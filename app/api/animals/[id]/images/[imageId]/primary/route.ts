import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

// PATCH /api/animals/:id/images/:imageId/primary - Set image as primary
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const params = await context.params
    const animalId = params.id
    const imageId = params.imageId

    // Verify the image belongs to this animal
    const image = await prisma.animalImage.findUnique({
      where: { id: imageId },
    })

    if (!image || image.animalId !== animalId) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Remove primary flag from all other images
    await prisma.animalImage.updateMany({
      where: { animalId },
      data: { isPrimary: false },
    })

    // Set this image as primary
    const updatedImage = await prisma.animalImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    })

    // Update the animal's legacy imageUrl
    await prisma.animal.update({
      where: { id: animalId },
      data: { imageUrl: updatedImage.url },
    })

    return NextResponse.json({
      success: true,
      image: updatedImage,
    })
  } catch (error) {
    console.error('Error setting primary image:', error)
    return NextResponse.json(
      { error: 'Failed to set primary image' },
      { status: 500 }
    )
  }
}
