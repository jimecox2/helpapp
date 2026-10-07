'use server'

// Dashboard-source writes that need more than the user's own Strapi rights.
// tbwww did these from the browser with the full-access admin token, which put the token in the
// public JS bundle. Here the token stays on the server (STRAPI_ADMIN_TOKEN) and every action
// checks the caller's session and role first.

import { auth } from '@/auth/auth'
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

// Creates a consolidated source. Owner and Customer_id are set from the caller, not the request.
async function createImpl(data) {
  const caller = await getCaller()
  if (!isManagerRole(caller.role)) throw new Error('Only an Administrator, Project Manager or Executive can create dashboard sources')
  if (!caller.customerId) throw new Error('Your account has no customer id')

  const saved = await createDashboardSource(
    { ...data, owner: caller.email, Customer_id: String(caller.customerId) },
    adminToken(),
  )

  let preprocess = null
  const rows = Array.isArray(data?.tbmdjoined) ? data.tbmdjoined : []
  if (rows.some(r => r?.tbType === 'Allocation')) {
    preprocess = await preprocessDashboardSourceData({ id: saved.id, tbmdjoined: rows }, adminToken())
  }
  return { id: saved.id, preprocess }
}

// Server-action errors are hidden in production builds, so each action returns
// { data } or { error: '<message for the user>' } instead of throwing.
async function safely(fn) {
  try {
    return { data: await fn() }
  } catch (e) {
    console.error('dashboard source action:', e.message)
    return { error: e.message || 'Something went wrong' }
  }
}

export async function shareDashboardSourceAction(id, emails) {
  return safely(() => shareImpl(id, emails))
}

export async function deleteDashboardSourceAction(id) {
  return safely(() => deleteImpl(id))
}

export async function createDashboardSourceAction(data) {
  return safely(() => createImpl(data))
}
