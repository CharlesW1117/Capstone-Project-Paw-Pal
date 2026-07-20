export const ALLOWED_PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

// Mirrors the backend's default PROFILE_PHOTO_MAX_BYTES / PET_PHOTO_MAX_BYTES;
// update if those env vars are changed on the backend.
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export function getPhotoFileError(file) {
  if (!ALLOWED_PHOTO_MIME_TYPES.has(file.type)) {
    return "Photo must be a JPEG, PNG, or WebP file.";
  }

  if (file.size > PHOTO_MAX_BYTES) {
    return "Photo must be 5MB or smaller.";
  }

  return null;
}
