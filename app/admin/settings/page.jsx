// app/admin/page.jsx - Server-side page for System Administrators
import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { isAdministrator } from '@/lib/auth/rbac';

export default async function SettingsAdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  if (!isAdministrator(session)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Settings and Help</h1>
          <p className="text-gray-600 mt-2">
            Licensed administrator page for managing your Dashboard. 
            Logged in as: <span className="font-medium">{session.user.email}</span>
          </p>
          <div className="mt-4 flex space-x-4">
            <a 
              href="/admin" 
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              ← Back to Admin
            </a>
          </div>
        </div>

        {/* User Management - Client Component */}
        <div className="mb-8">
Put some info here to asssist users with settings etc.
        </div>

      </div>
    </div>
  );
}