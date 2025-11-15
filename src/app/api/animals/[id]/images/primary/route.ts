import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PUT /api/animals/:id/images/primary - Set primary image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const animalId = params.id
    const { imageId } = await request.json()

    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId is required' },
        { status: 400 }
      )
    }

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
