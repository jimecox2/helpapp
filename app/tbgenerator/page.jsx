import Image from 'next/image'
import Link from 'next/link'
import TbGeneratorPanel from '@/components/TbGeneratorPanel'

export const metadata = {
  title: 'TB Generator | Timebars',
  description: 'Generate Timebars data from customer documents — powered by AI.',
}

export default function TbGeneratorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between gap-5 mb-8 flex-wrap">
        <div className="flex items-center gap-5">
          <Image
            src="/images/timebars-ltd-logo-final.png"
            alt="Timebars Ltd."
            width={250}
            height={250}
            style={{ height: 'auto' }}
            priority
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TB Generator
          </h1>
        </div>
        <Link href="/" className="text-sm text-tbBlue hover:underline font-medium">
          ← Back to Help Assistant
        </Link>
      </div>
      <TbGeneratorPanel />
    </main>
  )
}
