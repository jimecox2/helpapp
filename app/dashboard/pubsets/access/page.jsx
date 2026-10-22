// app/dashboard/pubsets/access/page.jsx
import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { filterPubsetsByAccess } from '@/lib/auth/rbac';
import DebugInfo from '../_components/DebugInfo';
import { fetchAllPubsets } from '../_lib/fetchAllPubsets';

/**
 * Manage Access - the Access Analysis for pubsets (why the user can or cannot see each one).
 * Opened from the Dashboard Pubsets menu and the Manage Access button on /dashboard/pubsets.
 */
export default async function ManageAccessPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/pubsets/access');
  }

  const allPubsets = await fetchAllPubsets(session.jwt);
  const accessiblePubsets = filterPubsetsByAccess(allPubsets, session);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Manage Access</h1>
      <p className="mb-6 text-sm text-gray-700">
        Why you can or cannot see each pubset, based on your role, customer ID and the grants on the pubset.
      </p>
      <DebugInfo
        session={session}
        allPubsets={allPubsets}
        accessiblePubsets={accessiblePubsets}
        defaultOpen
      />
    </div>
  );
}

export const metadata = {
  title: 'Manage Access | Enterprise Dashboard',
  description: 'See which pubsets you can access and why',
};
