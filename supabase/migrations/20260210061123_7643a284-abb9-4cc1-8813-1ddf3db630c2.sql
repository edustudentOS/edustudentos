
-- Make notes-files bucket private
UPDATE storage.buckets SET public = false WHERE id = 'notes-files';

-- Drop existing permissive storage policies for notes-files
DROP POLICY IF EXISTS "Anyone can view notes files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload notes files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own notes files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own notes files" ON storage.objects;

-- Uploaders can upload to their own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'notes-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Uploaders can view their own files, admins can view all
CREATE POLICY "Users can view own files or admins all"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'notes-files'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Uploaders can delete own files, admins can delete any
CREATE POLICY "Users can delete own files or admins all"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'notes-files'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );
