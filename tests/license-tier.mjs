// Enterprise edition tier - run with: npm run test:tier
import assert from 'assert'
import { tierOf, highestTier, isEnterpriseTier } from '../lib/license/tierRules.js'

assert.strictEqual(tierOf('CBT03'), 3)
assert.strictEqual(tierOf('tbt02'), 2)
assert.strictEqual(tierOf('TBT03Demo'), 3)
assert.strictEqual(tierOf('Costbars'), null)
assert.strictEqual(tierOf(null), null)

// Jim's case: ABT01 and CBT03 active -> Enterprise
assert.strictEqual(highestTier(['ABT01', 'CBT03']), 3)
assert.strictEqual(highestTier(['TBT02', 'ABT01']), 2)
assert.strictEqual(highestTier([]), null)
assert.strictEqual(highestTier([undefined, 'x']), null)

assert.strictEqual(isEnterpriseTier(3), true)
assert.strictEqual(isEnterpriseTier(2), false)
assert.strictEqual(isEnterpriseTier(null), false)

console.log('license-tier: all tests passed')
