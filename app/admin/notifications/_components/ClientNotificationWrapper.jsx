// app/admin/notifications/_components/ClientNotificationWrapper.jsx
'use client'
import React, { useState } from 'react';
import NotificationTestButton from './NotificationTestButton';
import AdminNotificationSender from './AdminNotificationSender';

const ClientNotificationWrapper = ({ pjRows, notificationSettings, orderList, session }) => {
  const [testResults, setTestResults] = useState(null);

  return (
    <div className="space-y-6">
      <NotificationTestButton
        pjRows={pjRows}
        notificationSettings={notificationSettings}
        orderList={orderList}
        session={session}
        onTestComplete={setTestResults}
      />
      
      <AdminNotificationSender
        testResults={testResults}
        notificationSettings={notificationSettings}
        session={session}
      />
    </div>
  );
};

export default ClientNotificationWrapper;