'use server'

// Users & Roles (RBAC). Only an Administrator can use these, and only for users of their own
// customer. The caller's role and customer come from Strapi, never from the request.
// Roles only for now: no accounts are created here and customer_id is never changed.

import { auth } from '@/auth/auth'
import { strapiErrorMessage } from '@/lib/strapiError'
import { API_URL } from '@/config/site'
import { getUserByEmail } from '@/lib/crud/coreCrud'
import { isAdminRole } from '@/lib/auth/roles'

const adminToken = () => {
  const token = process.env.STRAPI_ADMIN_TOKEN
  if (!token) throw new Error('STRAPI_ADMIN_TOKEN is not set on the server')
  return token
}

const sameCustomer = (a, b) => a != null && a !== '' && b != null && String(a) === String(b)
const norm = s => (typeof s === 'string' ? s.trim() : '')

async function strapi(path, init = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}`, ...(init.headers || {}) },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(`Strapi ${res.status} on ${path.split('?')[0]}${body?.error?.message ? `: ${body.error.message}` : ''}`)
  }
  return res.json()
}

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email || !session.jwt) throw new Error('Please sign in again')
  const me = await getUserByEmail(session.user.email, session.jwt)
  if (!me || !isAdminRole(me.primary_role) || !me.Customer_id) {
    throw new Error('Only an Administrator with a customer id can manage users and roles')
  }
  return { email: me.email.toLowerCase(), customerId: String(me.Customer_id) }
}

const toRow = u => ({
  id: u.id,
  username: u.username || '',
  email: u.email,
  role: u.primary_role || '',
  confirmed: !!u.confirmed,
  blocked: !!u.blocked,
})

async function listCustomerUsersImpl() {
  const admin = await requireAdmin()
  const users = await strapi(`/users?filters[customer_id][$eq]=${encodeURIComponent(admin.customerId)}&sort=username:asc&pagination[pageSize]=500`)
  return { customerId: admin.customerId, me: admin.email, users: users.map(toRow) }
}

async function setUserRoleImpl(userId, role) {
  const admin = await requireAdmin()
  const user = await strapi(`/users/${encodeURIComponent(userId)}`)
  if (!sameCustomer(user.customer_id ?? user.Customer_id, admin.customerId)) throw new Error('That user is not in your organisation')
  if (user.email?.toLowerCase() === admin.email) throw new Error('You cannot change your own role')
  const value = norm(role)
  if (!value || value.length > 60) throw new Error('Choose a role')
  await strapi(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify({ primary_role: value }) })
  console.log('rbac: role changed', { by: admin.email, user: user.email, from: user.primary_role || '', to: value })
  return toRow({ ...user, primary_role: value })
}

// rows: [{ email, role }] from the resource pool (tbResEmail, tbResPrimaryRole).
// Returns what would happen to each row; apply=true also writes the changes.
async function syncRolesFromPoolImpl(rows, apply = false) {
  const admin = await requireAdmin()
  if (!Array.isArray(rows) || rows.length > 2000) throw new Error('Expected a list of up to 2000 resources')

  const seen = new Set()
  const result = []
  for (const r of rows) {
    const email = norm(r?.email).toLowerCase()
    const role = norm(r?.role)
    if (!email || !role || seen.has(email)) continue
    seen.add(email)

    const found = await strapi(`/users?filters[email][$eqi]=${encodeURIComponent(email)}`)
    const user = found[0]
    let status
    if (!user) status = 'not registered'
    else if (!sameCustomer(user.customer_id ?? user.Customer_id, admin.customerId)) status = 'not in your organisation'
    else if (email === admin.email) status = 'skipped (you)'
    else if ((user.primary_role || '') === role) status = 'no change'
    else status = 'update'

    const row = { email, from: user?.primary_role || '', to: role, status }
    if (apply && status === 'update') {
      await strapi(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify({ primary_role: role }) })
      console.log('rbac: role from pool', { by: admin.email, user: email, from: row.from, to: role })
      row.status = 'updated'
    }
    result.push(row)
  }
  return result
}

// Server-action errors are hidden in production builds, so each action returns
// { data } or { error: '<message for the user>' } instead of throwing.
async function safely(fn) {
  try {
    return { data: await fn() }
  } catch (e) {
    const message = strapiErrorMessage(e)
    console.error('rbac:', message)
    return { error: message }
  }
}

export async function listCustomerUsers() {
  return safely(() => listCustomerUsersImpl())
}

export async function setUserRole(userId, role) {
  return safely(() => setUserRoleImpl(userId, role))
}

export async function syncRolesFromPool(rows, apply = false) {
  return safely(() => syncRolesFromPoolImpl(rows, apply))
}
