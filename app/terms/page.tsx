export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h2>2. Adoption Terms</h2>
        <p>
          All adoptions are subject to approval by Southern Pets Animal Rescue.
          We reserve the right to deny any adoption application for any reason.
          Adoption fees are non-refundable after 72 hours unless otherwise
          agreed upon in writing.
        </p>

        <h2>3. TNR Services</h2>
        <p>
          TNR services are provided on a case-by-case basis subject to
          availability. We reserve the right to decline service requests that
          fall outside our service area or capabilities.
        </p>

        <h2>4. Liability</h2>
        <p>
          Southern Pets Animal Rescue provides animals for adoption on an "as
          is" basis. We make no guarantees about the temperament or health
          conditions beyond what is documented in our records.
        </p>

        <h2>5. Donations</h2>
        <p>
          All donations to Southern Pets Animal Rescue are tax-deductible as we
          are a registered 501(c)(3) nonprofit organization. Donations are
          non-refundable.
        </p>

        <h2>Contact Information</h2>
        <p>
          For questions about these terms, please contact us at:
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:SouthernPetsAnimalRescue@gmail.com">
            SouthernPetsAnimalRescue@gmail.com
          </a>
          <br />
          <strong>Phone:</strong> <a href="tel:337-581-7562">337-581-7562</a>
        </p>
      </div>
    </div>
  )
}
