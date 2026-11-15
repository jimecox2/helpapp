// Copy of tbwww lib/licenseOrders.js (Phase 3, 15 Nov 2026). Keep the two the same; only the import paths differ.
// lib/licenseOrders.js
// One active license per product (Jim, 30 Oct 2026): an email may hold an active Agilebars, Timebars
// and Costbars license at the same time, but only one per product. The client apps load the license of
// the site's product (tbrunp scripts/tbLicenseRules.js). Pure functions, tested by tests/license-orders.mjs.

import { isPastExpiry, licenseStatus, formatLicenseDate } from '../license/expiry.js'

export const PRODUCTS = [
  { code: 'AB', name: 'Agilebars' },
  { code: 'TB', name: 'Timebars' },
  { code: 'CB', name: 'Costbars' },
]

/** "CBT03" -> "CB"; "" when the order has no product code. */
export const productOf = (productCode) => String(productCode || '').substring(0, 2).toUpperCase()

/**
 * true once the expires_on day is over ("08-Jul-2024", "27 March 2025"). Unreadable dates are not expired.
 * The rule (end of the day, then GRACE_DAYS of grace) is lib/licenseExpiry.js, shared with helpapp and tbrunp.
 */
export const isExpired = (expiresOn, now = new Date()) => isPastExpiry(expiresOn, now)

/**
 * The badge for an order on My Orders, from its date (the active flag lags).
 * @returns {{ label: string, tone: 'active'|'grace'|'expired'|'inactive', title: string }}
 */
export function orderLicenseBadge(order, now = new Date()) {
  const s = licenseStatus(order?.expires_on, now)
  if (s.state === 'grace') {
    return { label: 'Expired, in grace', tone: 'grace',
      title: `Expired on ${formatLicenseDate(s.expiresOn)}. Publishing keeps working until ${formatLicenseDate(s.graceEndsOn)}, then stops. Renew to keep it.` }
  }
  if (s.state === 'expired') {
    return { label: 'Expired', tone: 'expired',
      title: `Expired on ${formatLicenseDate(s.expiresOn)}. The apps keep working on your device, publishing to the Cloud is stopped. Renew, or make another order active.` }
  }
  return order?.active_status === true
    ? { label: 'Active', tone: 'active', title: 'The license this product uses at login (one per product).' }
    : { label: 'Inactive', tone: 'inactive', title: 'Not used at login. Make active to use it as this product\'s license.' }
}

/**
 * Early renewal (Jim, 4 Nov 2026): a new order of a product that still has a live license starts
 * where that license ends, so the customer keeps the days they paid for. In the grace period or
 * with no license it starts today.
 * @param {Array} orders - the user's orders (getMyOrders rows)
 * @param {Object} newOrder - the order being paid ({ id, product: { product_code } })
 * @returns {Date} the day the new months are added to
 */
export function renewalStartDate(orders = [], newOrder, now = new Date()) {
  const code = productOf(newOrder?.product?.product_code)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!code) return today
  const ends = orders
    .filter((o) => String(o.id) !== String(newOrder.id) && o.active_status === true && productOf(o.product?.product_code) === code)
    .map((o) => licenseStatus(o.expires_on, now))
    .filter((st) => st.state === 'active')
    .map((st) => st.expiresOn)
  return ends.reduce((latest, d) => (d > latest ? d : latest), today)
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** start + months as "27 March 2025" (the expires_on format order-confirmation has always written). */
export function expiresOnAfterMonths(start, months) {
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  d.setMonth(d.getMonth() + Number(months || 0))
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
}

/** A paid, inactive, unexpired order of a known product can be made the product's active license. */
export function canMakeActive(order, now = new Date()) {
  // A seat comes and goes with its company's contract; an add-on of seats is never a licence.
  if (order?.order_type === 'seat' || (order?.order_type === 'contract' && order?.contract)) return false
  return !!order && order.status === 'paid' && order.active_status !== true
    && productOf(order.product?.product_code) !== '' && !isExpired(order.expires_on, now)
}

/**
 * Orders grouped by product, newest first, in AB / TB / CB order; orders with no product last.
 * @param {Array} orders - getMyOrders() rows ({ id, status, active_status, expires_on, createdAt, product: { product_code } })
 * @returns {Array<{ code, name, active: Object|null, orders: Array }>} only products that have orders
 */
export function groupOrdersByProduct(orders = []) {
  const groups = [...PRODUCTS, { code: '', name: 'Other orders' }].map((p) => ({ ...p, active: null, orders: [] }))
  orders.forEach((order) => {
    const code = productOf(order.product?.product_code)
    const group = groups.find((g) => g.code === code) || groups[groups.length - 1]
    group.orders.push(order)
  })
  groups.forEach((g) => {
    g.orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    g.active = g.orders.find((o) => o.active_status === true) || null
  })
  return groups.filter((g) => g.orders.length > 0)
}

/** The other active orders of the same product as keepOrder: the ones to set inactive. */
export function otherActiveOrdersOfProduct(orders = [], keepOrder) {
  const code = productOf(keepOrder?.product?.product_code)
  if (!code) return []
  return orders.filter((o) => o.active_status === true && String(o.id) !== String(keepOrder.id)
    && productOf(o.product?.product_code) === code)
}
