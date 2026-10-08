'use client'

// Main navigation for the Timebars Cloud app (cloud.timebars.com). Refactored from the tbwww
// Navbar: same look, but the links are the Cloud pages. On /dashboard the Enterprise Dashboard's
// own blue header sits under this bar (two rows).

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ChevronDown, Menu, X, User } from 'lucide-react'
import { isAdminRole } from '@/lib/auth/roles'
import { WWW_URL } from '@/config/site'
import { cn } from '@/lib/utils'

// adminOnly items are hidden unless the user's primary_role is Administrator.
const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Help', href: '/help' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pubsets', href: '/pubsets' },
  { label: 'AI Generator', href: '/tbgenerator' },
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
  { label: 'AI Help (beta)', href: '/aitemp' },
]

// Links back to www.timebars.com (same list as its Assistance menu). Shown signed in or out.
const ASSISTANCE = {
  label: 'Assistance',
  children: [
    { label: 'timebars.com Home', path: '/' },
    { label: 'Get a License', path: '/sales/pricing' },
    { label: 'Quick Start', path: '/sales/quick-start' },
    { label: 'FAQ by Topic', path: '/knowledgebase/faq' },
    { label: 'Help Articles', path: '/knowledgebase/helparticles' },
    { label: 'Knowledgebase', path: '/knowledgebase' },
    { label: 'About Us', path: '/sales/about-us' },
    { label: 'Contact Us', path: '/sales/contact-us' },
    { label: 'Terms of Service', path: '/sales/terms-of-service' },
  ],
}

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
        className={cn('flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-sm text-white hover:bg-gray-900', active && 'bg-gray-900')}
      >
        {item.label} <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className={cn('absolute z-50 mt-1 w-60 rounded-md bg-white py-1 shadow-lg', align === 'right' ? 'right-0' : 'left-0')}>
          {item.children.map(c => (
            <Link
              prefetch={c.external ? false : undefined}
              key={c.href}
              href={c.href}
              onClick={() => { setOpen(false); onNavigate?.() }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {c.label}
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

  // Signed-out visitors only see Home; everything else needs a login.
  const items = signedIn
    ? NAV.filter(i => !i.adminOnly || admin)
        .map(i => (i.children ? { ...i, children: i.children.filter(c => !c.adminOnly || admin) } : i))
    : NAV.slice(0, 1)

  const closeAll = () => { setMobileOpen(false); setProfileOpen(false) }

  const assistance = { ...ASSISTANCE, children: ASSISTANCE.children.map(c => ({ ...c, href: `${WWW_URL}${c.path === '/' ? '' : c.path}`, external: true })) }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-red-500 bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white xl:hidden"
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2" onClick={closeAll}>
              <Image src="/images/timebars-ltd-logo-final-w.svg" alt="Timebars Ltd." width={150} height={48} className="h-12 w-auto" priority />
              <span className="hidden pr-2 text-sm font-semibold text-gray-200 sm:inline">Cloud</span>
            </Link>
            <div className="ml-2 hidden items-center gap-0.5 xl:flex">
              {items.map(item =>
                item.children ? (
                  <Dropdown key={item.label} item={item} pathname={pathname} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('whitespace-nowrap rounded-md px-2.5 py-2 text-sm text-white hover:bg-gray-900', isActive(pathname, item.href) && 'bg-gray-900')}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Dropdown item={assistance} pathname={pathname} align="right" />
            </div>
            {signedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 rounded-full bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
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
                <Link href="/auth/signin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200">
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-700 px-2 pb-3 pt-2 xl:hidden">
          {items.flatMap(item => (item.children ? item.children : [item])).map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeAll}
              className={cn('block rounded-md px-3 py-2 text-base text-white hover:bg-gray-900', isActive(pathname, item.href) && 'bg-gray-900')}
            >
              {item.label}
            </Link>
          ))}
          <p className="mt-2 border-t border-gray-700 px-3 pb-1 pt-3 text-xs uppercase tracking-wide text-gray-400">Assistance</p>
          {assistance.children.map(c => (
            <a key={c.href} href={c.href} className="block rounded-md px-3 py-2 text-base text-gray-300 hover:bg-gray-900">{c.label}</a>
          ))}
        </div>
      )}
    </nav>
  )
}
