CREATE TABLE IF NOT EXISTS "deepl_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"translationId" uuid NOT NULL,
	"translatedText" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "google_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"translationId" uuid NOT NULL,
	"translatedText" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sourceText" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userId" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deepl_translations" ADD CONSTRAINT "deepl_translations_translationId_translations_id_fk" FOREIGN KEY ("translationId") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "google_translations" ADD CONSTRAINT "google_translations_translationId_translations_id_fk" FOREIGN KEY ("translationId") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
