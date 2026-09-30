


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    terms_accepted_at,
    privacy_accepted_at,
    marketing_consent,
    consent_version
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    case
      when new.raw_user_meta_data->>'terms_accepted_at' is not null
      then (new.raw_user_meta_data->>'terms_accepted_at')::timestamptz
      else null
    end,
    case
      when new.raw_user_meta_data->>'privacy_accepted_at' is not null
      then (new.raw_user_meta_data->>'privacy_accepted_at')::timestamptz
      else null
    end,
    coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false),
    new.raw_user_meta_data->>'consent_version'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."touch_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" integer NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "icon" "text",
    "sort_order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."categories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."categories_id_seq" OWNED BY "public"."categories"."id";



CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "target_type" "text" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "body" "text" NOT NULL,
    "status" "text" DEFAULT 'published'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "comments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'published'::"text", 'hidden'::"text"]))),
    CONSTRAINT "comments_target_type_check" CHECK (("target_type" = ANY (ARRAY['place'::"text", 'route'::"text", 'legend'::"text", 'event'::"text"])))
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."donations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "amount_rub" integer NOT NULL,
    "provider" "text" NOT NULL,
    "provider_payment_id" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "donations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'failed'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."donations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone,
    "place_id" "uuid",
    "address" "text",
    "price_rub" integer,
    "url" "text",
    "cover_url" "text",
    "status" "text" DEFAULT 'published'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "events_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'past'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gigachat_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "scenario" "text" NOT NULL,
    "prompt" "text",
    "response" "text",
    "prompt_tokens" integer,
    "response_tokens" integer,
    "duration_ms" integer,
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."gigachat_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."legends" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "excerpt" "text",
    "body" "text" NOT NULL,
    "place_id" "uuid",
    "author_id" "uuid",
    "source" "text",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "views" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "legends_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'published'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."legends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."place_tags" (
    "place_id" "uuid" NOT NULL,
    "tag_id" integer NOT NULL
);


ALTER TABLE "public"."place_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."places" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "short_desc" "text",
    "full_desc" "text",
    "cover_url" "text",
    "gallery" "jsonb" DEFAULT '[]'::"jsonb",
    "lat" double precision,
    "lng" double precision,
    "category_id" integer,
    "author_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "season" "text",
    "is_free" boolean DEFAULT true,
    "how_to_get" "text",
    "tips" "text",
    "warnings" "text",
    "views" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by_gigachat" boolean DEFAULT false NOT NULL,
    CONSTRAINT "places_season_check" CHECK (("season" = ANY (ARRAY['all'::"text", 'winter'::"text", 'spring'::"text", 'summer'::"text", 'autumn'::"text"]))),
    CONSTRAINT "places_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'published'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."places" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "bio" "text",
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "reputation" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "terms_accepted_at" timestamp with time zone,
    "privacy_accepted_at" timestamp with time zone,
    "marketing_consent" boolean DEFAULT false NOT NULL,
    "consent_version" "text",
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'author'::"text", 'moderator'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quiz_id" "uuid",
    "user_id" "uuid",
    "score" integer NOT NULL,
    "total" integer NOT NULL,
    "answers" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quiz_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quizzes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "place_id" "uuid",
    "questions" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_by_gigachat" boolean DEFAULT false NOT NULL,
    "status" "text" DEFAULT 'published'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "quizzes_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"])))
);


ALTER TABLE "public"."quizzes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "target_type" "text" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "reason" "text" NOT NULL,
    "comment" "text",
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "reports_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'reviewed'::"text", 'resolved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."route_places" (
    "route_id" "uuid" NOT NULL,
    "place_id" "uuid" NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."route_places" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."routes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "duration_min" integer,
    "budget_rub" integer,
    "transport" "text",
    "author_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "gpx_url" "text",
    "pdf_url" "text",
    "views" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "routes_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'published'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."routes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" integer NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."tags_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tags_id_seq" OWNED BY "public"."tags"."id";



ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tags" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tags_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."donations"
    ADD CONSTRAINT "donations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."gigachat_logs"
    ADD CONSTRAINT "gigachat_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."legends"
    ADD CONSTRAINT "legends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."legends"
    ADD CONSTRAINT "legends_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."place_tags"
    ADD CONSTRAINT "place_tags_pkey" PRIMARY KEY ("place_id", "tag_id");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."quiz_results"
    ADD CONSTRAINT "quiz_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quizzes"
    ADD CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quizzes"
    ADD CONSTRAINT "quizzes_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."route_places"
    ADD CONSTRAINT "route_places_pkey" PRIMARY KEY ("route_id", "place_id");



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_slug_key" UNIQUE ("slug");



CREATE INDEX "comments_target_idx" ON "public"."comments" USING "btree" ("target_type", "target_id");



CREATE INDEX "events_starts_idx" ON "public"."events" USING "btree" ("starts_at");



CREATE INDEX "gigachat_logs_user_idx" ON "public"."gigachat_logs" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "places_author_idx" ON "public"."places" USING "btree" ("author_id");



CREATE INDEX "places_category_idx" ON "public"."places" USING "btree" ("category_id");



CREATE INDEX "places_status_idx" ON "public"."places" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "legends_touch" BEFORE UPDATE ON "public"."legends" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "places_touch" BEFORE UPDATE ON "public"."places" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_touch" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "routes_touch" BEFORE UPDATE ON "public"."routes" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."donations"
    ADD CONSTRAINT "donations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."gigachat_logs"
    ADD CONSTRAINT "gigachat_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."legends"
    ADD CONSTRAINT "legends_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."legends"
    ADD CONSTRAINT "legends_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."place_tags"
    ADD CONSTRAINT "place_tags_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."place_tags"
    ADD CONSTRAINT "place_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_results"
    ADD CONSTRAINT "quiz_results_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_results"
    ADD CONSTRAINT "quiz_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."quizzes"
    ADD CONSTRAINT "quizzes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."route_places"
    ADD CONSTRAINT "route_places_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."route_places"
    ADD CONSTRAINT "route_places_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "categories_public_read" ON "public"."categories" FOR SELECT USING (true);



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "comments_public_read" ON "public"."comments" FOR SELECT USING (("status" = 'published'::"text"));



ALTER TABLE "public"."donations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "events_admin_all" ON "public"."events" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "events_public_read" ON "public"."events" FOR SELECT USING (("status" = ANY (ARRAY['published'::"text", 'past'::"text"])));



ALTER TABLE "public"."gigachat_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."legends" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "legends_admin_all" ON "public"."legends" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "legends_public_read" ON "public"."legends" FOR SELECT USING (("status" = 'published'::"text"));



ALTER TABLE "public"."place_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "place_tags_public_read" ON "public"."place_tags" FOR SELECT USING (true);



ALTER TABLE "public"."places" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "places_admin_all" ON "public"."places" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "places_author_delete" ON "public"."places" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "author_id") AND ("status" = ANY (ARRAY['draft'::"text", 'rejected'::"text"]))));



CREATE POLICY "places_author_insert" ON "public"."places" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "places_author_read_own" ON "public"."places" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "author_id"));



CREATE POLICY "places_author_update" ON "public"."places" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "author_id")) WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "places_public_read" ON "public"."places" FOR SELECT USING (("status" = 'published'::"text"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_public_read" ON "public"."profiles" FOR SELECT USING (true);



ALTER TABLE "public"."quiz_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quizzes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "quizzes_anon_insert" ON "public"."quizzes" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "quizzes_auth_insert" ON "public"."quizzes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "quizzes_auth_read_all" ON "public"."quizzes" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "quizzes_auth_update" ON "public"."quizzes" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "quizzes_public_read" ON "public"."quizzes" FOR SELECT USING (("status" = 'published'::"text"));



ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."route_places" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."routes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "routes_public_read" ON "public"."routes" FOR SELECT USING (("status" = 'published'::"text"));



ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tags_public_read" ON "public"."tags" FOR SELECT USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."donations" TO "anon";
GRANT ALL ON TABLE "public"."donations" TO "authenticated";
GRANT ALL ON TABLE "public"."donations" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."gigachat_logs" TO "anon";
GRANT ALL ON TABLE "public"."gigachat_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."gigachat_logs" TO "service_role";



GRANT ALL ON TABLE "public"."legends" TO "anon";
GRANT ALL ON TABLE "public"."legends" TO "authenticated";
GRANT ALL ON TABLE "public"."legends" TO "service_role";



GRANT ALL ON TABLE "public"."place_tags" TO "anon";
GRANT ALL ON TABLE "public"."place_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."place_tags" TO "service_role";



GRANT ALL ON TABLE "public"."places" TO "anon";
GRANT ALL ON TABLE "public"."places" TO "authenticated";
GRANT ALL ON TABLE "public"."places" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quiz_results" TO "anon";
GRANT ALL ON TABLE "public"."quiz_results" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_results" TO "service_role";



GRANT ALL ON TABLE "public"."quizzes" TO "anon";
GRANT ALL ON TABLE "public"."quizzes" TO "authenticated";
GRANT ALL ON TABLE "public"."quizzes" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."route_places" TO "anon";
GRANT ALL ON TABLE "public"."route_places" TO "authenticated";
GRANT ALL ON TABLE "public"."route_places" TO "service_role";



GRANT ALL ON TABLE "public"."routes" TO "anon";
GRANT ALL ON TABLE "public"."routes" TO "authenticated";
GRANT ALL ON TABLE "public"."routes" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































