export type IdentityBackgroundType = "preset" | "image" | "video";

export interface CustomBackgroundMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  name: string;
  createdAt?: string;
}

export interface EventIdentityConfig {
  autoReset: boolean;
  autoResetSeconds: number;
  backgroundType: IdentityBackgroundType;
  backgroundValue: string;
  backgroundName: string;
  customBackgrounds: CustomBackgroundMediaItem[];
}

export const DEFAULT_EVENT_IDENTITY_CONFIG: EventIdentityConfig = {
  autoReset: true,
  autoResetSeconds: 60,
  backgroundType: "preset",
  backgroundValue: "tpl-hex",
  backgroundName: "",
  customBackgrounds: [],
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
  item?: CustomBackgroundMediaItem;
  customBackgrounds?: CustomBackgroundMediaItem[];
}

export interface DeletedEventMediaResponse {
  ok: boolean;
  error?: string;
  deletedUrl?: string;
  identityConfig?: EventIdentityConfig;
}

function normalizeCustomBackgrounds(raw: unknown): CustomBackgroundMediaItem[] {
  if (!Array.isArray(raw)) return [];
  const seenUrls = new Set<string>();
  const items: CustomBackgroundMediaItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    const url = typeof item.url === "string" ? item.url.trim() : "";
    const type =
      item.type === "image" || item.type === "video" ? item.type : null;
    if (!url || !type || seenUrls.has(url)) continue;

    seenUrls.add(url);
    const id =
      typeof item.id === "string" && item.id.trim()
        ? item.id.trim()
        : url;
    const name =
      typeof item.name === "string" && item.name.trim()
        ? item.name.trim()
        : "Custom Media";
    const createdAt =
      typeof item.createdAt === "string" ? item.createdAt : undefined;

    items.push({ id, url, type, name, ...(createdAt ? { createdAt } : {}) });
  }

  return items;
}

export function normalizeIdentityConfig(raw: unknown): EventIdentityConfig {
  if (!raw || typeof raw !== "object") {
    return {
      ...DEFAULT_EVENT_IDENTITY_CONFIG,
      customBackgrounds: [],
    };
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

  const customBackgrounds = normalizeCustomBackgrounds(obj.customBackgrounds);

  return {
    autoReset,
    autoResetSeconds,
    backgroundType,
    backgroundValue,
    backgroundName,
    customBackgrounds,
  };
}
