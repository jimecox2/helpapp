// License check at Cloud sign-in - run with: npm run test:license
import assert from 'assert'
import { licenseAtSignIn, companyLicenseState, productNameOf } from '../lib/license/signInRules.js'

const now = new Date(2026, 10, 5, 12) // 05-Nov-2026
const o = (id, code, { active = true, status = 'paid', expires = '31-Dec-2027' } = {}) =>
  ({ id, attributes: { status, active_status: active, expires_on: expires, product: { data: { attributes: { product_code: code } } } } })
const run = orders => licenseAtSignIn(orders, now)

assert.strictEqual(productNameOf('cbt03'), 'Costbars')

// Live license: nothing to do.
assert.deepStrictEqual(run([o(1, 'TBT02')]), { toDeactivate: [], notices: [], hasLive: true, hasOrders: true, redirect: false })

// Grace (expired 02-Nov): notice, not deactivated, no redirect.
const grace = run([o(2, 'TBT02', { expires: '02-Nov-2026' })])
assert.deepStrictEqual(grace.toDeactivate, [])
assert.deepStrictEqual(grace.notices, [{ product: 'Timebars', code: 'TBT02', expires_on: '02-Nov-2026' }])
assert.strictEqual(grace.redirect, false)

// Past grace, nothing else live: deactivate, notice, redirect once.
const gone = run([o(3, 'TBT02', { expires: '20-Oct-2026' }), o(4, 'TBT01', { active: false, expires: '01-Jan-2025' })])
assert.deepStrictEqual(gone.toDeactivate, [3])
assert.strictEqual(gone.notices[0].product, 'Timebars')
assert.strictEqual(gone.redirect, true)

// Agilebars expired but Timebars live: deactivate AB, banner for AB, no redirect.
const mixed = run([o(5, 'ABT02', { expires: '08-Jul-2024' }), o(6, 'TBT03')])
assert.deepStrictEqual(mixed.toDeactivate, [5])
assert.deepStrictEqual(mixed.notices.map(n => n.product), ['Agilebars'])
assert.strictEqual(mixed.redirect, false)

// Old expired order of a product that has a newer live one: deactivated quietly, no notice.
const renewed = run([o(7, 'CBT02', { expires: '08-Jul-2024' }), o(8, 'CBT03')])
assert.deepStrictEqual([renewed.toDeactivate, renewed.notices, renewed.redirect], [[7], [], false])

// Already inactive expired orders (an earlier sign-in): nothing, no second redirect.
assert.deepStrictEqual(run([o(9, 'TBT02', { active: false, expires: '08-Jul-2024' })]),
  { toDeactivate: [], notices: [], hasLive: false, hasOrders: true, redirect: false })

// No orders at all (team member): no redirect.
assert.deepStrictEqual(run([]), { toDeactivate: [], notices: [], hasLive: false, hasOrders: false, redirect: false })

// Company license: the Administrators' orders.
assert.strictEqual(companyLicenseState([o(10, 'CBT03')], now), null)
assert.strictEqual(companyLicenseState([o(11, 'CBT03', { expires: '02-Nov-2026' })], now), null) // grace
assert.strictEqual(companyLicenseState([o(12, 'CBT03', { expires: '08-Jul-2024' })], now), 'expired')
assert.strictEqual(companyLicenseState([o(13, 'CBT03', { active: false, expires: '08-Jul-2024' })], now), 'expired')
assert.strictEqual(companyLicenseState([], now), null) // no company license at all: nothing to say

console.log('license-signin: all tests passed')
