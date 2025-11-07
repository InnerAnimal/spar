import Link from 'next/link'
import Image from 'next/image'
import { DonateSection } from '@/components/shared/DonateSection'

export default function HomePage() {
  const benefits = [
    {
      icon: '💝',
      title: 'Save a Life',
      description:
        'Give a rescue animal a second chance at happiness while helping reduce pet overpopulation in our community.',
    },
    {
      icon: '🏥',
      title: 'Health Guaranteed',
      description:
        'All animals are spayed/neutered, vaccinated, microchipped, and thoroughly health-checked by veterinary professionals.',
    },
    {
      icon: '🤝',
      title: 'Ongoing Support',
      description:
        'We provide guidance, resources, and support throughout your pet's life to ensure successful adoptions.',
    },
    {
      icon: '🏠',
      title: 'TNR Services',
      description:
        'Trap-Neuter-Return services and resources for keeping pet families together in Acadia Parish.',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-5 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Every Animal Deserves a Loving Home
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            We rescue, rehabilitate, and match families with their perfect pet.
            Every animal deserves love, and every family deserves the joy of a
            loyal companion.
          </p>
          <p className="text-lg md:text-xl text-green-600 font-semibold mb-12">
            Serving Acadia Parish, Louisiana
          </p>

          {/* Animal Category Cards */}
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center mb-12">
            {/* Dogs */}
            <Link
              href="/adopt?tab=dogs"
              className="group w-full max-w-xs"
            >
              <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <Image
                  src="https://static.wixstatic.com/media/33e096_5f717f306d69438aaf07fa1528a6fb14~mv2.jpg"
                  alt="Rescue Dogs Available for Adoption"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
                  <div className="text-2xl font-bold mb-2">Meet Our Dogs</div>
                  <div className="text-base opacity-95">
                    View available dogs →
                  </div>
                </div>
              </div>
            </Link>

            {/* Cats */}
            <Link
              href="/adopt?tab=cats"
              className="group w-full max-w-xs"
            >
              <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <Image
                  src="https://static.wixstatic.com/media/33e096_56ccbd1b11574c49a55f07cf7c75c8b0~mv2.png"
                  alt="Rescue Cats Available for Adoption"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
                  <div className="text-2xl font-bold mb-2">Meet Our Cats</div>
                  <div className="text-base opacity-95">
                    View available cats →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <Link
            href="/adopt"
            className="inline-block bg-green-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
          >
            View All Animals
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Adopt From Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-gray-50 p-8 rounded-2xl text-center hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-2 hover:border-green-600 transition-all duration-300 border-2 border-transparent"
              >
                <div className="text-5xl mb-5">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
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
