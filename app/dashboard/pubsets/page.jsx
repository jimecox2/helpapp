// app/dashboard/pubsets/page.jsx
import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { filterPubsetsByAccess } from '@/lib/auth/rbac';
import PubsetsDataTable from './_components/PubsetsDataTable';
import Link from 'next/link';
import PubsetsInfo from './_components/PubsetsInfo';
import { fetchAllPubsets } from './_lib/fetchAllPubsets';
import { enterpriseGate } from '../_components/EnterpriseNotice';


/**
 * Enterprise Pubsets Page - Manage Pubsets and create dashboard sources
 * Server Component - fetches data and applies RBAC filtering
 */
export default async function PubsetsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/pubsets');
  }

  const gate = await enterpriseGate(session, 'Manage Pubsets and Dashboard Sources');
  if (gate) return gate;

  // Fetch all pubsets from Strapi
  const allPubsets = await fetchAllPubsets(session.jwt);

  // Apply security filtering based on role and grants
  const accessiblePubsets = filterPubsetsByAccess(allPubsets, session);

  return (
    <div className="container mx-auto p-6">
      {/* Header: the info icon holds the what and why, the page keeps the how-to */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-3xl font-bold text-gray-900">Manage Pubsets</h1>
          <PubsetsInfo />
        </div>

        <ol className="p-4 bg-blue-50 border border-blue-200 rounded-lg list-decimal list-inside space-y-1 text-sm text-blue-900">
          <li>Tick the pubsets you want to combine.</li>
          <li>Click <strong>Generate Dashboard Source</strong> and review the combined data.</li>
          <li>Save it. The source becomes the <Link href="/dashboard/sources" className="underline font-medium hover:text-blue-700">Active source of data</Link> for the Enterprise Dashboard.</li>
        </ol>
      </div>

      {/* Table Component */}
      <PubsetsDataTable data={accessiblePubsets} session={session} />

      {/* Info Message */}
      {allPubsets.length > 0 && accessiblePubsets.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            <strong>No pubsets available.</strong> You don&apos;t have access to any published datasets.
            Contact your administrator if you believe this is incorrect.
          </p>
        </div>
      )}

      {/* Access Analysis lives on its own page (also in the Dashboard Pubsets menu) */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
        <p className="mb-3">
          <strong>Missing a pubset?</strong> Show Access Analysis explains why you can or cannot see each one.
        </p>
        <Link
          href="/dashboard/pubsets/access"
          className="inline-block px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
        >
          Manage Access
        </Link>
      </div>
    </div>
  );
}

// Metadata for the page
export const metadata = {
  title: 'Manage Pubsets | Enterprise Dashboard',
  description: 'Manage published datasets and create enterprise dashboard sources',
};
