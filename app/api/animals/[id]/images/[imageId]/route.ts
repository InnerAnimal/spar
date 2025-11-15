import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { r2 } from '@/lib/r2'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

// DELETE /api/animals/:id/images/:imageId - Delete a specific image
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const params = await context.params
    const animalId = params.id
    const imageId = params.imageId

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
