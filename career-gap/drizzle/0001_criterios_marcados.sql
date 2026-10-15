CREATE TABLE "criteria_check" (
	"user_id" text NOT NULL,
	"competency_id" text NOT NULL,
	"level" text NOT NULL,
	"checked" jsonb NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "criteria_check_user_id_competency_id_level_pk" PRIMARY KEY("user_id","competency_id","level")
);
--> statement-breakpoint
ALTER TABLE "criteria_check" ADD CONSTRAINT "criteria_check_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;