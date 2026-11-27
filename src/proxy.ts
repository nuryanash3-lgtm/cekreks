import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export const config = {
  matcher: ["/admin/:path*", "/event/:path*", "/api/:path*"],
};

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/", req.url);
  loginUrl.searchParams.set("login", "required");
  loginUrl.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  // 1. Proteksi endpoint API
  if (pathname.startsWith("/api/")) {
    // Endpoint autentikasi & chatbot publik landing page tetap dapat diakses
    if (pathname.startsWith("/api/auth/") || pathname === "/api/chat") {
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (pathname.startsWith("/api/admin") && session.role !== "admin") {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 2. Proteksi halaman Super Admin (/admin/*)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!session) {
      return redirectToLogin(request);
    }

    if (session.role !== "admin") {
      if (session.role === "user") {
        return NextResponse.redirect(new URL("/event", request.url));
      }
      if (session.role === "event_guest" && session.eventCode) {
        return NextResponse.redirect(
          new URL(`/event/${session.eventCode}`, request.url)
        );
      }
      return redirectToLogin(request);
    }

    return NextResponse.next();
  }

  // 3. Proteksi halaman Event & Booth (/event/*)
  if (pathname === "/event" || pathname.startsWith("/event/")) {
    if (!session) {
      return redirectToLogin(request);
    }

    // Dashboard daftar event (/event) hanya untuk admin atau operator (user)
    if (pathname === "/event" || pathname === "/event/") {
      if (session.role === "event_guest") {
        return NextResponse.redirect(
          new URL(
            session.eventCode ? `/event/${session.eventCode}` : "/?login=required",
            request.url
          )
        );
      }
      return NextResponse.next();
    }

    // Cek segment /event/[kode] dan /event/[kode]/settings/*
    const segments = pathname.split("/").filter(Boolean); // ['event', kode, ...]
    const requestedCode = segments[1] || "";
    const isSettingsSubroute = segments[2] === "settings";

    if (session.role === "event_guest") {
      // Tamu/vendor kode event tidak boleh mengakses halaman settings
      if (isSettingsSubroute) {
        return NextResponse.redirect(
          new URL(
            session.eventCode ? `/event/${session.eventCode}` : "/?login=required",
            request.url
          )
        );
      }

      // Pastikan kode event pada URL sesuai dengan kode sesi event_guest
      if (
        !session.eventCode ||
        session.eventCode.toUpperCase() !== requestedCode.toUpperCase()
      ) {
        return NextResponse.redirect(
          new URL(
            session.eventCode ? `/event/${session.eventCode}` : "/?login=required",
            request.url
          )
        );
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
