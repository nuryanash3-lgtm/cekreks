export type IdentityBackgroundType = "preset" | "image" | "video";

export interface EventIdentityConfig {
  autoReset: boolean;
  autoResetSeconds: number;
  backgroundType: IdentityBackgroundType;
  backgroundValue: string;
  backgroundName: string;
}

export const DEFAULT_EVENT_IDENTITY_CONFIG: EventIdentityConfig = {
  autoReset: true,
  autoResetSeconds: 60,
  backgroundType: "preset",
  backgroundValue: "tpl-hex",
  backgroundName: "",
};

export interface EventSettingsApiResponse {
  ok: boolean;
  error?: string;
  event?: {
    id: string;
    code: string;
    title: string;
    description: string | null;
    isPublic: boolean;
  };
  settings?: {
    identityConfig: EventIdentityConfig;
  };
}

export interface UploadedEventMediaResponse {
  ok: boolean;
  error?: string;
  media?: {
    url: string;
    backgroundType: "image" | "video";
    fileName: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
}

export function normalizeIdentityConfig(raw: unknown): EventIdentityConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_EVENT_IDENTITY_CONFIG };
  }

  const obj = raw as Record<string, unknown>;
  const autoReset =
    typeof obj.autoReset === "boolean"
      ? obj.autoReset
      : DEFAULT_EVENT_IDENTITY_CONFIG.autoReset;

  const rawSeconds = Number(obj.autoResetSeconds);
  const autoResetSeconds =
    Number.isFinite(rawSeconds) && rawSeconds >= 15 && rawSeconds <= 120
      ? Math.round(rawSeconds)
      : DEFAULT_EVENT_IDENTITY_CONFIG.autoResetSeconds;

  const backgroundType: IdentityBackgroundType =
    obj.backgroundType === "image" ||
    obj.backgroundType === "video" ||
    obj.backgroundType === "preset"
      ? obj.backgroundType
      : DEFAULT_EVENT_IDENTITY_CONFIG.backgroundType;

  const backgroundValue =
    typeof obj.backgroundValue === "string" && obj.backgroundValue.trim()
      ? obj.backgroundValue.trim()
      : DEFAULT_EVENT_IDENTITY_CONFIG.backgroundValue;

  const backgroundName =
    typeof obj.backgroundName === "string" ? obj.backgroundName : "";

  return {
    autoReset,
    autoResetSeconds,
    backgroundType,
    backgroundValue,
    backgroundName,
  };
}
