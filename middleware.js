// middleware.js — host routing and the login gate for the Timebars Cloud app.
//
// 1. Host routes: help., dashboard. and pubsets.<domain> send the visitor to the matching route
//    on cloud.<domain> (cloud is the home page). Works for any domain (timebars.com, timebars.app).
//    Staging names end in "s" (helps., dashboards., pubsetss.) and go to clouds.<domain>.
//    On a help host the path is kept under /help: help.timebars.com/common-02-user-interface-guide
//    -> cloud.timebars.com/help/common-02-user-interface-guide (the #anchor stays in the browser).
// 2. Login gate: every page except the home page "/", the help library (/help, /help/<guide>;
//    not /help/ask) and the sign-in pages needs a login.
//    API routes are not gated here; each one checks its own login (the /api/ai/* routes are also
//    called by the Timebars apps through their nginx with a Strapi token, not a cookie).
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// First label of the host name -> route on the cloud host. The staging label is the same with an "s".
const HOST_ROUTES = {
  help: '/help',
  dashboard: '/dashboard',
  pubsets: '/pubsets',
}

// Paths anyone may open without logging in.
const PUBLIC_PATHS = ['/', '/robots.txt', '/sitemap.xml', '/favicon.ico', '/help']
const PUBLIC_PREFIXES = ['/auth/', '/api/', '/_next/', '/docsHelp/', '/images/', '/pdf/', '/spreadsheets/']

// The help library's guide pages are public; Ask AI (/help/ask) is not.
const isPublicHelpPage = pathname => /^\/help\/[a-z0-9-]+\/?$/.test(pathname) && !/^\/help\/ask\/?$/.test(pathname)

// "help" -> { route: '/help', staging: false }, "helps" -> { route: '/help', staging: true }
function hostRoute(label) {
  if (HOST_ROUTES[label]) return { route: HOST_ROUTES[label], staging: false }
  if (label.endsWith('s') && HOST_ROUTES[label.slice(0, -1)]) return { route: HOST_ROUTES[label.slice(0, -1)], staging: true }
  return null
}

const secureCookie = process.env.NODE_ENV === 'production'
// Must match cookies.sessionToken.name in app/auth/auth.js.
const SESSION_COOKIE = `${secureCookie ? '__Secure-' : ''}tbcloud.session-token`

function requestHost(req) {
  const raw = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  return raw.split(',')[0].trim().split(':')[0].toLowerCase()
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl

  // 1. Host routes
  const host = requestHost(req)
  const [label, ...rest] = host.split('.')
  const hr = hostRoute(label)
  if (hr && rest.length >= 2 && !pathname.startsWith('/api/')) {
    const target = new URL(`https://${hr.staging ? 'clouds' : 'cloud'}.${rest.join('.')}`)
    if (hr.route === '/help') {
      // Everything on a help host is a help page; /help/... paths are left as they are.
      target.pathname = pathname === '/' ? '/help' : pathname === '/help' || pathname.startsWith('/help/') ? pathname : `/help${pathname}`
      target.search = search
    } else {
      target.pathname = pathname === '/' ? hr.route : pathname
      target.search = pathname === '/' ? '' : search
    }
    return NextResponse.redirect(target, 308)
  }

  // 2. Login gate
  if (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some(p => pathname.startsWith(p)) ||
    isPublicHelpPage(pathname)
  ) {
    return NextResponse.next()
  }
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie,
    cookieName: SESSION_COOKIE,
  })
  if (!token) {
    const signIn = req.nextUrl.clone()
    signIn.pathname = '/auth/signin'
    signIn.search = ''
    signIn.searchParams.set('callbackUrl', pathname + search)
    return NextResponse.redirect(signIn)
  }
  return NextResponse.next()
}

export const config = {
  // Everything except Next's own static files and files with an extension in /public.
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)', '/projectArtifacts/:path*'],
}
