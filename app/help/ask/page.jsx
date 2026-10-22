// /help/ask — the Ask AI help assistant (login needed). The help library is /help.
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
      <div className="text-gray-600 mt-2 mb-6 space-y-2">
        <p>Three AI tools for Agilebars, Timebars and Costbars:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <strong className="text-gray-800">Help Assistant</strong> (below): pick your product and ask a question in plain
            words. It reads every guide for that product.
          </li>
          <li>
            <strong className="text-gray-800">Ask by Guide</strong>: choose which guides to search when you know where the
            answer is. Fewer guides give a quicker, more focused answer.
          </li>
          <li>
            <strong className="text-gray-800">AI Generator</strong>: paste the text of a charter, business case, risk
            register, task list or cost estimate and get a Timebars file you can import into the app. Check the file before
            you import it.
          </li>
        </ul>
        <p className="text-sm">
          This is a custom AI solution built by Timebars Ltd. The Help Assistant and Ask by Guide answer only from our
          official help guides, and tell you when the guides do not cover your question.
        </p>
      </div>
      <AskAiHelp
        initialProduct={PRODUCT_CODES.includes(requested) ? requested : undefined}
        initialTool={String(searchParams?.tool || '').toLowerCase()}
      />
    </div>
  )
}
