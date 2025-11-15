import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { r2 } from '@/lib/r2'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

// POST /api/animals/:id/images - Upload images for an animal
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const animalId = params.id

    // Verify animal exists
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
    })

    if (!animal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate files
    const maxSize = 10 * 1024 * 1024 // 10MB
    for (const file of files) {
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        )
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image` },
          { status: 400 }
        )
      }
    }

    // Get current image count to determine order
    const existingImages = await prisma.animalImage.findMany({
      where: { animalId },
      orderBy: { order: 'desc' },
      take: 1,
    })

    let nextOrder = existingImages.length > 0 ? existingImages[0].order + 1 : 0

    // Upload each file to R2 and create database records
    const uploadedImages = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Upload to R2
      const result = await r2.uploadFile(buffer, file.name, `animals/${animalId}`)

      // Create database record
      const image = await prisma.animalImage.create({
        data: {
          animalId,
          url: result.url,
          key: result.key,
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          order: nextOrder++,
          isPrimary: false, // Can be updated later
        },
      })

      uploadedImages.push(image)
    }

    // If this is the first image and animal has no imageUrl, set it as primary
    if (!animal.imageUrl && uploadedImages.length > 0) {
      await prisma.animalImage.update({
        where: { id: uploadedImages[0].id },
        data: { isPrimary: true },
      })

      // Also update the legacy imageUrl field
      await prisma.animal.update({
        where: { id: animalId },
        data: { imageUrl: uploadedImages[0].url },
      })
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
    })
  } catch (error) {
    console.error('Error uploading animal images:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}

// GET /api/animals/:id/images - Get all images for an animal
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const animalId = params.id

    const images = await prisma.animalImage.findMany({
      where: { animalId },
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching animal images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

// DELETE /api/animals/:id/images - Delete an image
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const animalId = params.id
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId is required' },
        { status: 400 }
      )
    }

    // Get the image
    const image = await prisma.animalImage.findUnique({
      where: { id: imageId },
    })

    if (!image || image.animalId !== animalId) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete from R2
    try {
      await r2.deleteFile(image.key)
    } catch (error) {
      console.error('Error deleting from R2:', error)
      // Continue with database deletion even if R2 fails
    }

    // Delete from database
    await prisma.animalImage.delete({
      where: { id: imageId },
    })

    // If this was the primary image, set another image as primary
    if (image.isPrimary) {
      const nextImage = await prisma.animalImage.findFirst({
        where: { animalId },
        orderBy: { order: 'asc' },
      })

      if (nextImage) {
        await prisma.animalImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        })

        // Update animal's legacy imageUrl
        await prisma.animal.update({
          where: { id: animalId },
          data: { imageUrl: nextImage.url },
        })
      } else {
        // No images left, clear the legacy imageUrl
        await prisma.animal.update({
          where: { id: animalId },
          data: { imageUrl: null },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting animal image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
