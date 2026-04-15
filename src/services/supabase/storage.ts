import { supabase } from '../../lib/supabaseClient'

export type StorageBucket = 'avatars' | 'receipts' | 'media' | 'attachments'

export async function uploadFileToStorage(
  bucket: StorageBucket,
  path: string,
  file: File,
) {
  return supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  })
}

export function getPublicStorageUrl(bucket: StorageBucket, path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

export async function getSignedStorageUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn = 60 * 60,
) {
  return supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
}
