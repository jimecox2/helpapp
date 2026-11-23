// Copy of tbwww lib/orders/seatRules.js (synced 23 Nov 2026). Keep the two the same; only the import paths differ.
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

export { MIN_SEATS, MAX_SEATS, MAX_MONTHS, isEnterpriseProduct, ENTERPRISE_SELLER_CODE, sellsEnterprise, BUNDLE_CODES, priceEnterprise, seatPrice, orderTypeOf, isAddOn, isMainContract, monthsLeft, priceCheckout } from './seatPrice.js'
import { orderTypeOf, isAddOn, isMainContract, monthsLeft, priceCheckout, priceEnterprise, sellsEnterprise, ENTERPRISE_SELLER_CODE, BUNDLE_CODES } from './seatPrice.js'

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

/** The id of the product that sells Enterprise contracts (CBT03), for links from the other T03 pages. */
export async function enterpriseSellerId(strapi) {
  const r = await strapi(`/products?filters[product_code][$eq]=${ENTERPRISE_SELLER_CODE}&fields[0]=product_code`)
  return r?.data?.[0]?.id || null
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

/** The products one Enterprise order buys seats of (CBT03, TBT03, ABT03), those that exist, in that order. */
export async function bundleProducts(strapi) {
  const rows = await Promise.all(BUNDLE_CODES.map(code =>
    strapi(`/products?filters[product_code][$eq]=${code}`).then(r => flat(r?.data?.[0]))))
  return rows.filter(Boolean)
}

const publicProduct = p => ({ id: p.id, product_code: p.product_code, name: p.name, price: p.price, discount_price: p.discount_price || null })

/**
 * The company's live contracts by product code ({ id, seats, used, expiresOn }) and the date they end. One date
 * per company (Jim, 18 Nov 2026): every Enterprise order makes or renews its contracts to the same day.
 */
export async function companyContracts(strapi, org, now = new Date()) {
  const contracts = org && org.org_type === 'organisation' ? await liveContracts(strapi, org.id, { now }) : []
  const live = {}
  let companyExpiry = null
  for (const c of contracts) {
    const code = String(c.product?.product_code || '').toUpperCase()
    if (!BUNDLE_CODES.includes(code) || live[code]) continue
    live[code] = { id: c.id, seats: Number(c.seats) || 0, used: seatsUsed(await seatOrdersOf(strapi, c.id)), expiresOn: c.expires_on }
    companyExpiry = companyExpiry || c.expires_on // newest first
  }
  return { live, companyExpiry }
}

/** The company that already gives this person `product` (as the buyer of its contract or a seat), or null. */
async function companyLicenceOf(strapi, user, product, now) {
  const org = await orgOfUser(strapi, user)
  if (!org || org.org_type !== 'organisation') return null
  for (const c of await liveContracts(strapi, org.id, { productId: product.id, now })) {
    if (lower(c.owner) === lower(user.email)) return org.org_name
    if ((await seatOrdersOf(strapi, c.id)).some(o => lower(o.owner) === lower(user.email))) return org.org_name
  }
  return null
}

// --- What the checkout page shows ----------------------------------------------------------------

/**
 * Everything the checkout page needs to offer the right Enterprise step, for the signed-in user.
 * Enterprise is bought on CBT03 only (Jim, 18 Nov 2026), for seats of CBT03, TBT03 and ABT03 at once.
 * mode: 'new' (no company yet: asks for the company name), 'buy' (the Administrator's company, no live
 * contract), 'manage' (live contracts: renew or add seats), 'member' (a Team Member: cannot buy),
 * 'elsewhere' (any other product: `sellerId` is CBT03's id).
 */
export async function enterpriseOptions(strapi, userId, productId, now = new Date()) {
  const user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  const problem = await accountDataProblem(strapi, user)
  if (problem) return { ok: false, error: problem }
  const org = await orgOfUser(strapi, user)
  const company = org && org.org_type === 'organisation'
  if (company && !isAdministrator(user)) return { ok: true, mode: 'member', org: publicOrg(org, false) }
  const product = await getProduct(strapi, productId)
  if (!sellsEnterprise(product)) return { ok: true, mode: 'elsewhere', org: publicOrg(org, false), sellerId: await enterpriseSellerId(strapi) }
  const products = (await bundleProducts(strapi)).map(publicProduct)
  if (!company) return { ok: true, mode: 'new', org: publicOrg(org, false), products }
  const { live, companyExpiry } = await companyContracts(strapi, org, now)
  if (!Object.keys(live).length) return { ok: true, mode: 'buy', org: publicOrg(org, false), products }
  return { ok: true, mode: 'manage', org: publicOrg(org, false), products, live, companyExpiry, monthsLeft: monthsLeft(companyExpiry, now) }
}

// --- Start a checkout: makes the unpaid order(s) -------------------------------------------------

/**
 * @param {{ productId, kind: 'personal'|'enterprise', months?, plan?: 'buy'|'renew'|'add', seats?: {code: n},
 *   companyName? }} input
 * @returns {{ ok: true, orders, lines, plan, companyExpiry } | { ok: false, error }}
 *   lines: what Stripe charges, one per order ({ name, description, totalMonthly, qtyMonths }).
 */
export async function startOrder(strapi, userId, input, now = new Date()) {
  const { productId, kind } = input || {}
  let user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  const product = await getProduct(strapi, productId)
  if (!product) return { ok: false, error: 'That product was not found.' }

  const base = {
    user: user.id,
    owner: user.email,
    total: 0,
    status: 'unpaid',
    active_status: false,
    checkout_session: 'tbd',
  }

  if (kind === 'personal') {
    // Someone who has this product through their company does not buy it again (Jim, 18 Nov 2026).
    const held = await companyLicenceOf(strapi, user, product, now)
    if (held) return { ok: false, error: `You already have ${product.name} through ${held}. You do not need to buy it.` }
    // Every licence holder has a Customer ID: make the person's own (individual) organisation if needed.
    if (!user.customer_id) {
      const made = await createOrganisation(strapi, user.id, { type: 'individual' })
      if (!made.ok) return made
      user = await getUser(strapi, userId)
    }
    const price = priceCheckout({ kind, product, months: input.months, now })
    if (!price.ok) return price
    const order = await createOrder(strapi, {
      ...base, product: product.id, description: product.subscription_description || product.name,
      name: `${user.email} - ${product.name}`, order_type: 'personal', customer_id: user.customer_id,
      total_monthly: price.totalMonthly, qty_months: price.qtyMonths,
    })
    return { ok: true, orders: [order], lines: [{ ...price.line, totalMonthly: price.totalMonthly, qtyMonths: price.qtyMonths }], plan: null, companyExpiry: null }
  }

  if (kind !== 'enterprise') return { ok: false, error: 'Unknown kind of order.' }
  if (!sellsEnterprise(product)) return { ok: false, error: `Enterprise, multi-user licences are bought on Costbars Enterprise (${ENTERPRISE_SELLER_CODE}).` }

  // The buyer's organisation: one organisation, one Administrator (Jim, 14 Nov 2026).
  const problem = await accountDataProblem(strapi, user)
  if (problem) return { ok: false, error: problem }
  let org = await orgOfUser(strapi, user)
  const company = org && org.org_type === 'organisation'
  if (company && !isAdministrator(user)) {
    return { ok: false, error: `Only the Administrator of ${org.org_name} can buy seats. You can take a seat on Your organisation.` }
  }
  const name = company ? org.org_name : cleanName(input.companyName)
  if (!name) return { ok: false, error: 'Please enter your company name.' }

  // Priced before anything is written: a refused order makes no organisation.
  const { live, companyExpiry } = await companyContracts(strapi, company ? org : null, now)
  const plan = Object.keys(live).length ? input.plan : 'buy'
  const quote = priceEnterprise({ plan, products: await bundleProducts(strapi), seats: input.seats, months: input.months, live, companyExpiry, orgName: name, now })
  if (!quote.ok) return quote

  if (!company) {
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

  const orders = []
  for (const l of quote.lines) {
    orders.push(await createOrder(strapi, {
      ...base, product: l.productId, description: l.description, order_type: 'contract',
      customer_id: org.org_customer_id, organisation: org.id,
      seats: l.seats, total_monthly: l.totalMonthly, qty_months: l.qtyMonths,
      ...(l.kind === 'addOn' ? { contract: l.contractId } : {}),
      name: `${user.email} - ${l.productName} (${l.kind === 'addOn' ? `add ${l.seats} seats` : `${l.seats} seats`})`,
    }))
  }
  return { ok: true, orders, lines: quote.lines, plan, companyExpiry, months: quote.months }
}

async function createOrder(strapi, data) {
  return flatOrder((await strapi('/orders', { method: 'POST', body: JSON.stringify({ data }) }))?.data)
}

const putOrder = (strapi, id, data) => strapi(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ data }) })

/** Saves Stripe's session id on the unpaid order, so the confirmation can check it is the same payment. */
export const setCheckoutSession = (strapi, orderId, sessionId) => putOrder(strapi, orderId, { checkout_session: sessionId })

// --- After payment ----------------------------------------------------------------------------------

const paymentIntentId = s => (typeof s?.payment_intent === 'string' ? s.payment_intent : s?.payment_intent?.id || '')

/** What the confirmation page shows, for paid orders (also on a reload). */
async function confirmationSummary(strapi, orders, plan) {
  const first = orders[0]
  const org = first.organisation?.id ? flat((await strapi(`/organisations/${first.organisation.id}`))?.data) : null
  const lines = []
  for (const o of orders) {
    const main = isAddOn(o) ? await getOrder(strapi, o.contract.id) : o
    lines.push({
      kind: isAddOn(o) ? 'addOn' : orderTypeOf(o),
      product: o.product ? { id: o.product.id, name: o.product.name, code: o.product.product_code } : null,
      seats: orderTypeOf(o) === 'contract' ? Number(main?.seats) || 0 : null,
      addedSeats: isAddOn(o) ? Number(o.seats) || 0 : null,
      months: Number(o.qty_months) || 0,
      expiresOn: isAddOn(o) ? main?.expires_on : o.expires_on,
    })
  }
  return {
    ok: true,
    type: orderTypeOf(first) === 'personal' ? 'personal' : 'enterprise',
    plan: plan || null,
    expiresOn: lines[0]?.expiresOn || null,
    lines,
    organisation: orderTypeOf(first) === 'contract' ? publicOrg(org, true) : null,
    orderIds: orders.map(o => o.id),
  }
}

/**
 * Order confirmation (success_url). Checks the payment really is for this user's order(s) and for the amount
 * the server priced, then makes the licences. One Stripe payment can hold up to three Enterprise orders
 * (metadata.orderIds). A reload of the page changes nothing.
 * @param {{ id, payment_status, payment_intent, amount_total, amount_subtotal, currency, customer_details, metadata }} stripeSession
 * @returns {{ ok: true, type: 'personal'|'enterprise', plan, expiresOn, lines, organisation } | { ok: false, error }}
 */
export async function confirmPaidOrder(strapi, { userId, email }, stripeSession, now = new Date()) {
  const s = stripeSession || {}
  const md = s.metadata || {}
  const ids = String(md.orderIds || md.orderId || '').split(',').map(x => x.trim()).filter(Boolean)
  const orders = await Promise.all(ids.map(id => getOrder(strapi, id)))
  if (!orders.length || orders.some(o => !o)) return { ok: false, error: 'That order was not found.' }
  for (const order of orders) {
    if (String(order.user?.id) !== String(userId) && lower(order.owner) !== lower(email)) {
      console.error('confirmPaidOrder: order of another user', { order: order.id, userId })
      return { ok: false, error: 'That order belongs to another account.' }
    }
    if (order.checkout_session && order.checkout_session !== 'tbd' && order.checkout_session !== s.id) {
      console.error('confirmPaidOrder: Stripe session does not match the order', { order: order.id })
      return { ok: false, error: 'This payment does not match the order. Please contact us.' }
    }
  }
  const plan = md.plan || null

  // A reload: already paid for this payment.
  if (orders.every(o => o.status === 'paid' && o.checkout_session === s.id && o.expires_on)) {
    return confirmationSummary(strapi, orders, plan)
  }
  if (s.payment_status !== 'paid') return { ok: false, error: 'The payment is not complete.' }

  const cost = o => Math.round(Number(o.total_monthly) * 100) * Number(o.qty_months)
  const expected = orders.reduce((t, o) => t + cost(o), 0)
  if (Number(s.amount_subtotal) !== expected) {
    console.error('confirmPaidOrder: amount does not match the order', { orders: ids, expected, paid: s.amount_subtotal })
    return { ok: false, error: 'The amount paid does not match the order. Please contact us.' }
  }

  // The tax of the one payment, shared by each order's part of the subtotal (the last takes the rounding).
  const tax = Number(s.amount_total) - Number(s.amount_subtotal)
  let taxLeft = tax
  const paidOf = (o, i) => {
    const t = i === orders.length - 1 ? taxLeft : Math.round(tax * cost(o) / (expected || 1))
    taxLeft -= t
    return {
      status: 'paid',
      total: (cost(o) + t) / 100,
      subtotal: cost(o) / 100,
      tax: t / 100,
      checkout_session: s.id,
      postalcode: s.customer_details?.address?.postal_code || '',
      notes: `Country: ${s.customer_details?.address?.country || ''} Currency: ${s.currency || ''} Metadata: ${JSON.stringify(md)}`,
    }
  }

  // One date per company (Jim, 18 Nov 2026): buy = today + months; renew = the company's expiry + months
  // (a product new in the renewal too); add = the company's expiry.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const baseDay = licenseStatus(md.baseExpiry, now).expiresOn
  const contractExpiry = plan === 'buy' ? expiresOnAfterMonths(today, md.months)
    : plan === 'renew' && baseDay ? expiresOnAfterMonths(baseDay, md.months)
      : plan === 'add' ? md.baseExpiry : null

  const done = []
  for (const [i, order] of orders.entries()) {
    const paid = paidOf(order, i)
    if (isAddOn(order)) {
      const main = await getOrder(strapi, order.contract.id)
      if (!main) return { ok: false, error: 'The contract for these seats was not found. Please contact us.' }
      await putOrder(strapi, order.id, { ...paid, active_status: false, expires_on: main.expires_on })
      await putOrder(strapi, main.id, { seats: (Number(main.seats) || 0) + (Number(order.seats) || 0) })
      console.log('seats: added', { contract: main.id, added: order.seats })
      done.push({ ...order, ...paid, expires_on: main.expires_on })
      continue
    }
    // A personal licence: today + months, or from the end of the live licence of this product. Seat orders and
    // add-ons are not the person's own licence: they never move the start date.
    const mine = (await ordersOfOwner(strapi, order.owner)).filter(o => orderTypeOf(o) !== 'seat' && !isAddOn(o))
    const expiresOn = isMainContract(order) && contractExpiry
      ? contractExpiry
      : expiresOnAfterMonths(renewalStartDate(mine, order, now), order.qty_months)
    await putOrder(strapi, order.id, { ...paid, active_status: true, expires_on: expiresOn })

    // One active licence per product. A person's seat in a company is not touched by their own purchase.
    const others = otherActiveOrdersOfProduct(mine, order)
    await Promise.all(others.map(o => putOrder(strapi, o.id, { active_status: false })))

    if (isMainContract(order) && order.organisation?.id) {
      // A renewal: the team's seats of this product move to the new contract and its date.
      const seats = await findOrders(strapi, `filters[organisation][id][$eq]=${order.organisation.id}&filters[order_type][$eq]=seat&filters[active_status][$eq]=true`)
      const ofProduct = seats.filter(o => productOf(o.product?.product_code) === productOf(order.product?.product_code))
      await Promise.all(ofProduct.map(o => putOrder(strapi, o.id, { contract: order.id, expires_on: expiresOn })))
      if (ofProduct.length) console.log('seats: moved to renewed contract', { contract: order.id, seats: ofProduct.length })
    }
    done.push({ ...order, ...paid, active_status: true, expires_on: expiresOn })
  }

  // Stripe's payment id (pi_...) on each order, to find them from the Stripe Payments list. Its own call, so a
  // Strapi without the stripe_payment_id field still confirms the order.
  const pi = paymentIntentId(s)
  if (pi) {
    await Promise.all(orders.map(o => putOrder(strapi, o.id, { stripe_payment_id: pi }).catch(e =>
      console.error('confirmPaidOrder: could not save stripe_payment_id (add the Text field to Order in Strapi)', e.message))))
  }
  return confirmationSummary(strapi, done, plan)
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
