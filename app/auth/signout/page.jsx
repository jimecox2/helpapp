
/* 
app/auth/signout/page.jsx
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { signOut } from 'next-auth/react'

export default function SignOut() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })

      
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('An error occurred while signing out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Out</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
        <button 
          onClick={handleSignOut}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-red-400"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Out...' : 'Sign Out'}
        </button>
        <button 
          onClick={() => router.back()}
          className="ml-4 text-blue-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}