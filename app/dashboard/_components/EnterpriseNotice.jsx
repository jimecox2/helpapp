// app/dashboard/_components/EnterpriseNotice.jsx
// Shown instead of an Enterprise edition page (Dashboard Sources, Manage Pubsets, Generate Source)
// when none of the user's active licenses is tier 3 (lib/license/tier.js).
import Link from 'next/link'
import { WWW_URL } from '@/config/site'
import { getLicenseTier, isEnterpriseTier } from '@/lib/license/tier'

export function EnterpriseNotice({ feature }) {
  return (
    <div className="max-w-3xl rounded-lg border border-blue-300 bg-blue-50 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Enterprise edition</h2>
      <p className="mt-2 text-gray-700">
        {feature} {feature.endsWith('s') ? 'are' : 'is'} part of the Enterprise edition: a Tier 3 license for
        Agilebars, Timebars or Costbars. Combining pubsets from several teams into one dashboard, and the
        master resource pool, come with it.
      </p>
      <p className="mt-2 text-gray-700">
        Your dashboard shows your connected pubset, the one you chose when publishing.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/dashboard" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Go to my dashboard</Link>
        <a href={`${WWW_URL}/sales/pricing`} className="rounded border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">See pricing</a>
      </div>
    </div>
  )
}

/** For server pages: the notice when the user is below tier 3, else null. */
export async function enterpriseGate(session, feature) {
  const tier = await getLicenseTier(session.user.email, session.jwt)
  if (isEnterpriseTier(tier)) return null
  return <div className="container mx-auto p-6"><EnterpriseNotice feature={feature} /></div>
}
