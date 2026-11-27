import { NextResponse } from "next/server";
import { findPublicEventByCode } from "@/lib/auth-users";
import { getSession, setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
    const rawCode = typeof body?.code === "string" ? body.code : "";
    const cleanCode = rawCode.trim().toUpperCase();

    if (!/^[A-Z0-9]{4,12}$/.test(cleanCode)) {
      return NextResponse.json(
        { ok: false, error: "Format kode event tidak valid." },
        { status: 400 }
      );
    }

    const foundEvent = await findPublicEventByCode(cleanCode);
    if (!foundEvent) {
      return NextResponse.json(
        {
          ok: false,
          error: "Kode Event tidak ditemukan atau belum diset Public!",
        },
        { status: 404 }
      );
    }

    // Jika sudah login sebagai admin/user, pertahankan role utama mereka
    const existingSession = await getSession();
    if (!existingSession || existingSession.role === "event_guest") {
      await setSessionCookie(
        {
          sub: `event:${foundEvent.code}`,
          name: foundEvent.title,
          role: "event_guest",
          eventCode: foundEvent.code,
        },
        60 * 60 * 12 // 12 jam untuk sesi vendor/booth event
      );
    }

    return NextResponse.json({
      ok: true,
      event: {
        code: foundEvent.code,
        title: foundEvent.title,
      },
      redirectUrl: foundEvent.redirectUrl,
    });
  } catch (error) {
    console.error("Connect event error:", error);
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan saat menghubungkan ke event." },
      { status: 500 }
    );
  }
}
