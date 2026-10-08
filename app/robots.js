// app/robots.js — Next.js serves this as /robots.txt. Only the home page is public.
import { unstable_noStore as noStore } from 'next/cache'
import { FRONTEND_URL } from '@/config/site'

export const dynamic = 'force-dynamic' // FRONTEND_URL is set per server at run time

export default function robots() {
  noStore()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/', '/personaldashboard', '/help', '/aitemp', '/pubsets', '/tbgenerator', '/customers/'],
      },
    ],
    sitemap: `${FRONTEND_URL}/sitemap.xml`,
  }
}
