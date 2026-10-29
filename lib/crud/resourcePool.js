// Which pubset's resource pool a Dashboard Source uses.
//
// Rules (Jim, 29 Oct 2026):
// 1. The customer's master pool: the Costbars pubset whose owner ticked is_master_pool (set in the
//    Costbars client, tbrunp scripts/tbMasterPool.js). There should be one per customer.
// 2. No master selected -> the Costbars connected pubset (isActive), then any Costbars pubset.
// 3. No Costbars pool in the selection -> the first pool found, as before.
// Every fallback, and more than one master, comes with a warning shown in the save dialog.

const hasPool = p => (Array.isArray(p?.tbresources) ? p.tbresources.length > 0 : !!p?.tbresources)

/**
 * @param {Array} pubsets - selected pubsets ({ name, owner, source_product, isActive, is_master_pool, tbresources })
 * @returns {{ pubset: Object|null, warning: string|null }}
 */
export function pickResourcePool(pubsets = []) {
  const withPool = pubsets.filter(hasPool)
  if (withPool.length === 0) return { pubset: null, warning: 'None of these pubsets has a resource pool.' }

  const costbars = withPool.filter(p => p.source_product === 'Costbars')
  const masters = costbars.filter(p => p.is_master_pool === true)
  const connected = costbars.filter(p => p.isActive === true)

  if (masters.length === 1) return { pubset: masters[0], warning: null }
  if (masters.length > 1) {
    return {
      pubset: masters[0],
      warning: `More than one master resource pool is selected (${masters.map(p => p.owner).join(', ')}). Using "${masters[0].name}". The owners should agree on one.`,
    }
  }
  if (connected.length > 0) {
    return {
      pubset: connected[0],
      warning: `No master resource pool is selected. Using the pool from the Costbars connected pubset "${connected[0].name}".`,
    }
  }
  if (costbars.length > 0) {
    return {
      pubset: costbars[0],
      warning: `No master resource pool is selected. Using the pool from "${costbars[0].name}".`,
    }
  }
  return {
    pubset: withPool[0],
    warning: `No Costbars pubset is selected, so the pool comes from "${withPool[0].name}". Include the customer's master resource pool.`,
  }
}
