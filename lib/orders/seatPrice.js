// Copy of tbwww lib/orders/seatPrice.js (synced 23 Nov 2026). Keep the two the same; only the import paths differ.
// lib/orders/seatPrice.js — Enterprise seat prices (Phase 2, Jim, 14 Nov 2026). Pure, no Node imports:
// the checkout page shows the same total the server charges (lib/orders/seatRules.js uses these too).
import { licenseStatus } from '../license/expiry.js'

export const MIN_SEATS = 2
export const MAX_SEATS = 1000
export const MAX_MONTHS = 60

const cents = n => Math.round(Number(n) * 100) / 100

export const isEnterpriseProduct = p => /T03$/i.test(String(p?.product_code || ''))
// Enterprise, multi-user contracts are bought only on Costbars Enterprise (Jim, 18 Nov 2026). ABT03 and TBT03
// still sell personal licences, and their pages send companies here.
export const ENTERPRISE_SELLER_CODE = 'CBT03'
export const sellsEnterprise = p => String(p?.product_code || '').toUpperCase() === ENTERPRISE_SELLER_CODE
// The products one Enterprise order on CBT03 buys seats of, in the order the page shows them.
export const BUNDLE_CODES = ['CBT03', 'TBT03', 'ABT03']
export const seatPrice = p => cents(p?.discount_price || p?.price || 0)
export const orderTypeOf = o => o?.order_type || 'personal'
export const isAddOn = o => orderTypeOf(o) === 'contract' && !!o?.contract
export const isMainContract = o => orderTypeOf(o) === 'contract' && !o?.contract

/** Whole months from today to the contract's expiry, rounded up; 0 when it is not active. */
export function monthsLeft(expiresOn, now = new Date()) {
  const s = licenseStatus(expiresOn, now)
  if (s.state !== 'active') return 0
  const end = s.expiresOn
  let m = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth())
  if (end.getDate() > now.getDate()) m++
  return Math.max(1, m)
}

const int = v => (Number.isInteger(Number(v)) && String(v).trim() !== '' ? Number(v) : NaN)

/**
 * The price of a checkout, worked out on the server only.
 * kind: 'personal' (months), 'contract' (seats, months; new or renewal), 'addSeats' (seats = extra seats,
 * months = what is left of `contract`).
 * @returns {{ ok: true, totalMonthly, qtyMonths, seats, total, line: { name, description } } | { ok: false, error }}
 */
export function priceCheckout({ kind, product, seats, months, contract = null, minSeats = MIN_SEATS, orgName = '', now = new Date() }) {
  const price = seatPrice(product)
  if (!(price > 0)) return { ok: false, error: 'This product has no price. Please contact us.' }
  const money = n => `$${cents(n).toFixed(2)}`

  if (kind === 'addSeats') {
    const extra = int(seats)
    if (!(extra >= 1 && extra <= MAX_SEATS)) return { ok: false, error: `Enter how many seats to add (1 to ${MAX_SEATS}).` }
    const left = monthsLeft(contract?.expires_on, now)
    if (!left) return { ok: false, error: 'This contract is not active. Renew it instead.' }
    const totalMonthly = cents(price * extra)
    return {
      ok: true, totalMonthly, qtyMonths: left, seats: extra, total: cents(totalMonthly * left),
      line: {
        name: `${product.name}, ${extra} more seat${extra === 1 ? '' : 's'}${orgName ? `, ${orgName}` : ''}`,
        description: `${extra} seat${extra === 1 ? '' : 's'} x ${money(price)} a month x ${left} month${left === 1 ? '' : 's'} left (to ${contract.expires_on})`,
      },
    }
  }

  const m = int(months)
  if (!(m >= 1 && m <= MAX_MONTHS)) return { ok: false, error: `Choose 1 to ${MAX_MONTHS} months.` }
  if (kind === 'personal') {
    return {
      ok: true, totalMonthly: price, qtyMonths: m, seats: null, total: cents(price * m),
      line: { name: product.name, description: product.subscription_description || product.name },
    }
  }
  if (kind === 'contract') {
    const n = int(seats)
    const min = Math.max(MIN_SEATS, minSeats)
    if (!(n >= min && n <= MAX_SEATS)) {
      return { ok: false, error: min > MIN_SEATS
        ? `Your team already uses ${min} seats. Choose ${min} to ${MAX_SEATS}.`
        : `Choose ${MIN_SEATS} to ${MAX_SEATS} seats.` }
    }
    const totalMonthly = cents(price * n)
    return {
      ok: true, totalMonthly, qtyMonths: m, seats: n, total: cents(totalMonthly * m),
      line: {
        name: `${product.name}, ${n} seats${orgName ? `, ${orgName}` : ''}`,
        description: `${n} seats x ${money(price)} a month x ${m} month${m === 1 ? '' : 's'}`,
      },
    }
  }
  return { ok: false, error: 'Unknown kind of order.' }
}

/**
 * The price of an Enterprise order on CBT03 (Jim, 18 Nov 2026): seats of Costbars, Timebars and Agilebars in
 * one payment, each at its own product's price. Worked out on the server; the page shows the same numbers.
 *   plan 'buy'    (no live contract): every product with seats > 0 gets a contract for `months`; at least
 *                 MIN_SEATS in total. The buyer holds one seat in each product bought.
 *   plan 'renew'  (live contracts): `months` more from the company's expiry. A product with a live contract
 *                 keeps at least the seats it uses, or 0 to let it end at the expiry. A product with no live
 *                 contract starts now and runs to the same date (months left + `months`).
 *   plan 'add'    (live contracts): more seats of a live product, or a new product, for the months left;
 *                 everything ends on the company's expiry.
 * @param {{ plan, products: [{id, product_code, name, price, discount_price}], seats: {code: n}, months?,
 *   live?: {code: {id, seats, used}}, companyExpiry?, orgName?, now? }} input
 * @returns {{ ok: true, plan, months, monthsLeft, lines: [{ code, productId, productName, kind: 'contract'|'addOn',
 *   contractId, seats, totalMonthly, qtyMonths, total, name, description }], total, seats } | { ok: false, error }}
 */
export function priceEnterprise({ plan, products = [], seats = {}, months, live = {}, companyExpiry = null, orgName = '', now = new Date() }) {
  const money = n => `$${cents(n).toFixed(2)}`
  const s = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
  const hasLive = Object.keys(live || {}).length > 0
  if (!['buy', 'renew', 'add'].includes(plan)) return { ok: false, error: 'Unknown kind of order.' }
  if (plan === 'buy' && hasLive) return { ok: false, error: 'Your company already has a live contract: renew it or add seats.' }
  if (plan !== 'buy' && !hasLive) return { ok: false, error: 'Your company has no live contract to renew or add to.' }
  const left = plan === 'buy' ? 0 : monthsLeft(companyExpiry, now)
  if (plan === 'add' && !left) return { ok: false, error: 'Your contracts are not active. Renew them instead.' }
  const m = plan === 'add' ? 0 : int(months)
  if (plan !== 'add' && !(m >= 1 && m <= MAX_MONTHS)) return { ok: false, error: `Choose 1 to ${MAX_MONTHS} months.` }

  const lines = []
  for (const p of products) {
    const code = String(p.product_code || '').toUpperCase()
    const raw = seats?.[code] ?? 0
    const n = int(raw === '' ? 0 : raw)
    if (!(n >= 0 && n <= MAX_SEATS)) return { ok: false, error: `${p.name}: choose 0 to ${MAX_SEATS} seats.` }
    if (!n) continue
    const price = seatPrice(p)
    if (!(price > 0)) return { ok: false, error: `${p.name} has no price. Please contact us.` }
    const c = live[code]
    if (plan === 'renew' && c && n < c.used) {
      return { ok: false, error: `${p.name}: your team already uses ${c.used} seats. Choose ${c.used} or more, or 0 to let it end.` }
    }
    const kind = plan === 'add' && c ? 'addOn' : 'contract'
    const qtyMonths = plan === 'buy' ? m : plan === 'add' ? left : c ? m : left + m
    const totalMonthly = cents(price * n)
    lines.push({
      code, productId: p.id, productName: p.name, kind, contractId: kind === 'addOn' ? c.id : null,
      seats: n, totalMonthly, qtyMonths, total: cents(totalMonthly * qtyMonths),
      name: `${p.name}, ${kind === 'addOn' ? s(n, 'more seat') : s(n, 'seat')}${orgName ? `, ${orgName}` : ''}`,
      description: `${s(n, 'seat')} x ${money(price)} a month x ${s(qtyMonths, 'month')}${plan === 'add' ? ` (to ${companyExpiry})` : ''}`,
    })
  }
  if (!lines.length) return { ok: false, error: plan === 'add' ? 'Choose the seats to add.' : 'Choose the seats for at least one product.' }
  const total = lines.reduce((t, l) => t + l.seats, 0)
  if (plan === 'buy' && total < MIN_SEATS) return { ok: false, error: `Choose at least ${MIN_SEATS} seats in total.` }
  return { ok: true, plan, months: m, monthsLeft: left, lines, seats: total, total: cents(lines.reduce((t, l) => t + l.total, 0)) }
}

