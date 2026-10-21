'use client'

// Main navigation for the Timebars Cloud app (cloud.timebars.com). Started from the tbwww Navbar
// but has its own dark-blue gradient so Cloud does not look like the marketing site. Every environment
// but PROD (TB_ENVIRONMENT) gets a dark red bar with its name instead. On /dashboard the Enterprise
// Dashboard's own blue header sits under this bar (two rows).

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ChevronDown, Menu, X, User } from 'lucide-react'
import { isAdminRole } from '@/lib/auth/roles'
import { WWW_URL, TB_ENVIRONMENT, IS_PROD } from '@/config/site'
import { cn } from '@/lib/utils'

// The Help menu, shown signed in or out. The last two go to the website (WWW_URL).
const HELP_MENU = [
  { label: 'Help Library', href: '/help', title: 'Product help guides for Agilebars, Timebars and Costbars, open to everyone' },
  { label: 'Contact Us', href: `${WWW_URL}/sales/contact-us`, external: true, title: 'Call or email Timebars Ltd. with questions or for more help' },
  { label: 'Visit Timebars Ltd.', href: WWW_URL, external: true, title: 'See what each product does, compare plans and buy a license' },
]

// adminOnly items are hidden unless the user's primary_role is Administrator.
// public items are also shown to signed-out visitors (everything else needs a login).
const NAV = [
  { label: 'Home', href: '/', public: true },
  { label: 'Help', public: true, children: HELP_MENU },
  { label: 'Ask AI', href: '/help/ask' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pubsets', href: '/pubsets' },
  {
    label: 'Notifications',
    children: [
      { label: 'Notification Settings', href: '/admin/notifications' },
      { label: 'Notification History', href: '/admin/notifications/history' },
      { label: 'Test Pushover / SMS', href: '/admin/testnotifications', adminOnly: true },
      { label: 'Notification Control Panel', href: '/admin', adminOnly: true },
    ],
  },
  { label: 'Users & Roles', href: '/admin/users', adminOnly: true },
]


const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

function Dropdown({ item, pathname, onNavigate, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = e => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const active = item.children.some(c => isActive(pathname, c.href))
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn('flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-sm text-white hover:bg-white/15', active && 'bg-white/20')}
      >
        {item.label} <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className={cn('absolute z-50 mt-1 w-72 rounded-md bg-white py-1 shadow-lg', align === 'right' ? 'right-0' : 'left-0')}>
          {item.children.map(c => (
            <Link
              prefetch={c.external ? false : undefined}
              key={c.href}
              href={c.href}
              title={c.title}
              onClick={() => { setOpen(false); onNavigate?.() }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {c.label}
              {c.title && <span className="block text-xs text-gray-500">{c.title}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppNavbar() {
  const pathname = usePathname() || '/'
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const signedIn = status === 'authenticated'
  const admin = isAdminRole(session?.user?.primary_role)

  // Signed-out visitors only see the public pages (Home, Help).
  const items = signedIn
    ? NAV.filter(i => !i.adminOnly || admin)
        .map(i => (i.children ? { ...i, children: i.children.filter(c => !c.adminOnly || admin) } : i))
    : NAV.filter(i => i.public)

  const closeAll = () => { setMobileOpen(false); setProfileOpen(false) }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b shadow-md bg-gradient-to-r',
        IS_PROD ? 'border-blue-300/40 from-blue-900 via-blue-700 to-blue-500' : 'border-red-300/40 from-red-950 via-red-900 to-red-700',
      )}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-blue-100 hover:bg-white/15 hover:text-white xl:hidden"
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2" onClick={closeAll}>
              <Image src="/images/timebars-ltd-logo-final-w.svg" alt="Timebars Ltd." width={150} height={48} className="h-12 w-auto" priority />
              <span className="hidden pr-2 text-sm font-semibold text-blue-100 sm:inline">Cloud</span>
              {!IS_PROD && (
                <span className="rounded bg-white px-2 py-0.5 text-xs font-bold tracking-wide text-red-800" title="Not production">
                  {TB_ENVIRONMENT}
                </span>
              )}
            </Link>
            <div className="ml-2 hidden items-center gap-0.5 xl:flex">
              {items.map(item =>
                item.children ? (
                  <Dropdown key={item.label} item={item} pathname={pathname} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('whitespace-nowrap rounded-md px-2.5 py-2 text-sm text-white hover:bg-white/15', isActive(pathname, item.href) && 'bg-white/20')}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/25"
                  aria-label="Account menu"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden max-w-[9rem] truncate md:inline">{session.user?.name || session.user?.email}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-md bg-white py-1 shadow-lg">
                    <p className="truncate border-b px-4 py-2 text-xs text-gray-500">{session.user?.email}</p>
                    <a href={`${WWW_URL}/auth/yourprofile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href={`${WWW_URL}/sales/myorders`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders &amp; License</a>
                    <a href={`${WWW_URL}/auth/password-forgot`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reset Password</a>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              status !== 'loading' && (
                <Link href="/auth/signin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/20 px-2 pb-3 pt-2 xl:hidden">
          {items.flatMap(item => (item.children ? item.children : [item])).map(item => (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              onClick={closeAll}
              className={cn('block rounded-md px-3 py-2 text-base text-white hover:bg-white/15', isActive(pathname, item.href) && 'bg-white/20')}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
