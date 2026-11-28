import crypto from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

export type SessionRole = "admin" | "user" | "event_guest";

export interface SessionPayload {
  sub: string;
  email?: string;
  name: string;
  role: SessionRole;
  eventCode?: string;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = "cekreks_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24; // 24 jam

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable must be set in production.");
  }
  return "dev-only-insecure-cekreks-session-secret";
}

function toBase64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function fromBase64Url(input: string): Buffer {
  const padded = input.replaceAll("-", "+").replaceAll("_", "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLength), "base64");
}

function signData(encodedPayload: string, secret: string): string {
  return toBase64Url(
    crypto.createHmac("sha256", secret).update(encodedPayload).digest()
  );
}

export function createSessionToken(
  data: Omit<SessionPayload, "iat" | "exp">,
  ttlSeconds = DEFAULT_TTL_SECONDS
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...data,
    iat: now,
    exp: now + ttlSeconds,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signData(encodedPayload, getSessionSecret());
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) return null;

  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  const expectedSig = signData(encodedPayload, secret);
  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");

  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload).toString("utf8")) as SessionPayload;
    if (
      !parsed ||
      typeof parsed.sub !== "string" ||
      typeof parsed.name !== "string" ||
      !["admin", "user", "event_guest"].includes(parsed.role) ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (parsed.exp <= now) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function setSessionCookie(
  data: Omit<SessionPayload, "iat" | "exp">,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<void> {
  const token = createSessionToken(data, ttlSeconds);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
