import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

// GET /api/animals - List all animals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'available'
    const type = searchParams.get('type') // 'dog' or 'cat'

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const animals = await prisma.animal.findMany({
      where,
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' },
          ],
        },
        _count: {
          select: { images: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ animals })
  } catch (error) {
    console.error('Error fetching animals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch animals' },
      { status: 500 }
    )
  }
}

// POST /api/animals - Create a new animal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const animal = await prisma.animal.create({
      data: {
        name: body.name,
        type: body.type,
        breed: body.breed,
        age: body.age,
        gender: body.gender,
        price: body.price,
        description: body.description,
        spayedNeutered: body.spayedNeutered || false,
        vaccinated: body.vaccinated || false,
        microchipped: body.microchipped || false,
        heartwormStatus: body.heartwormStatus,
        healthNotes: body.healthNotes,
        specialNote: body.specialNote,
        fosterToAdopt: body.fosterToAdopt || false,
        availableForReservation: body.availableForReservation || false,
        status: body.status || 'available',
      },
    })

    return NextResponse.json({ animal }, { status: 201 })
  } catch (error) {
    console.error('Error creating animal:', error)
    return NextResponse.json(
      { error: 'Failed to create animal' },
      { status: 500 }
    )
  }
}
