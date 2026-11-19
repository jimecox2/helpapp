// app/admin/licences/page.jsx — Licences & Accounts (Phase 3). Who sees what is decided on the server
// (./_actions.js); this page only needs a login.
import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import Licences from './_components/Licences'

export const metadata = { title: 'Licences & Accounts' }

export default async function LicencesPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin?callbackUrl=/admin/licences')
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Licences &amp; Accounts</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Your company&apos;s Enterprise contracts and seats. Make accounts for your people from the resource pool,
        give them seats, and set a new one-time password when someone is locked out.
      </p>
      <Licences />
    </div>
  )
}
