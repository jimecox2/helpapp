// components/LicenseBanner.jsx
// Expired license notices under the nav (Jim, 4 Nov 2026). The notices are taken at sign-in
// (lib/license/signInLicense.js); the wording is worked out here from expires_on, so the days of
// grace left are right on every page.
import { auth } from '@/auth/auth'
import { WWW_URL } from '@/config/site'
import { licenseExpiryMessage, licenseStatus } from '@/lib/license/expiry'

export default async function LicenseBanner() {
  const session = await auth()
  const license = session?.license
  if (!license) return null

  const lines = (license.notices || [])
    .map(n => ({ key: n.product, state: licenseStatus(n.expires_on).state, text: licenseExpiryMessage(n.product, n.expires_on) }))
    .filter(l => l.text)
  if (license.company === 'expired') {
    lines.push({ key: 'company', state: 'expired', text: "Your company's license expired, contact your administrator." })
  }
  if (lines.length === 0) return null

  return (
    <div className="space-y-1 px-4 py-2" role="status">
      {lines.map(l => (
        <div key={l.key}
          className={`mx-auto max-w-5xl rounded border px-4 py-2 text-sm ${l.state === 'grace'
            ? 'border-orange-300 bg-orange-50 text-orange-900'
            : 'border-red-300 bg-red-50 text-red-900'}`}>
          {l.text}
          {l.key !== 'company' && (
            <> <a href={`${WWW_URL}/sales/myorders`} className="font-medium underline">Go to My Orders</a></>
          )}
        </div>
      ))}
    </div>
  )
}
