// Copy of tbwww lib/org/orgRules.js (Phase 3, 15 Nov 2026). Keep the two the same; only the import paths differ.
// lib/org/orgRules.js — Organisations and shared Customer IDs (plan: "Plan: Organisations and shared
// Customer IDs", Jim, 12 Nov 2026). Server only: uses node:crypto. No Strapi code: everything here runs
// in tbwww and talks to Strapi with STRAPI_ADMIN_TOKEN through the `strapi` function it is given.
//
// - Customer ID: "TB-" + 10 Crockford base32 characters, made here. It is unique because the Strapi
//   Organisation table marks org_customer_id unique; users keep a plain, shared copy in customer_id.
// - Join code: 16 Crockford characters in four groups (80 bits), passed around by email by the
//   organisation's Administrator. Members paste it once.
import { randomBytes } from 'node:crypto'

// Crockford base32: no I, L, O or U, so codes read back without mistakes.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export function randomChars(n) {
  const bytes = randomBytes(n)
  let out = ''
  for (let i = 0; i < n; i++) out += ALPHABET[bytes[i] & 31] // 256 / 32 = 8, so no bias
  return out
}

export const makeCustomerId = () => `TB-${randomChars(10)}`

export const makeJoinCode = () => randomChars(16).match(/.{4}/g).join('-')

// What a person pastes: any case, spaces, missing dashes, O for 0, I/L for 1. Returns the stored form
// (XXXX-XXXX-XXXX-XXXX) or null when it can't be a join code.
export function normaliseJoinCode(input) {
  if (typeof input !== 'string') return null
  const raw = input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1')
  if (raw.length !== 16 || [...raw].some(c => !ALPHABET.includes(c))) return null
  return raw.match(/.{4}/g).join('-')
}

export const cleanName = s => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, 100) : '')

// --- Wrong-code limit ---------------------------------------------------------------------------
// At most MAX_FAILS wrong join codes per key (user id, and separately IP) in WINDOW_MS; after that the
// key waits until the window ends. In memory: right for one tbwww container.
export const MAX_FAILS = 5
export const WINDOW_MS = 15 * 60 * 1000

export function createLimiter({ max = MAX_FAILS, windowMs = WINDOW_MS, now = () => Date.now() } = {}) {
  const fails = new Map() // key -> { count, since }
  const entry = key => {
    const e = fails.get(key)
    if (e && now() - e.since >= windowMs) { fails.delete(key); return null }
    return e || null
  }
  return {
    // minutes to wait, or 0 when this key may try
    blockedFor(keys) {
      let ms = 0
      for (const k of keys.filter(Boolean)) {
        const e = entry(k)
        if (e && e.count >= max) ms = Math.max(ms, windowMs - (now() - e.since))
      }
      return ms > 0 ? Math.ceil(ms / 60000) : 0
    },
    fail(keys) {
      for (const k of keys.filter(Boolean)) {
        const e = entry(k)
        if (e) e.count++
        else fails.set(k, { count: 1, since: now() })
      }
    },
    clear(keys) { for (const k of keys.filter(Boolean)) fails.delete(k) },
  }
}

// --- Strapi steps -------------------------------------------------------------------------------
// `strapi(path, init)` returns parsed JSON or throws an Error with `.status` (see orgActions' helper).
// Strapi v4 REST: collection rows are { id, attributes }; users-permissions rows are flat.

const flat = row => (row ? { ...(row.attributes || row), id: row.id } : null)

const publicOrg = (org, { withCode = false } = {}) => org && ({
  id: org.id,
  name: org.org_name,
  customerId: org.org_customer_id,
  type: org.org_type,
  joinEnabled: org.org_join_enabled !== false,
  ...(withCode ? { joinCode: org.org_join_code || '' } : {}),
})

export async function getUser(strapi, userId) {
  return strapi(`/users/${encodeURIComponent(userId)}?populate=organisation`)
}

/**
 * People linked to an organisation. Strapi 4.14 /users/count does not take `filters` (it hands the query
 * to the database as it is and answers 500), so the users are listed with only their id and counted.
 */
export async function countOrgUsers(strapi, orgId) {
  const users = await strapi(`/users?filters[organisation][id][$eq]=${encodeURIComponent(orgId)}&fields[0]=id`)
  return Array.isArray(users) ? users.length : 0
}

async function findOrgByCustomerId(strapi, customerId) {
  const res = await strapi(`/organisations?filters[org_customer_id][$eq]=${encodeURIComponent(customerId)}`)
  return flat(res?.data?.[0])
}

async function findOrgByJoinCode(strapi, code) {
  const res = await strapi(`/organisations?filters[org_join_code][$eq]=${encodeURIComponent(code)}`)
  return flat(res?.data?.[0])
}

/**
 * Records that do not agree (set by hand, or by an older process). Returns a message for the person and
 * for support, naming the values to fix, or null when the account is consistent.
 */
export async function accountDataProblem(strapi, user) {
  if (!user) return null
  const who = user.email || `user ${user.id}`
  const linked = user.organisation ? flat(user.organisation) : null
  const end = ' Please contact support and quote this message.'
  if (user.customer_id && !linked) {
    const byId = await findOrgByCustomerId(strapi, user.customer_id).catch(() => null)
    if (!byId) {
      return `Account data problem: ${who} has Customer ID ${user.customer_id}, but no organisation has that Customer ID.`
        + ` Support: add an Organisation with org_customer_id ${user.customer_id} and link the user to it, or clear the user's customer_id.${end}`
    }
    return null
  }
  if (linked && !user.customer_id) {
    return `Account data problem: ${who} is linked to the organisation "${linked.org_name}" (${linked.org_customer_id || 'no Customer ID'}), but has no Customer ID.`
      + ` Support: set the user's customer_id to ${linked.org_customer_id || "the organisation's Customer ID"}.${end}`
  }
  if (linked && user.customer_id && linked.org_customer_id && linked.org_customer_id !== user.customer_id) {
    return `Account data problem: ${who} has Customer ID ${user.customer_id}, but is linked to the organisation "${linked.org_name}" (${linked.org_customer_id}).`
      + ` Support: make the user's customer_id and organisation agree.${end}`
  }
  return null
}

/** The signed-in user's organisation, for the page. Administrators also get the join code. */
export async function myOrganisation(strapi, userId) {
  const user = await getUser(strapi, userId)
  const customerId = user?.customer_id || null
  let org = user?.organisation ? flat(user.organisation) : null
  // Set up by hand with only customer_id: find the organisation by its Customer ID.
  if (!org && customerId) org = await findOrgByCustomerId(strapi, customerId).catch(() => null)
  const isAdmin = String(user?.primary_role || '').trim().toLowerCase() === 'administrator'
  return {
    customerId,
    role: user?.primary_role || '',
    organisation: publicOrg(org, { withCode: isAdmin }),
    problem: await accountDataProblem(strapi, user),
  }
}

/** "Just me" or "Start a company". The caller becomes the organisation's Administrator. */
export async function createOrganisation(strapi, userId, { name, type }) {
  const user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  if (user.customer_id) {
    return { ok: false, error: (await accountDataProblem(strapi, user)) || `Your account already belongs to an organisation (Customer ID ${user.customer_id}).` }
  }

  const orgType = type === 'individual' ? 'individual' : 'organisation'
  const orgName = cleanName(name) || (orgType === 'individual' ? cleanName(user.username) : '')
  if (!orgName) return { ok: false, error: 'Please enter your company name.' }

  let org = null
  for (let attempt = 0; attempt < 5 && !org; attempt++) {
    const data = {
      org_name: orgName,
      org_customer_id: makeCustomerId(),
      org_type: orgType,
      org_status: 'active',
      org_join_code: makeJoinCode(),
      org_join_code_changed_at: new Date().toISOString(),
      org_join_enabled: true,
      org_created_via: 'signup',
      org_owner: user.id,
    }
    try {
      org = flat((await strapi('/organisations', { method: 'POST', body: JSON.stringify({ data }) }))?.data)
    } catch (e) {
      // 400 "must be unique": a Customer ID or join code already exists (very unlikely). Try new ones.
      if (e.status !== 400 || !/unique/i.test(e.message)) throw e
    }
  }
  if (!org) return { ok: false, error: 'Could not create the organisation. Please try again.' }

  // The Customer ID and the link to the organisation are written together, in one call: a user is never
  // linked to an organisation without its Customer ID (another tab reading in between saw that).
  try {
    await strapi(`/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({ customer_id: org.org_customer_id, primary_role: 'Administrator', organisation: org.id }),
    })
  } catch (e) {
    // Don't leave an organisation nobody is in.
    await strapi(`/organisations/${org.id}`, { method: 'DELETE' }).catch(() => {})
    throw e
  }
  return { ok: true, organisation: publicOrg(org, { withCode: true }), customerId: org.org_customer_id }
}

// Everyone gets their own (individual) organisation at first sign-in, so a person joining their company
// is usually in one. They may leave it for a company while nobody else is in it.
async function onlyInOwnIndividualOrg(strapi, user) {
  const own = user.organisation ? flat(user.organisation) : await findOrgByCustomerId(strapi, user.customer_id).catch(() => null)
  if (!own || own.org_type !== 'individual' || own.org_customer_id !== user.customer_id) return false
  return await countOrgUsers(strapi, own.id) <= 1
}

/**
 * "Join my company" (first time) and "Change company" (already in one). The caller becomes a Team Member.
 * limiter / keys: the wrong-code limit, keyed by user id and IP.
 */
export async function joinOrganisation(strapi, userId, input, { limiter, keys = [], allowChange = false } = {}) {
  const wait = limiter?.blockedFor(keys) || 0
  if (wait) return { ok: false, error: `Too many wrong codes. Please try again in ${wait} minute${wait === 1 ? '' : 's'}.` }

  const user = await getUser(strapi, userId)
  if (!user) return { ok: false, error: 'Your account was not found. Please sign in again.' }
  const fromOwnIndividual = !!user.customer_id && await onlyInOwnIndividualOrg(strapi, user)
  if (user.customer_id && !allowChange && !fromOwnIndividual) {
    const problem = await accountDataProblem(strapi, user)
    if (problem) return { ok: false, error: problem }
    const own = user.organisation ? flat(user.organisation) : null
    return { ok: false, error: `Your account already belongs to ${own?.org_name ? `"${own.org_name}"` : 'an organisation'} (Customer ID ${user.customer_id}). Contact support to move to another company.` }
  }

  const code = normaliseJoinCode(input)
  const org = code ? await findOrgByJoinCode(strapi, code) : null
  const usable = org && org.org_join_enabled !== false && org.org_status !== 'suspended'
  if (!usable) {
    limiter?.fail(keys)
    console.warn('organisation: join code not accepted', { userId: user.id })
    return { ok: false, error: 'That code was not recognised. Check it with your Administrator.' }
  }
  limiter?.clear(keys)

  if (user.customer_id === org.org_customer_id) {
    return { ok: false, error: `You are already in ${org.org_name}.` }
  }

  const limit = Number(org.org_seat_limit)
  if (Number.isInteger(limit) && limit > 0) {
    const count = await countOrgUsers(strapi, org.id)
    if (count >= limit) return { ok: false, error: `${org.org_name} has no free seats. Ask your Administrator.` }
  }

  await strapi(`/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify({ customer_id: org.org_customer_id, primary_role: '', organisation: org.id }),
  })
  console.log('organisation: user joined', { userId: user.id, org: org.id, from: user.customer_id || '' })

  // Joining gives the company's Customer ID directly (Jim, 15 Nov 2026): the person's own individual
  // organisation, made at sign-in and never used (nobody else in it, no orders), is removed.
  let removed = false
  if (fromOwnIndividual) {
    const own = user.organisation ? flat(user.organisation) : await findOrgByCustomerId(strapi, user.customer_id).catch(() => null)
    const orders = await strapi(`/orders?filters[customer_id][$eq]=${encodeURIComponent(user.customer_id)}&pagination[pageSize]=1`).catch(() => null)
    if (own && Array.isArray(orders?.data) && orders.data.length === 0) {
      await strapi(`/organisations/${own.id}`, { method: 'DELETE' }).then(() => { removed = true }).catch(e => console.error('organisation: could not remove unused individual organisation', own.id, e.message))
    }
  }
  return { ok: true, organisation: publicOrg(org), customerId: org.org_customer_id, previousCustomerId: removed ? null : user.customer_id || null }
}
