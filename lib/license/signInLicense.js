// License check at Cloud sign-in: reads the user's orders with their own JWT, sets orders past
// their grace period inactive (as tbwww's My Orders does), and returns what the session keeps for
// the banner and the one-time redirect to My Orders. Rules: signInRules.js. Server only.
//
// Team members with no orders of their own follow their company's license: the Administrators of
// the same customer id. Reading those orders needs STRAPI_ADMIN_TOKEN (server only).

import { API_URL, WWW_URL } from '@/config/site'
import { licenseAtSignIn, companyLicenseState } from './signInRules'

const ORDER_FIELDS = 'fields[0]=status&fields[1]=active_status&fields[2]=expires_on'
  + '&populate[product][fields][0]=product_code&pagination[pageSize]=100'

async function getJson(path, bearer) {
  const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${bearer}` }, cache: 'no-store' })
  if (!res.ok) throw new Error(`Strapi ${res.status} for ${path.split('?')[0]}`)
  return res.json()
}

async function companyExpired(customerId, email) {
  const adminToken = process.env.STRAPI_ADMIN_TOKEN
  if (!customerId || !adminToken) return null
  const users = await getJson(`/users?filters[customer_id][$eq]=${encodeURIComponent(customerId)}`
    + `&filters[primary_role][$eqi]=Administrator&fields[0]=email&pagination[pageSize]=50`, adminToken)
  const emails = (Array.isArray(users) ? users : []).map(u => u.email).filter(e => e && e.toLowerCase() !== String(email).toLowerCase())
  if (emails.length === 0) return null
  const q = emails.map((e, i) => `filters[owner][$in][${i}]=${encodeURIComponent(e)}`).join('&')
  const orders = (await getJson(`/orders?${q}&${ORDER_FIELDS}`, adminToken)).data || []
  return companyLicenseState(orders)
}

/**
 * @returns {Promise<{ at: number, notices: Array, company: 'expired'|null, redirectTo: string|null }|null>}
 *   null when Strapi could not be read (sign-in goes ahead, nothing is changed).
 */
export async function checkLicenseAtSignIn({ email, jwt, customerId, primaryRole }) {
  try {
    const orders = (await getJson(`/orders?filters[owner][$eq]=${encodeURIComponent(email)}&${ORDER_FIELDS}`, jwt)).data || []
    const result = licenseAtSignIn(orders)

    await Promise.all(result.toDeactivate.map(async id => {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { active_status: false } }),
      })
      if (!res.ok) console.error('checkLicenseAtSignIn: could not set order inactive', id, res.status)
      else console.log('checkLicenseAtSignIn: order set inactive (expired)', { email, id })
    }))

    let company = null
    if (!result.hasOrders && String(primaryRole || '').toLowerCase() !== 'administrator') {
      company = await companyExpired(customerId, email).catch(e => {
        console.error('checkLicenseAtSignIn: company license', e.message)
        return null
      })
    }
    return {
      at: Date.now(),
      notices: result.notices,
      company,
      redirectTo: result.redirect ? `${WWW_URL}/sales/myorders?notice=expired` : null,
    }
  } catch (e) {
    console.error('checkLicenseAtSignIn:', e.message)
    return null
  }
}
