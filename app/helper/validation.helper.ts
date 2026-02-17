export function validateImage(file: File | null) {
  if (!file) return null;

  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > maxSize) {
    throw new Error("Image must be less than 2MB");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid image format");
  }

  return file;
}