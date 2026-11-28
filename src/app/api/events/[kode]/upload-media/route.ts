import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, events } from "@/db/schema";
import type { UploadedEventMediaResponse } from "@/lib/event-settings-types";
import {
  ALLOWED_IMAGE_MIMES,
  ALLOWED_VIDEO_MIMES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  saveEventMediaFile,
  StorageReadOnlyError,
} from "@/lib/media-storage";
import { getSession } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EVENT_CODE_REGEX = /^[A-Z0-9]{4,12}$/;

function isValidUuid(value: string | undefined): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ kode: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "user") {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!isValidUuid(session.sub)) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Sesi pengguna tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const { kode } = await context.params;
    const normalizedCode = decodeURIComponent(kode).trim().toUpperCase();
    if (!EVENT_CODE_REGEX.test(normalizedCode)) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Kode event tidak valid." },
        { status: 400 }
      );
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.code, normalizedCode))
      .limit(1);

    if (!event) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Event tidak ditemukan." },
        { status: 404 }
      );
    }

    const canWrite = session.role === "admin" || event.ownerId === session.sub;
    if (!canWrite) {
      return NextResponse.json<UploadedEventMediaResponse>(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

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
          error: "Tipe file tidak didukung. Gunakan PNG/JPG/WEBP atau MP4/WEBM.",
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

    await db.insert(activityLogs).values({
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
