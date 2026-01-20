drop policy "Admins manage enrollments" on "public"."hike_enrollments";

alter table "public"."hike_enrollments" drop constraint "hike_enrollments_pkey";

alter table "public"."profiles" drop constraint "profiles_pkey";

alter table "public"."user_roles" drop constraint "user_roles_pkey";

drop index if exists "public"."hike_enrollments_pkey";

drop index if exists "public"."profiles_pkey";

drop index if exists "public"."user_roles_pkey";

alter table "public"."hike_enrollments" drop column "id";

alter table "public"."profiles" drop column "id";

alter table "public"."user_roles" drop column "id";

CREATE UNIQUE INDEX hike_enrollments_pkey ON public.hike_enrollments USING btree (user_id, hike_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_id);

alter table "public"."hike_enrollments" add constraint "hike_enrollments_pkey" PRIMARY KEY using index "hike_enrollments_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";


  create policy "Admins manage enrollements"
  on "public"."hike_enrollments"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



