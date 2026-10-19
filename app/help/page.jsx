// /help — the public help library (help.timebars.com lands here). Ask AI is /help/ask.
import HelpLibrary from '@/components/HelpLibrary'
import { PRODUCTS } from '@/lib/help/helpDocs'

export const metadata = {
  title: 'Help Library',
  description: 'User guides, reference guides and spreadsheets for Agilebars, Timebars and Costbars.',
  alternates: { canonical: '/help' },
}

export default function HelpPage({ searchParams }) {
  const requested = String(searchParams?.product || '').toUpperCase()
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">Help Library</h1>
      <p className="text-gray-600 mt-1 mb-6">
        The official guides for Agilebars, Timebars and Costbars. Pick your product.
      </p>
      <HelpLibrary initialProduct={PRODUCTS[requested] ? requested : undefined} />
    </div>
  )
}
