// One connected pubset per product (Jim, 30 Oct 2026): a user licensed for several products can have an
// Agilebars, a Timebars and a Costbars connected pubset (isActive) at once. The dashboard shows the one
// for users.dashboard_product; empty or not found -> Costbars, then Timebars, then Agilebars.
// Pure functions, tested by tests/connected-pubset.mjs.

export const DASHBOARD_PRODUCTS = ['Costbars', 'Timebars', 'Agilebars']

/** Products that have a connected pubset, in the default order. */
export function connectedProducts(rows = []) {
  const have = new Set(rows.map(r => r?.attributes?.source_product).filter(Boolean))
  return DASHBOARD_PRODUCTS.filter(p => have.has(p))
}

/**
 * @param {Array} rows - the user's isActive timebars rows, newest first
 * @param {string|null} preferred - users.dashboard_product
 * @returns {Object|null} the row to show
 */
export function pickConnectedPubset(rows = [], preferred = null) {
  if (rows.length === 0) return null
  const order = [preferred, ...DASHBOARD_PRODUCTS].filter(Boolean)
  for (const product of order) {
    const hit = rows.find(r => r?.attributes?.source_product === product)
    if (hit) return hit
  }
  return rows[0] // never published, so no product yet
}
