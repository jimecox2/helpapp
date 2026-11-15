// Copy of tbwww lib/orders/seatPrice.js (Phase 3, 15 Nov 2026). Keep the two the same; only the import paths differ.
// lib/orders/seatPrice.js — Enterprise seat prices (Phase 2, Jim, 14 Nov 2026). Pure, no Node imports:
// the checkout page shows the same total the server charges (lib/orders/seatRules.js uses these too).
import { licenseStatus } from '../license/expiry.js'

export const MIN_SEATS = 2
export const MAX_SEATS = 1000
export const MAX_MONTHS = 60

const cents = n => Math.round(Number(n) * 100) / 100

export const isEnterpriseProduct = p => /T03$/i.test(String(p?.product_code || ''))
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

