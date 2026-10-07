// =================================================================
// FILE:app/admin/notifications/_components/NotificationsList.jsx
// =================================================================
'use client'
import React from 'react';
import { ChevronDown, Bell, BellOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import moment from 'moment';
import NotificationManagementClient from './NotificationManagementClient';

const getProductType = (order) => {
  const code = (order?.product?.product_code || '').toUpperCase();
  if (code.startsWith('CB')) return 'costbars';
  if (code.startsWith('AB')) return 'agilebars';
  if (code.startsWith('TB')) return 'timebars';
  return 'unknown';
};

const PRODUCT_LABELS = {
  costbars: { label: 'Costbars', color: 'bg-purple-100 text-purple-800' },
  agilebars: { label: 'Agilebars', color: 'bg-blue-100 text-blue-800' },
  timebars: { label: 'Timebars', color: 'bg-green-100 text-green-800' },
  unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-600' },
};


const NotificationsList = ({ orderList, orderNotifications, session }) => {
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return moment(timeString, 'HH:mm:ss').format('h:mm A');
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = moment(new Date(dateString));
    return date.isValid() ? date.format('DD/MMM/YYYY') : 'Invalid Date';
  };

  return (
    <div className="space-y-6">
      {orderList.map((order, index) => {
        const notifications = orderNotifications[order.id] || [];
        const activeNotifications = notifications.filter(n => n.is_active);
        const productType = getProductType(order);

        return (
          <Collapsible key={index} defaultOpen className="bg-white shadow overflow-hidden sm:rounded-lg max-w-[1200px] mx-auto">
            <CollapsibleTrigger className="w-full px-4 py-5 sm:px-6 flex justify-between items-center hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                  License: {order.product.name} - Order Date: {formatDate(order.createdAt)}
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${PRODUCT_LABELS[productType].color}`}>
                    {PRODUCT_LABELS[productType].label}
                  </span>
                </h3>
                <div className="mt-1 flex items-center space-x-4">
                  <p className="text-sm text-gray-500">
                    Total: ${order.total} | Expires: {formatDate(order.expires_on)}
                  </p>
                  <div className="flex items-center space-x-2">
                    {activeNotifications.length > 0 ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Bell className="w-3 h-3 mr-1" />
                        {activeNotifications.length} Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        <BellOff className="w-3 h-3 mr-1" />
                        No Active Notifications
                      </Badge>
                    )}
                    {notifications.length !== activeNotifications.length && (
                      <Badge variant="outline" className="text-gray-500">
                        {notifications.length - activeNotifications.length} Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${order.active_status
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {/*  {order.active_status ? 'Active' : 'Inactive'} */}
                </span>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {/* Order Details */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Order Details</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3 text-sm">
                    <div>
                      <dt className="font-medium text-gray-500">Product Code</dt>
                      <dd className="text-gray-900">{order.product.product_code}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Monthly Cost</dt>
                      <dd className="text-gray-900">${order.total_monthly}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Duration</dt>
                      <dd className="text-gray-900">{order.qty_months} months</dd>
                    </div>
                  </dl>
                </div>

                {/* Notifications Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Manager Notifications ({notifications.length})
                    </h4>
                    <NotificationManagementClient
                      orderId={order.id}
                      orderData={order} // Pass the full order data
                      initialNotifications={notifications}
                      session={session}
                    />
                  </div>

                  {notifications.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <BellOff className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        No notifications configured for this order
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click "Add Notification" to set up manager alerts
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 ${notification.is_active
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h5 className="font-medium text-gray-900">
                                  {notification.manager_name}
                                </h5>
                                <Badge
                                  variant={notification.is_active ? "default" : "secondary"}
                                  className={notification.is_active ? "bg-green-100 text-green-800" : ""}
                                >
                                  {notification.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-600">
                                <div>
                                  <span className="font-medium">Phone:</span> {notification.manager_phone}
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span> {notification.manager_email}
                                </div>
                                <div>
                                  <span className="font-medium">Delivery:</span> {notification.primary_channel}
                                </div>
                                <div>
                                  <span className="font-medium">Timezone:</span> {notification.timezone}
                                </div>

                                {productType === 'costbars' ? (
                                  <>
                                    <div>
                                      <span className="font-medium">Days Overdue Threshold:</span> {notification.days_overdue_threshold} days
                                    </div>
                                    <div>
                                      <span className="font-medium">Over-Budget Threshold:</span> {notification.budget_overrun_percent}%
                                    </div>
                                    <div>
                                      <span className="font-medium">Executive Commitment Threshold:</span> {notification.executive_commitment_threshold}
                                    </div>
                                    <div>
                                      <span className="font-medium">Strategic Value Threshold:</span> {notification.strategic_value_threshold}
                                    </div>
                                    <div>
                                      <span className="font-medium">Ability to Succeed Threshold:</span> {notification.likelyhood_of_success}
                                    </div>
                                    <div>
                                      <span className="font-medium">Risk/Size/Complexity Threshold:</span> {notification.risk_size_complexity_threshold}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <span className="font-medium">Health Alert:</span> Empty or Red
                                    </div>
                                    <div>
                                      <span className="font-medium">Commitment Required:</span> Full
                                    </div>
                                    <div>
                                      <span className="font-medium">Risk/Complexity Alert:</span> Not Assessed or &gt; 50
                                    </div>
                                  </>
                                )}

                                <div>
                                  <span className="font-medium">Quiet Hours:</span>
                                  {formatTime(notification.quiet_hours_start)} - {formatTime(notification.quiet_hours_end)}
                                </div>
                                <div>
                                  <span className="font-medium">Escalation:</span>
                                  {notification.enable_escalation ? 'Enabled' : 'Disabled'}
                                </div>
                              </div>

                              {notification.notes && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <span className="font-medium">Notes:</span> {notification.notes}
                                </div>
                              )}
                            </div>

                            <div className="flex space-x-2 ml-4 flex-shrink-0">
                              <NotificationManagementClient
                                orderId={order.id}
                                orderData={order} // Pass the full order data
                                notificationData={notification}
                                initialNotifications={notifications}
                                session={session}
                                mode="edit"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default NotificationsList;