import { redirect } from "next/navigation";
import { getSession, type SessionPayload, type SessionRole } from "./session";

export async function requireSession(
  allowedRoles: SessionRole[],
  options?: { eventCode?: string }
): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    redirect("/?login=required");
  }

  if (!allowedRoles.includes(session.role)) {
    if (session.role === "admin") {
      redirect("/admin");
    }
    if (session.role === "user") {
      redirect("/event");
    }
    if (session.role === "event_guest" && session.eventCode) {
      redirect(`/event/${session.eventCode}`);
    }
    redirect("/?login=required");
  }

  if (
    session.role === "event_guest" &&
    options?.eventCode &&
    session.eventCode?.toUpperCase() !== options.eventCode.toUpperCase()
  ) {
    redirect(session.eventCode ? `/event/${session.eventCode}` : "/?login=required");
  }

  return session;
}
