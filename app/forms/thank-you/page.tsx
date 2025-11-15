import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-16 px-5 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your form has been successfully submitted. We&apos;ve received your
            information and will review it shortly. A member of our team will be
            in touch with you soon.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-green-800 font-medium">
              You should receive a confirmation email at the address you
              provided. Please check your spam folder if you don&apos;t see it within
              a few minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/adopt"
              className="inline-block bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-green-600 transition-colors"
            >
              View Available Pets
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
