/*
  Harden role management and avatar storage.

  - Normal users may update profile fields, but never their own role.
  - Admin role changes go through a checked SECURITY DEFINER function.
  - Avatar uploads require authentication.
  - Users can manage only files inside a folder named with their auth user ID.
  - Admins can manage all files in the bucket for team-member administration.
*/

BEGIN;

-- Remove broad INSERT/UPDATE access, then grant only safe profile columns.
-- Omitting `role` from both grants prevents self-promotion during registration
-- as well as after the profile has been created.
REVOKE INSERT ON TABLE public.user_profiles FROM anon, authenticated;
REVOKE UPDATE ON TABLE public.user_profiles FROM anon, authenticated;
GRANT INSERT (
  id,
  email,
  full_name,
  avatar_url,
  phone,
  company,
  country
) ON TABLE public.user_profiles TO authenticated;
GRANT UPDATE (
  full_name,
  avatar_url,
  phone,
  company,
  country,
  updated_at
) ON TABLE public.user_profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_target_user_id uuid,
  p_new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF public.get_my_role() <> 'admin' THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  IF p_target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Administrators cannot change their own role';
  END IF;

  IF p_new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  UPDATE public.user_profiles
  SET
    role = p_new_role,
    updated_at = now()
  WHERE id = p_target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, text) TO authenticated;

-- Keep avatars public for display, but restrict accepted upload formats.
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'member-avatars';

DROP POLICY IF EXISTS "Allow Uploads for member-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow Updates for member-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow Deletes for member-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated avatar uploads" ON storage.objects;
DROP POLICY IF EXISTS "Avatar owner updates" ON storage.objects;
DROP POLICY IF EXISTS "Avatar owner deletes" ON storage.objects;

CREATE POLICY "Authenticated avatar uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'member-avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_my_role() = 'admin'
  )
);

CREATE POLICY "Avatar owner updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'member-avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_my_role() = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'member-avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_my_role() = 'admin'
  )
);

CREATE POLICY "Avatar owner deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'member-avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_my_role() = 'admin'
  )
);

COMMIT;
