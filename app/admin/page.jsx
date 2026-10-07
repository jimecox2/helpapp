// app/admin/page.jsx - Server-side page for System Administrators
import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { isAdministrator } from '@/lib/auth/rbac';
import SystemAdminDashboard from './_components/SystemAdminDashboard';



export default async function AdminPage() {
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
          <h1 className="text-3xl font-extrabold text-gray-900">Configure Notifications</h1>
          <p className="text-gray-600 mt-2">
            Licensed Administrator: {session.user.email}. Configure notification thresholds, delivery methods, and alerts.
          </p>
          <div className="mt-4 flex space-x-4">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              ← Back to Enterprise Dashboard
            </a>
          </div>
        </div>

        {/* System Dashboard - Client Component */}
        <div className="mb-8">
          <SystemAdminDashboard session={session} />
        </div>



        {/* Additional Admin Sections for later 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Logs</h3>
            <p className="text-sm text-gray-500 mb-4">View and manage system logs</p>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View Logs →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Database Management</h3>
            <p className="text-sm text-gray-500 mb-4">Backup and maintenance operations</p>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              Manage Database →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
            <p className="text-sm text-gray-500 mb-4">Manage API keys and integrations</p>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              Configure APIs →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Authentication and security policies</p>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              Security Settings →
            </button>
          </div>
        </div>*/}

      </div>
    </div>
  );
}