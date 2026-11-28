import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, events, eventSettings, type Event } from "@/db/schema";
import {
  type CustomBackgroundMediaItem,
  type DeletedEventMediaResponse,
  DEFAULT_EVENT_IDENTITY_CONFIG,
  normalizeIdentityConfig,
  type UploadedEventMediaResponse,
} from "@/lib/event-settings-types";
import {
  ALLOWED_IMAGE_MIMES,
  ALLOWED_VIDEO_MIMES,
  deleteEventMediaFile,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  saveEventMediaFile,
  StorageReadOnlyError,
} from "@/lib/media-storage";
import { getSession, type SessionPayload } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EVENT_CODE_REGEX = /^[A-Z0-9]{4,12}$/;

function isValidUuid(value: string | undefined): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

async function authorizeEventMediaWrite(
  kodeParam: string
): Promise<
  | { ok: true; session: SessionPayload; event: Event }
  | { ok: false; status: number; error: string }
> {
  const session = await getSession();
  if (!session) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  if (session.role !== "admin" && session.role !== "user") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  if (!isValidUuid(session.sub)) {
    return {
      ok: false,
      status: 401,
      error: "Sesi pengguna tidak valid. Silakan login ulang.",
    };
  }

  const normalizedCode = decodeURIComponent(kodeParam).trim().toUpperCase();
  if (!EVENT_CODE_REGEX.test(normalizedCode)) {
    return { ok: false, status: 400, error: "Kode event tidak valid." };
  }

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.code, normalizedCode))
    .limit(1);

  if (!event) {
    return { ok: false, status: 404, error: "Event tidak ditemukan." };
  }

  const canWrite = session.role === "admin" || event.ownerId === session.sub;
  if (!canWrite) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, session, event };
}

export async function POST(
  req: Request,
  context: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await context.params;
    const auth = await authorizeEventMediaWrite(kode);
    if (!auth.ok) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { session, event } = auth;

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Payload multipart/form-data tidak valid." },
        { status: 400 }
      );
    }

    const rawFile = formData.get("file");
    if (!(rawFile instanceof File) || rawFile.size === 0) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "File media wajib dipilih dan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const rawKind = formData.get("kind");
    const expectedKind =
      rawKind === "image" || rawKind === "video" ? rawKind : undefined;

    const mimeType = rawFile.type.trim().toLowerCase();
    const isImage = ALLOWED_IMAGE_MIMES.has(mimeType);
    const isVideo = ALLOWED_VIDEO_MIMES.has(mimeType);

    if (expectedKind === "image" && !isImage) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Format gambar harus PNG, JPG/JPEG, atau WEBP." },
        { status: 400 }
      );
    }

    if (expectedKind === "video" && !isVideo) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Format video harus MP4 atau WEBM." },
        { status: 400 }
      );
    }

    if (!isImage && !isVideo) {
      return NextResponse.json<UploadedEventMediaResponse>(
        {
          ok: false,
          error:
            "Tipe file tidak didukung. Gunakan PNG/JPG/WEBP atau MP4/WEBM.",
        },
        { status: 400 }
      );
    }

    if (isImage && rawFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Ukuran maksimal gambar adalah 2MB." },
        { status: 400 }
      );
    }

    if (isVideo && rawFile.size > MAX_VIDEO_BYTES) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Ukuran maksimal video adalah 8MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await rawFile.arrayBuffer());
    const saved = await saveEventMediaFile({
      eventCode: event.code,
      buffer,
      mimeType,
      expectedKind,
    });

    const newItem: CustomBackgroundMediaItem = {
      id: crypto.randomUUID(),
      url: saved.url,
      type: saved.backgroundType,
      name: rawFile.name || saved.fileName,
      createdAt: new Date().toISOString(),
    };

    const customBackgrounds = await db.transaction(async (tx) => {
      const [existingSettings] = await tx
        .select()
        .from(eventSettings)
        .where(eq(eventSettings.eventId, event.id))
        .limit(1);

      const currentIdentity = normalizeIdentityConfig(
        existingSettings?.identityConfig
      );
      const nextCustomBackgrounds = [
        ...currentIdentity.customBackgrounds.filter(
          (item) => item.url !== newItem.url
        ),
        newItem,
      ];
      const nextIdentity = {
        ...currentIdentity,
        customBackgrounds: nextCustomBackgrounds,
      };

      await tx
        .insert(eventSettings)
        .values({
          eventId: event.id,
          identityConfig: nextIdentity as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: eventSettings.eventId,
          set: {
            identityConfig: nextIdentity as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          },
        });

      await tx.insert(activityLogs).values({
        userId: session.sub,
        eventId: event.id,
        actorName: session.name,
        action: "UPLOAD_EVENT_MEDIA",
        tokensDelta: 0,
        status: "success",
        metadata: {
          code: event.code,
          url: saved.url,
          backgroundType: saved.backgroundType,
          sizeBytes: saved.sizeBytes,
          originalName: rawFile.name,
        },
      });

      return nextCustomBackgrounds;
    });

    return NextResponse.json<UploadedEventMediaResponse>({
      ok: true,
      media: {
        url: saved.url,
        backgroundType: saved.backgroundType,
        fileName: saved.fileName,
        originalName: rawFile.name,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
      },
      item: newItem,
      customBackgrounds,
    });
  } catch (error) {
    if (error instanceof StorageReadOnlyError) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: error.message },
        { status: 503 }
      );
    }
    console.error("POST /api/events/[kode]/upload-media error:", error);
    return NextResponse.json<UploadedEventMediaResponse>(
      { ok: false, error: "Gagal mengunggah media event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await context.params;
    const auth = await authorizeEventMediaWrite(kode);
    if (!auth.ok) {
      return NextResponse.json<DeletedEventMediaResponse>(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { session, event } = auth;
    const reqUrl = new URL(req.url);
    const body = (await req.json().catch(() => null)) as { url?: unknown } | null;
    const targetUrl =
      typeof body?.url === "string"
        ? body.url.trim()
        : (reqUrl.searchParams.get("url") ?? "").trim();

    if (!targetUrl) {
      return NextResponse.json<DeletedEventMediaResponse>(
        { ok: false, error: "URL media yang akan dihapus wajib diberikan." },
        { status: 400 }
      );
    }

    await deleteEventMediaFile(event.code, targetUrl);

    const updatedIdentity = await db.transaction(async (tx) => {
      const [existingSettings] = await tx
        .select()
        .from(eventSettings)
        .where(eq(eventSettings.eventId, event.id))
        .limit(1);

      const currentIdentity = normalizeIdentityConfig(
        existingSettings?.identityConfig
      );
      const nextCustomBackgrounds = currentIdentity.customBackgrounds.filter(
        (item) => item.url !== targetUrl
      );
      const wasActiveDeleted = currentIdentity.backgroundValue === targetUrl;

      const nextIdentity = {
        ...currentIdentity,
        ...(wasActiveDeleted
          ? {
              backgroundType: DEFAULT_EVENT_IDENTITY_CONFIG.backgroundType,
              backgroundValue: DEFAULT_EVENT_IDENTITY_CONFIG.backgroundValue,
              backgroundName: DEFAULT_EVENT_IDENTITY_CONFIG.backgroundName,
            }
          : {}),
        customBackgrounds: nextCustomBackgrounds,
      };

      await tx
        .insert(eventSettings)
        .values({
          eventId: event.id,
          identityConfig: nextIdentity as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: eventSettings.eventId,
          set: {
            identityConfig: nextIdentity as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          },
        });

      await tx.insert(activityLogs).values({
        userId: session.sub,
        eventId: event.id,
        actorName: session.name,
        action: "DELETE_EVENT_MEDIA",
        tokensDelta: 0,
        status: "success",
        metadata: {
          code: event.code,
          deletedUrl: targetUrl,
        },
      });

      return nextIdentity;
    });

    return NextResponse.json<DeletedEventMediaResponse>({
      ok: true,
      deletedUrl: targetUrl,
      identityConfig: updatedIdentity,
    });
  } catch (error) {
    if (error instanceof StorageReadOnlyError) {
      return NextResponse.json<DeletedEventMediaResponse>(
        { ok: false, error: error.message },
        { status: 503 }
      );
    }
    console.error("DELETE /api/events/[kode]/upload-media error:", error);
    return NextResponse.json<DeletedEventMediaResponse>(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus media event.",
      },
      { status: 400 }
    );
  }
}
