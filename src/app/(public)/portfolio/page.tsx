import { PublicLayout } from '@/components/layout/public-layout'

export default function PortfolioPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold">Portfolio</h1>
          <p className="mt-4 text-muted-foreground">
            Explore our recent projects and case studies showcasing our innovative solutions.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">AI Content Platform</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A comprehensive platform integrating multiple AI models for content creation.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">Community Hub</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Modern forum platform with real-time messaging and engagement features.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">Video Conferencing Suite</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enterprise-grade video conferencing with WebRTC technology.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">Custom Media Solutions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tailored platforms built to meet specific business requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

