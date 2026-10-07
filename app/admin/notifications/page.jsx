// =================================================================
// FILE: app/admin/notifications/page.jsx
// =================================================================

import { redirect } from "next/navigation";
import { getMyOrders, getNotificationsByOrder, fetchProjectDataFromPubset } from '@/crud/coreCrud';
import { auth } from "@/auth/auth";
import NotificationsList from './_components/NotificationsList';

import ClientNotificationWrapper from './_components/ClientNotificationWrapper';
import ProjectDataDisplay from '../_components/ProjectDataDisplay';
import { WWW_URL } from '@/config/site';

const NotificationManagementPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin/notifications");
  }

  const { user: { id, email, name }, jwt } = session;

  let orderList = [];
  let orderNotifications = {};
  let ordersError = null;
  let projError = null;
  let pfRows = [];
  let pjRows = [];
  let activeNotificationSettings = [];
  let generatedMessage = "FAke messaage"

  try {
    // Get user's orders
    orderList = await getMyOrders(email, jwt);

    // Get notifications for each order
    for (const order of orderList) {
      try {
        const notifications = await getNotificationsByOrder(order.id, jwt);
        orderNotifications[order.id] = notifications;
        activeNotificationSettings.push(...notifications.filter(n => n.is_active));
      } catch (err) {
        console.error(`Error fetching notifications for order ${order.id}:`, err);
        orderNotifications[order.id] = [];
      }
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    ordersError = 'Failed to fetch orders. Please try again later.';
  }
  try {
    const result = await fetchProjectDataFromPubset(email, jwt);
    pfRows = result.pfRows;
    pjRows = result.pjRows;
    // console.log("log: ", { email, jwt })
  } catch (err) {
    console.error('Error fetching project data:', err);
    projError = 'Failed to fetch projects. Publish from the Client app and try again later.';
  }

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 min-h-screen text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Notification Configuration</h2>
              <p className="text-blue-200 mt-2">Owner: {email} - Add and configure target user thresholds
                and other settings (Limit of 5 users).</p>
              <p className="text-blue-100 text-sm mt-1">Use this page to initiate a notification messages manually.
                Allows to configure notification delivery paramaters for your users to ensure they are configured
                correctly before auto delivery is turned on.</p>
              <div className="mt-4">
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  ← Dashboard
                </a>
              </div>
            </div>
          </div>

          {ordersError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {ordersError}</span>
            </div>
          ) : orderList.length === 0 ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">No orders found.</strong>
              <span className="block sm:inline"> You haven't placed any orders yet. </span>
              <a href={`${WWW_URL}/sales/pricing`} className="underline hover:text-blue-900 transition-colors duration-200">
                View our pricing and place an order!
              </a>
            </div>
          ) : (
            <NotificationsList
              orderList={orderList}
              orderNotifications={orderNotifications}
              session={session}
            />
          )}
          <div className="px-4 py-3">
            <ClientNotificationWrapper
              pjRows={pjRows}
              notificationSettings={activeNotificationSettings}
              orderList={orderList}
              session={session}
            />
          </div>

          <div className="mb-8">
            <ProjectDataDisplay pjRows={pjRows} pfRows={pfRows} orderList={orderList} />
          </div>


        </div>

      </div>
    </>
  );
};

export default NotificationManagementPage;