// /help/<slug> — one help guide, rendered from public/docsHelp/<file>.md. Public.
// The slug is the file name in lower case with hyphens (lib/help/helpDocs.js fileToSlug).
import { readFile } from 'fs/promises'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bot } from 'lucide-react'
import { PRODUCTS, guideBySlug } from '@/lib/help/helpDocs'
import { renderGuide } from '@/lib/help/renderGuide'

async function loadGuide(slug) {
  const guide = guideBySlug(slug)
  if (!guide) return null
  const markdown = await readFile(path.join(process.cwd(), 'public', 'docsHelp', guide.file), 'utf8')
  return { guide, ...renderGuide(markdown) }
}

export async function generateMetadata({ params }) {
  const guide = guideBySlug(params.slug)
  if (!guide) return {}
  return {
    title: guide.title,
    description: `${guide.title} for ${guide.products.map(p => PRODUCTS[p]).join(', ')}.`,
    alternates: { canonical: `/help/${guide.slug}` },
  }
}

export default async function HelpGuidePage({ params }) {
  const page = await loadGuide(params.slug)
  if (!page) notFound()
  const { guide, html, toc } = page
  const askProduct = guide.products.length === 1 ? guide.products[0] : ''

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/help" className="inline-flex items-center gap-1 text-sm text-tbBlue hover:underline">
          <ArrowLeft className="h-4 w-4" /> Help Library
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {guide.products.map(p => (
            <Link key={p} href={`/help?product=${p}`} className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-tbBlue hover:bg-blue-100">
              {PRODUCTS[p]}
            </Link>
          ))}
          <Link
            href={askProduct ? `/help/ask?product=${askProduct}` : '/help/ask'}
            className="inline-flex items-center gap-1 rounded-md bg-tbBlue px-3 py-1.5 font-semibold text-white hover:bg-blue-800"
          >
            <Bot className="h-3.5 w-3.5" /> Ask AI
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {toc.length > 1 && (
          <nav aria-label="Contents" className="hidden lg:block">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <p className="mb-2 font-semibold text-gray-900">Contents</p>
              <ul className="space-y-1.5">
                {toc.map(h => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-gray-600 hover:text-tbBlue">{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
        <article
          className="prose prose-slate max-w-none rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-start-2 prose-headings:scroll-mt-4 prose-a:text-tbBlue prose-img:rounded-md prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
