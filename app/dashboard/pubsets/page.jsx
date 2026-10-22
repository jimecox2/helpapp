// app/dashboard/pubsets/page.jsx
import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { filterPubsetsByAccess } from '@/lib/auth/rbac';
import PubsetsDataTable from './_components/PubsetsDataTable';
import DebugInfo from './_components/DebugInfo';
import PubsetsInfo from './_components/PubsetsInfo';
import { API_URL } from '@/config/site';


/**
 * Fetch all pubsets from Strapi (both connected and not connected)
 * @param {string} jwt - Strapi JWT token
 * @returns {Promise<Array>} Array of pubset objects
 */
const fetchAllPubsets = async (jwt) => {
  try {
    const res = await fetch(
      `${API_URL}/timebars?populate=users_permissions_user`,
      {
        headers: { 'Authorization': `Bearer ${jwt}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch pubsets:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();

    // Transform Strapi response to flat structure and filter out empty pubsets
    return data.data
      .filter(item => item.attributes.tb !== null) // Filter out pubsets with null tb field (empty pubsets)
      .map(item => ({
        id: item.id,
        name: item.attributes.name || 'Untitled',
        owner: item.attributes.owner || 'N/A',
        customer_id: item.attributes.Customer_id || null,
        published_date: item.attributes.publishedAt || item.attributes.createdAt,
        users_permissions_user: item.attributes.users_permissions_user?.data?.attributes?.email ||
                                item.attributes.users_permissions_user?.data?.attributes?.username ||
                                'N/A',
        isActive: item.attributes.isActive,
        grant_pm_access_to: item.attributes.grant_pm_access_to || '',
        grant_tm_access_to: item.attributes.grant_tm_access_to || '',
        tbmdjoined: item.attributes.tbmdjoined || null,
        source_product: item.attributes.source_product || null,
        source_product_version: item.attributes.source_product_version || null,
        aggregation_level: item.attributes.aggregation_level || null,
        publish_status: item.attributes.publish_status || null,
        division: item.attributes.division || null,
        cost_center: item.attributes.cost_center || null,
        geographic_region: item.attributes.geographic_region || null,
        source_file_name: item.attributes.source_file_name || null,
        source_file_version: item.attributes.source_file_version || null
      }));
  } catch (error) {
    console.error('Error fetching pubsets:', error);
    return [];
  }
};

/**
 * Enterprise Pubsets Page - Manage Pubsets and create dashboard sources
 * Server Component - fetches data and applies RBAC filtering
 */
export default async function PubsetsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/pubsets');
  }

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
          <li>Save it. The source is then available on the Enterprise Dashboard.</li>
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

      {/* Access Analysis: the RBAC rules themselves are in the info dialog */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
        <p className="mb-3">
          <strong>Missing a pubset?</strong> Show Access Analysis explains why you can or cannot see each one.
        </p>
        <DebugInfo
          session={session}
          allPubsets={allPubsets}
          accessiblePubsets={accessiblePubsets}
        />
      </div>
    </div>
  );
}

// Metadata for the page
export const metadata = {
  title: 'Manage Pubsets | Enterprise Dashboard',
  description: 'Manage published datasets and create enterprise dashboard sources',
};
