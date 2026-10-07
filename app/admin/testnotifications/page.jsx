// =================================================================
// FILE: app/admin/testnotifications/page.jsx
// =================================================================

import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import PushoverTwilioTestComponent from './_components/PushoverTwilioTestComponent';



const NotificationSystemTestPage2 = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin/notifications");
  }
  
  const { user: { id, email, name }, jwt } = session;
  
 console.log("log: ", { email, name, jwt })

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 min-h-screen text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Test Notification Platform</h2>
              <p className="text-blue-200 mt-2">Licensed Owner & Administrator: {email}</p>
              <p className="text-blue-100 text-sm mt-1">Use this page to test connectivity, generate sample 
                notification messages, and configure notification profiles for your users who can receive notifications.</p>
              <div className="mt-4">
                <a 
                  href="/admin" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  ← Back To Admin
                </a>
              </div>
            </div>
          </div>

          {/* Pushover Test Component */}
          <div className="mb-8">
            <PushoverTwilioTestComponent jwt={jwt} />
          </div>

        </div>
      </div>
    </>
  );
};

export default NotificationSystemTestPage2;