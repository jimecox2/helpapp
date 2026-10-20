// app/robots.js — Next.js serves this as /robots.txt. Public: the home page and the help library.
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
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/', '/personaldashboard', '/help/ask', '/update-help', '/pubsets', '/projectArtifacts/'],
      },
    ],
    sitemap: `${FRONTEND_URL}/sitemap.xml`,
  }
}
