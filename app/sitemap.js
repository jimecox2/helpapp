// app/sitemap.js — Next.js serves this as /sitemap.xml. Every other page needs a login.
import { FRONTEND_URL } from '@/config/site'

export const dynamic = 'force-dynamic' // FRONTEND_URL is set per server at run time

export default function sitemap() {
  return [
    { url: `${FRONTEND_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
  ]
}
