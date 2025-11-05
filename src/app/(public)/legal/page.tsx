import { PublicLayout } from '@/components/layout/public-layout'

export default function LegalPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Legal</h1>
          <p className="mt-4 text-muted-foreground">
            Legal information and policies for InnerAnimalMedia.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}

