// Shared by /dashboard/pubsets and /dashboard/pubsets/access (server only).
// The query (filters, fields, pagination) is in lib/crud/pubsetListQuery.js.
import { API_URL } from '@/config/site';
import { pubsetListQuery } from '@/lib/crud/pubsetListQuery';

const toPubset = item => {
  const a = item.attributes;
  const user = a.users_permissions_user?.data?.attributes;
  return {
    id: item.id,
    name: a.name || 'Untitled',
    owner: a.owner || 'N/A',
    customer_id: a.Customer_id || null,
    published_date: a.publishedAt || a.createdAt,
    users_permissions_user: user?.email || user?.username || 'N/A',
    isActive: a.isActive,
    grant_pm_access_to: a.grant_pm_access_to || '',
    grant_tm_access_to: a.grant_tm_access_to || '',
    source_product: a.source_product || null,
    source_product_version: a.source_product_version || null,
    aggregation_level: a.aggregation_level || null,
    publish_status: a.publish_status || null,
    division: a.division || null,
    cost_center: a.cost_center || null,
    geographic_region: a.geographic_region || null,
    source_file_name: a.source_file_name || null,
    source_file_version: a.source_file_version || null,
  };
};

/**
 * The published pubsets of the user's tenant (customer id) and the ones they own, every page.
 * RBAC is applied afterwards by filterPubsetsByAccess().
 * @param {Object} session - NextAuth session (jwt, user.email, user.customer_id)
 * @returns {Promise<Array>} flat pubset objects, without the data columns
 */
export const fetchAllPubsets = async (session) => {
  const email = session?.user?.email;
  const customerId = session?.user?.customer_id || null;
  if (!email) return [];
  const rows = [];
  try {
    for (let page = 1; ; page++) {
      const res = await fetch(`${API_URL}/timebars?${pubsetListQuery({ email, customerId, page })}`, {
        headers: { Authorization: `Bearer ${session.jwt}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        console.error('Failed to fetch pubsets:', res.status, res.statusText);
        break;
      }
      const data = await res.json();
      rows.push(...(data.data || []).map(toPubset));
      const pageCount = data.meta?.pagination?.pageCount || 1;
      if (page >= pageCount) break;
    }
  } catch (error) {
    console.error('Error fetching pubsets:', error);
  }
  return rows;
};
