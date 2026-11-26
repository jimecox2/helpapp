// lib/licence/parsePool.js — reads a resource pool export in the browser (no server imports).
// A tbrunp backup (.js/.json with a tbResources store), a tbrunp data file (tbResources.js: the JSON inside
// `export function ... { const jdata = {...} }`), a tbResources.json, a plain array, or a CSV with
// tbResEmail (and tbResName, tbResPrimaryRole) columns. Only Human resources with an email are kept.
// Used by Users, Roles & Seats (one import: accounts, roles and seats from the pool).

export function parsePool(text, { needRole = false } = {}) {
  const trimmed = String(text || '').trim()
  let list = null
  if (trimmed.startsWith('{') || trimmed.startsWith('[') || /^(export|const|let|var|function|\/\/|\/\*)/.test(trimmed)) {
    const data = JSON.parse(trimmed.startsWith('{') || trimmed.startsWith('[') ? trimmed : jsonInScript(trimmed))
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

// The {"tbResources": [...]} object inside a .js data file: from its opening brace to the brace that closes it.
function jsonInScript(text) {
  const start = text.search(/\{\s*"tbResources"\s*:/)
  if (start < 0) throw new Error('No tbResources data found in that .js file')
  let depth = 0
  let inString = false
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (ch === '\\') i++
      else if (ch === '"') inString = false
    } else if (ch === '"') inString = true
    else if (ch === '{') depth++
    else if (ch === '}' && --depth === 0) return text.slice(start, i + 1)
  }
  throw new Error('The tbResources data in that .js file is not complete')
}
