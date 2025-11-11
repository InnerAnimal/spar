import { PublicLayout } from '@/components/layout/public-layout'

export default function BlogPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-4 text-muted-foreground">
            Stay updated with the latest insights, tutorials, and news from InnerAnimalMedia.
          </p>
          <div className="mt-12 space-y-8">
            <article className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl font-semibold">Getting Started with AI Chat</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Learn how to leverage our dual AI platform for your content creation needs.
              </p>
            </article>
            <article className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl font-semibold">Building Communities That Matter</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Best practices for creating engaged and active communities on our platform.
              </p>
            </article>
            <article className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl font-semibold">Video Conferencing Best Practices</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tips for hosting effective video meetings and virtual events.
              </p>
            </article>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

