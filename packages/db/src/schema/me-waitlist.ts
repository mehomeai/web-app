import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const meWaitlistTable = pgTable("me_waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  consentVersion: text("consent_version").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMeWaitlistSchema = createInsertSchema(meWaitlistTable).omit({
  id: true,
  createdAt: true,
});
export type InsertMeWaitlist = z.infer<typeof insertMeWaitlistSchema>;
export type MeWaitlist = typeof meWaitlistTable.$inferSelect;
