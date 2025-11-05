import { PublicLayout } from '@/components/layout/public-layout'

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including your name, email address,
                and any other information you choose to provide when using our services.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process
                transactions, send communications, and comply with legal obligations.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:meauxbility@gmail.com" className="text-primary hover:underline">
                  meauxbility@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

