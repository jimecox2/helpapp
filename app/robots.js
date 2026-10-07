// app/robots.js — Next.js serves this as /robots.txt. Only the home page is public.
import { FRONTEND_URL } from '@/config/site'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/', '/help', '/aitemp', '/pubsets', '/tbgenerator', '/customers/'],
      },
    ],
    sitemap: `${FRONTEND_URL}/sitemap.xml`,
  }
}
