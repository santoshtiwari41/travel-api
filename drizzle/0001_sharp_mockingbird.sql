CREATE TYPE "public"."trip_status" AS ENUM('planned', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."trip_visibility" AS ENUM('private', 'friends', 'public');--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"city_id" bigint NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "trip_status" DEFAULT 'planned',
	"visibility" "trip_visibility" DEFAULT 'friends',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;