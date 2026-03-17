/**
 * Upload service placeholder.
 * Implement actual file upload logic based on your storage provider
 * (e.g., AWS S3, Cloudflare R2, Vercel Blob, local filesystem).
 */
export const uploadService = {
  /**
   * Upload a file and return its public URL.
   * @param file - The file buffer or stream
   * @param filename - Original filename
   * @param options - Upload options (path prefix, content type, etc.)
   * @returns The public URL of the uploaded file
   */
  async upload(
    file: Buffer,
    filename: string,
    options?: {
      prefix?: string;
      contentType?: string;
      maxSize?: number;
    }
  ): Promise<{ url: string; key: string }> {
    // TODO: Implement with your storage provider
    // Example with S3:
    // const key = `${options?.prefix || 'uploads'}/${Date.now()}-${filename}`;
    // await s3.putObject({ Bucket: BUCKET, Key: key, Body: file, ContentType: options?.contentType });
    // return { url: `https://${BUCKET}.s3.amazonaws.com/${key}`, key };

    throw new Error("Upload service not implemented. Configure a storage provider.");
  },

  /**
   * Delete a file by its key/path.
   * @param key - The file key or path
   */
  async delete(key: string): Promise<void> {
    // TODO: Implement with your storage provider
    throw new Error("Upload service not implemented. Configure a storage provider.");
  },

  /**
   * Validate file before upload.
   * @param file - The file buffer
   * @param options - Validation options
   */
  validate(
    file: Buffer,
    options?: {
      maxSize?: number; // in bytes, default 5MB
      allowedTypes?: string[]; // MIME types
    }
  ): { valid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes } = options || {};

    if (file.length > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return { valid: false, error: `파일 크기는 ${maxMB}MB 이하여야 합니다.` };
    }

    // Additional MIME type validation would go here if allowedTypes is provided

    return { valid: true };
  },
};
