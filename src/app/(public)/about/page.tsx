import { PublicLayout } from '@/components/layout/public-layout'

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">About InnerAnimalMedia</h1>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <p>
              InnerAnimalMedia is a cutting-edge platform that empowers businesses and creators
              with innovative media solutions powered by artificial intelligence.
            </p>
            <p>
              We combine the power of OpenAI&apos;s GPT-4 and Anthropic&apos;s Claude AI to deliver
              intelligent content creation, community engagement, and video conferencing solutions.
            </p>
            <p>
              Our mission is to help you unleash your inner potential and transform your brand
              through technology and creativity.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

