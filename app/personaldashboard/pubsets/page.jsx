// app/personaldashboard/pubsets/page.jsx
import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { filterPubsetsByAccess } from '@/lib/auth/rbac';
import PubsetsDataTable from './_components/PubsetsDataTable';
import DebugInfo from './_components/DebugInfo';
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
      .filter(item => item.attributes.tb !== null)
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
 * Personal Dashboard Pubsets Page
 * View published datasets that drive the personal dashboard charts and reports.
 * The personal dashboard displays data from your connected (active) pubset.
 */
export default async function PersonalPubsetsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/personaldashboard/pubsets');
  }

  const allPubsets = await fetchAllPubsets(session.jwt);
  const accessiblePubsets = filterPubsetsByAccess(allPubsets, session);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Personal Dashboard Pubsets</h1>

        {/* Instructional Text */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 text-sm text-blue-900">
          <p>
            <strong>What are pubsets?</strong> Pubsets are project pubsets published from your desktop application
            (Agilebars, Timebars, or Costbars). Each pubset contains a snapshot of your project data at the time of publishing.
          </p>
          <p>
            <strong>Connected pubset:</strong> The pubset marked as &quot;Connected&quot; is the one currently driving your
            Personal Dashboard charts, graphs, and reports. When you publish new data from your desktop app with the
            &quot;Connect to Dashboard&quot; option enabled, it automatically becomes the active pubset.
          </p>
          <p>
            <strong>Viewing reports:</strong> Click &quot;View&quot; on any pubset to see its detailed project data
            breakdown with drill-down by Portfolio, Project, Sub-Project, and Task.
          </p>
        </div>

        {/* Link back to dashboard */}
        <div className="mt-4">
          <Link
            href="/personaldashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Personal Dashboard Home
          </Link>
        </div>
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

      {/* RBAC Explanation Section */}
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Access Control (RBAC)</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <p>
            This page uses <strong>Role-Based Access Control (RBAC)</strong> to determine which published datasets (pubsets) you can view.
            Your access is based on your role, customer ID, and specific grant permissions from Project Managers.
          </p>

          <p>
            <strong>Don&apos;t see a pubset you expect?</strong> Use the <strong>&quot;Show Access Analysis&quot;</strong> button below
            to see detailed information about why you can or cannot access each pubset. Contact your Project Manager
            or Administrator to request access.
          </p>

          <div className="my-4">
            <DebugInfo
              session={session}
              allPubsets={allPubsets}
              accessiblePubsets={accessiblePubsets}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Access Rules Summary:</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Owner:</strong> You always have access to pubsets you created.</li>
              <li><strong>Administrator:</strong> Administrators can see all pubsets within their customer organization.</li>
              <li><strong>Project Manager:</strong> Project Managers can see pubsets where they are granted access via the PM grant list.</li>
              <li><strong>Team Member:</strong> Team members can see pubsets where they are granted access via the Team Member grant list.</li>
              <li><strong>No Role/Grants:</strong> Users without roles or grant permissions can only see their own pubsets.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'My Pubsets | Personal Dashboard',
  description: 'View published project pubsets for personal dashboard',
};
