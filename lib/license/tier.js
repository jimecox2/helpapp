// Enterprise edition = license tier 3 (Jim, 30 Oct 2026). Timebars Cloud uses the highest tier among
// the user's active orders, whatever the product (one active license per product, so up to three).
// Tier 3: Dashboard Sources, Manage Pubsets, Generate Source. Below: the dashboard shows the user's
// connected pubset only. Existing sources are kept and come back on an upgrade.
// The pure rules are in tierRules.js; getLicenseTier reads Strapi.

import { API_URL } from '@/config/site'

import { highestTier } from './tierRules'
export { ENTERPRISE_TIER, tierOf, highestTier, isEnterpriseTier } from './tierRules'

/**
 * The signed-in user's highest active tier, from their Strapi orders (their own JWT).
 * @returns {Promise<number|null>} null = no active license (or Strapi unreachable)
 */
export async function getLicenseTier(email, jwt) {
  try {
    const url = `${API_URL}/orders?filters[owner][$eq]=${encodeURIComponent(email)}&filters[active_status][$eq]=true`
      + `&fields[0]=active_status&populate[product][fields][0]=product_code&pagination[pageSize]=100`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${jwt}` }, cache: 'no-store' })
    if (!res.ok) {
      console.error('getLicenseTier: Strapi', res.status)
      return null
    }
    const codes = ((await res.json()).data || []).map(o => o.attributes?.product?.data?.attributes?.product_code)
    return highestTier(codes)
  } catch (e) {
    console.error('getLicenseTier:', e.message)
    return null
  }
}

