// Pure tier rules for the Enterprise edition (see lib/license/tier.js). Tested by tests/license-tier.mjs.

export const ENTERPRISE_TIER = 3

/** "CBT03" / "TBT03Demo" -> 3; null when the code has no tier. Same rule as tbrunp getLicenseTier(). */
export function tierOf(productCode) {
  const match = /^[A-Z]{2}T0?(\d)/.exec(String(productCode || '').toUpperCase())
  return match ? Number(match[1]) : null
}

/** Highest tier among product codes; null when none has a tier. */
export function highestTier(productCodes = []) {
  const tiers = productCodes.map(tierOf).filter(t => t !== null)
  return tiers.length ? Math.max(...tiers) : null
}

export const isEnterpriseTier = tier => tier !== null && tier >= ENTERPRISE_TIER
