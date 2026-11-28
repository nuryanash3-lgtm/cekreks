import crypto from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, events, users, type Event } from "@/db/schema";
import { getSession } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_CODE_ATTEMPTS = 5;

function isValidUuid(value: string | undefined): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function generateEventCode(length = 6): string {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: unknown; cause?: { code?: unknown } };
  return err.code === "23505" || err.cause?.code === "23505";
}

function serializeEvent(ev: Event) {
  return {
    id: ev.id,
    ownerId: ev.ownerId,
    code: ev.code,
    title: ev.title,
    description: ev.description,
    eventDate: ev.eventDate,
    isPublic: ev.isPublic,
    remoteToken: ev.remoteToken,
    createdAt: ev.createdAt,
    updatedAt: ev.updatedAt,
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "user") {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!isValidUuid(session.sub)) {
      return NextResponse.json(
        { ok: false, error: "Sesi pengguna tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const [currentUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        companyName: users.companyName,
        city: users.city,
        country: users.country,
        planName: users.planName,
        tokenBalance: users.tokenBalance,
        unlimitedUntil: users.unlimitedUntil,
      })
      .from(users)
      .where(eq(users.id, session.sub))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { ok: false, error: "Akun pengguna tidak ditemukan." },
        { status: 401 }
      );
    }

    const eventRows =
      session.role === "admin"
        ? await db.select().from(events).orderBy(desc(events.createdAt))
        : await db
            .select()
            .from(events)
            .where(eq(events.ownerId, session.sub))
            .orderBy(desc(events.createdAt));

    return NextResponse.json({
      ok: true,
      user: currentUser,
      events: eventRows.map(serializeEvent),
    });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil daftar event." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "user") {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!isValidUuid(session.sub)) {
      return NextResponse.json(
        { ok: false, error: "Sesi pengguna tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => null)) as {
      title?: unknown;
      description?: unknown;
      eventDate?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload JSON tidak valid." },
        { status: 400 }
      );
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Nama event wajib diisi." },
        { status: 400 }
      );
    }

    let description: string | null = null;
    if (body.description !== undefined && body.description !== null) {
      if (typeof body.description !== "string") {
        return NextResponse.json(
          { ok: false, error: "Deskripsi event tidak valid." },
          { status: 400 }
        );
      }
      const trimmedDesc = body.description.trim();
      description = trimmedDesc.length > 0 ? trimmedDesc : null;
    }

    let eventDate: string = new Date().toISOString().slice(0, 10);
    if (body.eventDate !== undefined && body.eventDate !== null) {
      if (typeof body.eventDate !== "string" || !DATE_REGEX.test(body.eventDate.trim())) {
        return NextResponse.json(
          { ok: false, error: "Format tanggal event harus YYYY-MM-DD." },
          { status: 400 }
        );
      }
      const parsedDate = new Date(`${body.eventDate.trim()}T00:00:00Z`);
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { ok: false, error: "Tanggal event tidak valid." },
          { status: 400 }
        );
      }
      eventDate = body.eventDate.trim();
    }

    const [owner] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.id, session.sub))
      .limit(1);

    if (!owner) {
      return NextResponse.json(
        { ok: false, error: "Akun pengguna tidak ditemukan." },
        { status: 401 }
      );
    }

    let createdEvent: Event | null = null;

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
      const candidateCode = generateEventCode(6);
      const [existing] = await db
        .select({ id: events.id })
        .from(events)
        .where(eq(events.code, candidateCode))
        .limit(1);

      if (existing) {
        continue;
      }

      try {
        const [inserted] = await db
          .insert(events)
          .values({
            ownerId: owner.id,
            code: candidateCode,
            title,
            description,
            eventDate,
            isPublic: false,
          })
          .returning();

        createdEvent = inserted ?? null;
        break;
      } catch (insertError) {
        if (isUniqueViolation(insertError)) {
          continue;
        }
        throw insertError;
      }
    }

    if (!createdEvent) {
      return NextResponse.json(
        { ok: false, error: "Gagal menghasilkan kode event unik. Silakan coba lagi." },
        { status: 500 }
      );
    }

    await db.insert(activityLogs).values({
      userId: owner.id,
      eventId: createdEvent.id,
      actorName: owner.name || session.name,
      action: "CREATE_EVENT",
      tokensDelta: 0,
      status: "success",
      metadata: {
        code: createdEvent.code,
        title: createdEvent.title,
        isPublic: createdEvent.isPublic,
      },
    });

    return NextResponse.json(
      { ok: true, event: serializeEvent(createdEvent) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal membuat event baru." },
      { status: 500 }
    );
  }
}
