import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inneranimalmedia.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/chat/', '/community/', '/video/', '/login', '/signup', '/reset'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

