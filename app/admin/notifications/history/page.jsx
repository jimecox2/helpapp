// /admin/notifications/history — placeholder until sent notifications are recorded.
import Link from 'next/link'

export const metadata = { title: 'Notification History' }

export default function NotificationHistoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Notification History</h1>
      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-900 space-y-2">
        <p><strong>History is not recorded yet.</strong></p>
        <p>
          Pushover and SMS messages are sent by the notification run, but nothing keeps a copy of what was sent.
          This page will list them once a <code>notification-log</code> collection exists in Strapi and the send
          routes write to it.
        </p>
      </div>
      <p className="mt-6 text-sm">
        <Link href="/admin/notifications" className="text-blue-600 hover:underline">Go to Notification Settings</Link>
      </p>
    </div>
  )
}
