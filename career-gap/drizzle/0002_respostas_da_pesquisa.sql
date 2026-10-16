CREATE TABLE "evaluation_response" (
	"user_id" text PRIMARY KEY NOT NULL,
	"instrument_version" text NOT NULL,
	"catalog_version" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"participant" jsonb NOT NULL,
	"answers" jsonb NOT NULL,
	"comments" jsonb NOT NULL,
	"context" jsonb NOT NULL,
	"submitted_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "evaluation_response" ADD CONSTRAINT "evaluation_response_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;