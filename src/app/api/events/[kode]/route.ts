import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, events, type Event } from "@/db/schema";
import { getSession, type SessionPayload } from "@/lib/session";

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

function normalizeCode(rawKode: string): string {
  return decodeURIComponent(rawKode).trim().toUpperCase();
}

function serializeEvent(ev: Event, includeRemoteToken: boolean) {
  return {
    id: ev.id,
    ownerId: ev.ownerId,
    code: ev.code,
    title: ev.title,
    description: ev.description,
    eventDate: ev.eventDate,
    isPublic: ev.isPublic,
    ...(includeRemoteToken ? { remoteToken: ev.remoteToken } : {}),
    createdAt: ev.createdAt,
    updatedAt: ev.updatedAt,
  };
}

function canWriteEvent(session: SessionPayload, event: Event): boolean {
  if (session.role === "admin") return true;
  if (session.role === "user") return event.ownerId === session.sub;
  return false;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ kode: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "event_guest" && !isValidUuid(session.sub)) {
      return NextResponse.json(
        { ok: false, error: "Sesi pengguna tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const { kode } = await context.params;
    const code = normalizeCode(kode);
    if (!code || code.length > 12) {
      return NextResponse.json(
        { ok: false, error: "Kode event tidak valid." },
        { status: 400 }
      );
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.code, code))
      .limit(1);

    if (!event) {
      return NextResponse.json(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    if (session.role === "event_guest") {
      const guestCode = session.eventCode?.trim().toUpperCase();
      if (!guestCode || guestCode !== event.code.toUpperCase() || !event.isPublic) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 }
        );
      }
      return NextResponse.json({
        ok: true,
        event: serializeEvent(event, false),
      });
    }

    if (session.role === "user") {
      const isOwner = event.ownerId === session.sub;
      if (!isOwner && !event.isPublic) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 }
        );
      }
      return NextResponse.json({
        ok: true,
        event: serializeEvent(event, isOwner),
      });
    }

    if (session.role === "admin") {
      return NextResponse.json({
        ok: true,
        event: serializeEvent(event, true),
      });
    }

    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  } catch (error) {
    console.error("GET /api/events/[kode] error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil detail event." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ kode: string }> }
) {
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

    const { kode } = await context.params;
    const code = normalizeCode(kode);
    if (!code || code.length > 12) {
      return NextResponse.json(
        { ok: false, error: "Kode event tidak valid." },
        { status: 400 }
      );
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.code, code))
      .limit(1);

    if (!event) {
      return NextResponse.json(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!canWriteEvent(session, event)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = (await req.json().catch(() => null)) as {
      title?: unknown;
      description?: unknown;
      eventDate?: unknown;
      isPublic?: unknown;
      regenerateCode?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload JSON tidak valid." },
        { status: 400 }
      );
    }

    const updates: Partial<{
      title: string;
      description: string | null;
      eventDate: string | null;
      isPublic: boolean;
      code: string;
      updatedAt: Date;
    }> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json(
          { ok: false, error: "Nama event tidak boleh kosong." },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (body.description === null) {
        updates.description = null;
      } else if (typeof body.description === "string") {
        const trimmed = body.description.trim();
        updates.description = trimmed.length > 0 ? trimmed : null;
      } else {
        return NextResponse.json(
          { ok: false, error: "Deskripsi event tidak valid." },
          { status: 400 }
        );
      }
    }

    if (body.eventDate !== undefined) {
      if (body.eventDate === null) {
        updates.eventDate = null;
      } else if (
        typeof body.eventDate === "string" &&
        DATE_REGEX.test(body.eventDate.trim())
      ) {
        const parsed = new Date(`${body.eventDate.trim()}T00:00:00Z`);
        if (Number.isNaN(parsed.getTime())) {
          return NextResponse.json(
            { ok: false, error: "Tanggal event tidak valid." },
            { status: 400 }
          );
        }
        updates.eventDate = body.eventDate.trim();
      } else {
        return NextResponse.json(
          { ok: false, error: "Format tanggal event harus YYYY-MM-DD." },
          { status: 400 }
        );
      }
    }

    if (body.isPublic !== undefined) {
      if (typeof body.isPublic !== "boolean") {
        return NextResponse.json(
          { ok: false, error: "Nilai isPublic harus boolean." },
          { status: 400 }
        );
      }
      updates.isPublic = body.isPublic;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Tidak ada perubahan yang diberikan." },
        { status: 400 }
      );
    }

    const shouldRegenerateCode =
      updates.isPublic === true && body.regenerateCode === true;

    let updatedEvent: Event | null = null;

    if (shouldRegenerateCode) {
      for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
        const candidateCode = generateEventCode(6);
        if (candidateCode === event.code) continue;

        const [existing] = await db
          .select({ id: events.id })
          .from(events)
          .where(eq(events.code, candidateCode))
          .limit(1);

        if (existing) continue;

        try {
          const [updated] = await db
            .update(events)
            .set({
              ...updates,
              code: candidateCode,
              updatedAt: new Date(),
            })
            .where(eq(events.id, event.id))
            .returning();

          updatedEvent = updated ?? null;
          break;
        } catch (updateError) {
          if (isUniqueViolation(updateError)) {
            continue;
          }
          throw updateError;
        }
      }

      if (!updatedEvent) {
        return NextResponse.json(
          { ok: false, error: "Gagal membuat kode event baru. Silakan coba lagi." },
          { status: 500 }
        );
      }
    } else {
      const [updated] = await db
        .update(events)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(events.id, event.id))
        .returning();

      updatedEvent = updated ?? null;
    }

    if (!updatedEvent) {
      return NextResponse.json(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    await db.insert(activityLogs).values({
      userId: session.sub,
      eventId: updatedEvent.id,
      actorName: session.name,
      action: "UPDATE_EVENT",
      tokensDelta: 0,
      status: "success",
      metadata: {
        previousCode: event.code,
        code: updatedEvent.code,
        isPublic: updatedEvent.isPublic,
        title: updatedEvent.title,
      },
    });

    return NextResponse.json({
      ok: true,
      event: serializeEvent(updatedEvent, true),
    });
  } catch (error) {
    console.error("PATCH /api/events/[kode] error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ kode: string }> }
) {
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

    const { kode } = await context.params;
    const code = normalizeCode(kode);
    if (!code || code.length > 12) {
      return NextResponse.json(
        { ok: false, error: "Kode event tidak valid." },
        { status: 400 }
      );
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.code, code))
      .limit(1);

    if (!event) {
      return NextResponse.json(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!canWriteEvent(session, event)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, event.id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    await db.insert(activityLogs).values({
      userId: session.sub,
      eventId: null,
      actorName: session.name,
      action: "DELETE_EVENT",
      tokensDelta: 0,
      status: "success",
      metadata: {
        deletedEventId: deleted.id,
        code: deleted.code,
        title: deleted.title,
      },
    });

    return NextResponse.json({
      ok: true,
      deletedCode: deleted.code,
    });
  } catch (error) {
    console.error("DELETE /api/events/[kode] error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus event." },
      { status: 500 }
    );
  }
}
