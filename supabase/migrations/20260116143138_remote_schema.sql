drop policy "Users insert own profile" on "public"."profiles";

drop policy "Users update own profile" on "public"."profiles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.bulk_assign_members(phone_numbers text[])
 RETURNS TABLE(phone_number text, status text, name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  p_num TEXT;
  target_user_id UUID;
  user_name TEXT;
BEGIN
  -- [SECURITY CHECK] Stop non-admins immediately
IF (auth.jwt() ->> 'role' <> 'service_role') AND (NOT public.is_admin()) THEN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.check_email_exists(email_check text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return exists (
    select 1 from auth.users 
    where email = email_check
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;


  create policy "Users insert own profile"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users update own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));
