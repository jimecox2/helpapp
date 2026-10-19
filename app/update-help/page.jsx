// /update-help — push the help files (public/docsHelp) into Strapi help-articles.
// Only for a Strapi Administrator whose email is in HELP_EDITORS (lib/help/editors.js).
import { checkHelpEditor } from '@/lib/help/editors'
import { strapiAddress } from '@/lib/help/strapiSync'
import { HELP_URL } from '@/config/site'
import HelpSyncManager from './_components/HelpSyncManager'

export const metadata = {
  title: 'Update Help',
  robots: { index: false, follow: false },
}

export default async function UpdateHelpPage() {
  const who = await checkHelpEditor()
  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800">Update Help</h1>
      {who.ok ? (
        <HelpSyncManager strapiUrl={strapiAddress()} helpUrl={HELP_URL} />
      ) : (
        <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{who.error}.</p>
      )}
    </div>
  )
}
