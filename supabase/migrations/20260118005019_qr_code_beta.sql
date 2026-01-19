alter table "public"."hike_enrollments" drop constraint "hike_enrollments_status_check";

alter table "public"."hike_enrollments" add constraint "hike_enrollments_status_check" CHECK ((status = ANY (ARRAY['enrolled'::text, 'cancelled'::text, 'completed'::text, 'verified'::text]))) not valid;

alter table "public"."hike_enrollments" validate constraint "hike_enrollments_status_check";


  create policy "Admins manage enrollments"
  on "public"."hike_enrollments"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



