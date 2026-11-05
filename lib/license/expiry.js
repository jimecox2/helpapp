// License expiry rule, the same file in tbrunp (scripts/tbLicenseExpiry.js), helpapp
// (lib/license/expiry.js) and tbwww (lib/licenseExpiry.js). Pure: no imports, no DOM, no fetch.
// Change all three together.
//
// Decisions (Jim, 4 Nov 2026):
// - A license is good to the END of its expires_on day (local time), so a UTC server clock never
//   cuts it off on the morning of its last day.
// - Then a 7-day grace period: everything still works, publishing included, and the user is told
//   at login and when publishing.
// - After the grace period the license is "expired": the product keeps working locally (same
//   limits), but publishing, Bulk Update / Re-Publish and OpenProject sync stop, the Cloud drops
//   its paid features, and the order is set inactive at the next Cloud sign-in.
// expires_on is text in Strapi ("08-Jul-2024", "27 March 2025", sometimes "2025-03-27").

export const GRACE_DAYS = 7

const DAY_MS = 24 * 60 * 60 * 1000

/** The expires_on day as a local Date at 00:00, or null when the text is not a date. */
export function parseExpiresOn(expiresOn) {
  const text = String(expiresOn ?? '').trim()
  if (!text) return null
  // "2025-03-27" would parse as UTC midnight; read it as a local day like the other formats.
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(text)
  const d = iso ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])) : new Date(text)
  if (!Number.isFinite(d.getTime())) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * Where a license stands on a date.
 * @returns {{ state: 'active'|'grace'|'expired'|'unknown', expiresOn: Date|null, graceEndsOn: Date|null,
 *   daysLeft: number|null, graceDaysLeft: number|null }}
 *   active  - on or before the expires_on day. daysLeft = whole days left (0 on the last day).
 *   grace   - within GRACE_DAYS after it. graceDaysLeft = days of grace left (1..GRACE_DAYS).
 *   expired - after the grace period.
 *   unknown - no readable date (treated like active, as before).
 *   graceEndsOn = the last day of grace.
 */
export function licenseStatus(expiresOn, now = new Date()) {
  const day = parseExpiresOn(expiresOn)
  if (!day) return { state: 'unknown', expiresOn: null, graceEndsOn: null, daysLeft: null, graceDaysLeft: null }
  const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime()
  const graceEndsOn = new Date(day.getFullYear(), day.getMonth(), day.getDate() + GRACE_DAYS)
  const graceEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + GRACE_DAYS + 1).getTime()
  const t = now.getTime()
  if (t < endOfDay) {
    return { state: 'active', expiresOn: day, graceEndsOn, daysLeft: Math.floor((endOfDay - t - 1) / DAY_MS), graceDaysLeft: null }
  }
  if (t < graceEnd) {
    return { state: 'grace', expiresOn: day, graceEndsOn, daysLeft: 0, graceDaysLeft: Math.ceil((graceEnd - t) / DAY_MS) }
  }
  return { state: 'expired', expiresOn: day, graceEndsOn, daysLeft: 0, graceDaysLeft: 0 }
}

/** true once the expires_on day is over (grace or expired). */
export const isPastExpiry = (expiresOn, now = new Date()) => ['grace', 'expired'].includes(licenseStatus(expiresOn, now).state)

/** true once the grace period is over: publishing and paid Cloud features stop. */
export const isExpiredPastGrace = (expiresOn, now = new Date()) => licenseStatus(expiresOn, now).state === 'expired'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "08-Jul-2024" for a Date, "" for null. */
export const formatLicenseDate = (d) => d ? `${String(d.getDate()).padStart(2, '0')}-${MONTHS[d.getMonth()]}-${d.getFullYear()}` : ''

/**
 * One sentence for the user, or "" while the license is active.
 * @param {string} productName - "Timebars"
 */
export function licenseExpiryMessage(productName, expiresOn, now = new Date()) {
  const s = licenseStatus(expiresOn, now)
  const name = productName || 'Your'
  if (s.state === 'grace') {
    const days = s.graceDaysLeft === 1 ? '1 day' : `${s.graceDaysLeft} days`
    return `${name} license expired on ${formatLicenseDate(s.expiresOn)}. Publishing to the Cloud stops in ${days} (${formatLicenseDate(s.graceEndsOn)}). Renew at My Orders.`
  }
  if (s.state === 'expired') {
    return `${name} license expired on ${formatLicenseDate(s.expiresOn)}. Publishing to the Cloud is stopped. Renew or make another order active at My Orders.`
  }
  return ''
}
