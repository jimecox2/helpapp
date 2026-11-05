// Expired license in the Cloud: one redirect to My Orders after sign-in, then the banner.
// Run:  npm run build && npm run test:license:app   (the login cookie is minted here, Strapi is a stub)
import http from 'node:http'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { encode } from 'next-auth/jwt'

const SECRET = 'test-secret-for-license-redirect-0123'
const COOKIE = '__Secure-tbcloud.session-token' // next start runs as production
const NOTICE_COOKIE = 'tbcloud.license-notice'

const strapi = await new Promise(res => {
  const s = http.createServer((req, r) => { r.setHeader('Content-Type', 'application/json'); r.end('{"data":[]}') })
    .listen(0, '127.0.0.1', () => res({ s, port: s.address().port }))
})
const port = 3291
const env = { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', AUTH_SECRET: SECRET,
  CLOUD_API_URL: `http://127.0.0.1:${strapi.port}/api`, CLOUD_WWW_URL: 'https://wwws.example.com' }
const app = spawn('npx', ['next', 'start', '-p', String(port), '-H', '127.0.0.1'], { env, stdio: 'ignore', detached: true })
const base = `http://127.0.0.1:${port}`
for (let i = 0; i < 60; i++) {
  try { await fetch(base + '/robots.txt'); break } catch { await new Promise(r => setTimeout(r, 500)) }
}

const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toDateString() }
const cookieFor = async license => `${COOKIE}=${await encode({
  token: { email: 'pm@example.com', name: 'pm', jwt: 'jwt-pm', license }, secret: SECRET, salt: COOKIE })}`
const get = (path, cookie) => fetch(base + path, { redirect: 'manual', headers: { Cookie: cookie } })

try {
  // Own license just expired, nothing live: redirected once, then let in with the banner.
  const expired = await cookieFor({ at: 111, company: null, redirectTo: 'https://wwws.example.com/sales/myorders?notice=expired',
    notices: [{ product: 'Timebars', code: 'TBT02', expires_on: daysAgo(20) }] })
  const first = await get('/help/ask', expired)
  assert.equal(first.status, 307)
  assert.equal(first.headers.get('location'), 'https://wwws.example.com/sales/myorders?notice=expired')
  assert.match(first.headers.get('set-cookie') || '', new RegExp(`${NOTICE_COOKIE}=111`))
  const second = await get('/help/ask', `${expired}; ${NOTICE_COOKIE}=111`)
  assert.equal(second.status, 200)
  assert.match(await second.text(), /Timebars license expired on .*Publishing to the Cloud is stopped/)
  // A new sign-in (new time) redirects again.
  assert.equal((await get('/help/ask', `${await cookieFor({ at: 222, redirectTo: 'https://wwws.example.com/x', notices: [] })}; ${NOTICE_COOKIE}=111`)).status, 307)

  // Grace: no redirect, orange banner with the days left.
  const grace = await get('/help/ask', await cookieFor({ at: 333, company: null, redirectTo: null,
    notices: [{ product: 'Agilebars', code: 'ABT02', expires_on: daysAgo(2) }] }))
  assert.equal(grace.status, 200)
  assert.match(await grace.text(), /Agilebars license expired on .*Publishing to the Cloud stops in 6 days/)

  // Team member whose company license expired: no redirect, company notice.
  const team = await get('/help/ask', await cookieFor({ at: 444, company: 'expired', redirectTo: null, notices: [] }))
  assert.equal(team.status, 200)
  assert.match(await team.text(), /Your company(&#x27;|')s license expired, contact your administrator/)

  // Session from before this change (no license field): nothing.
  const old = await get('/help/ask', await cookieFor(undefined))
  assert.equal(old.status, 200)
  assert.doesNotMatch(await old.text(), /license expired/)
  console.log('license-redirect: all tests passed')
} finally {
  try { process.kill(-app.pid) } catch {}
  strapi.s.close()
}
