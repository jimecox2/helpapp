// app/sitemap.js — Next.js serves this as /sitemap.xml: the home page and the public help library.
import { FRONTEND_URL } from '@/config/site'
import { HELP_GUIDES } from '@/lib/help/helpDocs'

export const dynamic = 'force-dynamic' // FRONTEND_URL is set per server at run time

export default function sitemap() {
  return [
    { url: `${FRONTEND_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${FRONTEND_URL}/help`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...HELP_GUIDES.map(g => ({
      url: `${FRONTEND_URL}/help/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ]
}
