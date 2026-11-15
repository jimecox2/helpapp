'use server'

// Licences & Accounts (/admin/licences), Phase 3 (Jim, 15 Nov 2026). The caller is always the signed-in
// user, read again from Strapi with the server token; nothing about who they are comes from the request.
//   Licence manager (LICENSING_MODE=self-managed, email in LICENCE_MANAGERS, Strapi Administrator):
//     set up companies and contracts with no payment.
//   A company's Administrator (both modes): accounts from the resource pool, seats, one-time passwords.
// Rules: lib/licence/selfManaged.js. Server actions return { ok, error } and never throw to the browser.

import { auth } from '@/auth/auth'
import { strapiAdmin as strapi, strapiProblem } from '@/lib/strapiAdmin'
import { getUser } from '@/lib/org/orgRules'
import {
  licensingMode, isLicenceManager, managerOverview, setUpOrganisation, saveContract,
  companyOverview, accountsFromPool, setSeat, newOneTimePassword,
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
    console.error(`licences: ${label} failed`, e.message)
    return { ok: false, error: strapiProblem(e, `Something went wrong (${e.message}). Please try again, or contact support.`) }
  }
}

const managerOnly = fn => me => (isLicenceManager(me)
  ? fn(me)
  : { ok: false, error: 'Only a licence manager can do this (LICENSING_MODE=self-managed and your email in LICENCE_MANAGERS).' })

export async function getLicencesPage() {
  return run('read', async me => {
    const manager = isLicenceManager(me)
    const company = await companyOverview(strapi, me.id)
    return {
      ok: true,
      mode: licensingMode(),
      manager,
      managerView: manager ? await managerOverview(strapi) : null,
      company: company.ok ? company : null,
      companyError: company.ok ? '' : company.error,
    }
  })
}

export async function setUpOrganisationAction(input) {
  return run('set up organisation', managerOnly(() => setUpOrganisation(strapi, input || {})))
}

export async function saveContractAction(input) {
  return run('save contract', managerOnly(() => saveContract(strapi, input || {})))
}

export async function accountsFromPoolAction(input) {
  return run('accounts from pool', me => accountsFromPool(strapi, me.id, input || {}))
}

export async function setSeatAction(input) {
  return run('seat', me => setSeat(strapi, me.id, input || {}))
}

export async function newOneTimePasswordAction(userId) {
  return run('one-time password', me => newOneTimePassword(strapi, me.id, userId))
}
