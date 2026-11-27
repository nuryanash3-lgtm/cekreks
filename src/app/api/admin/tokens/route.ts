import { NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs, tokenTransactions, users } from "@/db/schema";
import { getSession, type SessionPayload } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_TRANSACTION_TYPES = new Set([
  "topup",
  "deduct",
  "adjustment",
  "refund",
]);

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

export async function GET() {
  try {
    const auth = await requireAdminSession();
    if (auth.errorResponse) return auth.errorResponse;

    const [userSummaries, recentTransactions] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          tokenBalance: users.tokenBalance,
        })
        .from(users)
        .orderBy(asc(users.name)),
      db
        .select({
          id: tokenTransactions.id,
          userId: tokenTransactions.userId,
          userName: users.name,
          userEmail: users.email,
          eventId: tokenTransactions.eventId,
          createdBy: tokenTransactions.createdBy,
          type: tokenTransactions.type,
          amount: tokenTransactions.amount,
          balanceAfter: tokenTransactions.balanceAfter,
          note: tokenTransactions.note,
          createdAt: tokenTransactions.createdAt,
        })
        .from(tokenTransactions)
        .leftJoin(users, eq(tokenTransactions.userId, users.id))
        .orderBy(desc(tokenTransactions.createdAt))
        .limit(25),
    ]);

    return NextResponse.json({
      ok: true,
      users: userSummaries,
      transactions: recentTransactions,
    });
  } catch (error) {
    console.error("GET /api/admin/tokens error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil data token dan transaksi." },
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
      userId?: unknown;
      amount?: unknown;
      note?: unknown;
      type?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload JSON tidak valid." },
        { status: 400 }
      );
    }

    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    if (!userId || !UUID_REGEX.test(userId)) {
      return NextResponse.json(
        { ok: false, error: "ID pengguna target tidak valid." },
        { status: 400 }
      );
    }

    const parsedAmount =
      typeof body.amount === "number" ? body.amount : Number(body.amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Jumlah token harus berupa bilangan bulat bukan nol.",
        },
        { status: 400 }
      );
    }

    let resolvedType = parsedAmount > 0 ? "topup" : "deduct";
    if (body.type !== undefined && body.type !== null && body.type !== "") {
      if (typeof body.type !== "string") {
        return NextResponse.json(
          { ok: false, error: "Tipe transaksi tidak valid." },
          { status: 400 }
        );
      }
      const normalizedType = body.type.trim().toLowerCase();
      if (!ALLOWED_TRANSACTION_TYPES.has(normalizedType)) {
        return NextResponse.json(
          { ok: false, error: "Tipe transaksi tidak didukung." },
          { status: 400 }
        );
      }
      resolvedType = normalizedType;
    }

    const rawNote = typeof body.note === "string" ? body.note.trim() : "";
    const resolvedNote =
      rawNote ||
      (parsedAmount > 0
        ? "Top-up token manual oleh admin"
        : "Penyesuaian pengurangan token oleh admin");

    const result = await db.transaction(async (tx) => {
      const whereCondition =
        parsedAmount < 0
          ? and(
              eq(users.id, userId),
              gte(sql<number>`${users.tokenBalance} + ${parsedAmount}`, 0)
            )
          : eq(users.id, userId);

      const [updatedUser] = await tx
        .update(users)
        .set({
          tokenBalance: sql`${users.tokenBalance} + ${parsedAmount}`,
          updatedAt: new Date(),
        })
        .where(whereCondition)
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          tokenBalance: users.tokenBalance,
        });

      if (!updatedUser) {
        const [existingUser] = await tx
          .select({ id: users.id })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!existingUser) {
          throw new HttpError(404, "Pengguna target tidak ditemukan.");
        }

        throw new HttpError(
          400,
          "Saldo token pengguna tidak mencukupi untuk pengurangan ini."
        );
      }

      const actorUserId = await resolveActorUserId(tx, session.sub);

      const [transaction] = await tx
        .insert(tokenTransactions)
        .values({
          userId: updatedUser.id,
          createdBy: actorUserId,
          type: resolvedType,
          amount: parsedAmount,
          balanceAfter: updatedUser.tokenBalance,
          note: resolvedNote,
        })
        .returning();

      await tx.insert(activityLogs).values({
        userId: actorUserId ?? updatedUser.id,
        actorName: session.name,
        action:
          parsedAmount > 0
            ? `Top-up +${parsedAmount} token untuk ${updatedUser.email}`
            : `Pengurangan ${parsedAmount} token untuk ${updatedUser.email}`,
        tokensDelta: parsedAmount,
        status: "success",
        metadata: {
          targetUserId: updatedUser.id,
          targetEmail: updatedUser.email,
          transactionId: transaction.id,
          type: resolvedType,
          balanceAfter: updatedUser.tokenBalance,
          note: resolvedNote,
        },
      });

      return {
        user: updatedUser,
        transaction: {
          ...transaction,
          userName: updatedUser.name,
          userEmail: updatedUser.email,
        },
      };
    });

    return NextResponse.json({
      ok: true,
      user: result.user,
      transaction: result.transaction,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status }
      );
    }
    console.error("POST /api/admin/tokens error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memproses transaksi token." },
      { status: 500 }
    );
  }
}
