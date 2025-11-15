import Link from 'next/link'
import { FileText, PawPrint, Heart, Home, Users, DollarSign } from 'lucide-react'

export default function FormsPage() {
  const forms = [
    {
      icon: PawPrint,
      title: 'TNR Request',
      description:
        'Request Trap-Neuter-Return services for community cats in your area.',
      href: '/forms/tnr-request',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
    },
    {
      icon: Heart,
      title: 'Adoption Application',
      description:
        'Apply to adopt a dog or cat and give them their forever home.',
      href: '/forms/adoption-application',
      color: 'bg-pink-50 border-pink-200 hover:border-pink-500',
    },
    {
      icon: FileText,
      title: 'Contact Us',
      description: 'Get in touch with us for general inquiries or questions.',
      href: '/forms/contact',
      color: 'bg-green-50 border-green-200 hover:border-green-500',
    },
    {
      icon: Home,
      title: 'Surrender Request',
      description:
        'Request to surrender an animal you can no longer care for.',
      href: '/forms/surrender-request',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-500',
    },
    {
      icon: Heart,
      title: 'Foster Application',
      description:
        'Apply to become a foster parent and provide temporary care for animals.',
      href: '/forms/foster-application',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-500',
    },
    {
      icon: Users,
      title: 'Volunteer Signup',
      description:
        'Sign up to volunteer and help make a difference in animals\' lives.',
      href: '/forms/volunteer-signup',
      color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-500',
    },
    {
      icon: DollarSign,
      title: 'Donate Pledge',
      description:
        'Make a pledge to support our mission with a one-time or recurring donation.',
      href: '/forms/donate-pledge',
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Forms & Applications
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a form below to get started. All submissions are reviewed by
            our team and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => {
            const Icon = form.icon
            return (
              <Link
                key={form.href}
                href={form.href}
                className={`${form.color} border-2 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {form.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {form.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
