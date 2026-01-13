drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Admins Delete Hike Images"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'hike-images'::text) AND public.is_admin()));



  create policy "Admins Manage Hike Images"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'hike-images'::text) AND public.is_admin()));



  create policy "Admins can delete hike images"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'hike-images'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));



  create policy "Admins can update hike images"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'hike-images'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));



  create policy "Admins can upload hike images"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'hike-images'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));



  create policy "Anyone can view hike images"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'hike-images'::text));



  create policy "Avatar images are publicly accessible."
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "Public Read Hike Images"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'hike-images'::text));



  create policy "Users can update their own avatar."
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can upload their own avatar."
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



