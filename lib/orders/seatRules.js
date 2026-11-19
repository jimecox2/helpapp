// Copy of tbwww lib/orders/seatRules.js (Phase 3, 15 Nov 2026). Keep the two the same; only the import paths differ.
// lib/orders/seatRules.js — Enterprise seats (Phase 2, Jim, 14 Nov 2026). Plan: "Plan: Enterprise seats
// (Phase 2) and self-managed licences (Phase 3)".
//
// An order is the licence: tbrunp and helpapp read the user's orders (owner = email, product,
// active_status, expires_on) and never look at the price. So:
//   - personal  : today's order, one person.
//   - contract  : one paid order with `seats` (the buyer's own seat included). It is the buyer's licence.
//                 An add-on (more seats mid-contract) is a contract order whose `contract` points at the
//                 main contract; when paid it adds its seats to the main contract and is never a licence.
//   - seat      : a free order (total 0, paid) for one team member, same product and expires_on as its
//                 contract, `contract` -> the contract order.
// Every write here runs on the server with STRAPI_ADMIN_TOKEN, through the `strapi` function it is given
// (lib/strapiAdmin.js in the app, a fake in tests/seats.mjs).
import { licenseStatus, isExpiredPastGrace } from '../license/expiry.js'
import { renewalStartDate, expiresOnAfterMonths, otherActiveOrdersOfProduct, productOf } from './licenseOrders.js'
import { getUser, createOrganisation, makeJoinCode, cleanName, accountDataProblem } from '../org/orgRules.js'

export { MIN_SEATS, MAX_SEATS, MAX_MONTHS, isEnterpriseProduct, seatPrice, orderTypeOf, isAddOn, isMainContract, monthsLeft, priceCheckout } from './seatPrice.js'
import { orderTypeOf, isAddOn, isMainContract, monthsLeft, priceCheckout, isEnterpriseProduct, MIN_SEATS } from './seatPrice.js'

const lower = s => String(s || '').trim().toLowerCase()
const isAdministrator = u => lower(u?.primary_role) === 'administrator'
const isLive = (o, now) => o?.active_status === true && !isExpiredPastGrace(o.expires_on, now)
const int = v => (Number.isInteger(Number(v)) && String(v).trim() !== '' ? Number(v) : NaN)

// --- Strapi rows ---------------------------------------------------------------------------------
const rel = r => (r?.data ? { ...(r.data.attributes || {}), id: r.data.id } : null)
export function flatOrder(row) {
  if (!row) return null
  const a = row.attributes || {}
  return { ...a, id: row.id, product: rel(a.product), contract: rel(a.contract), organisation: rel(a.organisation), user: rel(a.user) }
}
const flat = row => (row ? { ...(row.attributes || row), id: row.id } : null)

const ORDER_POP = 'populate[product]=true&populate[contract]=true&populate[organisation]=true&populate[user][fields][0]=email'

export async function getProduct(strapi, id) {
  if (!int(id)) return null
  return flat((await strapi(`/products/${int(id)}`).catch(e => { if (e.status === 404) return null; throw e }))?.data)
}

export async function getOrder(strapi, id) {
  if (!int(id)) return null
  return flatOrder((await strapi(`/orders/${int(id)}?${ORDER_POP}`).catch(e => { if (e.status === 404) return null; throw e }))?.data)
}

async function findOrders(strapi, filters) {
  const res = await strapi(`/orders?${filters}&${ORDER_POP}&pagination[pageSize]=100`)
  return (res?.data || []).map(flatOrder)
}

const ordersOfOwner = (strapi, email) => findOrders(strapi, `filters[owner][$eq]=${encodeURIComponent(email)}`)

/** Active seat orders of one contract. */
export const seatOrdersOf = (strapi, contractId) =>
  findOrders(strapi, `filters[contract][id][$eq]=${int(contractId)}&filters[order_type][$eq]=seat&filters[active_status][$eq]=true`)

/** Seats taken on a contract: the buyer plus each active seat order. */
export const seatsUsed = seatOrders => 1 + seatOrders.length

/** The organisation's live main contracts, newest expiry first (optionally of one product). */
export async function liveContracts(strapi, orgId, { productId = null, now = new Date() } = {}) {
  if (!orgId) return []
  const rows = await findOrders(strapi, `filters[organisation][id][$eq]=${int(orgId)}&filters[order_type][$eq]=contract&filters[active_status][$eq]=true`)
  return rows
    .filter(o => isMainContract(o) && isLive(o, now) && (!productId || String(o.product?.id) === String(productId)))
    .sort((a, b) => (licenseStatus(b.expires_on, now).expiresOn || 0) - (licenseStatus(a.expires_on, now).expiresOn || 0))
}

/** The user's organisation row (from the relation, or found by Customer ID when set by hand). */
async function orgOfUser(strapi, user) {
  if (user?.organisation) return flat(user.organisation)
  if (!user?.customer_id) return null
  const res = await strapi(`/organisations?filters[org_customer_id][$eq]=${encodeURIComponent(user.customer_id)}`)
  return flat(res?.data?.[0])
}

const publicOrg = (org, withCode) => org && ({
  id: org.id, name: org.org_name, customerId: org.org_customer_id, type: org.org_type,
  ...(withCode ? { joinCode: org.org_join_code || '' } : {}),
})

// --- What the checkout page shows ----------------------------------------------------------------

/**
 * Everything the product page needs to offer the right Enterprise step, for the signed-in user.
 * mode: 'new' (no organisation yet or an individual one: asks for the company name), 'contract' (the
 * Administrator's organisation, no live contract of this product), 'renewOrAdd' (a live contract),
 * 'member' (a Team Member of a company: cannot buy seats).
 */
export async function enterpriseOptions(strapi, userId, productId, now = new Date()) {
  const user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  const problem = await accountDataProblem(strapi, user)
  if (problem) return { ok: false, error: problem }
  const org = await orgOfUser(strapi, user)
  const company = org && org.org_type === 'organisation'
  if (company && !isAdministrator(user)) return { ok: true, mode: 'member', org: publicOrg(org, false) }
  if (!company) return { ok: true, mode: 'new', org: publicOrg(org, false) }
  const [live] = await liveContracts(strapi, org.id, { productId, now })
  if (!live) return { ok: true, mode: 'contract', org: publicOrg(org, false) }
  const used = seatsUsed(await seatOrdersOf(strapi, live.id))
  return {
    ok: true, mode: 'renewOrAdd', org: publicOrg(org, false),
    contract: { id: live.id, seats: Number(live.seats) || 0, used, expiresOn: live.expires_on, monthsLeft: monthsLeft(live.expires_on, now) },
  }
}

// --- Start a checkout: makes the unpaid order ------------------------------------------------------

/**
 * @param {{ productId, kind: 'personal'|'contract'|'addSeats', seats?, months?, companyName? }} input
 * @returns {{ ok: true, order, price } | { ok: false, error }}
 */
export async function startOrder(strapi, userId, input, now = new Date()) {
  const { productId, kind } = input || {}
  let user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  const product = await getProduct(strapi, productId)
  if (!product) return { ok: false, error: 'That product was not found.' }

  const base = {
    product: product.id,
    user: user.id,
    owner: user.email,
    description: product.subscription_description || product.name,
    total: 0,
    status: 'unpaid',
    active_status: false,
    checkout_session: 'tbd',
    name: `${user.email} - ${product.name}`,
  }

  if (kind === 'personal') {
    // Every licence holder has a Customer ID: make the person's own (individual) organisation if needed.
    if (!user.customer_id) {
      const made = await createOrganisation(strapi, user.id, { type: 'individual' })
      if (!made.ok) return made
      user = await getUser(strapi, userId)
    }
    const price = priceCheckout({ kind, product, months: input.months, now })
    if (!price.ok) return price
    const order = await createOrder(strapi, {
      ...base, order_type: 'personal', customer_id: user.customer_id,
      total_monthly: price.totalMonthly, qty_months: price.qtyMonths,
    })
    return { ok: true, order, price }
  }

  if (kind !== 'contract' && kind !== 'addSeats') return { ok: false, error: 'Unknown kind of order.' }
  if (!isEnterpriseProduct(product)) return { ok: false, error: 'Seats can only be bought for Enterprise (T03) editions.' }

  // The buyer's organisation: one organisation, one Administrator (Jim, 14 Nov 2026).
  const problem = await accountDataProblem(strapi, user)
  if (problem) return { ok: false, error: problem }
  let org = await orgOfUser(strapi, user)
  if (org && org.org_type === 'organisation' && !isAdministrator(user)) {
    return { ok: false, error: `Only the Administrator of ${org.org_name} can buy seats. You can take a seat on Your organisation.` }
  }
  if (!org || org.org_type !== 'organisation') {
    if (kind === 'addSeats') return { ok: false, error: 'There is no contract to add seats to.' }
    const name = cleanName(input.companyName)
    if (!name) return { ok: false, error: 'Please enter your company name.' }
    if (!org) {
      const made = await createOrganisation(strapi, user.id, { type: 'organisation', name })
      if (!made.ok) return made
      user = await getUser(strapi, userId)
      org = await orgOfUser(strapi, user)
    } else {
      // Upgrade the person's own organisation in place: same Customer ID, so their pubsets stay visible.
      const changes = { org_name: name, org_type: 'organisation', org_join_enabled: true }
      if (!org.org_join_code) Object.assign(changes, { org_join_code: makeJoinCode(), org_join_code_changed_at: new Date().toISOString() })
      org = flat((await strapi(`/organisations/${org.id}`, { method: 'PUT', body: JSON.stringify({ data: changes }) }))?.data) || { ...org, ...changes }
      if (!isAdministrator(user)) {
        await strapi(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify({ primary_role: 'Administrator' }) })
      }
    }
  }

  const [live] = await liveContracts(strapi, org.id, { productId: product.id, now })
  const common = { ...base, order_type: 'contract', customer_id: org.org_customer_id, organisation: org.id }

  if (kind === 'addSeats') {
    if (!live) return { ok: false, error: 'There is no live contract of this product to add seats to.' }
    const price = priceCheckout({ kind, product, seats: input.seats, contract: live, orgName: org.org_name, now })
    if (!price.ok) return price
    const order = await createOrder(strapi, {
      ...common, contract: live.id, seats: price.seats, total_monthly: price.totalMonthly, qty_months: price.qtyMonths,
      name: `${user.email} - ${product.name} (add ${price.seats} seats)`,
    })
    return { ok: true, order, price }
  }

  // New contract, or a renewal of the live one: never fewer seats than the team already uses.
  const minSeats = live ? seatsUsed(await seatOrdersOf(strapi, live.id)) : MIN_SEATS
  const price = priceCheckout({ kind, product, seats: input.seats, months: input.months, minSeats, orgName: org.org_name, now })
  if (!price.ok) return price
  const order = await createOrder(strapi, {
    ...common, seats: price.seats, total_monthly: price.totalMonthly, qty_months: price.qtyMonths,
    name: `${user.email} - ${product.name} (${price.seats} seats)`,
  })
  return { ok: true, order, price }
}

async function createOrder(strapi, data) {
  return flatOrder((await strapi('/orders', { method: 'POST', body: JSON.stringify({ data }) }))?.data)
}

const putOrder = (strapi, id, data) => strapi(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ data }) })

/** Saves Stripe's session id on the unpaid order, so the confirmation can check it is the same payment. */
export const setCheckoutSession = (strapi, orderId, sessionId) => putOrder(strapi, orderId, { checkout_session: sessionId })

// --- After payment ----------------------------------------------------------------------------------

/**
 * Order confirmation (success_url). Checks the payment really is for this user's order and for the
 * amount the server priced, then makes the licence. A reload of the page changes nothing.
 * @param {{ id, payment_status, amount_total, amount_subtotal, currency, customer_details, metadata }} stripeSession
 * @returns {{ ok: true, type, expiresOn, seats, product, organisation } | { ok: false, error }}
 */
export async function confirmPaidOrder(strapi, { userId, email }, stripeSession, now = new Date()) {
  const s = stripeSession || {}
  const order = await getOrder(strapi, s.metadata?.orderId)
  if (!order) return { ok: false, error: 'That order was not found.' }
  if (String(order.user?.id) !== String(userId) && lower(order.owner) !== lower(email)) {
    console.error('confirmPaidOrder: order of another user', { order: order.id, userId })
    return { ok: false, error: 'That order belongs to another account.' }
  }
  if (order.checkout_session && order.checkout_session !== 'tbd' && order.checkout_session !== s.id) {
    console.error('confirmPaidOrder: Stripe session does not match the order', { order: order.id })
    return { ok: false, error: 'This payment does not match the order. Please contact us.' }
  }

  const summary = async (o, expiresOn) => {
    const main = isAddOn(o) ? await getOrder(strapi, o.contract.id) : o
    const org = o.organisation?.id ? flat((await strapi(`/organisations/${o.organisation.id}`))?.data) : null
    return {
      ok: true,
      type: isAddOn(o) ? 'addSeats' : orderTypeOf(o),
      expiresOn,
      seats: orderTypeOf(o) === 'contract' ? Number(main?.seats) || 0 : null,
      addedSeats: isAddOn(o) ? Number(o.seats) || 0 : null,
      product: o.product ? { id: o.product.id, name: o.product.name, code: o.product.product_code } : null,
      organisation: publicOrg(org, true),
      totals: { total: o.total, subtotal: o.subtotal, tax: o.tax, months: o.qty_months },
    }
  }

  // A reload: already paid for this payment.
  if (order.status === 'paid' && order.checkout_session === s.id && order.expires_on) {
    return summary(order, order.expires_on)
  }
  if (s.payment_status !== 'paid') return { ok: false, error: 'The payment is not complete.' }

  const expected = Math.round(Number(order.total_monthly) * 100) * Number(order.qty_months)
  if (Number(s.amount_subtotal) !== expected) {
    console.error('confirmPaidOrder: amount does not match the order', { order: order.id, expected, paid: s.amount_subtotal })
    return { ok: false, error: 'The amount paid does not match the order. Please contact us.' }
  }

  const paid = {
    status: 'paid',
    total: s.amount_total / 100,
    subtotal: s.amount_subtotal / 100,
    tax: (s.amount_total - s.amount_subtotal) / 100,
    checkout_session: s.id,
    postalcode: s.customer_details?.address?.postal_code || '',
    notes: `Country: ${s.customer_details?.address?.country || ''} Currency: ${s.currency || ''} Metadata: ${JSON.stringify(s.metadata || {})}`,
  }

  if (isAddOn(order)) {
    const main = await getOrder(strapi, order.contract.id)
    if (!main) return { ok: false, error: 'The contract for these seats was not found. Please contact us.' }
    await putOrder(strapi, order.id, { ...paid, active_status: false, expires_on: main.expires_on })
    await putOrder(strapi, main.id, { seats: (Number(main.seats) || 0) + (Number(order.seats) || 0) })
    console.log('seats: added', { contract: main.id, added: order.seats })
    return summary({ ...order, ...paid }, main.expires_on)
  }

  // Personal or contract: today + months, or from the end of the live licence of this product.
  // Seat orders and add-ons are not the person's own licence: they never move the start date.
  const mine = (await ordersOfOwner(strapi, order.owner)).filter(o => orderTypeOf(o) !== 'seat' && !isAddOn(o))
  const expiresOn = expiresOnAfterMonths(renewalStartDate(mine, order, now), order.qty_months)
  await putOrder(strapi, order.id, { ...paid, active_status: true, expires_on: expiresOn })

  // One active licence per product. A person's seat in a company is not touched by their own purchase.
  const others = otherActiveOrdersOfProduct(mine, order)
  await Promise.all(others.map(o => putOrder(strapi, o.id, { active_status: false })))

  if (isMainContract(order) && order.organisation?.id) {
    // A renewal: the team's seats move to the new contract and its date.
    const seats = await findOrders(strapi, `filters[organisation][id][$eq]=${order.organisation.id}&filters[order_type][$eq]=seat&filters[active_status][$eq]=true`)
    const ofProduct = seats.filter(o => productOf(o.product?.product_code) === productOf(order.product?.product_code))
    await Promise.all(ofProduct.map(o => putOrder(strapi, o.id, { contract: order.id, expires_on: expiresOn })))
    if (ofProduct.length) console.log('seats: moved to renewed contract', { contract: order.id, seats: ofProduct.length })
  }
  return summary({ ...order, ...paid }, expiresOn)
}

// --- Team members: take a seat -------------------------------------------------------------------

/** The organisation's live contracts as a member sees them (on Your organisation). */
export async function contractsForMember(strapi, userId, now = new Date()) {
  const user = await getUser(strapi, userId)
  if (!user) return []
  const org = await orgOfUser(strapi, user)
  if (!org || org.org_type !== 'organisation') return []
  const contracts = await liveContracts(strapi, org.id, { now })
  return Promise.all(contracts.map(async c => {
    const seatOrders = await seatOrdersOf(strapi, c.id)
    const seats = Number(c.seats) || 0
    const used = seatsUsed(seatOrders)
    return {
      id: c.id,
      productId: c.product?.id || null,
      productName: c.product?.name || '',
      productCode: c.product?.product_code || '',
      seats, used, free: Math.max(0, seats - used),
      expiresOn: c.expires_on,
      held: lower(c.owner) === lower(user.email) ? 'buyer' : seatOrders.some(o => lower(o.owner) === lower(user.email)) ? 'seat' : '',
    }
  }))
}

/** A member of the organisation takes one seat of a contract: a free order of its product. */
export async function takeSeat(strapi, userId, contractId, now = new Date()) {
  const user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  const contract = await getOrder(strapi, contractId)
  const org = await orgOfUser(strapi, user)
  if (!contract || !isMainContract(contract) || !isLive(contract, now) || !org || String(contract.organisation?.id) !== String(org.id)) {
    return { ok: false, error: 'That contract is not available to you.' }
  }
  if (lower(contract.owner) === lower(user.email)) return { ok: false, error: 'You bought this contract: it is already your licence.' }
  const seatOrders = await seatOrdersOf(strapi, contract.id)
  if (seatOrders.some(o => lower(o.owner) === lower(user.email))) return { ok: false, error: 'You already have a seat in this contract.' }
  if (seatsUsed(seatOrders) >= (Number(contract.seats) || 0)) {
    return { ok: false, error: `${org.org_name} has no free ${contract.product?.name || ''} seats. Ask your Administrator.` }
  }
  const order = await createOrder(strapi, {
    product: contract.product.id,
    user: user.id,
    owner: user.email,
    description: `Seat in ${org.org_name}'s ${contract.product.name} contract`,
    total: 0, subtotal: 0, tax: 0, total_monthly: 0,
    qty_months: contract.qty_months,
    status: 'paid',
    active_status: true,
    checkout_session: 'seat',
    name: `${user.email} - ${contract.product.name} (seat)`,
    order_type: 'seat',
    contract: contract.id,
    organisation: org.id,
    customer_id: org.org_customer_id,
    expires_on: contract.expires_on,
  })
  console.log('seats: taken', { contract: contract.id, userId: user.id })
  return { ok: true, order: { id: order?.id, productName: contract.product.name, expiresOn: contract.expires_on } }
}
