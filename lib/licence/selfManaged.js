// lib/licence/selfManaged.js — Phase 3 (Jim, 15 Nov 2026): licences without tbwww, for owners of the
// container, own-the-code and air-gapped installs. Plan: "Plan: Enterprise seats (Phase 2) and
// self-managed licences (Phase 3)".
//
// The records are the Phase 2 ones (lib/orders/seatRules.js): an organisation, one contract order with
// `seats` (its Administrator's own seat included) and one free seat order per member. tbrunp and the
// helpapp licence checks read them unchanged.
//
//   LICENSING_MODE=sales (default, Timebars Ltd.): contracts come only from the tbwww buy flow.
//   LICENSING_MODE=self-managed: a licence manager (LICENCE_MANAGERS + Strapi Administrator) also sets
//     up organisations and contracts here, with no payment.
// In both modes an organisation's Administrator can make accounts for their people from the resource
// pool, give them seats, and set a new one-time password.
//
// Server only. Every call goes through the `strapi` function it is given (lib/strapiAdmin.js with
// STRAPI_ADMIN_TOKEN in the app, a fake in tests/licence-self-managed.mjs). Users never write their own
// Strapi record and no order is written with a user's login.
import { getUser, createOrganisation, makeJoinCode, cleanName, randomChars, accountDataProblem } from '../org/orgRules.js'
import { getOrder, getProduct, liveContracts, seatOrdersOf, seatsUsed, flatOrder, isEnterpriseProduct, MIN_SEATS, MAX_SEATS } from '../orders/seatRules.js'
import { otherActiveOrdersOfProduct } from '../orders/licenseOrders.js'
import { licenseStatus, parseExpiresOn } from '../license/expiry.js'

const lower = s => String(s || '').trim().toLowerCase()
const isAdministrator = u => lower(u?.primary_role) === 'administrator'
const int = v => (Number.isInteger(Number(v)) && String(v).trim() !== '' ? Number(v) : NaN)
const flat = row => (row ? { ...(row.attributes || row), id: row.id } : null)
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const longDate = d => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- Settings ----------------------------------------------------------------------------------------

/** 'self-managed' or 'sales' (anything else, or unset). */
export const licensingMode = (env = process.env) =>
  lower(env.LICENSING_MODE) === 'self-managed' ? 'self-managed' : 'sales'

/** Emails in LICENCE_MANAGERS (comma separated). Empty = nobody. */
export const licenceManagers = (env = process.env) =>
  String(env.LICENCE_MANAGERS || '').split(',').map(lower).filter(Boolean)

/** A licence manager: self-managed mode, email listed, and Administrator in Strapi. */
export function isLicenceManager(user, env = process.env) {
  return licensingMode(env) === 'self-managed' && !!user?.email
    && licenceManagers(env).includes(lower(user.email)) && isAdministrator(user)
}

/** 14 characters a person can read out and type: no I, L, O or U. They change it after signing in. */
export const makeOneTimePassword = () => `${randomChars(4)}-${randomChars(4)}-${randomChars(4)}`

// --- Strapi helpers ---------------------------------------------------------------------------------

async function userByEmail(strapi, email) {
  const rows = await strapi(`/users?filters[email][$eqi]=${encodeURIComponent(lower(email))}&populate=organisation`)
  return Array.isArray(rows) && rows[0] ? rows[0] : null
}

async function orgById(strapi, id) {
  if (!int(id)) return null
  return flat((await strapi(`/organisations/${int(id)}`).catch(e => { if (e.status === 404) return null; throw e }))?.data)
}

/** The user's organisation (relation first, then by Customer ID when set by hand). */
async function orgOfUser(strapi, user) {
  if (user?.organisation) return flat(user.organisation)
  if (!user?.customer_id) return null
  return flat((await strapi(`/organisations?filters[org_customer_id][$eq]=${encodeURIComponent(user.customer_id)}`))?.data?.[0])
}

const membersOf = (strapi, orgId) =>
  strapi(`/users?filters[organisation][id][$eq]=${int(orgId)}&sort=username:asc&pagination[pageSize]=1000`).then(r => r || [])

/**
 * The id of the users-permissions role new accounts get ("Authenticated"). Strapi's POST /users refuses
 * a body without a role ("role must be a defined value"), even though it has a default role.
 */
async function authenticatedRoleId(strapi) {
  const r = await strapi('/users-permissions/roles')
  const roles = r?.roles || []
  const role = roles.find(x => x.type === 'authenticated') || roles.find(x => /^authenticated$/i.test(x.name || ''))
  if (!role) throw Object.assign(new Error('Strapi has no Authenticated role (users-permissions)'), { status: 500 })
  return role.id
}

const usernameTaken = async (strapi, username) =>
  ((await strapi(`/users?filters[username][$eqi]=${encodeURIComponent(username)}&pagination[pageSize]=1`)) || []).length > 0

/**
 * A new Strapi account, confirmed, with a one-time password, in the Authenticated role. Made with the
 * server token, then given its Customer ID, organisation and role in a second call (Strapi's create only
 * takes the core fields). Username: the person's name, or the email when that name is taken (the email
 * is new, so it is free). Strapi only checks a taken username itself when no email is sent.
 */
async function createAccount(strapi, { email, name }) {
  const password = makeOneTimePassword()
  const mail = lower(email)
  const named = cleanName(name)
  const username = named && named.length >= 3 && !(await usernameTaken(strapi, named)) ? named : mail
  const role = await authenticatedRoleId(strapi)
  const user = await strapi('/users', { method: 'POST', body: JSON.stringify({ username, email: mail, password, role, confirmed: true, blocked: false }) })
  return { user, password }
}

const putUser = (strapi, id, data) => strapi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
const putOrder = (strapi, id, data) => strapi(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ data }) })
const postOrder = async (strapi, data) => flatOrder((await strapi('/orders', { method: 'POST', body: JSON.stringify({ data }) }))?.data)

/** A contract and its seat count, as the pages show it. */
async function contractRow(strapi, c) {
  const seatOrders = await seatOrdersOf(strapi, c.id)
  const seats = Number(c.seats) || 0
  const used = seatsUsed(seatOrders)
  return {
    id: c.id, productId: c.product?.id || null, productName: c.product?.name || '', productCode: c.product?.product_code || '',
    seats, used, free: Math.max(0, seats - used), expiresOn: c.expires_on, owner: c.owner || '',
    selfManaged: c.checkout_session === 'self-managed',
    holders: [lower(c.owner), ...seatOrders.map(o => lower(o.owner))].filter(Boolean),
  }
}

// --- Licence manager (self-managed only) -----------------------------------------------------------

/** Companies on this server with their Administrator and live contracts, and the Enterprise products. */
export async function managerOverview(strapi, now = new Date()) {
  const orgs = ((await strapi('/organisations?filters[org_type][$eq]=organisation&pagination[pageSize]=500'))?.data || []).map(flat)
  const products = ((await strapi('/products?pagination[pageSize]=200'))?.data || []).map(flat).filter(isEnterpriseProduct)
  const rows = await Promise.all(orgs.map(async org => {
    const members = await membersOf(strapi, org.id)
    const admin = members.find(isAdministrator)
    const contracts = await Promise.all((await liveContracts(strapi, org.id, { now })).map(c => contractRow(strapi, c)))
    return {
      id: org.id, name: org.org_name, customerId: org.org_customer_id, joinCode: org.org_join_code || '',
      administrator: admin?.email || '', members: members.length, contracts,
    }
  }))
  return {
    organisations: rows.sort((a, b) => a.name.localeCompare(b.name)),
    products: products.map(p => ({ id: p.id, name: p.name, code: p.product_code })),
  }
}

/**
 * Set up a company: name + its Administrator's email. A new email gets an account with a one-time
 * password (returned once). An existing person may be moved only from their own individual
 * organisation while nobody else is in it, which is upgraded in place (same Customer ID).
 */
export async function setUpOrganisation(strapi, { name, adminEmail, adminName }) {
  const orgName = cleanName(name)
  const email = lower(adminEmail)
  if (!orgName) return { ok: false, error: 'Enter the company name.' }
  if (!EMAIL.test(email)) return { ok: false, error: 'Enter the Administrator\'s email address.' }

  let user = await userByEmail(strapi, email)
  let password = null
  if (!user) {
    const made = await createAccount(strapi, { email, name: adminName })
    user = made.user
    password = made.password
  }
  user = await getUser(strapi, user.id)
  const problem = await accountDataProblem(strapi, user)
  if (problem) return { ok: false, error: problem }

  if (!user.customer_id) {
    const made = await createOrganisation(strapi, user.id, { type: 'organisation', name: orgName })
    if (!made.ok) return made
    console.log('licences: organisation set up', { org: made.organisation.id, admin: email })
    return { ok: true, organisation: made.organisation, administrator: { email, password } }
  }

  const own = await orgOfUser(strapi, user)
  const alone = own && own.org_type === 'individual' && Number(await strapi(`/users/count?filters[organisation][id][$eq]=${own.id}`)) <= 1
  if (!alone) {
    return { ok: false, error: `${email} already belongs to ${own?.org_name ? `"${own.org_name}"` : 'an organisation'} (Customer ID ${user.customer_id}). Use another email for this company.` }
  }
  const changes = { org_name: orgName, org_type: 'organisation', org_join_enabled: true }
  if (!own.org_join_code) Object.assign(changes, { org_join_code: makeJoinCode(), org_join_code_changed_at: new Date().toISOString() })
  await strapi(`/organisations/${own.id}`, { method: 'PUT', body: JSON.stringify({ data: changes }) })
  if (!isAdministrator(user)) await putUser(strapi, user.id, { primary_role: 'Administrator' })
  console.log('licences: individual organisation upgraded', { org: own.id, admin: email })
  const org = { ...own, ...changes }
  return {
    ok: true,
    organisation: { id: org.id, name: org.org_name, customerId: org.org_customer_id, type: org.org_type, joinCode: org.org_join_code },
    administrator: { email, password },
  }
}

/**
 * A contract with no payment, or a change to the live one of that product: seats and expiry date.
 * The contract is the organisation Administrator's own licence (seat 1), like a bought one.
 * Fewer seats than are in use is refused; a new date moves the members' seat orders with it.
 */
export async function saveContract(strapi, { orgId, productId, seats, expiresOn }, now = new Date()) {
  const org = await orgById(strapi, orgId)
  if (!org || org.org_type !== 'organisation') return { ok: false, error: 'That company was not found.' }
  const product = await getProduct(strapi, productId)
  if (!product || !isEnterpriseProduct(product)) return { ok: false, error: 'Choose an Enterprise (T03) product.' }
  const n = int(seats)
  if (!(n >= MIN_SEATS && n <= MAX_SEATS)) return { ok: false, error: `Seats must be a whole number from ${MIN_SEATS} to ${MAX_SEATS}.` }
  const day = parseExpiresOn(expiresOn)
  const expires = day ? longDate(day) : ''
  if (!day || licenseStatus(expires, now).state !== 'active') return { ok: false, error: 'Choose an expiry date from today on.' }
  const admin = (await membersOf(strapi, org.id)).find(isAdministrator)
  if (!admin) return { ok: false, error: `${org.org_name} has no Administrator. Set one on Users & Roles first.` }

  const [live] = await liveContracts(strapi, org.id, { productId: product.id, now })
  if (live) {
    const seatOrders = await seatOrdersOf(strapi, live.id)
    if (n < seatsUsed(seatOrders)) return { ok: false, error: `${org.org_name} already uses ${seatsUsed(seatOrders)} ${product.name} seats.` }
    await putOrder(strapi, live.id, { seats: n, expires_on: expires })
    await Promise.all(seatOrders.map(o => putOrder(strapi, o.id, { expires_on: expires })))
    console.log('licences: contract changed', { contract: live.id, seats: n, expiresOn: expires })
    return { ok: true, contract: await contractRow(strapi, { ...live, seats: n, expires_on: expires }), changed: true }
  }

  const months = Math.max(1, Math.round((day - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / (30.44 * 24 * 3600 * 1000)))
  const order = await postOrder(strapi, {
    product: product.id, user: admin.id, owner: admin.email,
    description: `${product.name}, ${n} seats, ${org.org_name} (self-managed)`,
    name: `${admin.email} - ${product.name} (${n} seats)`,
    total: 0, subtotal: 0, tax: 0, total_monthly: 0, qty_months: months,
    status: 'paid', active_status: true, checkout_session: 'self-managed',
    order_type: 'contract', seats: n, organisation: org.id, customer_id: org.org_customer_id, expires_on: expires,
  })
  // One active licence per product for the Administrator, as after a purchase.
  const theirs = (await strapi(`/orders?filters[owner][$eq]=${encodeURIComponent(admin.email)}&filters[active_status][$eq]=true&populate=*`))?.data?.map(flatOrder) || []
  const others = otherActiveOrdersOfProduct(theirs.filter(o => o.order_type !== 'seat'), { ...order, product })
  await Promise.all(others.map(o => putOrder(strapi, o.id, { active_status: false })))
  console.log('licences: contract made', { contract: order.id, org: org.id, seats: n, expiresOn: expires })
  return { ok: true, contract: await contractRow(strapi, { ...order, product }), changed: false }
}

// --- Organisation Administrator (both modes) -------------------------------------------------------

/** The Administrator's own company, or an error naming why not. */
async function adminsCompany(strapi, adminUserId) {
  const admin = await getUser(strapi, adminUserId)
  if (!admin) return { error: 'Your account was not found. Please sign in again.' }
  const problem = await accountDataProblem(strapi, admin)
  if (problem) return { error: problem }
  const org = await orgOfUser(strapi, admin)
  if (!org || org.org_type !== 'organisation') return { error: 'You are not in a company organisation. Buy an Enterprise (T03) contract first, or ask your licence manager.' }
  if (!isAdministrator(admin)) return { error: `Only the Administrator of ${org.org_name} can manage its accounts and seats.` }
  return { admin, org }
}

/** Company, live contracts and members with the seats they hold. */
export async function companyOverview(strapi, adminUserId, now = new Date()) {
  const { admin, org, error } = await adminsCompany(strapi, adminUserId)
  if (error) return { ok: false, error }
  const contracts = await Promise.all((await liveContracts(strapi, org.id, { now })).map(c => contractRow(strapi, c)))
  const members = (await membersOf(strapi, org.id)).map(u => ({
    id: u.id, username: u.username || '', email: u.email, role: u.primary_role || '',
    you: u.id === admin.id,
    seats: contracts.filter(c => c.holders.includes(lower(u.email))).map(c => c.productCode),
  }))
  return {
    ok: true,
    organisation: { id: org.id, name: org.org_name, customerId: org.org_customer_id, joinCode: org.org_join_code || '' },
    contracts: contracts.map(({ holders, ...c }) => c),
    members,
  }
}

/** What would happen to each resource pool row ({ email, name, role }). */
async function planRow(strapi, org, contracts, r, seen) {
  const email = lower(r?.email)
  if (!EMAIL.test(email)) return null
  if (seen.has(email)) return null
  seen.add(email)
  const role = isAdministrator({ primary_role: r.role }) ? '' : String(r.role || '').trim().slice(0, 60)
  const row = { email, name: cleanName(r.name), role, roleNote: role === '' && r.role ? 'Administrator not given: one Administrator per organisation' : '' }
  const user = await userByEmail(strapi, email)
  const has = contracts.filter(c => c.holders.includes(email)).map(c => c.id)
  if (!user) return { ...row, status: 'new', userId: null, has }
  const full = await getUser(strapi, user.id)
  const own = await orgOfUser(strapi, full)
  if (own && String(own.id) === String(org.id)) return { ...row, status: 'member', userId: user.id, has }
  if (!full.customer_id) return { ...row, status: 'join', userId: user.id, has }
  const alone = own && own.org_type === 'individual' && Number(await strapi(`/users/count?filters[organisation][id][$eq]=${own.id}`)) <= 1
  if (alone && !(await accountDataProblem(strapi, full))) return { ...row, status: 'join', userId: user.id, has, previousCustomerId: full.customer_id }
  return { ...row, status: 'other', userId: user.id, has, note: `In ${own?.org_name ? `"${own.org_name}"` : 'another organisation'} (${full.customer_id})` }
}

/** The licence an imported person gets unless the Administrator picks another: TBT03 when live, else the first. */
export const defaultContract = contracts => contracts.find(c => /^TBT03$/i.test(c.productCode)) || contracts[0] || null

/**
 * Accounts and seats from the resource pool (Human rows with an email), Jim 16 Nov 2026.
 * Needs a live contract: every person imported takes a seat, and nobody gets an account without one.
 * rows: [{ email, name, role, contractId }]: contractId is the licence chosen for that person (one each;
 * null or '' = skip the row). apply=false only says what would happen and gives each row its default
 * licence. apply=true makes the accounts (one-time passwords are returned once, never stored), puts
 * people in the company and gives each their seat. A row whose licence has no free seat is skipped.
 * statuses: new, join (existing account, moved in), member (already in), other (in another company: skipped).
 */
export async function accountsFromPool(strapi, adminUserId, { rows, apply = false }, now = new Date()) {
  const { admin, org, error } = await adminsCompany(strapi, adminUserId)
  if (error) return { ok: false, error }
  if (!Array.isArray(rows) || rows.length > 2000) return { ok: false, error: 'Expected a list of up to 2000 people.' }
  const live = await Promise.all((await liveContracts(strapi, org.id, { now })).map(c => contractRow(strapi, c)))
  if (!live.length) return { ok: false, error: `${org.org_name} has no live Enterprise contract. People can only be imported into seats of a contract.` }
  const byId = new Map(live.map(c => [String(c.id), c]))
  const fallback = defaultContract(live)

  const seen = new Set([lower(admin.email)])
  const plan = []
  for (const r of rows) {
    const p = await planRow(strapi, org, live, r, seen)
    if (!p) continue
    const chosen = apply ? (r.contractId ? byId.get(String(r.contractId)) : null) : fallback
    if (apply && r.contractId && !chosen) return { ok: false, error: 'A chosen licence is no longer live. Refresh the page.' }
    plan.push({ ...p, contractId: chosen?.id || null })
  }
  const contracts = live.map(({ holders, ...c }) => c)
  if (!apply) return { ok: true, rows: plan, contracts, defaultContractId: fallback.id }

  const free = new Map(live.map(c => [c.id, c.free]))
  const out = []
  for (const p of plan) {
    const c = p.contractId ? byId.get(String(p.contractId)) : null
    const row = { ...p, password: null, seats: [], noSeat: [] }
    if (p.status === 'other') { out.push(row); continue }
    if (!c) { out.push({ ...row, status: 'skipped' }); continue }
    const needsSeat = !p.has.includes(c.id)
    if (needsSeat && !(free.get(c.id) > 0)) { out.push({ ...row, status: 'skipped', noSeat: [c.productCode] }); continue }

    // One person's failure is shown on their row and the import goes on: the accounts already made
    // keep their one-time passwords on screen (they are never stored).
    try {
      let userId = p.userId
      if (p.status === 'new') {
        const made = await createAccount(strapi, { email: p.email, name: p.name })
        userId = made.user.id
        row.password = made.password
      }
      if (p.status !== 'member') {
        await putUser(strapi, userId, { customer_id: org.org_customer_id, organisation: org.id, primary_role: p.role })
        console.log('licences: account in company', { by: admin.email, user: p.email, org: org.id, was: p.status })
      } else if (p.role) {
        await putUser(strapi, userId, { primary_role: p.role })
      }
      if (needsSeat) {
        await giveSeat(strapi, org, c, { id: userId, email: p.email })
        free.set(c.id, free.get(c.id) - 1)
        row.seats.push(c.productCode)
      }
      row.status = p.status === 'new' ? 'created' : p.status === 'join' ? 'moved in' : 'already in'
    } catch (e) {
      console.error('licences: import failed for one person', { by: admin.email, user: p.email, error: e.message })
      row.status = 'failed'
      row.error = e.message
    }
    out.push(row)
  }
  return { ok: true, rows: out }
}

async function giveSeat(strapi, org, c, user) {
  const contract = await getOrder(strapi, c.id)
  return postOrder(strapi, {
    product: contract.product.id, user: user.id, owner: user.email,
    description: `Seat in ${org.org_name}'s ${contract.product.name} contract`,
    total: 0, subtotal: 0, tax: 0, total_monthly: 0, qty_months: contract.qty_months,
    status: 'paid', active_status: true, checkout_session: 'seat',
    name: `${user.email} - ${contract.product.name} (seat)`,
    order_type: 'seat', contract: contract.id, organisation: org.id, customer_id: org.org_customer_id,
    expires_on: contract.expires_on,
  })
}

/** Give or take back one member's seat in a contract. */
export async function setSeat(strapi, adminUserId, { userId, contractId, on }, now = new Date()) {
  const { org, error } = await adminsCompany(strapi, adminUserId)
  if (error) return { ok: false, error }
  const user = await getUser(strapi, userId)
  const own = user && await orgOfUser(strapi, user)
  if (!own || String(own.id) !== String(org.id)) return { ok: false, error: 'That person is not in your organisation.' }
  const [c] = (await liveContracts(strapi, org.id, { now })).filter(x => String(x.id) === String(contractId))
  if (!c) return { ok: false, error: 'That contract is not live.' }
  if (lower(c.owner) === lower(user.email)) return { ok: false, error: 'The contract is the Administrator\'s own licence.' }
  const seatOrders = await seatOrdersOf(strapi, c.id)
  const mine = seatOrders.filter(o => lower(o.owner) === lower(user.email))
  if (on) {
    if (mine.length) return { ok: true }
    if (seatsUsed(seatOrders) >= (Number(c.seats) || 0)) return { ok: false, error: `No free ${c.product?.name || ''} seats.` }
    await giveSeat(strapi, org, await contractRow(strapi, c), { id: user.id, email: user.email })
  } else {
    await Promise.all(mine.map(o => putOrder(strapi, o.id, { active_status: false })))
  }
  console.log('licences: seat', { contract: c.id, user: user.email, on: !!on })
  return { ok: true }
}

/** A new one-time password for a member (no email needed). Returned once, never stored. */
export async function newOneTimePassword(strapi, adminUserId, userId) {
  const { admin, org, error } = await adminsCompany(strapi, adminUserId)
  if (error) return { ok: false, error }
  if (String(userId) === String(admin.id)) return { ok: false, error: 'Change your own password on Change password.' }
  const user = await getUser(strapi, userId)
  const own = user && await orgOfUser(strapi, user)
  if (!own || String(own.id) !== String(org.id)) return { ok: false, error: 'That person is not in your organisation.' }
  const password = makeOneTimePassword()
  await putUser(strapi, user.id, { password })
  console.log('licences: one-time password set', { by: admin.email, user: user.email })
  return { ok: true, email: user.email, password }
}
