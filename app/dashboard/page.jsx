// app/dashboard/page.jsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import ExecutiveDashboard from "./_components/ExecutiveDashboard"

/**
 * Enterprise Landing Page
 * Executive dashboard with stats and insights from dashboard sources
 */
const EnterprisePage = async () => {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  const { user: { email }, jwt } = session

  return (
    <div className="container mx-auto p-6">
      <ExecutiveDashboard userEmail={email} jwt={jwt} />
      <p className="mt-8 text-right text-xs text-gray-400">
        <Link href="/personaldashboard" className="hover:text-gray-600 hover:underline">Personal Dashboard</Link>
      </p>
    </div>
  )
}

export default EnterprisePage
