// Query for the pubset lists (/dashboard/pubsets and /dashboard/pubsets/access). Pure, no imports.
//
// Built for a large timebars table, following Strapi's guidance (REST API: filters, fields, populate,
// pagination):
// - Filter in Strapi, not in Node: only the user's tenant (Customer_id) or pubsets they own, and only
//   pubsets that have been published (tb not null). Every RBAC rule (lib/auth/rbac.js) needs one of
//   those two, so nothing the user may see is left out.
// - fields[]: only the columns the list shows. The big JSON columns (tb, tbmdjoined, tbresources...)
//   are never sent; the report and consolidated pages read them for the pubsets they open.
// - populate the user relation with its email and username only.
// - pagination: pageSize 100 (Strapi's default maxLimit), sorted by id so pages are stable.
// - Strapi answers 400 "Invalid key <x>" or "Invalid parameter <x>" when a field or filter does not exist in this Strapi (columns
//   differ between servers). invalidKeyOf() reads the key so the caller drops it and asks again.
// Tested by tests/pubset-list-query.mjs.

export const PUBSET_LIST_FIELDS = [
  'name', 'owner', 'Customer_id', 'published_date', 'createdAt', 'isActive',
  'grant_pm_access_to', 'grant_tm_access_to', 'source_product', 'source_product_version',
  'aggregation_level', 'publish_status', 'division', 'cost_center', 'geographic_region',
  'source_file_name', 'source_file_version',
]

export const PUBSET_PAGE_SIZE = 100

/**
 * Query string for one page of the user's pubsets.
 * @param {{ email: string, customerId?: string|null, page?: number }} args
 * @returns {string} without the leading "?"; "" when there is no email (nothing to ask for)
 */
export function pubsetListQuery({ email, customerId = null, page = 1, fields = PUBSET_LIST_FIELDS, publishedOnly = true }) {
  if (!email) return ''
  const p = new URLSearchParams()
  if (publishedOnly) p.set('filters[tb][$notNull]', 'true')
  p.set('filters[$or][0][owner][$eq]', email)
  if (customerId) p.set('filters[$or][1][Customer_id][$eq]', customerId)
  fields.forEach((f, i) => p.set(`fields[${i}]`, f))
  p.set('populate[users_permissions_user][fields][0]', 'email')
  p.set('populate[users_permissions_user][fields][1]', 'username')
  p.set('sort[0]', 'id:asc')
  p.set('pagination[page]', String(page))
  p.set('pagination[pageSize]', String(PUBSET_PAGE_SIZE))
  return p.toString()
}

/** The key a Strapi 400 complains about ("Invalid key publishedAt" -> "publishedAt"), or null. */
export function invalidKeyOf(body) {
  const err = body?.error || {}
  if (err.details?.key) return String(err.details.key)
  const m = /invalid (?:key|parameter):?\s*([\w$]+)/i.exec(err.message || '')
  return m ? m[1] : null
}
