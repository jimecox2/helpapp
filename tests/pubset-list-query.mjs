// node tests/pubset-list-query.mjs
import assert from 'assert'
import { pubsetListQuery, PUBSET_PAGE_SIZE } from '../lib/crud/pubsetListQuery.js'

const q = new URLSearchParams(pubsetListQuery({ email: 'a@x.com', customerId: 'CUST1', page: 2 }))
assert.strictEqual(q.get('filters[$or][0][owner][$eq]'), 'a@x.com')
assert.strictEqual(q.get('filters[$or][1][Customer_id][$eq]'), 'CUST1')
assert.strictEqual(q.get('filters[tb][$notNull]'), 'true')
assert.strictEqual(q.get('pagination[page]'), '2')
assert.strictEqual(q.get('pagination[pageSize]'), String(PUBSET_PAGE_SIZE))
const fields = [...q.keys()].filter(k => k.startsWith('fields[')).map(k => q.get(k))
for (const big of ['tb', 'tbmdjoined', 'tbresources', 'tbtags', 'tbcharts']) assert.ok(!fields.includes(big), big)
assert.ok(fields.includes('source_product') && fields.includes('Customer_id'))

// No customer id: own pubsets only.
const own = new URLSearchParams(pubsetListQuery({ email: 'a@x.com' }))
assert.strictEqual(own.get('filters[$or][1][Customer_id][$eq]'), null)
assert.strictEqual(own.get('pagination[page]'), '1')

// No email: no query.
assert.strictEqual(pubsetListQuery({}), '')
console.log('pubset-list-query: all tests passed')
