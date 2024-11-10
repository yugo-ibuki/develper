import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const translations = pgTable('translations', {
  id: serial('id').primaryKey(),
  sourceText: text('source_text').notNull(),
  translatedText: text('translated_text').notNull(),
  sourceLang: varchar('source_lang', { length: 10 }).notNull(),
  targetLang: varchar('target_lang', { length: 10 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: varchar('user_id', { length: 255 }), // Optional: ユーザーIDがある場合
});

export type Translation = typeof translations.$inferSelect;
export type NewTranslation = typeof translations.$inferInsert;
