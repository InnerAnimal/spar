export default function AdoptionApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Adoption Application Form
          </h1>
          <p className="text-gray-600 mb-8">
            This comprehensive form is in development. It will include all the
            adoption requirements, personal information, housing arrangements,
            animal behavior questions, and legal agreements.
          </p>
          <p className="text-gray-600">
            For now, please contact us at{' '}
            <a
              href="tel:337-581-7562"
              className="text-green-600 hover:underline"
            >
              337-581-7562
            </a>{' '}
            or email{' '}
            <a
              href="mailto:SouthernPetsAnimalRescue@gmail.com"
              className="text-green-600 hover:underline"
            >
              SouthernPetsAnimalRescue@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
