DROP POLICY IF EXISTS "Public view profiles" ON "public"."profiles";

CREATE POLICY "Users can view their own profile or if admin" 
ON "public"."profiles" 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);