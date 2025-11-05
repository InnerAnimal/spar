import Link from 'next/link'
import { PublicLayout } from '@/components/layout/public-layout'

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Unleash Your Inner Animal
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Transform your brand with cutting-edge media solutions powered by AI and innovation.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              href="/services"
              className="rounded-md border border-border px-6 py-3 text-lg font-medium hover:bg-accent"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Services</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Link href="/services" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold">AI-Powered Content</h3>
              <p className="mt-2 text-muted-foreground">
                Leverage ChatGPT and Claude AI for intelligent content creation and automation.
              </p>
            </Link>
            <Link href="/services" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold">Video Production</h3>
              <p className="mt-2 text-muted-foreground">
                Professional video conferencing and streaming solutions for your team.
              </p>
            </Link>
            <Link href="/services" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold">Community Platform</h3>
              <p className="mt-2 text-muted-foreground">
                Build engaged communities with our modern forum and messaging system.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

