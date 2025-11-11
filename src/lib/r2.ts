import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 configuration
const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID!,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'inneranimalmedia',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || `https://pub-${process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev`,
}

// Initialize S3 client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
})

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2(
  key: string,
  file: Buffer | Uint8Array,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ url: string; key: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
    })

    await r2Client.send(command)

    const publicUrl = `${R2_CONFIG.publicUrl}/${key}`

    return {
      url: publicUrl,
      key,
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    throw new Error('Failed to upload file to R2')
  }
}

/**
 * Get a signed URL for uploading (client-side uploads)
 */
export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('R2 signed URL error:', error)
    throw new Error('Failed to generate upload URL')
  }
}

/**
 * Get a signed URL for downloading (private files)
 */
export async function getDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('R2 download URL error:', error)
    throw new Error('Failed to generate download URL')
  }
}

/**
 * Get public URL (if bucket is public)
 */
export function getPublicUrl(key: string): string {
  return `${R2_CONFIG.publicUrl}/${key}`
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error('R2 delete error:', error)
    throw new Error('Failed to delete file from R2')
  }
}

/**
 * List files in R2 bucket
 */
export async function listR2Files(prefix?: string): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_CONFIG.bucketName,
      Prefix: prefix,
    })

    const response = await r2Client.send(command)
    return response.Contents?.map((object) => object.Key || '') || []
  } catch (error) {
    console.error('R2 list error:', error)
    throw new Error('Failed to list files from R2')
  }
}

/**
 * Generate a unique file key with path structure
 */
export function generateFileKey(
  userId: string,
  folder: string,
  filename: string
): string {
  const timestamp = Date.now()
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${userId}/${folder}/${timestamp}-${sanitizedFilename}`
}

