-- Create storage bucket for member avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'member-avatars',
  'member-avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS policies on storage.objects (if not already)
-- Allow public access to view files in member-avatars bucket
DROP POLICY IF EXISTS "Public Access for member-avatars" ON storage.objects;
CREATE POLICY "Public Access for member-avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-avatars');

-- Allow authenticated users and public to upload avatars
DROP POLICY IF EXISTS "Allow Uploads for member-avatars" ON storage.objects;
CREATE POLICY "Allow Uploads for member-avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'member-avatars');

-- Allow updates to member-avatars
DROP POLICY IF EXISTS "Allow Updates for member-avatars" ON storage.objects;
CREATE POLICY "Allow Updates for member-avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'member-avatars');

-- Allow deletes from member-avatars
DROP POLICY IF EXISTS "Allow Deletes for member-avatars" ON storage.objects;
CREATE POLICY "Allow Deletes for member-avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'member-avatars');
