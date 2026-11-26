// app/admin/users/page.jsx — Users, Roles & Seats for an Administrator's own organisation (Jim, 26 Nov 2026).
import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import { isAdministrator } from '@/lib/auth/rbac'
import People from './_components/People'

export const metadata = { title: 'Users, Roles & Seats' }

export default async function UsersPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin?callbackUrl=/admin/users')
  if (!isAdministrator(session)) redirect('/dashboard')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Users, Roles &amp; Seats</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Everyone in your organisation who has a Timebars Cloud account: the role that decides which pubsets and
        dashboards they see, and their seat of each product. Import your resource pool to make accounts, move people
        in, update roles and give seats in one step.
      </p>
      <People />
    </div>
  )
}
