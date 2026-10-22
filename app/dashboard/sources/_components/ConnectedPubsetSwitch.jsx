'use client'

// "Use my connected pubset" switch (Strapi users.use_connected_pubset). When ticked, every dashboard
// page reads the user's own connected pubset instead of the active source (lib/crud/dashboardData.js).

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { setUseConnectedPubsetAction } from '@/app/dashboard/_actions/userSettings'

export default function ConnectedPubsetSwitch({ initialValue = false }) {
  const router = useRouter()
  const [checked, setChecked] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = async (e) => {
    const next = e.target.checked
    setSaving(true)
    setError(null)
    const result = await setUseConnectedPubsetAction(next)
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setChecked(next)
    router.refresh()
  }

  return (
    <div className={`rounded-lg border p-4 ${checked ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <label
        className="flex items-center gap-3 cursor-pointer select-none"
        title="Tick to make every dashboard report use the pubset you chose as connected when publishing from Agilebars, Timebars or Costbars. Untick to use the active source again."
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={saving}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className="font-medium text-gray-900">Use my connected pubset instead of the active source</span>
        {saving && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
      </label>
      {checked && (
        <p className="mt-2 ml-7 text-sm text-blue-800">
          All dashboard reports now show your connected pubset. The active source below is not used until you untick this.
        </p>
      )}
      {error && <p className="mt-2 ml-7 text-sm text-red-700">Could not save: {error}</p>}
    </div>
  )
}
