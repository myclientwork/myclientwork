/*
  Forward-only reconciliation for databases that already recorded the original
  settings migration.

  - Rebuilds admin policies with the SECURITY DEFINER role helper to avoid
    recursive user_profiles policy checks.
  - Requires user deletion to go through the authenticated server admin API,
    which removes the auth account and its cascading profile data together.
  - Enforces last-admin protection inside the role RPC, not only in the UI.
*/

BEGIN;

DROP POLICY IF EXISTS "admin_manage_settings" ON public.site_settings;
CREATE POLICY "admin_manage_settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.get_my_role() IN ('admin', 'super_admin'))
WITH CHECK (public.get_my_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "admin_read_activity" ON public.user_activity_log;
CREATE POLICY "admin_read_activity"
ON public.user_activity_log
FOR SELECT
TO authenticated
USING (public.get_my_role() IN ('admin', 'super_admin'));

-- Profile-only deletion can orphan the corresponding auth account. The server
-- admin endpoint uses the service role to delete auth.users instead.
DROP POLICY IF EXISTS "admin_delete_profiles" ON public.user_profiles;
REVOKE DELETE ON TABLE public.user_profiles FROM anon, authenticated;

DROP POLICY IF EXISTS "admin_upload_site_assets" ON storage.objects;
CREATE POLICY "admin_upload_site_assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets'
  AND public.get_my_role() IN ('admin', 'super_admin')
);

DROP POLICY IF EXISTS "admin_update_site_assets" ON storage.objects;
CREATE POLICY "admin_update_site_assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND public.get_my_role() IN ('admin', 'super_admin')
)
WITH CHECK (
  bucket_id = 'site-assets'
  AND public.get_my_role() IN ('admin', 'super_admin')
);

DROP POLICY IF EXISTS "admin_delete_site_assets" ON storage.objects;
CREATE POLICY "admin_delete_site_assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND public.get_my_role() IN ('admin', 'super_admin')
);

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_target_user_id uuid,
  p_new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_target_role text;
BEGIN
  IF public.get_my_role() NOT IN ('admin', 'super_admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  IF p_target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Administrators cannot change their own role';
  END IF;

  IF p_new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  -- Serialize role changes so two concurrent requests cannot both demote the
  -- last remaining administrator.
  LOCK TABLE public.user_profiles IN SHARE ROW EXCLUSIVE MODE;

  SELECT role
  INTO v_target_role
  FROM public.user_profiles
  WHERE id = p_target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_target_role = 'admin'
    AND p_new_role = 'user'
    AND (
      SELECT count(*)
      FROM public.user_profiles
      WHERE role = 'admin'
    ) <= 1
  THEN
    RAISE EXCEPTION 'The last administrator cannot be demoted';
  END IF;

  UPDATE public.user_profiles
  SET
    role = p_new_role,
    updated_at = now()
  WHERE id = p_target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, text) TO authenticated;

COMMIT;
