// lib/help/renderGuide.js
// Markdown -> HTML for the guide pages (/help/<slug>). Server side, no DOM.
//
// The help files are our own content, but the page still never passes raw HTML through:
// HTML in the markdown is shown as text, and only http(s), mailto, relative and #anchor
// URLs are kept. Links between guides are stored relative (Common_02_User_Interface_Guide.md#the-canvas)
// and come out as /help/common-02-user-interface-guide#the-canvas, so a file works on any host.
import { Marked } from 'marked'
import { fileToSlug } from './helpDocs.js'

const escapeHtml = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// GitHub's heading-anchor rule (what the TOC links in the help files were written against):
// lower case, drop punctuation and emoji, each space becomes a hyphen (runs are not collapsed),
// and a repeated heading gets -1, -2 ...
export function headingSlugger() {
  const seen = {}
  return text => {
    const base = text
      .toLowerCase()
      .replace(/[\uFE00-\uFE0F\u200D]/g, '') // emoji variation selectors and joiners
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
      .replace(/ /g, '-')
    let id = base
    if (seen[base] !== undefined) {
      seen[base] += 1
      id = `${base}-${seen[base]}`
    } else {
      seen[base] = 0
    }
    return id
  }
}

// Plain text of a heading as GitHub sees it: markdown emphasis, code and link syntax removed.
export function headingText(raw) {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`]/g, '')
    .replace(/(^|\s)_+|_+(\s|$)/g, '$1$2')
    .trim()
}

const GUIDE_LINK = /^([A-Za-z0-9_]+)\.md(#.*)?$/
const SAFE_URL = /^(https?:|mailto:|\/|#|\.{0,2}\/)/i

export function guideHref(href) {
  const m = GUIDE_LINK.exec(href || '')
  return m ? `/help/${fileToSlug(m[1])}${m[2] || ''}` : href
}

function safeUrl(href) {
  const h = guideHref(String(href || '').trim())
  return SAFE_URL.test(h) ? h : '#'
}

// Returns { html, title, toc: [{ id, text }] } - toc holds the H2s, for the page's contents list.
export function renderGuide(markdown) {
  // The logo banner at the top of each file (logo, then ---) is dropped: the page has its own header.
  markdown = markdown.replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*\n-{3,}\s*\n/, '')
  const slug = headingSlugger()
  const toc = []
  let title = ''

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, raw }) {
        const text = headingText(raw.replace(/^#+\s*/, '').replace(/\s*#*\s*$/, ''))
        const id = slug(text)
        if (depth === 1 && !title) title = text
        if (depth === 2 && !/^table of contents$/i.test(text)) toc.push({ id, text })
        return `<h${depth} id="${escapeHtml(id)}">${this.parser.parseInline(tokens)}</h${depth}>\n`
      },
      html({ text }) {
        return escapeHtml(text)
      },
      link({ href, title: t, tokens }) {
        const url = safeUrl(href)
        const external = /^https?:/i.test(url)
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
        const tt = t ? ` title="${escapeHtml(t)}"` : ''
        return `<a href="${escapeHtml(url)}"${tt}${attrs}>${this.parser.parseInline(tokens)}</a>`
      },
      image({ href, title: t, text }) {
        const tt = t ? ` title="${escapeHtml(t)}"` : ''
        return `<img src="${escapeHtml(safeUrl(href))}" alt="${escapeHtml(text)}"${tt} loading="lazy">`
      },
    },
  })

  const html = marked.parse(markdown)
  return { html, title, toc }
}
