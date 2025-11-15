import { PublicLayout } from '@/components/layout/public-layout'

export default function ServicesPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold">Our Services</h1>
          <div className="mt-12 space-y-12">
            <div>
              <h2 className="text-2xl font-semibold">AI Chat Platform</h2>
              <p className="mt-2 text-muted-foreground">
                Access both ChatGPT and Claude AI in one unified interface. Get intelligent
                responses, content creation, and problem-solving assistance from two powerful AI
                models.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Community Forum</h2>
              <p className="mt-2 text-muted-foreground">
                Build engaged communities with our modern message board. Create posts, reply to
                discussions, and foster meaningful connections.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Video Conferencing</h2>
              <p className="mt-2 text-muted-foreground">
                Host and join video calls with WebRTC technology. Secure, reliable, and
                feature-rich video conferencing for teams of any size.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Custom Solutions</h2>
              <p className="mt-2 text-muted-foreground">
                Need something tailored to your needs? We work with businesses to create custom
                media solutions that fit your unique requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

