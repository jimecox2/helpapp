// License expiry rule (end of the expires_on day, then GRACE_DAYS of grace).
import assert from 'assert'
import { GRACE_DAYS, parseExpiresOn, licenseStatus, isPastExpiry, isExpiredPastGrace, formatLicenseDate, licenseExpiryMessage } from '../lib/license/expiry.js'

const at = (y, m, d, h = 12) => new Date(y, m - 1, d, h)

assert.strictEqual(GRACE_DAYS, 7)
assert.strictEqual(formatLicenseDate(parseExpiresOn('08-Jul-2024')), '08-Jul-2024')
assert.strictEqual(formatLicenseDate(parseExpiresOn('27 March 2025')), '27-Mar-2025')
assert.strictEqual(formatLicenseDate(parseExpiresOn('2025-03-27')), '27-Mar-2025')
assert.strictEqual(formatLicenseDate(parseExpiresOn('2025-03-27T00:00:00.000Z')), '27-Mar-2025')
assert.strictEqual(parseExpiresOn(''), null)
assert.strictEqual(parseExpiresOn('soon'), null)
assert.strictEqual(parseExpiresOn(null), null)

// Last day: still active, even late at night.
assert.strictEqual(licenseStatus('10-Nov-2026', at(2026, 11, 10, 23)).state, 'active')
assert.strictEqual(licenseStatus('10-Nov-2026', at(2026, 11, 10, 0)).daysLeft, 0)
assert.strictEqual(licenseStatus('10-Nov-2026', at(2026, 11, 1)).daysLeft, 9)
// Next day: grace, 7 days left.
const g1 = licenseStatus('10-Nov-2026', at(2026, 11, 11, 0))
assert.strictEqual(g1.state, 'grace')
assert.strictEqual(g1.graceDaysLeft, 7)
assert.strictEqual(formatLicenseDate(g1.graceEndsOn), '17-Nov-2026')
// Last grace day.
const g7 = licenseStatus('10-Nov-2026', at(2026, 11, 17, 23))
assert.strictEqual(g7.state, 'grace')
assert.strictEqual(g7.graceDaysLeft, 1)
// After grace.
assert.strictEqual(licenseStatus('10-Nov-2026', at(2026, 11, 18, 0)).state, 'expired')
assert.strictEqual(licenseStatus('08-Jul-2024', at(2026, 11, 5)).state, 'expired')
assert.strictEqual(licenseStatus('', at(2026, 11, 5)).state, 'unknown')
// Month and year ends.
assert.strictEqual(formatLicenseDate(licenseStatus('28-Dec-2026', at(2026, 12, 29)).graceEndsOn), '04-Jan-2027')

assert.strictEqual(isPastExpiry('10-Nov-2026', at(2026, 11, 10)), false)
assert.strictEqual(isPastExpiry('10-Nov-2026', at(2026, 11, 11)), true)
assert.strictEqual(isExpiredPastGrace('10-Nov-2026', at(2026, 11, 17)), false)
assert.strictEqual(isExpiredPastGrace('10-Nov-2026', at(2026, 11, 18)), true)
assert.strictEqual(isExpiredPastGrace('', at(2026, 11, 18)), false)

assert.strictEqual(licenseExpiryMessage('Timebars', '10-Nov-2026', at(2026, 11, 9)), '')
assert.match(licenseExpiryMessage('Timebars', '10-Nov-2026', at(2026, 11, 16)), /expired on 10-Nov-2026\. Publishing to the Cloud stops in 2 days \(17-Nov-2026\)/)
assert.match(licenseExpiryMessage('Timebars', '10-Nov-2026', at(2026, 11, 17)), /stops in 1 day /)
assert.match(licenseExpiryMessage('Costbars', '08-Jul-2024', at(2026, 11, 5)), /^Costbars license expired on 08-Jul-2024\. Publishing to the Cloud is stopped\./)

console.log('licenseExpiry: all tests passed')
