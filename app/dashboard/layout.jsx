// app/dashboard/layout.jsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import EnterpriseHeader from "./_components/EnterpriseHeader"
import { getLicenseTier, isEnterpriseTier } from "@/lib/license/tier"

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * Dashboard Layout
 * Wraps all dashboard pages with blue header navigation
 * No main sales/support navbar - this is a separate application area
 */
export default async function EnterpriseLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  // Enterprise edition (tier 3) shows Manage Pubsets and Manage Sources in the nav
  const enterprise = isEnterpriseTier(await getLicenseTier(session.user.email, session.jwt))

  return (
    <div className="min-h-screen bg-gray-50">
      <EnterpriseHeader user={session.user} enterprise={enterprise} />
      <main>{children}</main>
    </div>
  )
}
