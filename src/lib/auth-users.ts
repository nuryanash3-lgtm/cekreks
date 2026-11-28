import crypto from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs, events, users } from "@/db/schema";
import type { SessionRole } from "./session";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Extract<SessionRole, "admin" | "user">;
  redirectUrl: string;
}

export interface PublicEventRecord {
  id: string;
  code: string;
  title: string;
  date: string;
  description: string;
  redirectUrl: string;
  isPublic: boolean;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [salt, keyHex] = parts;
  if (!salt || !keyHex || keyHex.length % 2 !== 0) return false;

  const expectedKey = Buffer.from(keyHex, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);

  if (expectedKey.length !== derivedKey.length) return false;
  return crypto.timingSafeEqual(expectedKey, derivedKey);
}

export async function authenticateUser(
  rawEmail: string,
  rawPassword: string
): Promise<AuthenticatedUser | null> {
  const email = rawEmail.trim().toLowerCase();
  if (!email || !rawPassword) return null;

  const [dbUser] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(sql`lower(${users.email})`, email))
    .limit(1);

  if (!dbUser || dbUser.status !== "active") {
    return null;
  }

  if (!verifyPassword(rawPassword, dbUser.passwordHash)) {
    return null;
  }

  const role: Extract<SessionRole, "admin" | "user"> =
    dbUser.role === "admin" ? "admin" : "user";
  const redirectUrl = role === "admin" ? "/admin" : "/event";

  try {
    await db
      .update(users)
      .set({ lastActiveAt: new Date() })
      .where(eq(users.id, dbUser.id));
  } catch (error) {
    console.error("Failed to update user lastActiveAt:", error);
  }

  try {
    await db.insert(activityLogs).values({
      userId: dbUser.id,
      actorName: dbUser.name,
      action: "user.login",
      tokensDelta: 0,
      status: "success",
      metadata: {
        email: dbUser.email,
        role,
      },
    });
  } catch (error) {
    console.error("Failed to insert login activity log:", error);
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role,
    redirectUrl,
  };
}

export async function findPublicEventByCode(
  rawCode: string
): Promise<PublicEventRecord | null> {
  const cleanCode = rawCode.trim().toUpperCase();
  if (!cleanCode) return null;

  const [found] = await db
    .select({
      id: events.id,
      code: events.code,
      title: events.title,
      eventDate: events.eventDate,
      description: events.description,
      isPublic: events.isPublic,
    })
    .from(events)
    .where(and(eq(events.code, cleanCode), eq(events.isPublic, true)))
    .limit(1);

  if (!found) return null;

  return {
    id: found.id,
    code: found.code,
    title: found.title,
    date: found.eventDate ?? "",
    description: found.description ?? "",
    redirectUrl: `/event/${found.code}`,
    isPublic: found.isPublic,
  };
}
