// Phase 3: self-managed licences (lib/licence/selfManaged.js) against an in-memory Strapi.
// Run:  npm run test:licences
import assert from 'node:assert/strict'
import {
  licensingMode, licenceManagers, isLicenceManager, makeOneTimePassword,
  managerOverview, setUpOrganisation, saveCompanyContracts, companyOverview, accountsFromPool, setSeat, newOneTimePassword,
} from '../lib/licence/selfManaged.js'
import { createOrganisation } from '../lib/org/orgRules.js'
import { fakeStrapi as baseFake } from './fakeStrapi.mjs'
import { parsePool } from '../lib/licence/parsePool.js'

// The tbwww fake plus the users-permissions list / create calls this file makes.
function fakeStrapi() {
  const f = baseFake()
  const { db } = f
  let nextUser = 100
  const base = f.strapi
  f.strapi = async (path, init = {}) => {
    const method = init.method || 'GET'
    const url = new URL(path, 'http://x')
    if (url.pathname === '/users' && method === 'POST') {
      const b = JSON.parse(init.body)
      const all = [...db.users.values()]
      // Like Strapi 4.14: role is required; a taken username is not checked when an email is sent.
      if (b.role == null) throw Object.assign(new Error('Strapi 400 on /users: role must be a defined value'), { status: 400 })
      if (f.failEmail && b.email === f.failEmail) throw Object.assign(new Error('Strapi 500 on /users: boom'), { status: 500 })
      if (all.some(u => u.email === b.email)) throw Object.assign(new Error('Strapi 400: Email already taken'), { status: 400 })
      if (all.some(u => u.username === b.username)) throw Object.assign(new Error('Strapi 400: Username already taken'), { status: 400 })
      const u = { id: nextUser++, customer_id: null, primary_role: null, organisation: null, ...b }
      db.users.set(u.id, u)
      return { ...u }
    }
    if (url.pathname === '/users-permissions/roles') {
      return { roles: [{ id: 1, name: 'Authenticated', type: 'authenticated' }, { id: 2, name: 'Public', type: 'public' }] }
    }
    if (url.pathname === '/users' && method === 'GET') {
      const uname = url.searchParams.get('filters[username][$eqi]')
      if (uname != null) return [...db.users.values()].filter(u => String(u.username).toLowerCase() === uname.toLowerCase())
      const email = url.searchParams.get('filters[email][$eqi]')
      const org = url.searchParams.get('filters[organisation][id][$eq]')
      return [...db.users.values()]
        .filter(u => (email == null || String(u.email).toLowerCase() === email) && (org == null || String(u.organisation) === org))
        .map(u => ({ ...u, organisation: u.organisation ? { ...db.orgs.get(u.organisation) } : null }))
    }
    return base(path, init)
  }
  return f
}

const NOW = new Date(2026, 10, 15)

const CODES = { 8: 'CBT03', 9: 'TBT03', 7: 'ABT03' }
// One product's seats, the company's other live seats kept (the form sends all of them).
async function saveContract(strapi, { orgId, productId, seats, expiresOn }, now) {
  const view = await managerOverview(strapi, now)
  const org = view.organisations.find(o => String(o.id) === String(orgId))
  const all = Object.fromEntries((org?.contracts || []).map(c => [c.productCode, c.seats]))
  const r = await saveCompanyContracts(strapi, { orgId, seats: { ...all, [CODES[productId]]: seats }, expiresOn }, now)
  return r.ok ? { ...r, contract: r.contracts.find(c => c.productCode === CODES[productId]) } : r
}

let failed = 0
const t = async (name, fn) => { try { await fn(); console.log('ok  ', name) } catch (e) { failed++; console.log('FAIL', name, '-', e.stack.split('\n').slice(0, 2).join(' ')) } }
const seatOrders = (db, contractId) => [...db.orders.values()].filter(o => o.order_type === 'seat' && o.contract === contractId && o.active_status)

await t('settings: LICENSING_MODE and LICENCE_MANAGERS', () => {
  assert.equal(licensingMode({}), 'sales')
  assert.equal(licensingMode({ LICENSING_MODE: 'Self-Managed' }), 'self-managed')
  assert.deepEqual(licenceManagers({ LICENCE_MANAGERS: ' A@x.com, b@x.com ,' }), ['a@x.com', 'b@x.com'])
  const env = { LICENSING_MODE: 'self-managed', LICENCE_MANAGERS: 'a@x.com' }
  assert.equal(isLicenceManager({ email: 'A@x.com', primary_role: 'administrator' }, env), true)
  assert.equal(isLicenceManager({ email: 'a@x.com', primary_role: 'Team Member' }, env), false)
  assert.equal(isLicenceManager({ email: 'a@x.com', primary_role: 'Administrator' }, { ...env, LICENSING_MODE: 'sales' }), false)
  assert.match(makeOneTimePassword(), /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/)
})

await t('manager: set up a company with a new Administrator account, then a contract with no payment', async () => {
  const { strapi, db } = fakeStrapi()
  const r = await setUpOrganisation(strapi, { name: 'Acme Ltd', adminEmail: 'Boss@Acme.com', adminName: 'Boss' })
  assert.equal(r.ok, true, r.error)
  assert.ok(r.administrator.password)
  const boss = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  assert.equal(boss.confirmed, true)
  assert.deepEqual([boss.primary_role, boss.customer_id], ['Administrator', r.organisation.customerId])

  const org = r.organisation.id
  assert.match((await saveCompanyContracts(strapi, { orgId: org, seats: { TBT03: 1 }, expiresOn: '2027-11-15' }, NOW)).error, /at least 2 seats in total/)
  assert.match((await saveCompanyContracts(strapi, { orgId: org, seats: { TBT03: 5 }, expiresOn: '2026-11-01' }, NOW)).error, /from today/)
  assert.match((await saveCompanyContracts(strapi, { orgId: org, seats: { TBT03: -1, CBT03: 3 }, expiresOn: '2027-11-15' }, NOW)).error, /0 to/)
  const c = await saveCompanyContracts(strapi, { orgId: org, seats: { CBT03: 1, TBT03: 5, ABT03: 0 }, expiresOn: '2027-11-15' }, NOW)
  assert.equal(c.ok, true, c.error)
  assert.deepEqual([c.made, c.changed, c.ended, c.expiresOn], [['CBT03', 'TBT03'], [], [], '15 November 2027'])
  const tb = c.contracts.find(x => x.productCode === 'TBT03')
  const o = db.orders.get(tb.id)
  assert.deepEqual([o.order_type, o.seats, o.total, o.status, o.active_status, o.owner, o.expires_on, o.checkout_session],
    ['contract', 5, 0, 'paid', true, 'boss@acme.com', '15 November 2027', 'self-managed'])
  assert.equal(db.orders.get(c.contracts.find(x => x.productCode === 'CBT03').id).seats, 1)
  const view = await managerOverview(strapi, NOW)
  assert.equal(view.organisations[0].administrator, 'boss@acme.com')
  assert.deepEqual(view.organisations[0].contracts.map(x => [x.productCode, x.seats]).sort(), [['CBT03', 1], ['TBT03', 5]])
  assert.deepEqual([view.organisations[0].expiresOn, view.organisations[0].expiresOnInput], ['15 November 2027', '2027-11-15'])
  assert.deepEqual(view.products.map(p => p.code), ['CBT03', 'TBT03', 'ABT03'])
})

await t('manager: an existing person moves only from their own individual organisation (same Customer ID)', async () => {
  const { strapi, db, addUser } = fakeStrapi()
  addUser(1); addUser(2)
  const own = await createOrganisation(strapi, 1, { type: 'individual' })
  const r = await setUpOrganisation(strapi, { name: 'Solo Co', adminEmail: 'u1@x.com' })
  assert.equal(r.ok, true, r.error)
  assert.equal(r.administrator.password, null)
  assert.equal(r.organisation.customerId, own.customerId)
  assert.equal(db.orgs.get(own.organisation.id).org_type, 'organisation')
  const again = await setUpOrganisation(strapi, { name: 'Other', adminEmail: 'u1@x.com' })
  assert.match(again.error, /already belongs to "Solo Co"/)
})

await t('manager: changing a contract keeps at least the seats in use and moves the seat dates', async () => {
  const { strapi, db } = fakeStrapi()
  const r = await setUpOrganisation(strapi, { name: 'Acme', adminEmail: 'boss@acme.com' })
  const c = await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 3, expiresOn: '2027-06-30' }, NOW)
  const admin = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  await accountsFromPool(strapi, admin.id, { rows: [{ email: 'a@acme.com', contractId: c.contract.id }, { email: 'b@acme.com', contractId: c.contract.id }], apply: true }, NOW)
  assert.match((await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 2, expiresOn: '2027-06-30' }, NOW)).error, /already uses 3/)
  const ch = await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 10, expiresOn: '2028-01-31' }, NOW)
  assert.deepEqual(ch.changed, ['TBT03'])
  assert.equal(db.orders.get(c.contract.id).seats, 10)
  assert.deepEqual(seatOrders(db, c.contract.id).map(o => o.expires_on), ['31 January 2028', '31 January 2028'])
})

await t('administrator: accounts from the pool get one-time passwords and seats until seats run out', async () => {
  const { strapi, db, addUser } = fakeStrapi()
  const r = await setUpOrganisation(strapi, { name: 'Acme', adminEmail: 'boss@acme.com' })
  const c = await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 3, expiresOn: '2027-11-15' }, NOW)
  const admin = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  addUser(1) // u1@x.com, own individual org, alone: may move in
  await createOrganisation(strapi, 1, { type: 'individual' })
  addUser(2); addUser(3)
  await createOrganisation(strapi, 2, { type: 'organisation', name: 'Rival' }) // u2: in another company
  const rows = [
    { email: 'new1@acme.com', name: 'New One', role: 'Project Manager' },
    { email: 'u1@x.com', role: 'Administrator' },
    { email: 'u2@x.com' },
    { email: 'new2@acme.com' },
    { email: 'NEW1@acme.com' }, { email: 'boss@acme.com' }, { email: 'not an email' },
  ]
  const preview = await accountsFromPool(strapi, admin.id, { rows }, NOW)
  assert.deepEqual(preview.rows.map(x => [x.email, x.status]), [['new1@acme.com', 'new'], ['u1@x.com', 'join'], ['u2@x.com', 'other'], ['new2@acme.com', 'new']])
  assert.equal(preview.defaultContractId, c.contract.id)
  assert.match(preview.rows[1].roleNote, /one Administrator/)
  assert.equal(db.users.size, 4) // nothing made yet

  const done = await accountsFromPool(strapi, admin.id, { rows: rows.map(x => ({ ...x, contractId: c.contract.id })), apply: true }, NOW)
  assert.equal(done.ok, true, done.error)
  const by = Object.fromEntries(done.rows.map(x => [x.email, x]))
  assert.equal(by['new1@acme.com'].status, 'created')
  assert.ok(by['new1@acme.com'].password)
  assert.deepEqual(by['new1@acme.com'].seats, ['TBT03'])
  assert.deepEqual([by['u1@x.com'].status, by['u1@x.com'].password, by['u1@x.com'].seats], ['moved in', null, ['TBT03']])
  assert.equal(by['u2@x.com'].status, 'other')
  assert.deepEqual([by['new2@acme.com'].status, by['new2@acme.com'].noSeat, by['new2@acme.com'].password], ['skipped', ['TBT03'], null]) // 3 seats: boss + 2
  assert.equal([...db.users.values()].some(u => u.email === 'new2@acme.com'), false) // no account without a seat
  const n1 = [...db.users.values()].find(u => u.email === 'new1@acme.com')
  assert.deepEqual([n1.username, n1.customer_id, n1.primary_role, n1.confirmed], ['New One', r.organisation.customerId, 'Project Manager', true])
  assert.equal(db.users.get(1).primary_role, '')
  assert.equal(db.users.get(2).customer_id !== r.organisation.customerId, true)
  assert.equal(seatOrders(db, c.contract.id).length, 2)

  const view = await companyOverview(strapi, admin.id, NOW)
  assert.deepEqual([view.contracts[0].used, view.contracts[0].free], [3, 0])
  assert.equal(view.members.some(m => m.email === 'new2@acme.com'), false)
})

await t('import: new accounts get the Authenticated role; a taken name falls back to the email; one failure does not stop the rest', async () => {
  const f = fakeStrapi()
  const { strapi, db } = f
  const r = await setUpOrganisation(strapi, { name: 'Acme', adminEmail: 'boss@acme.com', adminName: 'Joe' })
  const c = await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 5, expiresOn: '2027-11-15' }, NOW)
  const admin = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  assert.equal(admin.role, 1)
  f.failEmail = 'bad@acme.com'
  const rows = [{ email: 'joe@rlan.ca', name: 'Joe' }, { email: 'bad@acme.com', name: 'Bad' }, { email: 'ann@acme.com', name: 'Ann' }]
  const done = await accountsFromPool(strapi, admin.id, { rows: rows.map(x => ({ ...x, contractId: c.contract.id })), apply: true }, NOW)
  assert.equal(done.ok, true, done.error)
  const by = Object.fromEntries(done.rows.map(x => [x.email, x]))
  assert.deepEqual([by['joe@rlan.ca'].status, !!by['joe@rlan.ca'].password], ['created', true])
  assert.deepEqual([by['bad@acme.com'].status, by['bad@acme.com'].error], ['failed', 'Strapi 500 on /users: boom'])
  assert.equal(by['ann@acme.com'].status, 'created')
  const joe = [...db.users.values()].find(u => u.email === 'joe@rlan.ca')
  assert.deepEqual([joe.username, joe.role, joe.organisation, joe.customer_id], ['joe@rlan.ca', 1, r.organisation.id, r.organisation.customerId])
  assert.equal(seatOrders(db, c.contract.id).length, 2)
})

await t('administrator: seats on and off, one-time password; only for their own company', async () => {
  const { strapi, db, addUser } = fakeStrapi()
  const r = await setUpOrganisation(strapi, { name: 'Acme', adminEmail: 'boss@acme.com' })
  const c = await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 2, expiresOn: '2027-11-15' }, NOW)
  const admin = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  await accountsFromPool(strapi, admin.id, { rows: [{ email: 'a@acme.com', contractId: c.contract.id }], apply: true }, NOW)
  const a = [...db.users.values()].find(u => u.email === 'a@acme.com')
  assert.equal(seatOrders(db, c.contract.id).length, 1)
  assert.equal((await setSeat(strapi, admin.id, { userId: a.id, contractId: c.contract.id, on: false }, NOW)).ok, true)
  assert.equal(seatOrders(db, c.contract.id).length, 0)
  assert.equal((await setSeat(strapi, admin.id, { userId: a.id, contractId: c.contract.id, on: true }, NOW)).ok, true)
  assert.equal(seatOrders(db, c.contract.id).length, 1)
  assert.match((await setSeat(strapi, admin.id, { userId: admin.id, contractId: c.contract.id, on: false }, NOW)).error, /own licence/)

  const pw = await newOneTimePassword(strapi, admin.id, a.id)
  assert.equal(pw.ok, true)
  assert.equal(db.users.get(a.id).password, pw.password)
  assert.match((await newOneTimePassword(strapi, admin.id, admin.id)).error, /Change password/)
  addUser(7)
  assert.match((await newOneTimePassword(strapi, admin.id, 7)).error, /not in your organisation/)
  assert.match((await companyOverview(strapi, a.id, NOW)).error, /Only the Administrator/)
  assert.match((await accountsFromPool(strapi, a.id, { rows: [] }, NOW)).error, /Only the Administrator/)
})
await t('import: needs a live contract; one licence each, TBT03 by default, switchable; skip', async () => {
  const { strapi, db } = fakeStrapi()
  const r = await setUpOrganisation(strapi, { name: 'Acme', adminEmail: 'boss@acme.com' })
  const admin = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  assert.match((await accountsFromPool(strapi, admin.id, { rows: [{ email: 'a@acme.com' }] }, NOW)).error, /no live Enterprise contract/)
  const cb = await saveContract(strapi, { orgId: r.organisation.id, productId: 8, seats: 3, expiresOn: '2027-11-15' }, NOW)
  const tb = await saveContract(strapi, { orgId: r.organisation.id, productId: 9, seats: 3, expiresOn: '2027-11-15' }, NOW)
  const rows = [{ email: 'a@acme.com' }, { email: 'b@acme.com' }, { email: 'c@acme.com' }]
  const preview = await accountsFromPool(strapi, admin.id, { rows }, NOW)
  assert.equal(preview.defaultContractId, tb.contract.id)
  assert.deepEqual(preview.rows.map(x => x.contractId), [tb.contract.id, tb.contract.id, tb.contract.id])
  const done = await accountsFromPool(strapi, admin.id, { rows: [
    { email: 'a@acme.com', contractId: tb.contract.id },
    { email: 'b@acme.com', contractId: cb.contract.id },
    { email: 'c@acme.com', contractId: '' },
  ], apply: true }, NOW)
  assert.deepEqual(done.rows.map(x => [x.email, x.status, x.seats]), [['a@acme.com', 'created', ['TBT03']], ['b@acme.com', 'created', ['CBT03']], ['c@acme.com', 'skipped', []]])
  assert.equal([...db.users.values()].some(u => u.email === 'c@acme.com'), false)
  assert.match((await accountsFromPool(strapi, admin.id, { rows: [{ email: 'd@acme.com', contractId: 999 }], apply: true }, NOW)).error, /no longer live/)
})

await t('parsePool: tbResources.json, a backup and a tbrunp tbResources.js data file', () => {
  const pool = { tbResources: [
    { tbResName: 'Ann', tbResEmail: 'ann@x.com', tbResPrimaryRole: 'PM', tbResLabourType: 'Human' },
    { tbResName: 'Room', tbResEmail: 'room@x.com', tbResLabourType: 'Generic' },
    { tbResName: 'No mail "quoted } brace"', tbResEmail: '' },
  ] }
  const expected = [{ email: 'ann@x.com', name: 'Ann', role: 'PM' }]
  assert.deepEqual(parsePool(JSON.stringify(pool)), expected)
  assert.deepEqual(parsePool(JSON.stringify({ tbAdminPanel: [], ...pool })), expected)
  const js = `export function gettbResourcesDemoDataCore() {\n    const jdata =\n${JSON.stringify(pool)}\n    return jdata\n}\n`
  assert.deepEqual(parsePool(js), expected)
  assert.throws(() => parsePool('export const x = 1'), /No tbResources/)
})


await t('manager: one date for the company; a product added later, or ended only while nobody else holds a seat', async () => {
  const { strapi, db } = fakeStrapi()
  const r = await setUpOrganisation(strapi, { name: 'Acme', adminEmail: 'boss@acme.com' })
  const org = r.organisation.id
  const first = await saveCompanyContracts(strapi, { orgId: org, seats: { CBT03: 2, TBT03: 3 }, expiresOn: '2027-06-30' }, NOW)
  assert.equal(first.ok, true, first.error)
  const id = code => first.contracts.find(x => x.productCode === code).id
  const admin = [...db.users.values()].find(u => u.email === 'boss@acme.com')
  await accountsFromPool(strapi, admin.id, { rows: [{ email: 'a@acme.com', contractId: id('TBT03') }], apply: true }, NOW)

  // Agilebars added later; every contract and seat moves to the new date.
  const add = await saveCompanyContracts(strapi, { orgId: org, seats: { CBT03: 2, TBT03: 3, ABT03: 4 }, expiresOn: '2027-12-31' }, NOW)
  assert.equal(add.ok, true, add.error)
  assert.deepEqual([add.made, add.changed.sort()], [['ABT03'], ['CBT03', 'TBT03']])
  assert.deepEqual(add.contracts.map(x => x.expiresOn), ['31 December 2027', '31 December 2027', '31 December 2027'])
  assert.deepEqual(seatOrders(db, id('TBT03')).map(o => o.expires_on), ['31 December 2027'])

  // Timebars has a member's seat: it cannot end, nor go below the 2 in use. Costbars (only the Administrator) can end.
  assert.match((await saveCompanyContracts(strapi, { orgId: org, seats: { CBT03: 2, TBT03: 0, ABT03: 4 }, expiresOn: '2027-12-31' }, NOW)).error, /1 person holds a seat/)
  assert.match((await saveCompanyContracts(strapi, { orgId: org, seats: { CBT03: 2, TBT03: 1, ABT03: 4 }, expiresOn: '2027-12-31' }, NOW)).error, /already uses 2/)
  const end = await saveCompanyContracts(strapi, { orgId: org, seats: { CBT03: 0, TBT03: 3, ABT03: 4 }, expiresOn: '2027-12-31' }, NOW)
  assert.equal(end.ok, true, end.error)
  assert.deepEqual(end.ended, ['CBT03'])
  assert.equal(db.orders.get(id('CBT03')).active_status, false)
  assert.deepEqual(end.contracts.map(x => x.productCode).sort(), ['ABT03', 'TBT03'])
})

console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
