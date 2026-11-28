import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 8 * 1024 * 1024;

export const ALLOWED_IMAGE_MIMES = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

export const ALLOWED_VIDEO_MIMES = new Map<string, string>([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

const EVENT_CODE_REGEX = /^[A-Z0-9]{4,12}$/;

/**
 * Thrown when local filesystem writes fail on read-only serverless runtimes (e.g. Vercel).
 */
export class StorageReadOnlyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageReadOnlyError";
  }
}

function resolveValidatedMedia(
  mimeType: string,
  sizeBytes: number,
  expectedKind?: "image" | "video"
): { backgroundType: "image" | "video"; ext: string } {
  const normalizedMime = mimeType.trim().toLowerCase();
  const imageExt = ALLOWED_IMAGE_MIMES.get(normalizedMime);
  const videoExt = ALLOWED_VIDEO_MIMES.get(normalizedMime);

  if (expectedKind === "image" && !imageExt) {
    throw new Error("Format gambar harus PNG, JPG/JPEG, atau WEBP.");
  }
  if (expectedKind === "video" && !videoExt) {
    throw new Error("Format video harus MP4 atau WEBM.");
  }

  if (imageExt) {
    if (sizeBytes > MAX_IMAGE_BYTES) {
      throw new Error("Ukuran maksimal gambar adalah 2MB.");
    }
    return { backgroundType: "image", ext: imageExt };
  }

  if (videoExt) {
    if (sizeBytes > MAX_VIDEO_BYTES) {
      throw new Error("Ukuran maksimal video adalah 8MB.");
    }
    return { backgroundType: "video", ext: videoExt };
  }

  throw new Error("Tipe file tidak didukung. Gunakan PNG/JPG/WEBP atau MP4/WEBM.");
}

/**
 * Persists an uploaded event background media file to local public storage.
 * Isolated in this module so upgrading to Vercel Blob or Cloudflare R2 only changes this adapter.
 */
export async function saveEventMediaFile(params: {
  eventCode: string;
  buffer: Buffer;
  mimeType: string;
  expectedKind?: "image" | "video";
}): Promise<{
  url: string;
  backgroundType: "image" | "video";
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}> {
  const normalizedCode = params.eventCode.trim().toUpperCase();
  if (!EVENT_CODE_REGEX.test(normalizedCode)) {
    throw new Error("Kode event tidak valid.");
  }

  if (!params.buffer || params.buffer.byteLength === 0) {
    throw new Error("File kosong tidak dapat diunggah.");
  }

  const { backgroundType, ext } = resolveValidatedMedia(
    params.mimeType,
    params.buffer.byteLength,
    params.expectedKind
  );

  const fileName = `bg-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const targetDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "events",
    normalizedCode
  );
  const targetPath = path.join(targetDir, fileName);

  try {
    await mkdir(targetDir, { recursive: true });
    await writeFile(targetPath, params.buffer);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException | null)?.code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      throw new StorageReadOnlyError(
        "Storage lokal bersifat read-only pada environment serverless ini (mis. Vercel). Pasang Cloud Storage (Vercel Blob / Cloudflare R2) untuk upload di production."
      );
    }
    throw err;
  }

  return {
    url: `/uploads/events/${normalizedCode}/${fileName}`,
    backgroundType,
    fileName,
    mimeType: params.mimeType.trim().toLowerCase(),
    sizeBytes: params.buffer.byteLength,
  };
}
