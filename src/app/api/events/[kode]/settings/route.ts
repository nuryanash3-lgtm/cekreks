import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, events, eventSettings } from "@/db/schema";
import {
  type EventIdentityConfig,
  type EventSettingsApiResponse,
  normalizeIdentityConfig,
} from "@/lib/event-settings-types";
import { getSession } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PRESET_CLASS_REGEX = /^tpl-[a-z0-9-]+$/i;

function isValidUuid(value: string | undefined): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function normalizeCode(rawKode: string): string {
  return decodeURIComponent(rawKode).trim().toUpperCase();
}

function isAllowedMediaValue(
  type: EventIdentityConfig["backgroundType"],
  value: string
): boolean {
  if (type === "preset") {
    return PRESET_CLASS_REGEX.test(value);
  }
  if (value.startsWith("/uploads/events/") && !value.includes("..")) {
    return true;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ kode: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "event_guest" && !isValidUuid(session.sub)) {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Sesi pengguna tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const { kode } = await context.params;
    const code = normalizeCode(kode);
    if (!code || code.length > 12) {
      return NextResponse.json<EventSettingsApiResponse>(
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
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    if (session.role === "event_guest") {
      const guestCode = session.eventCode?.trim().toUpperCase();
      if (
        !guestCode ||
        guestCode !== event.code.toUpperCase() ||
        !event.isPublic
      ) {
        return NextResponse.json<EventSettingsApiResponse>(
          { ok: false, error: "Forbidden" },
          { status: 403 }
        );
      }
    } else if (session.role === "user") {
      const isOwner = event.ownerId === session.sub;
      if (!isOwner && !event.isPublic) {
        return NextResponse.json<EventSettingsApiResponse>(
          { ok: false, error: "Forbidden" },
          { status: 403 }
        );
      }
    } else if (session.role !== "admin") {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const [settingsRow] = await db
      .select()
      .from(eventSettings)
      .where(eq(eventSettings.eventId, event.id))
      .limit(1);

    return NextResponse.json<EventSettingsApiResponse>({
      ok: true,
      event: {
        id: event.id,
        code: event.code,
        title: event.title,
        description: event.description,
        isPublic: event.isPublic,
      },
      settings: {
        identityConfig: normalizeIdentityConfig(settingsRow?.identityConfig),
      },
    });
  } catch (error) {
    console.error("GET /api/events/[kode]/settings error:", error);
    return NextResponse.json<EventSettingsApiResponse>(
      { ok: false, error: "Gagal mengambil pengaturan event." },
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
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "user") {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!isValidUuid(session.sub)) {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Sesi pengguna tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const { kode } = await context.params;
    const code = normalizeCode(kode);
    if (!code || code.length > 12) {
      return NextResponse.json<EventSettingsApiResponse>(
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
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    const canWrite = session.role === "admin" || event.ownerId === session.sub;
    if (!canWrite) {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = (await req.json().catch(() => null)) as {
      title?: unknown;
      description?: unknown;
      identityConfig?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Payload JSON tidak valid." },
        { status: 400 }
      );
    }

    const eventUpdates: Partial<{
      title: string;
      description: string | null;
      updatedAt: Date;
    }> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json<EventSettingsApiResponse>(
          { ok: false, error: "Nama event tidak boleh kosong." },
          { status: 400 }
        );
      }
      eventUpdates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (body.description === null) {
        eventUpdates.description = null;
      } else if (typeof body.description === "string") {
        const trimmed = body.description.trim();
        eventUpdates.description = trimmed.length > 0 ? trimmed : null;
      } else {
        return NextResponse.json<EventSettingsApiResponse>(
          { ok: false, error: "Deskripsi event tidak valid." },
          { status: 400 }
        );
      }
    }

    let normalizedIdentity: EventIdentityConfig | null = null;
    if (body.identityConfig !== undefined) {
      normalizedIdentity = normalizeIdentityConfig(body.identityConfig);
      if (
        !isAllowedMediaValue(
          normalizedIdentity.backgroundType,
          normalizedIdentity.backgroundValue
        )
      ) {
        return NextResponse.json<EventSettingsApiResponse>(
          {
            ok: false,
            error:
              "URL atau template background tidak valid. Silakan unggah ulang media atau pilih template bawaan.",
          },
          { status: 400 }
        );
      }
    }

    if (Object.keys(eventUpdates).length === 0 && !normalizedIdentity) {
      return NextResponse.json<EventSettingsApiResponse>(
        { ok: false, error: "Tidak ada perubahan yang diberikan." },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      let currentEvent = event;
      if (Object.keys(eventUpdates).length > 0) {
        const [updated] = await tx
          .update(events)
          .set({
            ...eventUpdates,
            updatedAt: new Date(),
          })
          .where(eq(events.id, event.id))
          .returning();
        if (updated) {
          currentEvent = updated;
        }
      }

      let savedIdentity: EventIdentityConfig;
      if (normalizedIdentity) {
        const [upserted] = await tx
          .insert(eventSettings)
          .values({
            eventId: event.id,
            identityConfig: normalizedIdentity as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: eventSettings.eventId,
            set: {
              identityConfig: normalizedIdentity as unknown as Record<string, unknown>,
              updatedAt: new Date(),
            },
          })
          .returning();
        savedIdentity = normalizeIdentityConfig(upserted?.identityConfig);
      } else {
        const [existingRow] = await tx
          .select()
          .from(eventSettings)
          .where(eq(eventSettings.eventId, event.id))
          .limit(1);
        savedIdentity = normalizeIdentityConfig(existingRow?.identityConfig);
      }

      await tx.insert(activityLogs).values({
        userId: session.sub,
        eventId: currentEvent.id,
        actorName: session.name,
        action: "UPDATE_EVENT_SETTINGS",
        tokensDelta: 0,
        status: "success",
        metadata: {
          code: currentEvent.code,
          title: currentEvent.title,
          backgroundType: savedIdentity.backgroundType,
        },
      });

      return { currentEvent, savedIdentity };
    });

    return NextResponse.json<EventSettingsApiResponse>({
      ok: true,
      event: {
        id: result.currentEvent.id,
        code: result.currentEvent.code,
        title: result.currentEvent.title,
        description: result.currentEvent.description,
        isPublic: result.currentEvent.isPublic,
      },
      settings: {
        identityConfig: result.savedIdentity,
      },
    });
  } catch (error) {
    console.error("PATCH /api/events/[kode]/settings error:", error);
    return NextResponse.json<EventSettingsApiResponse>(
      { ok: false, error: "Gagal menyimpan pengaturan event." },
      { status: 500 }
    );
  }
}
