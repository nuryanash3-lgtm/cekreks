import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs, tokenTransactions, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth-users";
import { getSession, type SessionPayload } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DbRole = "operator" | "client_admin" | "admin";
type DbStatus = "active" | "suspended";

const ROLE_MAP: Record<string, DbRole> = {
  "Operator Event": "operator",
  operator: "operator",
  "Client Admin": "client_admin",
  client_admin: "client_admin",
  "Super Admin": "admin",
  admin: "admin",
};

const STATUS_MAP: Record<string, DbStatus> = {
  active: "active",
  Aktif: "active",
  suspended: "suspended",
  Ditangguhkan: "suspended",
};

const safeUserColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  phone: users.phone,
  role: users.role,
  status: users.status,
  companyName: users.companyName,
  city: users.city,
  country: users.country,
  planName: users.planName,
  tokenBalance: users.tokenBalance,
  unlimitedUntil: users.unlimitedUntil,
  lastActiveAt: users.lastActiveAt,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function requireAdminSession(): Promise<
  | { session: SessionPayload; errorResponse?: never }
  | { session?: never; errorResponse: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { ok: false, error: "Autentikasi diperlukan." },
        { status: 401 }
      ),
    };
  }
  if (session.role !== "admin") {
    return {
      errorResponse: NextResponse.json(
        { ok: false, error: "Akses ditolak. Hanya admin yang diizinkan." },
        { status: 403 }
      ),
    };
  }
  return { session };
}

type DbExecutor = Pick<typeof db, "select">;

async function resolveActorUserId(
  executor: DbExecutor,
  sessionSub: string
): Promise<string | null> {
  if (!UUID_REGEX.test(sessionSub)) {
    return null;
  }
  const [actor] = await executor
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, sessionSub))
    .limit(1);
  return actor?.id ?? null;
}

function isUniqueViolation(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const record = err as { code?: unknown; cause?: { code?: unknown } };
  return record.code === "23505" || record.cause?.code === "23505";
}

export async function GET() {
  try {
    const auth = await requireAdminSession();
    if (auth.errorResponse) return auth.errorResponse;

    const userList = await db
      .select(safeUserColumns)
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ ok: true, users: userList });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil daftar pengguna." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminSession();
    if (auth.errorResponse) return auth.errorResponse;
    const { session } = auth;

    const body = (await req.json().catch(() => null)) as {
      name?: unknown;
      email?: unknown;
      phone?: unknown;
      role?: unknown;
      tokens?: unknown;
      password?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload JSON tidak valid." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() || null : null;

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Nama pengguna wajib diisi." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    let mappedRole: DbRole = "operator";
    if (body.role !== undefined && body.role !== null && body.role !== "") {
      if (typeof body.role !== "string" || !(body.role in ROLE_MAP)) {
        return NextResponse.json(
          { ok: false, error: "Role pengguna tidak valid." },
          { status: 400 }
        );
      }
      mappedRole = ROLE_MAP[body.role];
    }

    let initialTokens = 0;
    if (body.tokens !== undefined && body.tokens !== null && body.tokens !== "") {
      const parsedTokens =
        typeof body.tokens === "number" ? body.tokens : Number(body.tokens);
      if (!Number.isInteger(parsedTokens) || parsedTokens < 0) {
        return NextResponse.json(
          { ok: false, error: "Jumlah token awal harus bilangan bulat >= 0." },
          { status: 400 }
        );
      }
      initialTokens = parsedTokens;
    }

    const rawPassword =
      typeof body.password === "string" && body.password.trim().length > 0
        ? body.password
        : crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(rawPassword);

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const createdUser = await db.transaction(async (tx) => {
      const actorUserId = await resolveActorUserId(tx, session.sub);

      const [inserted] = await tx
        .insert(users)
        .values({
          name,
          email,
          phone,
          passwordHash,
          role: mappedRole,
          status: "active",
          tokenBalance: initialTokens,
        })
        .returning(safeUserColumns);

      if (initialTokens > 0) {
        await tx.insert(tokenTransactions).values({
          userId: inserted.id,
          createdBy: actorUserId,
          type: "topup",
          amount: initialTokens,
          balanceAfter: initialTokens,
          note: "Alokasi token awal saat pendaftaran pengguna",
        });
      }

      await tx.insert(activityLogs).values({
        userId: actorUserId ?? inserted.id,
        actorName: session.name,
        action: `Mendaftarkan pengguna baru ${inserted.email} (${inserted.role})`,
        tokensDelta: initialTokens,
        status: "success",
        metadata: {
          targetUserId: inserted.id,
          targetEmail: inserted.email,
          role: inserted.role,
          initialTokens,
        },
      });

      return inserted;
    });

    return NextResponse.json(
      { ok: true, user: createdUser },
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { ok: false, error: "Email sudah terdaftar." },
        { status: 409 }
      );
    }
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mendaftarkan pengguna baru." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdminSession();
    if (auth.errorResponse) return auth.errorResponse;
    const { session } = auth;

    const body = (await req.json().catch(() => null)) as {
      id?: unknown;
      status?: unknown;
      role?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload JSON tidak valid." },
        { status: 400 }
      );
    }

    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id || !UUID_REGEX.test(id)) {
      return NextResponse.json(
        { ok: false, error: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    let requestedStatus: DbStatus | undefined;
    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !(body.status in STATUS_MAP)) {
        return NextResponse.json(
          { ok: false, error: "Status pengguna tidak valid." },
          { status: 400 }
        );
      }
      requestedStatus = STATUS_MAP[body.status];
    }

    let requestedRole: DbRole | undefined;
    if (body.role !== undefined) {
      if (typeof body.role !== "string" || !(body.role in ROLE_MAP)) {
        return NextResponse.json(
          { ok: false, error: "Role pengguna tidak valid." },
          { status: 400 }
        );
      }
      requestedRole = ROLE_MAP[body.role];
    }

    const updatedUser = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select(safeUserColumns)
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!existing) {
        throw new HttpError(404, "Pengguna tidak ditemukan.");
      }

      const nextStatus: DbStatus =
        requestedStatus ??
        (requestedRole === undefined
          ? existing.status === "active"
            ? "suspended"
            : "active"
          : (existing.status as DbStatus));

      const nextRole: DbRole = requestedRole ?? (existing.role as DbRole);

      if (existing.id === session.sub && nextStatus === "suspended") {
        throw new HttpError(
          400,
          "Anda tidak dapat menangguhkan akun Anda sendiri."
        );
      }

      if (existing.id === session.sub && nextRole !== "admin") {
        throw new HttpError(
          400,
          "Anda tidak dapat menurunkan role akun Anda sendiri."
        );
      }

      const [updated] = await tx
        .update(users)
        .set({
          status: nextStatus,
          role: nextRole,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning(safeUserColumns);

      const actorUserId = await resolveActorUserId(tx, session.sub);

      await tx.insert(activityLogs).values({
        userId: actorUserId ?? updated.id,
        actorName: session.name,
        action: `Memperbarui akun ${updated.email} (status=${updated.status}, role=${updated.role})`,
        tokensDelta: 0,
        status: "success",
        metadata: {
          targetUserId: updated.id,
          previousStatus: existing.status,
          nextStatus: updated.status,
          previousRole: existing.role,
          nextRole: updated.role,
        },
      });

      return updated;
    });

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status }
      );
    }
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui pengguna." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdminSession();
    if (auth.errorResponse) return auth.errorResponse;
    const { session } = auth;

    const queryId = req.nextUrl.searchParams.get("id")?.trim() ?? "";
    const body = (await req.json().catch(() => null)) as {
      id?: unknown;
    } | null;
    const bodyId = typeof body?.id === "string" ? body.id.trim() : "";
    const id = queryId || bodyId;

    if (!id || !UUID_REGEX.test(id)) {
      return NextResponse.json(
        { ok: false, error: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    if (id === session.sub) {
      return NextResponse.json(
        { ok: false, error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const deletedUser = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(users)
        .where(eq(users.id, id))
        .returning(safeUserColumns);

      if (!deleted) {
        throw new HttpError(404, "Pengguna tidak ditemukan.");
      }

      const actorUserId = await resolveActorUserId(tx, session.sub);

      await tx.insert(activityLogs).values({
        userId: actorUserId,
        actorName: session.name,
        action: `Menghapus pengguna ${deleted.email}`,
        tokensDelta: 0,
        status: "success",
        metadata: {
          deletedUserId: deleted.id,
          deletedEmail: deleted.email,
          deletedRole: deleted.role,
        },
      });

      return deleted;
    });

    return NextResponse.json({
      ok: true,
      deletedId: deletedUser.id,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status }
      );
    }
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus pengguna." },
      { status: 500 }
    );
  }
}
