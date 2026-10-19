'use client'

// The help library (/help): one tab per product, each listing that product's guides from the
// help registry (lib/help/helpDocs.js) and its downloads. Same header and tabs as AskAiHelp.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Bot, Download, FileText } from 'lucide-react'
import { PRODUCTS, librarySections, downloadsForProduct } from '@/lib/help/helpDocs'
import { cn } from '@/lib/utils'

const PRODUCT_KEY = 'helpLibraryProduct'

export default function HelpLibrary({ initialProduct }) {
  const [product, setProduct] = useState(initialProduct || 'TB')

  // Without ?product= in the address, reopen the tab the visitor used last.
  useEffect(() => {
    if (initialProduct) return
    try {
      const saved = localStorage.getItem(PRODUCT_KEY)
      if (PRODUCTS[saved]) setProduct(saved)
    } catch { /* storage blocked */ }
  }, [initialProduct])

  const choose = code => {
    setProduct(code)
    try { localStorage.setItem(PRODUCT_KEY, code) } catch { /* storage blocked */ }
    window.history.replaceState(null, '', `/help?product=${code}`)
  }

  const productName = PRODUCTS[product]
  const sections = librarySections(product)
  const downloads = downloadsForProduct(product)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      {/* Header with product tabs */}
      <div className="bg-gradient-to-r from-tbBlue to-blue-700 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-lg font-bold">{productName} Help</h2>
        </div>
        <div className="flex rounded-lg bg-white/15 p-1" role="tablist" aria-label="Product">
          {Object.entries(PRODUCTS).map(([code, name]) => (
            <button
              key={code}
              role="tab"
              aria-selected={product === code}
              onClick={() => choose(code)}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                product === code ? 'bg-white text-tbBlue' : 'text-white hover:bg-white/20',
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 grid gap-6 md:grid-cols-2">
        {sections.map(s => (
          <section key={s.key}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{s.title}</h3>
            <ul className="space-y-1">
              {s.guides.map(g => (
                <li key={g.slug}>
                  <Link
                    href={`/help/${g.slug}`}
                    className="flex items-start gap-2 rounded-md px-2 py-1.5 text-tbBlue hover:bg-blue-50"
                  >
                    <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{g.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Downloads</h3>
          <ul className="space-y-1">
            {downloads.map(d => (
              <li key={d.href}>
                <a
                  href={d.href}
                  download
                  className="flex items-start gap-2 rounded-md px-2 py-1.5 text-tbBlue hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{d.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">Can&apos;t find it? Ask a question and get an answer from these guides.</p>
        <Link
          href={`/help/ask?product=${product}`}
          className="inline-flex items-center gap-2 rounded-md bg-tbBlue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Bot className="h-4 w-4" /> Ask AI about {productName}
        </Link>
      </div>
    </div>
  )
}
