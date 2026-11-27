import { relations, sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  check,
  date,
  inet,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Application user accounts, roles, plans, and token balances.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("operator"),
    status: text("status").notNull().default("active"),
    companyName: text("company_name"),
    city: text("city"),
    country: text("country").default("Indonesia"),
    planName: text("plan_name").notNull().default("Free"),
    tokenBalance: integer("token_balance").notNull().default(0),
    unlimitedUntil: timestamp("unlimited_until", { withTimezone: true }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("users_token_balance_non_negative", sql`${table.tokenBalance} >= 0`),
  ]
);

/**
 * Photobooth events owned by an operator/admin.
 */
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 12 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: date("event_date", { mode: "string" }),
  isPublic: boolean("is_public").notNull().default(false),
  remoteToken: uuid("remote_token").notNull().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Per-event JSON configuration blocks (1:1 with events).
 */
export const eventSettings = pgTable("event_settings", {
  eventId: uuid("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),
  identityConfig: jsonb("identity_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  outputConfig: jsonb("output_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  imageModelConfig: jsonb("image_model_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  cameraConfig: jsonb("camera_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  screenEditorConfig: jsonb("screen_editor_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  printConfig: jsonb("print_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  guestDownloadConfig: jsonb("guest_download_config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * AI photo booth concepts / presets attached to an event.
 */
export const eventConcepts = pgTable("event_concepts", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  conceptType: text("concept_type").notNull().default("CUSTOM CONCEPT"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  referenceImageUrl: text("reference_image_url"),
  prompt: text("prompt").notNull().default(""),
  modelOverride: text("model_override").notNull().default("default"),
  styleFilter: text("style_filter"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Frame / overlay canvas templates linked to an event and/or owner.
 */
export const overlayTemplates = pgTable("overlay_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  source: text("source").notNull(),
  paperSize: text("paper_size"),
  dpi: integer("dpi").default(300),
  canvasWidth: integer("canvas_width").notNull(),
  canvasHeight: integer("canvas_height").notNull(),
  bgColor: text("bg_color").notNull().default("#1b4d3e"),
  elementsJson: jsonb("elements_json").$type<unknown[]>().notNull().default([]),
  renderedPngUrl: text("rendered_png_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Node-based interactive kiosk flow graph (1:1 with events).
 */
export const interactiveFlows = pgTable("interactive_flows", {
  eventId: uuid("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),
  nodesJson: jsonb("nodes_json").$type<unknown[]>().notNull().default([]),
  edgesJson: jsonb("edges_json").$type<unknown[]>().notNull().default([]),
  globalSettingsJson: jsonb("global_settings_json")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Individual guest photobooth capture & render sessions.
 */
export const boothSessions = pgTable("booth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  conceptId: uuid("concept_id").references(() => eventConcepts.id, {
    onDelete: "set null",
  }),
  sessionCode: text("session_code").notNull().unique(),
  guestName: text("guest_name"),
  guestContact: text("guest_contact"),
  guestEmail: text("guest_email"),
  aiModelUsed: text("ai_model_used"),
  status: text("status").notNull().default("started"),
  renderDurationMs: integer("render_duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Generated or captured media files belonging to an event/session.
 */
export const boothMedia = pgTable("booth_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id").references(() => boothSessions.id, {
    onDelete: "cascade",
  }),
  fileName: text("file_name").notNull(),
  mediaType: text("media_type").notNull(),
  conceptTitle: text("concept_title"),
  storageKey: text("storage_key").notNull(),
  fileUrl: text("file_url").notNull(),
  mimeType: text("mime_type").notNull().default("image/png"),
  sizeBytes: bigint("size_bytes", { mode: "number" }).notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Immutable ledger of user token top-ups, deductions, and adjustments.
 */
export const tokenTransactions = pgTable("token_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Audit trail of system, user, and booth actions.
 */
export const activityLogs = pgTable("activity_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  actorName: text("actor_name").notNull(),
  action: text("action").notNull(),
  tokensDelta: integer("tokens_delta").notNull().default(0),
  status: text("status").notNull(),
  ipAddress: inet("ip_address"),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  overlayTemplates: many(overlayTemplates),
  tokenTransactions: many(tokenTransactions, { relationName: "userTransactions" }),
  createdTokenTransactions: many(tokenTransactions, {
    relationName: "createdByTransactions",
  }),
  activityLogs: many(activityLogs),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  owner: one(users, {
    fields: [events.ownerId],
    references: [users.id],
  }),
  settings: one(eventSettings, {
    fields: [events.id],
    references: [eventSettings.eventId],
  }),
  interactiveFlow: one(interactiveFlows, {
    fields: [events.id],
    references: [interactiveFlows.eventId],
  }),
  concepts: many(eventConcepts),
  overlayTemplates: many(overlayTemplates),
  boothSessions: many(boothSessions),
  boothMedia: many(boothMedia),
  tokenTransactions: many(tokenTransactions),
  activityLogs: many(activityLogs),
}));

export const eventSettingsRelations = relations(eventSettings, ({ one }) => ({
  event: one(events, {
    fields: [eventSettings.eventId],
    references: [events.id],
  }),
}));

export const eventConceptsRelations = relations(eventConcepts, ({ one, many }) => ({
  event: one(events, {
    fields: [eventConcepts.eventId],
    references: [events.id],
  }),
  boothSessions: many(boothSessions),
}));

export const overlayTemplatesRelations = relations(overlayTemplates, ({ one }) => ({
  event: one(events, {
    fields: [overlayTemplates.eventId],
    references: [events.id],
  }),
  owner: one(users, {
    fields: [overlayTemplates.ownerId],
    references: [users.id],
  }),
}));

export const interactiveFlowsRelations = relations(interactiveFlows, ({ one }) => ({
  event: one(events, {
    fields: [interactiveFlows.eventId],
    references: [events.id],
  }),
}));

export const boothSessionsRelations = relations(boothSessions, ({ one, many }) => ({
  event: one(events, {
    fields: [boothSessions.eventId],
    references: [events.id],
  }),
  concept: one(eventConcepts, {
    fields: [boothSessions.conceptId],
    references: [eventConcepts.id],
  }),
  media: many(boothMedia),
}));

export const boothMediaRelations = relations(boothMedia, ({ one }) => ({
  event: one(events, {
    fields: [boothMedia.eventId],
    references: [events.id],
  }),
  session: one(boothSessions, {
    fields: [boothMedia.sessionId],
    references: [boothSessions.id],
  }),
}));

export const tokenTransactionsRelations = relations(tokenTransactions, ({ one }) => ({
  user: one(users, {
    fields: [tokenTransactions.userId],
    references: [users.id],
    relationName: "userTransactions",
  }),
  event: one(events, {
    fields: [tokenTransactions.eventId],
    references: [events.id],
  }),
  creator: one(users, {
    fields: [tokenTransactions.createdBy],
    references: [users.id],
    relationName: "createdByTransactions",
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [activityLogs.eventId],
    references: [events.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventSetting = typeof eventSettings.$inferSelect;
export type NewEventSetting = typeof eventSettings.$inferInsert;
export type EventConcept = typeof eventConcepts.$inferSelect;
export type NewEventConcept = typeof eventConcepts.$inferInsert;
export type OverlayTemplate = typeof overlayTemplates.$inferSelect;
export type NewOverlayTemplate = typeof overlayTemplates.$inferInsert;
export type InteractiveFlow = typeof interactiveFlows.$inferSelect;
export type NewInteractiveFlow = typeof interactiveFlows.$inferInsert;
export type BoothSession = typeof boothSessions.$inferSelect;
export type NewBoothSession = typeof boothSessions.$inferInsert;
export type BoothMedia = typeof boothMedia.$inferSelect;
export type NewBoothMedia = typeof boothMedia.$inferInsert;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type NewTokenTransaction = typeof tokenTransactions.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
