// Shared by /dashboard/pubsets and /dashboard/pubsets/access (server only).
import { API_URL } from '@/config/site';

/**
 * Fetch all pubsets from Strapi (both connected and not connected)
 * @param {string} jwt - Strapi JWT token
 * @returns {Promise<Array>} Array of pubset objects
 */
export const fetchAllPubsets = async (jwt) => {
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
