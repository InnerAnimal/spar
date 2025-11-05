import { PublicLayout } from '@/components/layout/public-layout'

export default function TermsPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Acceptance of Terms</h2>
              <p>
                By accessing and using InnerAnimalMedia Platform, you accept and agree to be bound by the
                terms and provision of this agreement.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Use License</h2>
              <p>
                Permission is granted to temporarily use our services for personal and commercial purposes.
                This is the grant of a license, not a transfer of title.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password and for
                restricting access to your account.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Prohibited Uses</h2>
              <p>
                You may not use our services in any way that causes, or may cause, damage to the platform or
                impairment of the availability or accessibility of the services.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us at{' '}
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

