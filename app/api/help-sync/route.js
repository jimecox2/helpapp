// /api/help-sync — the /update-help page's API. HELP_EDITORS + Strapi Administrator only.
//   GET  -> every public/docsHelp file with its Strapi help-article (or none)
//   POST { action: 'create' | 'update', filename, strapiId, withMeta }
import { NextResponse } from 'next/server'
import { checkHelpEditor } from '@/lib/help/editors'
import { listHelpArticles, createHelpArticle, updateHelpArticle } from '@/lib/help/strapiSync'

export const dynamic = 'force-dynamic'

const fail = (e, status = 500) => NextResponse.json({ error: e.message || String(e) }, { status: e.status || status })

export async function GET() {
  const who = await checkHelpEditor()
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status })
  try {
    return NextResponse.json(await listHelpArticles())
  } catch (e) {
    console.error('help-sync list error:', e)
    return fail(e)
  }
}

export async function POST(request) {
  const who = await checkHelpEditor()
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status })
  try {
    const { action, filename, strapiId, withMeta } = await request.json()
    if (action === 'create') return NextResponse.json({ success: true, ...(await createHelpArticle(filename)) })
    if (action === 'update') return NextResponse.json({ success: true, ...(await updateHelpArticle(filename, strapiId, !!withMeta)) })
    return NextResponse.json({ error: 'Invalid action - use "create" or "update"' }, { status: 400 })
  } catch (e) {
    console.error('help-sync error:', e)
    return fail(e)
  }
}
