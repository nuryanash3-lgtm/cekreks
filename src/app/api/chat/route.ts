import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import knowledge from "@/data/cekreksKnowledge.json";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const MAX_MESSAGE_LENGTH = 500;

const ipBuckets = new Map<string, number[]>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipBuckets.get(clientIp) || []).filter((ts) => ts > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipBuckets.set(clientIp, timestamps);
    return true;
  }

  timestamps.push(now);
  ipBuckets.set(clientIp, timestamps);

  // Bersihkan entri map jika terlalu besar agar memori tetap bounded
  if (ipBuckets.size > 1000) {
    for (const [ip, list] of ipBuckets.entries()) {
      const fresh = list.filter((ts) => ts > windowStart);
      if (fresh.length === 0) {
        ipBuckets.delete(ip);
      }
    }
  }

  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip")?.trim() || "local";
}

function getApiErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null) {
    const record = err as { status?: unknown; code?: unknown };
    if (typeof record.status === "number") return record.status;
    if (typeof record.code === "number") return record.code;
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          reply:
            "Terlalu banyak permintaan dalam waktu singkat. Tunggu sebentar atau hubungi CS WhatsApp kami ya! [SHOW_WHATSAPP]",
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "Maaf, konfigurasi API Key belum disetel. Silakan hubungi CS WhatsApp kami! [SHOW_WHATSAPP]",
        },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => null)) as {
      message?: unknown;
    } | null;

    if (!body || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Format pesan tidak valid" },
        { status: 400 }
      );
    }

    const message = body.message.trim();
    if (!message) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter.`,
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Anda adalah CS Agent manusia yang ramah, santai, dan kasual untuk "Cekreks.id".

BERIKUT ADALAH DATABASE / KNOWLEDGE BASE RESMI PERUSAHAAN YANG WAJIB ANDA JADIKAN ACUAN UTAMA:
${JSON.stringify(knowledge, null, 2)}

Aturan Ketat:
1. Jawab HANYA berdasarkan informasi di dalam database JSON di atas (harga paket studio, photobooth, wedding, alamat Cimahi, jam operasional, dll).
2. JANGAN pernah mengulang kata sapaan seperti "Halo!" atau "Selamat datang" di setiap pesan jika sudah disapa sebelumnya.
3. Jawab langsung pada inti pertanyaan dengan singkat, padat, dan natural seperti sedang *chatting* di WhatsApp (maksimal 2-3 kalimat).
4. Jangan gunakan format penomoran (1., 2.) atau simbol markdown yang berlebihan. Buat mengalir secara natural.
5. ATURAN TOMBOL WHATSAPP:
   - Jika informasi yang ditanyakan user **ADA** di database JSON (misal tanya harga paket, alamat, fasilitas), jawab secara akurat **TANPA** memunculkan tombol WhatsApp.
   - JANGAN PERNAH menyertakan tag [SHOW_WHATSAPP] jika pertanyaannya bisa dijawab oleh data di JSON.
   - HANYA sertakan teks persis: [SHOW_WHATSAPP] di akhir kalimat jika pertanyaan user **BENAR-BENAR BUNTU**, tidak ada datanya sama sekali di JSON, atau meminta hal di luar kapasitas seperti booking jadwal, nego harga, pembayaran, dan custom khusus yang butuh admin manusia.

Pertanyaan user: ${message}`,
              },
            ],
          },
        ],
      });

      const reply =
        response.text ||
        "Maaf, silakan hubungi CS WhatsApp kami. [SHOW_WHATSAPP]";
      return NextResponse.json({ reply });
    } catch (apiError: unknown) {
      console.error("Detail Error Gemini API:", apiError);
      if (getApiErrorStatus(apiError) === 503) {
        return NextResponse.json(
          {
            reply:
              "Wah, antrean AI Agent sedang sangat padat saat ini! 😊 Untuk respon cepat, silakan langsung hubungi CS WhatsApp kami ya! [SHOW_WHATSAPP]",
          },
          { status: 503 }
        );
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error Server / Route:", error);
    return NextResponse.json(
      {
        reply:
          "Maaf, sistem sedang ada kendala teknis. Silakan hubungi CS WhatsApp kami untuk bantuan langsung ya! [SHOW_WHATSAPP]",
      },
      { status: 500 }
    );
  }
}
