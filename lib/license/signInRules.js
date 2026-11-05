// Pure rules for the license check at Cloud sign-in (Jim, 4 Nov 2026). No imports from Next or
// Strapi, so tests/license-signin.mjs runs them as they ship. The fetching is in signInLicense.js.
//
// - An active order past its grace period (expiry.js) is set inactive at sign-in. That is
//   housekeeping: every page also works the expiry out from the date (getLicenseTier skips it).
// - The user is sent to My Orders on www ONCE, and only when an order of theirs has just expired
//   and they have no live license left. Another live product, or no orders at all (team members
//   under their Administrator's customer id), means no redirect.
// - Expired users can still sign in, see their pubsets and download them. Publishing is stopped
//   in the apps (tbrunp).

import { isExpiredPastGrace, licenseStatus } from './expiry.js'

const PRODUCT_NAMES = { AB: 'Agilebars', TB: 'Timebars', CB: 'Costbars' }

const codeOf = o => o?.attributes?.product?.data?.attributes?.product_code || ''
export const productNameOf = code => PRODUCT_NAMES[String(code || '').substring(0, 2).toUpperCase()] || ''

/**
 * @param {Array} orders - the user's Strapi orders ({ id, attributes: { status, active_status, expires_on, product } })
 * @returns {{ toDeactivate: Array<number>, notices: Array<{ product, code, expires_on }>, hasLive: boolean,
 *   hasOrders: boolean, redirect: boolean }}
 *   notices: products whose license is in its grace period, or has just expired with no other live
 *   license of that product. The banner works its wording out from expires_on when it is shown.
 */
export function licenseAtSignIn(orders = [], now = new Date()) {
  const active = orders.filter(o => o?.attributes?.active_status === true && codeOf(o))
  const live = active.filter(o => !isExpiredPastGrace(o.attributes.expires_on, now))
  const lapsed = active.filter(o => isExpiredPastGrace(o.attributes.expires_on, now))
  const liveProducts = new Set(live.filter(o => licenseStatus(o.attributes.expires_on, now).state !== 'grace')
    .map(o => productNameOf(codeOf(o))))

  const notices = []
  const add = o => {
    const product = productNameOf(codeOf(o))
    if (!product || liveProducts.has(product) || notices.some(n => n.product === product)) return
    notices.push({ product, code: codeOf(o), expires_on: o.attributes.expires_on })
  }
  live.filter(o => licenseStatus(o.attributes.expires_on, now).state === 'grace').forEach(add)
  lapsed.forEach(add)

  const hasOrders = orders.some(o => o?.attributes?.status === 'paid' || o?.attributes?.active_status === true)
  return {
    toDeactivate: lapsed.map(o => o.id),
    notices,
    hasLive: live.length > 0,
    hasOrders,
    redirect: lapsed.length > 0 && live.length === 0,
  }
}

/**
 * Company license for a team member (no orders of their own): the Administrators' orders of the
 * same customer id. 'expired' when they had a license and none is live, else null.
 */
export function companyLicenseState(adminOrders = [], now = new Date()) {
  const active = adminOrders.filter(o => o?.attributes?.active_status === true && codeOf(o))
  const paid = adminOrders.filter(o => o?.attributes?.status === 'paid' && codeOf(o))
  if (active.some(o => !isExpiredPastGrace(o.attributes.expires_on, now))) return null
  return paid.length > 0 || active.length > 0 ? 'expired' : null
}
