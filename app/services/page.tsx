'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DonateSection } from '../../components/shared/DonateSection'
import { TNRRequestButton } from '@/components/CTAButtons'

type AnimalImage = {
  url: string
  isPrimary: boolean
}

type Animal = {
  id: string
  name: string
  type: string
  images?: AnimalImage[]
}

export default function ServicesPage() {
  const [catImages, setCatImages] = useState<string[]>([
    'https://static.wixstatic.com/media/33e096_56ccbd1b11574c49a55f07cf7c75c8b0~mv2.png',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=360&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300&h=360&fit=crop&crop=face',
  ])

  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const response = await fetch('/api/animals?status=available')
        if (response.ok) {
          const data = await response.json()
          const cats = (data.animals || []).filter((a: Animal) => a.type === 'cat')

          const dynamicImages: string[] = []
          for (const cat of cats) {
            if (cat.images && cat.images.length > 0) {
              const primaryImage = cat.images.find((img: AnimalImage) => img.isPrimary)
              dynamicImages.push(primaryImage?.url || cat.images[0].url)
            }
          }

          if (dynamicImages.length > 0) {
            setCatImages((prevImages) => [
              dynamicImages[0] || prevImages[0],
              dynamicImages[1] || prevImages[1],
              dynamicImages[2] || prevImages[2],
            ])
          }
        }
      } catch (error) {
        console.log('Using fallback cat images')
      }
    }
    fetchCatImages()
  }, [])

  const tnrSteps = [
    {
      icon: '🪤',
      title: 'Trap',
      description:
        'We humanely trap outdoor or feral cats using safe, professional equipment.',
    },
    {
      icon: '⚕️',
      title: 'Neuter & Vaccinate',
      description:
        'Each cat is spayed or neutered, given rabies and FVRCP vaccines by licensed veterinarians.',
    },
    {
      icon: '🏠',
      title: 'Return',
      description:
        'Cats are returned to their familiar territory with a clipped ear to show they\'ve been fixed.',
    },
  ]

  const packages = [
    {
      icon: '🐱',
      title: 'Standard TNR Package',
      price: 60,
      includes: [
        'Spay or Neuter',
        '3-Year Rabies Vaccine',
        'FVRCP Vaccine',
        'Ear Tipping',
        'Recovery Monitoring',
      ],
    },
    {
      icon: '🤱',
      title: 'Pregnant Female Package',
      price: 71,
      includes: [
        'Spay with PAIR Injection',
        '3-Year Rabies Vaccine',
        'FVRCP Vaccine',
        'Ear Tipping',
        'Extended Recovery Care',
      ],
      note: 'PAIR = Pregnancy Abortion Injection and Recovery',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-5 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            TNR Services - One Fix at a Time
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Our Trap-Neuter-Return program is a humane, effective solution to
            control the growing number of outdoor cats in our communities while
            helping them live healthier lives.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {catImages.map((src, idx) => (
              <div
                key={idx}
                className="relative w-48 h-60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <Image
                  src={src}
                  alt={`Community Cat ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <TNRRequestButton
            variant="secondary"
            size="lg"
            className="bg-gray-900 hover:bg-gray-700 text-white hover:-translate-y-1 shadow-lg"
          />
        </div>
      </section>

      {/* TNR Process Section */}
      <section className="py-16 px-5 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            How TNR Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tnrSteps.map((step) => (
              <div
                key={step.title}
                className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            TNR Service Packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.title}
                className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-5 text-center">{pkg.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                  {pkg.title}
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-5 text-center">
                  ${pkg.price}
                </div>

                <div className="mb-5">
                  <h4 className="font-semibold mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-gray-600 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-bold"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {pkg.note && (
                  <p className="text-xs text-gray-500 mt-3">{pkg.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <DonateSection />
    </>
  )
}
