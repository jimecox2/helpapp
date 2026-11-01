// One connected pubset per product - run with: npm run test:connected
import assert from 'assert'
import { connectedProducts, pickConnectedPubset } from '../lib/crud/connectedPubset.js'

const r = (id, source_product) => ({ id, attributes: { source_product } })
const rows = [r(1, 'Agilebars'), r(2, 'Timebars'), r(3, 'Costbars')]

assert.deepStrictEqual(connectedProducts(rows), ['Costbars', 'Timebars', 'Agilebars'])
assert.deepStrictEqual(connectedProducts([r(1, 'Agilebars'), r(2, null)]), ['Agilebars'])

assert.strictEqual(pickConnectedPubset(rows, 'Timebars').id, 2)
assert.strictEqual(pickConnectedPubset(rows, null).id, 3) // default Costbars first
assert.strictEqual(pickConnectedPubset(rows, 'Costbars').id, 3)
assert.strictEqual(pickConnectedPubset([r(1, 'Agilebars'), r(2, 'Timebars')], 'Costbars').id, 2) // not found -> default order
assert.strictEqual(pickConnectedPubset([r(5, null)], 'Timebars').id, 5)
assert.strictEqual(pickConnectedPubset([], 'Timebars'), null)

console.log('connected-pubset: all tests passed')
