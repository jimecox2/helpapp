// app/admin/licences/page.jsx — Licences & Accounts (Phase 3). Who sees what is decided on the server
// (./_actions.js); this page only needs a login.
import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import Licences from './_components/Licences'
import { licensingMode } from '@/lib/licence/selfManaged'

export async function generateMetadata() {
  return { title: licensingMode() === 'self-managed' ? 'Enterprise Account Groups' : 'Licences & Accounts' }
}

export default async function LicencesPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin?callbackUrl=/admin/licences')
  // Self-managed servers run the software inside the enterprise: groups of accounts, not bought licences (Jim, 26 Nov 2026).
  const selfManaged = licensingMode() === 'self-managed'
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {selfManaged ? (
        <>
          <h1 className="text-3xl font-extrabold text-gray-900">Enterprise Account Groups</h1>
          <p className="text-gray-600 mt-2 mb-6">
            An account group is a part of your enterprise that plans its own work with its own people and resources:
            a department such as HR or Engineering, a division, a programme or a site. Each group has an Administrator,
            accounts for its people so they can sign in, and seats of Costbars, Timebars and Agilebars. The group&apos;s
            Administrator makes the accounts from the resource pool, gives out the seats, and sets a new one-time
            password when someone is locked out.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold text-gray-900">Licences &amp; Accounts</h1>
          <p className="text-gray-600 mt-2 mb-6">
            Your company&apos;s Enterprise contracts and seats. Make accounts for your people from the resource pool,
            give them seats, and set a new one-time password when someone is locked out.
          </p>
        </>
      )}
      <Licences />
    </div>
  )
}
