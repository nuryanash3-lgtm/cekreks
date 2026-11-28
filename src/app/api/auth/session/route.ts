import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { clearSessionCookie, getSession, type SessionRole } from "@/lib/session";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  if (session.role === "admin" || session.role === "user") {
    if (!UUID_REGEX.test(session.sub)) {
      await clearSessionCookie();
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const [dbUser] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          status: users.status,
          tokenBalance: users.tokenBalance,
          planName: users.planName,
          companyName: users.companyName,
          city: users.city,
          country: users.country,
        })
        .from(users)
        .where(eq(users.id, session.sub))
        .limit(1);

      if (!dbUser || dbUser.status !== "active") {
        await clearSessionCookie();
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      const role: SessionRole = dbUser.role === "admin" ? "admin" : "user";

      return NextResponse.json({
        authenticated: true,
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role,
          status: dbUser.status,
          tokenBalance: dbUser.tokenBalance,
          planName: dbUser.planName,
          companyName: dbUser.companyName,
          city: dbUser.city,
          country: dbUser.country,
          eventCode: session.eventCode,
        },
      });
    } catch (error) {
      console.error("Session lookup error:", error);
      return NextResponse.json(
        { authenticated: false, error: "Gagal memverifikasi sesi pengguna." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.sub,
      name: session.name,
      email: session.email,
      role: session.role,
      eventCode: session.eventCode,
    },
  });
}
