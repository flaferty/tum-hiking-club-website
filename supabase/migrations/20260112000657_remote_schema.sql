


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



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'moderator',
    'user',
    'member'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."waypoint_type" AS ENUM (
    'start',
    'end',
    'overnight_stop'
);


ALTER TYPE "public"."waypoint_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_assign_members"("phone_numbers" "text"[]) RETURNS TABLE("phone_number" "text", "status" "text", "name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  p_num TEXT;
  target_user_id UUID;
  user_name TEXT;
BEGIN
  -- [SECURITY CHECK] Stop non-admins immediately
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: You are not an administrator.';
  END IF;

  -- Loop logic
  FOREACH p_num IN ARRAY phone_numbers
  LOOP
    -- Strip formatting (spaces and +)
    p_num := REPLACE(p_num, '+', '');

    -- Find user (joining auth.users to avoid "Ghost Users")
    SELECT p.id, p.full_name INTO target_user_id, user_name 
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE REPLACE(REPLACE(p.phone_number, '+', ''), ' ', '') = REPLACE(p_num, ' ', '') 
    LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
      -- Logic: Check if Admin -> Check if Member -> Else Assign
      IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
        phone_number := p_num;
        status := 'Is Admin (Skipped)'; 
        name := user_name;
        RETURN NEXT;
      ELSIF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = 'member') THEN
        phone_number := p_num;
        status := 'Already Member';
        name := user_name;
        RETURN NEXT;
      ELSE
        INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'member');
        phone_number := p_num;
        status := 'Assigned ';
        name := user_name;
        RETURN NEXT;
      END IF;
    ELSE
      phone_number := p_num;
      status := 'Not Found ';
      name := NULL;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."bulk_assign_members"("phone_numbers" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_email_exists"("email_check" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return exists (
    select 1 from auth.users 
    where email = email_check
  );
end;
$$;


ALTER FUNCTION "public"."check_email_exists"("email_check" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (user_id, email, full_name, phone_number)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone_number'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


ALTER FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."hike_enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "hike_id" "uuid" NOT NULL,
    "enrolled_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'enrolled'::"text" NOT NULL,
    CONSTRAINT "hike_enrollments_status_check" CHECK (("status" = ANY (ARRAY['enrolled'::"text", 'cancelled'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."hike_enrollments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hike_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hike_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hike_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hikes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "date" "date" NOT NULL,
    "end_date" "date",
    "location_lat" numeric(10,6) NOT NULL,
    "location_lng" numeric(10,6) NOT NULL,
    "location_name" "text" NOT NULL,
    "difficulty" "text" NOT NULL,
    "distance" numeric(5,1) NOT NULL,
    "elevation" integer NOT NULL,
    "duration" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "max_participants" integer DEFAULT 20 NOT NULL,
    "organizer_id" "uuid",
    "organizer_name" "text" NOT NULL,
    "status" "text" DEFAULT 'upcoming'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "members_only" boolean DEFAULT false,
    CONSTRAINT "hikes_difficulty_check" CHECK (("difficulty" = ANY (ARRAY['easy'::"text", 'moderate'::"text", 'hard'::"text", 'expert'::"text"]))),
    CONSTRAINT "hikes_status_check" CHECK (("status" = ANY (ARRAY['upcoming'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."hikes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text",
    "email" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "phone_number" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waypoints" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hike_id" "uuid" NOT NULL,
    "latitude" numeric NOT NULL,
    "longitude" numeric NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."waypoint_type" NOT NULL,
    "day_number" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."waypoints" OWNER TO "postgres";


ALTER TABLE ONLY "public"."hike_enrollments"
    ADD CONSTRAINT "hike_enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hike_enrollments"
    ADD CONSTRAINT "hike_enrollments_user_id_hike_id_key" UNIQUE ("user_id", "hike_id");



ALTER TABLE ONLY "public"."hike_images"
    ADD CONSTRAINT "hike_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hikes"
    ADD CONSTRAINT "hikes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "unique_user_id" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");



ALTER TABLE ONLY "public"."waypoints"
    ADD CONSTRAINT "waypoints_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_enrollments_hike_id" ON "public"."hike_enrollments" USING "btree" ("hike_id");



CREATE INDEX "idx_enrollments_user_id" ON "public"."hike_enrollments" USING "btree" ("user_id");



CREATE INDEX "idx_hike_images_hike_id" ON "public"."hike_images" USING "btree" ("hike_id");



CREATE INDEX "idx_waypoints_hike_id" ON "public"."waypoints" USING "btree" ("hike_id");



CREATE OR REPLACE TRIGGER "update_hikes_updated_at" BEFORE UPDATE ON "public"."hikes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."hike_enrollments"
    ADD CONSTRAINT "fk_enrollments_hikes" FOREIGN KEY ("hike_id") REFERENCES "public"."hikes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hike_enrollments"
    ADD CONSTRAINT "fk_enrollments_profiles" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hike_enrollments"
    ADD CONSTRAINT "hike_enrollments_hike_id_fkey" FOREIGN KEY ("hike_id") REFERENCES "public"."hikes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hike_enrollments"
    ADD CONSTRAINT "hike_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hike_images"
    ADD CONSTRAINT "hike_images_hike_id_fkey" FOREIGN KEY ("hike_id") REFERENCES "public"."hikes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hikes"
    ADD CONSTRAINT "hikes_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waypoints"
    ADD CONSTRAINT "waypoints_hike_id_fkey" FOREIGN KEY ("hike_id") REFERENCES "public"."hikes"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage all roles" ON "public"."user_roles" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can manage hike images" ON "public"."hike_images" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Admins can manage waypoints" ON "public"."waypoints" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Admins manage hikes" ON "public"."hikes" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Anyone can view hike images" ON "public"."hike_images" FOR SELECT USING (true);



CREATE POLICY "Anyone can view waypoints" ON "public"."waypoints" FOR SELECT USING (true);



CREATE POLICY "Public can view enrollments" ON "public"."hike_enrollments" FOR SELECT USING (true);



CREATE POLICY "Public view hikes" ON "public"."hikes" FOR SELECT USING (true);



CREATE POLICY "Public view profiles" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can enroll themselves" ON "public"."hike_enrollments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own role" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can unenroll themselves" ON "public"."hike_enrollments" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."hike_enrollments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hike_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hikes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waypoints" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."bulk_assign_members"("phone_numbers" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_members"("phone_numbers" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_assign_members"("phone_numbers" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_email_exists"("email_check" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_email_exists"("email_check" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_email_exists"("email_check" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."hike_enrollments" TO "anon";
GRANT ALL ON TABLE "public"."hike_enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."hike_enrollments" TO "service_role";



GRANT ALL ON TABLE "public"."hike_images" TO "anon";
GRANT ALL ON TABLE "public"."hike_images" TO "authenticated";
GRANT ALL ON TABLE "public"."hike_images" TO "service_role";



GRANT ALL ON TABLE "public"."hikes" TO "anon";
GRANT ALL ON TABLE "public"."hikes" TO "authenticated";
GRANT ALL ON TABLE "public"."hikes" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."waypoints" TO "anon";
GRANT ALL ON TABLE "public"."waypoints" TO "authenticated";
GRANT ALL ON TABLE "public"."waypoints" TO "service_role";









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



































