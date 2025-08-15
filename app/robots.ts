import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/freelancer/dashboard',
          '/workroom/',
          '/messages/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/freelancer/dashboard',
          '/workroom/',
          '/messages/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://freelancehub-saas.vercel.app/sitemap.xml',
  }
}
