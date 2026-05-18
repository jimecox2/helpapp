import Image from 'next/image'
import HelpChatPanel from '@/components/HelpChatPanel'

export const metadata = {
  title: 'AI Help Assistant | Timebars',
  description: 'Get instant answers about Timebars, Agilebars, or Costbars — powered by official documentation.',
}

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-5 mb-8">
        <Image
          src="/images/timebars-ltd-logo-final.png"
          alt="Timebars Ltd."
          width={250}
          height={250}
          style={{ height: 'auto' }}
          priority
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Help Assistant
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Ask questions about Agilebars, Timebars or Costbars — answered instantly from the official documentation.
          </p>
        </div>
      </div>
      <HelpChatPanel />
    </main>
  )
}
