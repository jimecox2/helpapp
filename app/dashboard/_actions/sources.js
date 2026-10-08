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

// A source already saved for this set of pubsets. `uid` (hyphen-separated pubset IDs) is unique in
// Strapi: one source per set, so reports never count the same data twice.
async function findSourceByUid(uid) {
  const fields = ['name', 'owner', 'Customer_id', 'published_date', 'updatedAt'].map((f, i) => `fields[${i}]=${f}`).join('&')
  const res = await fetch(`${API_URL}/dashboard-sources?filters[uid][$eq]=${encodeURIComponent(uid)}&${fields}`, {
    headers: { Authorization: `Bearer ${adminToken()}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Strapi ${res.status} while checking for an existing source`)
  const hit = (await res.json()).data?.[0]
  if (!hit) return null
  const a = hit.attributes
  return { id: hit.id, name: a.name, owner: a.owner, Customer_id: a.Customer_id, savedAt: a.published_date || a.updatedAt }
}

// Saves a consolidated source. Owner and Customer_id are set from the caller, not the request.
// If these pubsets are already saved, nothing is written and { conflict } is returned so the user can
// choose; calling again with replaceId = that source's id overwrites it in place (same id, owner,
// sharing and active flag), so dashboards pointing at it keep working.
async function saveImpl(data, replaceId = null) {
  const caller = await getCaller()
  if (!isManagerRole(caller.role)) throw new Error('Only an Administrator, Project Manager or Executive can create dashboard sources')
  if (!caller.customerId) throw new Error('Your account has no customer id')
  const uid = String(data?.uid || '').trim()
  if (!uid) throw new Error('No pubsets selected')

  const existing = await findSourceByUid(uid)
  let id
  if (existing) {
    const canOverwrite = canDelete(caller, existing)
    if (String(existing.id) !== String(replaceId ?? '')) return { conflict: { ...existing, canOverwrite } }
    if (!canOverwrite) throw new Error('Only the owner of this source or an Administrator can overwrite it')
    // eslint-disable-next-line no-unused-vars
    const { owner, Customer_id, uid: _uid, isActive, grant_tm_access_to, ...rest } = data
    await updateDashboardSource(existing.id, rest, adminToken())
    id = existing.id
    console.log('dashboard source overwritten', { id, by: caller.email, uid })
  } else {
    const saved = await createDashboardSource(
      { ...data, uid, owner: caller.email, Customer_id: String(caller.customerId) },
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

export async function createDashboardSourceAction(data, replaceId = null) {
  return safely(() => saveImpl(data, replaceId))
}
