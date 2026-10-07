// /help — the Ask AI help assistant (help.timebars.com lands here).
import AskAiHelp from '@/components/AskAiHelp'

export const metadata = {
  title: 'Help Assistant',
  robots: { index: false, follow: false },
}

const PRODUCT_CODES = ['TB', 'AB', 'CB']

export default function HelpPage({ searchParams }) {
  const requested = String(searchParams?.product || '').toUpperCase()
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">Ask AI</h1>
      <p className="text-gray-600 mt-1 mb-6">
        Answers come only from the official Agilebars, Timebars and Costbars documentation.
      </p>
      <AskAiHelp initialProduct={PRODUCT_CODES.includes(requested) ? requested : undefined} />
    </div>
  )
}
