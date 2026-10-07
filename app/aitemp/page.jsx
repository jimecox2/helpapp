// /aitemp — the original helpapp help panel (document picker, Gemini or local Ollama).
// Kept as its own page to be enhanced later; the main help page is /help.
import HelpChatPanel from '@/components/HelpChatPanel'

export const metadata = {
  title: 'AI Help (beta)',
  robots: { index: false, follow: false },
}

export default function AiTempPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Help (beta)</h1>
      <p className="text-gray-600 mb-6">
        Pick the documents to search and ask a question. Choose the cloud model (Gemini) or the local model (Ollama).
      </p>
      <HelpChatPanel />
    </div>
  )
}
