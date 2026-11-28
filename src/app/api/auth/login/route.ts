import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-users";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: unknown;
      password?: unknown;
    } | null;

    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Email atau password salah." },
        { status: 401 }
      );
    }

    await setSessionCookie({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl: user.redirectUrl,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan pada server saat login." },
      { status: 500 }
    );
  }
}
