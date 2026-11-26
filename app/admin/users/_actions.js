'use server'

// Users, Roles & Seats (Jim, 26 Nov 2026): one page for the people of an Administrator's own organisation
// (account group on a self-managed server): roles, seats of each product, one-time passwords, and one import
// from the resource pool that makes accounts, moves people in, updates roles and gives seats.
// The caller is always the signed-in user, read again from Strapi with the server token; nothing about who
// they are comes from the request. Rules: lib/licence/selfManaged.js. Actions return { ok, error }, never throw.

import { auth } from '@/auth/auth'
import { strapiAdmin as strapi, strapiProblem } from '@/lib/strapiAdmin'
import { getUser } from '@/lib/org/orgRules'
import {
  licensingMode, companyOverview, accountsFromPool, setSeat, setMemberRole, newOneTimePassword,
} from '@/lib/licence/selfManaged'

async function run(label, fn) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) return { ok: false, error: 'Please sign in again.' }
    const me = await getUser(strapi, userId)
    if (!me) return { ok: false, error: 'Your account was not found. Please sign in again.' }
    return await fn(me)
  } catch (e) {
    console.error(`people: ${label} failed`, e.message)
    return { ok: false, error: strapiProblem(e, `Something went wrong (${e.message}). Please try again, or contact support.`) }
  }
}

export async function getPeoplePage() {
  return run('read', async me => {
    const company = await companyOverview(strapi, me.id)
    return company.ok ? { ...company, mode: licensingMode() } : company
  })
}

export async function setRoleAction(input) {
  return run('role', me => setMemberRole(strapi, me.id, input || {}))
}

export async function setSeatAction(input) {
  return run('seat', me => setSeat(strapi, me.id, input || {}))
}

export async function newOneTimePasswordAction(userId) {
  return run('one-time password', me => newOneTimePassword(strapi, me.id, userId))
}

export async function importPoolAction(input) {
  return run('import', me => accountsFromPool(strapi, me.id, input || {}))
}
