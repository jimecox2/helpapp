// Decides where the Enterprise Dashboard gets its data: the active dashboard source or the user's
// connected pubset. Every dashboard page goes through resolveDashboardData (most via
// useEnterpriseDashboardSource), so this is the only place that makes the choice.
//
// Rules (Jim, 22 Oct 2026):
// - users.use_connected_pubset = true  -> the user's own connected pubset.
// - the user has no dashboard sources  -> the connected pubset too, so a new user who has just
//   published sees their data with no extra steps.
// - otherwise                          -> the active source (or the newest one when none is active).
// - below the Enterprise edition (tier 3, lib/license/tier.js) -> always the connected pubset; the
//   user's sources are kept and come back on an upgrade.
// The connected pubset is the user's own `timebars` row with isActive = true. The client apps choose
// it when publishing; it is only read here, never written. There can be one per product (one active
// license per product); users.dashboard_product picks which one shows (lib/crud/connectedPubset.js).

import { API_URL } from '@/config/site'
import { getAllDashboardSources, getUserByEmail, buildResCalcsFromRows } from '@/lib/crud/coreCrud'
import { pickConnectedPubset, connectedProducts } from '@/lib/crud/connectedPubset'
import { getLicenseTier, isEnterpriseTier } from '@/lib/license/tier'

// The user's isActive rows, newest first: one per product at most (more is old data).
async function fetchConnectedRows(email, jwt, fields = null) {
  const fieldQuery = fields ? '&' + fields.map((f, i) => `fields[${i}]=${f}`).join('&') : ''
  const res = await fetch(
    `${API_URL}/timebars?filters[owner][$eq]=${encodeURIComponent(email)}&filters[isActive][$eq]=true&sort=updatedAt:desc${fieldQuery}`,
    { headers: { Authorization: `Bearer ${jwt}` }, cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Strapi ${res.status} while loading your connected pubset`)
  return (await res.json()).data || []
}

/** Products the user has a connected pubset for (Costbars, Timebars, Agilebars order). */
export async function getConnectedPubsetProducts(email, jwt) {
  return connectedProducts(await fetchConnectedRows(email, jwt, ['name', 'source_product']))
}

/**
 * The user's own connected pubset, in the same shape as a dashboard source.
 * @returns {Promise<Object|null>} null when there is none or it holds no data
 */
export async function getConnectedPubset(email, jwt, preferredProduct = null) {
  const rows = await fetchConnectedRows(email, jwt)
  const hit = pickConnectedPubset(rows, preferredProduct)
  const a = hit?.attributes
  if (!a || !Array.isArray(a.tbmdjoined) || a.tbmdjoined.length === 0) return null

  return {
    id: hit.id,
    // Pages print "Source: <name>", so the name says where the data came from.
    name: `${a.name || 'Untitled'} (connected pubset)`,
    pubsetName: a.name || 'Untitled',
    owner: a.owner,
    Customer_id: a.Customer_id || null,
    tbmdjoined: a.tbmdjoined,
    tbresources: a.tbresources || [],
    tbtags: a.tbtags || [],
    tbcharts: a.tbcharts || null,
    tbbaseline: a.tbbaseline || null,
    // Resource charts need tbrescalcs2; build it in memory when the publish did not include it.
    tbrescalcs2: Array.isArray(a.tbrescalcs2) && a.tbrescalcs2.length > 0 ? a.tbrescalcs2 : buildResCalcsFromRows(a.tbmdjoined),
    tb: a.tb || null,
    source_product: a.source_product || null,
    published_date: a.updatedAt || a.publishedAt || null,
    isConnectedPubset: true,
  }
}

/**
 * @returns {Promise<{ origin: 'source'|'pubset'|null, source: Object|null, sources: Array,
 *   useConnectedPubset: boolean, customerId: string|null, user: Object|null, tier: number|null, enterprise: boolean }>}
 *   origin null = nothing to show (no source and no connected pubset).
 */
export async function resolveDashboardData(email, jwt) {
  const user = await getUserByEmail(email, jwt)
  const customerId = user?.Customer_id || null
  const useConnectedPubset = user?.use_connected_pubset === true
  const tier = await getLicenseTier(email, jwt)
  const enterprise = isEnterpriseTier(tier)
  const sources = enterprise ? ((await getAllDashboardSources(email, jwt)) || []) : []
  const base = { sources, useConnectedPubset, customerId, user, tier, enterprise }

  if (!enterprise || useConnectedPubset || sources.length === 0) {
    const pubset = await getConnectedPubset(email, jwt, user?.dashboard_product || null)
    if (pubset) return { ...base, origin: 'pubset', source: pubset }
    // Switch on but nothing published: show nothing rather than silently using a source,
    // so the user is not misled about where the numbers come from.
    return { ...base, origin: null, source: null }
  }

  const active = sources.find(s => s.isActive) || sources[0]
  return { ...base, origin: 'source', source: active }
}
