// Shared by /dashboard/pubsets and /dashboard/pubsets/access (server only).
// The query (filters, fields, pagination) is in lib/crud/pubsetListQuery.js.
import { API_URL } from '@/config/site';
import { pubsetListQuery, invalidKeyOf, PUBSET_LIST_FIELDS } from '@/lib/crud/pubsetListQuery';

const toPubset = item => {
  const a = item.attributes;
  const user = a.users_permissions_user?.data?.attributes;
  return {
    id: item.id,
    name: a.name || 'Untitled',
    owner: a.owner || 'N/A',
    customer_id: a.Customer_id || null,
    published_date: a.createdAt || a.published_date,
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
  let fields = [...PUBSET_LIST_FIELDS];
  let publishedOnly = true;
  let retries = 0;
  try {
    for (let page = 1; ; page++) {
      const res = await fetch(`${API_URL}/timebars?${pubsetListQuery({ email, customerId, page, fields, publishedOnly })}`, {
        headers: { Authorization: `Bearer ${session.jwt}` },
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && retries < 10) {
        // A field or filter this Strapi does not have: drop it and ask for the same page again.
        const key = invalidKeyOf(data);
        console.error('Pubsets query refused by Strapi:', data?.error?.message || res.statusText);
        if (key === 'tb' && publishedOnly) publishedOnly = false;
        else if (key && fields.includes(key)) fields = fields.filter(f => f !== key);
        else break;
        retries++;
        page--;
        continue;
      }
      if (!res.ok) {
        console.error('Failed to fetch pubsets:', res.status, data?.error?.message || res.statusText);
        break;
      }
      rows.push(...(data.data || []).map(toPubset));
      const pageCount = data.meta?.pagination?.pageCount || 1;
      if (page >= pageCount) break;
    }
  } catch (error) {
    console.error('Error fetching pubsets:', error);
  }
  console.log('Pubsets list:', { email, customerId, rows: rows.length, fieldsDropped: PUBSET_LIST_FIELDS.filter(f => !fields.includes(f)), publishedOnly });
  return rows;
};
