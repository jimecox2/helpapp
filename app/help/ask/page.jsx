// /help/ask — the Ask AI help assistant (login needed). The help library is /help.
import AskAiHelp from '@/components/AskAiHelp'

export const metadata = {
  title: 'Ask AI',
  robots: { index: false, follow: false },
}

const PRODUCT_CODES = ['TB', 'AB', 'CB']

export default function HelpPage({ searchParams }) {
  const requested = String(searchParams?.product || '').toUpperCase()
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">Ask AI</h1>
      <div className="text-gray-600 mt-2 mb-6 space-y-2">
        <p>
          Three AI tools for Agilebars, Timebars and Costbars. Switch between them with the buttons below; hover over a
          button to see what it does.
        </p>
        <p className="text-sm">
          This is a custom AI solution built by Timebars Ltd. The AI Help Assistant and AI Ask by Guide answer only from
          our official help guides, and tell you when the guides do not cover your question.
        </p>
      </div>
      <AskAiHelp
        initialProduct={PRODUCT_CODES.includes(requested) ? requested : undefined}
        initialTool={String(searchParams?.tool || '').toLowerCase()}
      />
    </div>
  )
}
