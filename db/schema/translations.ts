import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// メインの translations テーブル
export const translations = pgTable('translations', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  sourceText: text('sourceText').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  userId: varchar('userId', { length: 255 }),
});

// DeepL の翻訳結果テーブル
export const deeplTranslations = pgTable('deepl_translations', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  translationId: uuid('translationId')
    .notNull()
    .references(() => translations.id, {
      onDelete: 'cascade',
    }),
  translatedText: text('translatedText').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

// Google の翻訳結果テーブル
export const googleTranslations = pgTable('google_translations', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  translationId: uuid('translationId')
    .notNull()
    .references(() => translations.id, {
      onDelete: 'cascade',
    }),
  translatedText: text('translatedText').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

// リレーションの定義
export const translationsRelations = relations(translations, ({ many }) => ({
  deeplTranslations: many(deeplTranslations),
  googleTranslations: many(googleTranslations),
}));

export const deeplTranslationsRelations = relations(deeplTranslations, ({ one }) => ({
  translation: one(translations, {
    fields: [deeplTranslations.translationId],
    references: [translations.id],
  }),
}));

export const googleTranslationsRelations = relations(googleTranslations, ({ one }) => ({
  translation: one(translations, {
    fields: [googleTranslations.translationId],
    references: [translations.id],
  }),
}));

// 型定義のエクスポート
export type Translation = typeof translations.$inferSelect;
export type NewTranslation = typeof translations.$inferInsert;
export type DeepLTranslation = typeof deeplTranslations.$inferSelect;
export type NewDeepLTranslation = typeof deeplTranslations.$inferInsert;
export type GoogleTranslation = typeof googleTranslations.$inferSelect;
export type NewGoogleTranslation = typeof googleTranslations.$inferInsert;
