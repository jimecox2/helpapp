
/* 
app/auth/signin/page.js
*/

'use client';
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod';
import { WWW_URL } from '@/config/site'

// Zod validation schema for sign-in form
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});


function SignInPageInner() {
  const [error, setError] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  let callbackUrl = searchParams.get('callbackUrl');
  
  if (callbackUrl) {
    console.log("callbackUrl: ", callbackUrl)
  } else {
    callbackUrl = "/"
  }
 // console.log("callbackUrl searchParams ", callbackUrl)

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Reset error before new validation
  setError('');
  
  // Zod validation
  const validationResult = signInSchema.safeParse({ email, password });

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.format();
    if (formattedErrors.email) {
      setError(formattedErrors.email._errors[0]);
    } else if (formattedErrors.password) {
      setError(formattedErrors.password._errors[0]);
    }
    return;
  }

  setIsLoading(true);

  // Set up an AbortController to handle timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout after 5 seconds

  try {
    const res = await signIn('credentials', {
      redirect: false, 
      email,
      password,
      signal: controller.signal, // Attach the abort controller
    });

    if (res?.error) {
      setError(res.error);
      router.push('/auth/error?error=' + res.error);
    } else {
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push('/');
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      setError('The server is taking too long to respond. Please try again later.');
    } else {
      setError('Failed to sign in, the service may be down. Please try again.');
    }
  } finally {
    clearTimeout(timeoutId);
    setIsLoading(false);
  }
};


  const handleSubmitOld = async (e) => {
    e.preventDefault();

    // Reset error before new validation
    setError('');

    // Zod validation
    const validationResult = signInSchema.safeParse({ email, password, confirmPassword });

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      if (formattedErrors.email) {
        setError(formattedErrors.email._errors[0]);
      } else if (formattedErrors.password) {
        setError(formattedErrors.password._errors[0]);
      } else if (formattedErrors.confirmPassword) {
        setError(formattedErrors.confirmPassword._errors[0]);
      }
      return;
    }

    setIsLoading(true);
    // Attempt to sign in with credentials
    const res = await signIn('credentials', {
      redirect: false, // Prevent automatic redirection
      email,
      password,

    });
    if (res?.error) {

      // Display the specific error message from the authorize function
      setError(res.error); // This will now display the actual error from the [auth][cause] log
    //  console.log("resp.err ", error)
        router.push('/auth/error?error='+res.error);
      throw new Error('Failed to sign in, service may be down.'); // This will trigger the error.tsx page
      


    } else {
    // we will get callbackUrl from search params in url
    if (callbackUrl) {
      router.push(callbackUrl);
    } else {
      // If no callbackUrl, you might want to redirect to a default page or show a success message
      router.push('/'); // or wherever you want users to go after successful login
    }
    } 

    setIsLoading(false);
  };

  const handleProviderSignIn = async (provider) => {
    setError(""); // Clear any previous errors
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: callbackUrl});
    } catch (error) {
      console.error(`An error occurred during ${provider} sign in:`, error);
      setError(`An unexpected error occurred with ${provider} sign in. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${error.includes('Email') ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            disabled={isLoading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${error.includes('Password') ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            disabled={isLoading}
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Credentials Sign In'}
          </button>
        </form>

        <div className="hidden">
          <button onClick={() => handleProviderSignIn('google')} tabIndex={-1} aria-hidden="true">Sign in with Google</button>
          <button onClick={() => handleProviderSignIn('github')} tabIndex={-1} aria-hidden="true">Sign in with GitHub</button>
          <button onClick={() => handleProviderSignIn('facebook')} tabIndex={-1} aria-hidden="true">Sign in with Facebook</button>
        </div>
        <p className="text-gray-600 pt-4">
          Don't have an account?{' '}
          <a href={`${WWW_URL}/auth/new-user`} className="text-blue-600 hover:underline">
            Register at timebars.com
          </a>
        </p>
        <p className="text-gray-600 pt-4">
          Forgot your password?{' '}
          <a href={`${WWW_URL}/auth/password-forgot`} className="text-blue-600 hover:underline">
            Reset it at timebars.com
          </a>
        </p>
        <p className="text-gray-600 pt-4">
          New user? Did you confirm your account via the registration email?
        </p>
      </div>
    </div>
  )
}

// useSearchParams needs a Suspense boundary for the static build.
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  )
}
