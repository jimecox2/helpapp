'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const errorMessages = {
  Configuration: `Wrong password? New account? Retry the sign in process. If you continue to arrive here, 
  your account may be blocked from too many retries. Try changing your password or contact us.`,
  AccessDenied: "You do not have permission to sign in yet, try again if this is your first time!.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An unexpected error occurred during authentication.",
  CredentialsSignin: `Maybe you did not confirm your account vie the email registration process or you entered wrong password.
  Try again or reset your password. 
  If problem persists contact us at the address in the Footer.`,

}

function AuthErrorInner() {
  const searchParams = useSearchParams()
  const [error, setError] = useState(errorMessages.Default)

  useEffect(() => {
    const errorType = searchParams.get('error') || 'Default'
    
    // Check if the error is one of our predefined types
    if (errorMessages[errorType]) {
      setError(errorMessages[errorType])
    } else {
      // If it's not a predefined type, it's likely the custom error from Strapi
      setError(decodeURIComponent(errorType))
    }
  }, [searchParams])

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-3xl font-bold mb-6 text-red-600">Authentication Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link 
          href="/auth/signin" 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 inline-block"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}


// useSearchParams needs a Suspense boundary for the static build.
export default function AuthError() {
  return (
    <Suspense fallback={null}>
      <AuthErrorInner />
    </Suspense>
  )
}
