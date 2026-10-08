'use server'

// Dashboard-source writes that need more than the user's own Strapi rights.
// tbwww did these from the browser with the full-access admin token, which put the token in the
// public JS bundle. Here the token stays on the server (STRAPI_ADMIN_TOKEN) and every action
// checks the caller's session and role first.

import { auth } from '@/auth/auth'
import { API_URL } from '@/config/site'
import { strapiErrorMessage } from '@/lib/strapiError'
import {
  getOneDashboardSource,
  updateDashboardSource,
  deleteDashboardSource,
  createDashboardSource,
  preprocessDashboardSourceData,
  getUserByEmail,
} from '@/lib/crud/coreCrud'
import { isAdminRole, isProjectManagerRole, isExecutiveRole, isManagerRole } from '@/lib/auth/roles'

const adminToken = () => {
  const token = process.env.STRAPI_ADMIN_TOKEN
  if (!token) throw new Error('STRAPI_ADMIN_TOKEN is not set on the server')
  return token
}

const sameCustomer = (a, b) => a != null && b != null && String(a) === String(b)

// The caller's identity and role always come from Strapi, never from the request.
async function getCaller() {
  const session = await auth()
  if (!session?.user?.email || !session.jwt) throw new Error('Please sign in again')
  const user = await getUserByEmail(session.user.email, session.jwt)
  if (!user) throw new Error('User not found')
  return { email: session.user.email, role: user.primary_role, customerId: user.Customer_id }
}

// Same rules as the buttons in DashboardSourceSelector, plus the customer scope.
function canDelete(caller, source) {
  if (isAdminRole(caller.role)) return sameCustomer(caller.customerId, source.Customer_id)
  if (isProjectManagerRole(caller.role) || isExecutiveRole(caller.role)) return source.owner === caller.email
  return false
}

function canShare(caller, source) {
  return isManagerRole(caller.role) && source.owner === caller.email
}

async function shareImpl(id, emails) {
  const caller = await getCaller()
  const source = await getOneDashboardSource(id, adminToken())
  if (!canShare(caller, source)) throw new Error('You do not have permission to share this source')
  const list = (Array.isArray(emails) ? emails : []).map(e => String(e).trim()).filter(Boolean)
  await updateDashboardSource(id, { grant_tm_access_to: list.join(',') }, adminToken())
  return { ok: true }
}

async function deleteImpl(id) {
  const caller = await getCaller()
  const source = await getOneDashboardSource(id, adminToken())
  if (!canDelete(caller, source)) throw new Error('You do not have permission to delete this source')
  await deleteDashboardSource(id, adminToken())
  return { ok: true }
}

// One dashboard source per set of pubsets, so reports never count the same data twice.
// The set is stored in the unique Strapi field `uid` as hyphen-separated pubset IDs ("21" or "21-22").
// Older sources may list the IDs in any order, so sets are compared, not strings.
const setKey = ids =>
  [...new Set((ids || []).map(id => String(id).trim()).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))
    .join('-')

const uidToKey = uid => setKey(String(uid || '').split('-'))

// The caller's customer's sources (light fields only), plus any source whose uid is exactly this set.
async function findSourceForSet(caller, key) {
  const fields = ['uid', 'name', 'owner', 'Customer_id', 'published_date', 'updatedAt']
    .map((f, i) => `fields[${i}]=${f}`).join('&')
  const filters = [
    `filters[$or][0][Customer_id][$eq]=${encodeURIComponent(caller.customerId)}`,
    `filters[$or][1][uid][$eq]=${encodeURIComponent(key)}`,
  ].join('&')
  const res = await fetch(`${API_URL}/dashboard-sources?${fields}&${filters}&pagination[pageSize]=1000`, {
    headers: { Authorization: `Bearer ${adminToken()}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Strapi ${res.status} while checking for an existing source`)
  const { data = [] } = await res.json()
  const hit = data.find(item => uidToKey(item.attributes?.uid) === key)
  if (!hit) return null
  const a = hit.attributes
  return {
    id: hit.id,
    name: a.name,
    owner: a.owner,
    Customer_id: a.Customer_id,
    savedAt: a.published_date || a.updatedAt,
  }
}

// What the page shows before saving: the existing source for this set, and whether the caller may replace it.
async function findExistingImpl(pubsetIds) {
  const caller = await getCaller()
  const key = setKey(pubsetIds)
  if (!key) throw new Error('No pubsets selected')
  const existing = await findSourceForSet(caller, key)
  if (!existing) return { existing: null }
  return { existing: { ...existing, canOverwrite: canDelete(caller, existing) } }
}

// Saves a consolidated source. With no replaceId, a source that already exists for the same set is
// returned as { conflict } and nothing is written. With replaceId, that source is overwritten in place
// (same id, owner, sharing and active flag), so dashboards pointing at it keep working.
async function saveImpl(data, replaceId = null) {
  const caller = await getCaller()
  if (!isManagerRole(caller.role)) throw new Error('Only an Administrator, Project Manager or Executive can create dashboard sources')
  if (!caller.customerId) throw new Error('Your account has no customer id')

  const key = uidToKey(data?.uid)
  if (!key) throw new Error('No pubsets selected')
  const existing = await findSourceForSet(caller, key)

  let id
  if (existing) {
    const canOverwrite = canDelete(caller, existing)
    if (String(existing.id) !== String(replaceId ?? '')) return { conflict: { ...existing, canOverwrite } }
    if (!canOverwrite) throw new Error('You do not have permission to overwrite this source')
    // Keep who owns it, who it is shared with, whether it is active, and its uid.
    // eslint-disable-next-line no-unused-vars
    const { owner, Customer_id, uid, isActive, grant_tm_access_to, ...rest } = data
    await updateDashboardSource(existing.id, rest, adminToken())
    id = existing.id
    console.log('dashboard source overwritten', { id, by: caller.email, uid: key })
  } else {
    if (replaceId) throw new Error('The source you chose to overwrite no longer exists. Save again to create a new one.')
    const saved = await createDashboardSource(
      { ...data, uid: key, owner: caller.email, Customer_id: String(caller.customerId) },
      adminToken(),
    )
    id = saved.id
  }

  let preprocess = null
  const rows = Array.isArray(data?.tbmdjoined) ? data.tbmdjoined : []
  if (rows.some(r => r?.tbType === 'Allocation')) {
    preprocess = await preprocessDashboardSourceData({ id, tbmdjoined: rows }, adminToken())
  }
  return { id, overwritten: !!existing, preprocess }
}

// Server-action errors are hidden in production builds, so each action returns
// { data } or { error: '<message for the user>' } instead of throwing.
async function safely(fn) {
  try {
    return { data: await fn() }
  } catch (e) {
    const message = strapiErrorMessage(e)
    console.error('dashboard source action:', message)
    return { error: message }
  }
}

export async function shareDashboardSourceAction(id, emails) {
  return safely(() => shareImpl(id, emails))
}

export async function deleteDashboardSourceAction(id) {
  return safely(() => deleteImpl(id))
}

export async function findDashboardSourceForPubsetsAction(pubsetIds) {
  return safely(() => findExistingImpl(pubsetIds))
}

export async function saveDashboardSourceAction(data, replaceId = null) {
  return safely(() => saveImpl(data, replaceId))
}
