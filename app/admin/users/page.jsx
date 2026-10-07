// app/admin/users/page.jsx — Users & Roles (RBAC) for an Administrator's own organisation.
import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import { isAdministrator } from '@/lib/auth/rbac'
import UsersAndRoles from './_components/UsersAndRoles'

export const metadata = { title: 'Users & Roles' }

export default async function UsersPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin?callbackUrl=/admin/users')
  if (!isAdministrator(session)) redirect('/dashboard')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Users &amp; Roles</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Everyone in your organisation who has a Timebars Cloud account, and the role that decides which
        pubsets and dashboards they can see. New people register at timebars.com first.
      </p>
      <UsersAndRoles />
    </div>
  )
}
