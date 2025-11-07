import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-5">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-5">
          Southern Pets Animal Rescue
        </h3>
        <p className="text-gray-300 leading-relaxed mb-5">
          Southern Pets Animal Rescue is a 501(c)(3) established in 2025 serving
          Acadia Parish, Louisiana. Our goal is community spay/neuter and keeping
          families together through TNR services and resources.
        </p>
        <div className="mb-4">
          <a
            href="mailto:SouthernPetsAnimalRescue@gmail.com"
            className="text-green-400 hover:text-white font-medium transition-colors"
          >
            SouthernPetsAnimalRescue@gmail.com
          </a>
        </div>
        <div className="text-gray-300 font-medium">337-581-7562</div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4">
            © {new Date().getFullYear()} Southern Pets Animal Rescue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
