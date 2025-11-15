import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/animals/:id - Get single animal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' },
          ],
        },
      },
    })

    if (!animal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ animal })
  } catch (error) {
    console.error('Error fetching animal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch animal' },
      { status: 500 }
    )
  }
}

// PUT /api/animals/:id - Update animal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const animal = await prisma.animal.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        breed: body.breed,
        age: body.age,
        gender: body.gender,
        price: body.price,
        description: body.description,
        spayedNeutered: body.spayedNeutered,
        vaccinated: body.vaccinated,
        microchipped: body.microchipped,
        heartwormStatus: body.heartwormStatus,
        healthNotes: body.healthNotes,
        specialNote: body.specialNote,
        fosterToAdopt: body.fosterToAdopt,
        availableForReservation: body.availableForReservation,
        status: body.status,
      },
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' },
          ],
        },
      },
    })

    return NextResponse.json({ animal })
  } catch (error) {
    console.error('Error updating animal:', error)
    return NextResponse.json(
      { error: 'Failed to update animal' },
      { status: 500 }
    )
  }
}

// DELETE /api/animals/:id - Delete animal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete animal (cascade will delete images)
    await prisma.animal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting animal:', error)
    return NextResponse.json(
      { error: 'Failed to delete animal' },
      { status: 500 }
    )
  }
}
