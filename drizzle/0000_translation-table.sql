CREATE TABLE IF NOT EXISTS "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_text" text NOT NULL,
	"translated_text" text NOT NULL,
	"source_lang" varchar(10) NOT NULL,
	"target_lang" varchar(10) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255)
);
