// lib/help/strapiSync.js — public/docsHelp/*.md -> Strapi help-articles. Server only.
// Ported from tbwww's /api/docshelp-list and /api/docshelp-sync (the DocsHelp Sync Manager).
//
// An article is matched to a file by slug (fileToSlug: Common_02_User_Interface_Guide.md ->
// common-02-user-interface-guide). The content is the file after its # title, with relative guide
// links and site paths made absolute on HELP_URL, because Strapi content is read on other sites
// (www.timebars.com/knowledgebase/helparticles): production writes help.timebars.com links, staging
// helps.timebars.com - whatever CLOUD_HELP_URL says on the server doing the push.
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { API_URL, HELP_URL } from '@/config/site'
import { fileToSlug } from '@/lib/help/helpDocs'

const DOCS_DIR = path.join(process.cwd(), 'public', 'docsHelp')

// Strapi category and product tag ids per file-name prefix (same ids tbwww used).
const PREFIX_MAP = {
  Agilebars: { categoryId: 8, productTags: [5], product: 'Agilebars' },
  Timebars: { categoryId: 9, productTags: [6], product: 'Timebars' },
  Costbars: { categoryId: 6, productTags: [7], product: 'Costbars' },
  Common: { categoryId: 13, productTags: [8], product: 'Common' },
}

const SAFE_FILE = /^[A-Za-z0-9_.-]+\.md$/

function adminHeaders() {
  const token = process.env.STRAPI_ADMIN_TOKEN
  if (!token) throw new Error('STRAPI_ADMIN_TOKEN is not set on the server')
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function strapi(pathAndQuery, init = {}) {
  const res = await fetch(`${API_URL}${pathAndQuery}`, { ...init, headers: adminHeaders(), cache: 'no-store' })
  const text = await res.text()
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

export const strapiAddress = () => API_URL

// Relative guide links and site paths -> absolute links on the help host.
export function absoluteHelpLinks(markdown) {
  return markdown
    .replace(/\]\(([A-Za-z0-9_]+)\.md(#[^)]*)?\)/g, (_, file, hash = '') => `](${HELP_URL}/${fileToSlug(file)}${hash})`)
    .replace(/\]\((\/(?:images|pdf|spreadsheets)\/[^)\s]*)/g, (_, p) => `](${HELP_URL}${p}`)
}

function split(raw) {
  const lines = raw.split('\n')
  const h1 = lines.findIndex(l => l.startsWith('# '))
  return { lines, h1, body: (h1 >= 0 ? lines.slice(h1 + 1) : lines).join('\n').trim() }
}

// The fields Create sends, and Update sends when "also update title, description, tags and SEO" is on.
function articleFields(filename, raw) {
  const { lines, h1, body } = split(raw)
  const title = h1 >= 0 ? lines[h1].replace(/^# /, '').trim() : filename.replace('.md', '').replace(/_/g, ' ')
  const meta = PREFIX_MAP[filename.split('_')[0]] || PREFIX_MAP.Common

  const descLine = body.split('\n').find(l => {
    const t = l.trim()
    return t && !t.startsWith('#') && !t.startsWith('---') && !t.startsWith('**') && !t.startsWith('![') && t.length > 20
  })
  const description = (descLine ? descLine.replace(/[*_`[\]()>]/g, '').trim() : title).slice(0, 150)
  const tags = lines
    .filter(l => /^#{2,3} /.test(l))
    .map(l => l.replace(/^#{2,3} /, '').trim())
    .slice(0, 10)
    .join(', ')
    .slice(0, 900)
  const titleKeywords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3).join(', ')

  return {
    meta,
    fields: {
      title,
      description,
      tags,
      seo_title: `${title} | Timebars Ltd. Help`.slice(0, 255),
      seo_keywords: `${meta.product.toLowerCase()}, ${titleKeywords}, timebars ltd, help guide`.slice(0, 900),
    },
    content: absoluteHelpLinks(body),
  }
}

// Every .md file in public/docsHelp with its matching Strapi article, if any.
export async function listHelpArticles() {
  const files = (await readdir(DOCS_DIR)).filter(f => f.endsWith('.md')).sort()
  const data = await strapi('/help-articles?fields[0]=slug&fields[1]=title&pagination[limit]=500')
  const bySlug = Object.fromEntries((data?.data || []).map(a => [a.attributes?.slug, { id: a.id, title: a.attributes?.title }]))
  return files.map(filename => {
    const slug = fileToSlug(filename)
    const hit = bySlug[slug]
    return {
      filename,
      slug,
      product: (PREFIX_MAP[filename.split('_')[0]] || PREFIX_MAP.Common).product,
      exists: !!hit,
      strapiId: hit?.id || null,
      strapiTitle: hit?.title || null,
    }
  })
}

async function readDoc(filename) {
  if (!SAFE_FILE.test(filename || '')) throw Object.assign(new Error('Invalid filename'), { status: 400 })
  try {
    return await readFile(path.join(DOCS_DIR, filename), 'utf8')
  } catch {
    throw Object.assign(new Error(`File not found: ${filename}`), { status: 404 })
  }
}

export async function createHelpArticle(filename) {
  const { meta, fields, content } = articleFields(filename, await readDoc(filename))
  const data = await strapi('/help-articles', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        ...fields,
        content,
        slug: fileToSlug(filename),
        type: 'Help',
        status: 'Preliminary',
        author: 'Jim Cox',
        category: { id: meta.categoryId },
        product_tags: { connect: meta.productTags },
      },
    }),
  })
  return { id: data?.data?.id, title: fields.title }
}

// Updates an existing article by id: content only, or with withMeta also title, description, tags, SEO.
export async function updateHelpArticle(filename, strapiId, withMeta) {
  if (!strapiId) throw Object.assign(new Error('Missing strapiId for update'), { status: 400 })
  const { fields, content } = articleFields(filename, await readDoc(filename))
  await strapi(`/help-articles/${encodeURIComponent(strapiId)}`, {
    method: 'PUT',
    body: JSON.stringify({ data: withMeta ? { ...fields, content } : { content } }),
  })
  return { title: fields.title }
}
