// Which pubset's resource pool a Dashboard Source uses.
//
// Rule (Jim, 29 Oct 2026): the master pool is the Costbars connected pubset (isActive). Timebars and
// Agilebars pubsets may carry their own pools; those are ignored whenever a Costbars pool is selected.
// No Costbars pool in the selection -> the first pool found, as before, with a warning.

const hasPool = p => (Array.isArray(p?.tbresources) ? p.tbresources.length > 0 : !!p?.tbresources)

/**
 * @param {Array} pubsets - selected pubsets ({ name, source_product, isActive, tbresources })
 * @returns {{ pubset: Object|null, warning: string|null }}
 */
export function pickResourcePool(pubsets = []) {
  const withPool = pubsets.filter(hasPool)
  if (withPool.length === 0) return { pubset: null, warning: 'None of these pubsets has a resource pool.' }

  const costbars = withPool.filter(p => p.source_product === 'Costbars')
  const connected = costbars.filter(p => p.isActive === true)

  if (connected.length === 1) return { pubset: connected[0], warning: null }
  if (connected.length > 1) {
    return {
      pubset: connected[0],
      warning: `More than one Costbars connected pubset is selected. Using the pool from "${connected[0].name}".`,
    }
  }
  if (costbars.length > 0) {
    return {
      pubset: costbars[0],
      warning: `No Costbars connected pubset is selected. Using the pool from "${costbars[0].name}".`,
    }
  }
  return {
    pubset: withPool[0],
    warning: `No Costbars pubset is selected, so the pool comes from "${withPool[0].name}". Include the Costbars connected pubset to use the master pool.`,
  }
}
