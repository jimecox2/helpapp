// lib/licence/parsePool.js — reads a resource pool export in the browser (no server imports).
// A tbrunp backup (.js/.json with a tbResources store), a tbResources.json, a plain array, or a CSV with
// tbResEmail (and tbResName, tbResPrimaryRole) columns. Only Human resources with an email are kept.
// Used by Users & Roles (roles from the pool) and Licences & Accounts (accounts from the pool).

export function parsePool(text, { needRole = false } = {}) {
  const trimmed = String(text || '').trim()
  let list = null
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const data = JSON.parse(trimmed)
    list = Array.isArray(data) ? data : data.tbResources
  } else {
    const [head = '', ...lines] = trimmed.split(/\r?\n/)
    const cols = head.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    list = lines.filter(Boolean).map(line => {
      const cells = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      return Object.fromEntries(cols.map((c, i) => [c, cells[i]]))
    })
  }
  if (!Array.isArray(list)) throw new Error('No tbResources rows found in that file')
  return list
    .filter(r => r && r.tbResEmail && (!needRole || r.tbResPrimaryRole) && (r.tbResLabourType || 'Human') === 'Human')
    .map(r => ({ email: String(r.tbResEmail).trim(), name: String(r.tbResName || '').trim(), role: String(r.tbResPrimaryRole || '').trim() }))
}
