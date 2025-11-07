export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <p>
          Southern Pets Animal Rescue ("we", "our", or "us") is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, and safeguard your information when you visit our website or
          submit forms.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect information that you voluntarily provide to us when you:
        </p>
        <ul>
          <li>Fill out adoption, foster, or volunteer applications</li>
          <li>Request TNR services</li>
          <li>Contact us via email or phone</li>
          <li>Make donations</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process adoption and foster applications</li>
          <li>Coordinate TNR services</li>
          <li>Communicate with you about your inquiries</li>
          <li>Maintain records required for our 501(c)(3) operations</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. We may share information with:
        </p>
        <ul>
          <li>Veterinarians for animal care coordination</li>
          <li>Landlords for rental verification (adoption applications only)</li>
          <li>Law enforcement if required by law</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
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
