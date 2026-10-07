// "/" — public home page of Timebars Cloud (cloud.timebars.com). The only page without a login.
import Link from 'next/link'
import Image from 'next/image'
import { Bot, LayoutDashboard, Layers, BellRing, Sparkles, ShieldCheck } from 'lucide-react'
import { auth } from '@/auth/auth'
import { WWW_URL } from '@/config/site'

export const metadata = {
  title: { absolute: 'Timebars Cloud – Dashboards, Pubsets and AI Help for Timebars Ltd. Customers' },
  alternates: { canonical: '/' },
}

const FEATURES = [
  {
    icon: Bot,
    title: 'Ask AI Help Assistant',
    href: '/help',
    text: 'Ask how to do anything in Agilebars, Timebars or Costbars. Answers come only from the official documentation.',
  },
  {
    icon: LayoutDashboard,
    title: 'Enterprise Dashboard',
    href: '/dashboard',
    text: 'Portfolio, project, risk, resource and financial reports built from the data your teams publish.',
  },
  {
    icon: Layers,
    title: 'Pubsets',
    href: '/pubsets',
    text: 'Combine the pubsets your teams publish from the desktop apps into one dashboard source and share it.',
  },
  {
    icon: BellRing,
    title: 'Text Notifications',
    href: '/admin/notifications',
    text: 'Pushover and SMS alerts when projects go red, run over budget or need an executive’s attention.',
  },
  {
    icon: Sparkles,
    title: 'AI Generator',
    href: '/tbgenerator',
    text: 'Turn a business case or charter into a starting project plan you can load into the app.',
  },
  {
    icon: ShieldCheck,
    title: 'Users & Roles',
    href: '/admin/users',
    text: 'Administrators decide who sees which pubsets and dashboards, with roles taken from your resource pool.',
  },
]

export default async function HomePage() {
  const session = await auth()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-tbBlue text-white">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-10 md:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-tbGold">For Timebars Ltd. customers</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">Timebars Cloud</h1>
            <p className="mt-5 text-lg text-gray-200">
              The online side of Agilebars, Timebars and Costbars. Get answers from the AI help assistant, see your
              portfolio in the Enterprise Dashboard, manage the pubsets your teams publish, and set up text
              notifications, all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {session ? (
                <>
                  <Link href="/help" className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-200">Ask AI</Link>
                  <Link href="/dashboard" className="rounded-lg border border-white/60 px-6 py-3 font-semibold hover:bg-white/10">Open Dashboard</Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-200">Sign In</Link>
                  <a href={`${WWW_URL}/auth/new-user`} className="rounded-lg border border-white/60 px-6 py-3 font-semibold hover:bg-white/10">Create an Account</a>
                </>
              )}
            </div>
            {session && <p className="mt-4 text-sm text-gray-300">Signed in as {session.user?.email}</p>}
          </div>
          <div className="hidden md:flex justify-center">
            <Image src="/images/timebars-ltd-logo-final-w.svg" alt="Timebars Ltd." width={360} height={160} className="h-auto w-full max-w-sm" priority />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900">What you can do here</h2>
        <p className="mt-2 text-gray-600">Sign in with the same account you use to publish from the apps.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, href, text }) => (
            <Link key={href} href={href} className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-tbBlue hover:shadow-md">
              <Icon className="h-8 w-8 text-tbBlue" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-tbBlue">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Not a customer yet */}
      <section className="border-t border-gray-200 bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New to Timebars?</h2>
            <p className="mt-1 text-gray-600">Products, pricing, licences and your account are on timebars.com.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={WWW_URL} className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-50">Visit timebars.com</a>
            <a href={`${WWW_URL}/sales/pricing`} className="rounded-lg bg-tbOrange px-5 py-2.5 font-medium text-gray-900 hover:brightness-95">Get a License</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Timebars Ltd. · <a href={`${WWW_URL}/sales/terms-of-service`} className="hover:underline">Terms</a> · <a href={`${WWW_URL}/sales/contact-us`} className="hover:underline">Contact</a>
      </footer>
    </div>
  )
}
