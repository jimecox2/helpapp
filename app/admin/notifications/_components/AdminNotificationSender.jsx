// app/admin/notifications/_components/AdminNotificationSender.jsx
'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-toastify';
import { Bell, Send, Eye, EyeOff, User, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { sendNotificationBasedOnEscalation } from '@/lib/notifications/twilio';
import { shouldSendNotification } from '@/lib/notifications/pushover';

const AdminNotificationSender = ({ testResults, notificationSettings, session }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [showMessagePreviews, setShowMessagePreviews] = useState({});
  const [sentNotifications, setSentNotifications] = useState(new Set());

  // Check if we have test results to work with
  if (!testResults || !testResults.shouldNotify || !testResults.notifications || testResults.notifications.length === 0) {
    return (
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium mb-2 text-yellow-800 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Send Actual PPM Notifications
        </h4>
        <p className="text-sm text-yellow-600">
          Click "Run Manual Test" first to generate notification messages. If notifications are needed, individual send buttons will appear here for each target manager.
        </p>
        {testResults && !testResults.shouldNotify && (
          <div className="mt-2 flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">All projects are healthy - no notifications required</span>
          </div>
        )}
      </div>
    );
  }

  const notifications = testResults.notifications || [];

  const toggleMessagePreview = (managerName) => {
    setShowMessagePreviews(prev => ({
      ...prev,
      [managerName]: !prev[managerName]
    }));
  };

  const sendNotificationToManager = async (notification) => {
    const { managerName, flaggedProjects, notificationConfig } = notification;
    setLoadingStates(prev => ({ ...prev, [managerName]: true }));

    try {
      console.log(`📤 Sending notification to ${managerName}...`);
      
      // Check if we should send notification (same logic as automated)
      const sendCheck = shouldSendNotification(notificationConfig);
      if (!sendCheck.shouldSend) {
        toast.warning(`Cannot send to ${managerName}: ${sendCheck.reason}`);
        console.log(`⏸️ Skipping ${managerName}: ${sendCheck.reason}`);
        setLoadingStates(prev => ({ ...prev, [managerName]: false }));
        return;
      }

      // Use the same escalation logic as automated endpoint.
      // Pass the session JWT so the API route can authenticate the Pushover call server-side.
      const result = await sendNotificationBasedOnEscalation(
        notificationConfig,
        flaggedProjects,
        {
          title: `PPM Alert - ${notification.projectCount} Project${notification.projectCount > 1 ? 's' : ''} Need Attention`,
          url: window.location.origin + '/admin/notifications',
          url_title: 'View PPM Dashboard'
        },
        session?.strapiJwt
      );

      // Log what was sent
      let sentChannels = [];
      if (result.primary) {
        sentChannels.push('Pushover');
        console.log(`   📧 Pushover: Sent`);
      }
      if (result.escalation && result.escalation.success) {
        sentChannels.push(`SMS to ${notificationConfig.escalation_phone}`);
        console.log(`   📱 SMS: Sent to ${notificationConfig.escalation_phone} (Message ID: ${result.escalation.messageId})`);
      }
      if (result.escalation && result.escalation.skipped) {
        console.log(`   📱 SMS: Skipped - ${result.escalation.reason}`);
      }

      const channelsSent = sentChannels.length > 0 ? sentChannels.join(' and ') : 'Unknown channels';
      toast.success(`Notification sent to ${managerName} via ${channelsSent}!`);
      console.log(`✅ Notification sent to ${managerName}:`, result);
      
      // Track sent notifications
      setSentNotifications(prev => new Set([...prev, managerName]));
      
    } catch (error) {
      toast.error(`Failed to send notification to ${managerName}: ${error.message}`);
      console.error(`❌ Notification error for ${managerName}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [managerName]: false }));
    }
  };

  const sendAllNotifications = async () => {
    console.log('📤 Sending all notifications...');
    
    for (const notification of notifications) {
      if (!sentNotifications.has(notification.managerName)) {
        await sendNotificationToManager(notification);
        // Add a small delay between notifications to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    toast.success(`All notifications sent successfully!`);
  };

  const unsentNotifications = notifications.filter(n => !sentNotifications.has(n.managerName));

  return (
    <div className="mt-6 space-y-4">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Bell className="h-5 w-5" />
            Send Actual PPM Notifications
          </CardTitle>
          <CardDescription className="text-green-700">
            Test results show {notifications.length} manager{notifications.length > 1 ? 's' : ''} should receive notifications about flagged projects. 
            These will send both Pushover notifications and SMS escalations (if configured).
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Send All Button */}
          {unsentNotifications.length > 1 && (
            <div className="flex justify-center mb-4">
              <Button 
                onClick={sendAllNotifications}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={Object.values(loadingStates).some(loading => loading)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send All Notifications ({unsentNotifications.length})
              </Button>
            </div>
          )}

          {/* Individual Notification Cards */}
          {notifications.map((notification, index) => {
            const { managerName, managerEmail, managerPhone, primaryChannel, message, flaggedProjects, projectCount, issueCount, dataQualityIssueCount, notificationConfig } = notification;
            const isLoading = loadingStates[managerName] || false;
            const showPreview = showMessagePreviews[managerName] || false;
            const isSent = sentNotifications.has(managerName);

            // Check if this manager has Executive projects for SMS
            const executiveProjects = flaggedProjects?.filter(p => 
              p.project?.tbMDEscalationLevel === "Executives"
            ) || [];
            
            const willSendSMS = notificationConfig?.enable_escalation && 
                              notificationConfig?.escalation_phone && 
                              executiveProjects.length > 0;

            return (
              <div key={index} className={`border rounded-lg p-4 ${isSent ? 'bg-gray-50 border-gray-300' : 'bg-white border-green-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        {managerName}
                        {isSent && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Sent
                          </Badge>
                        )}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{projectCount} project{projectCount > 1 ? 's' : ''} flagged</span>
                        <span>{issueCount} issue{issueCount > 1 ? 's' : ''} detected</span>
                        {dataQualityIssueCount > 0 && (
                          <span className="text-yellow-600">{dataQualityIssueCount} data issue{dataQualityIssueCount > 1 ? 's' : ''}</span>
                        )}
                        {executiveProjects.length > 0 && (
                          <span className="text-red-600">{executiveProjects.length} executive project{executiveProjects.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={notificationConfig ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {notificationConfig ? 'Configured' : 'No Config'}
                    </Badge>
                    {willSendSMS && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        SMS
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Flagged Projects Summary */}
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Flagged Projects:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {flaggedProjects.map((fp, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-sm p-2 rounded ${
                        fp.project?.tbMDEscalationLevel === "Executives" ? 'bg-red-50 border border-red-200' : 'bg-yellow-50'
                      }`}>
                        <AlertTriangle className={`h-3 w-3 flex-shrink-0 ${
                          fp.project?.tbMDEscalationLevel === "Executives" ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {fp.project?.tbName || 'Unknown Project'}
                            {fp.project?.tbMDEscalationLevel === "Executives" && (
                              <span className="text-red-600 text-xs ml-1">(EXECUTIVE)</span>
                            )}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {fp.evaluation?.scenarios?.length || 0} scenario{fp.evaluation?.scenarios?.length !== 1 ? 's' : ''} triggered
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-3 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div><strong>Email:</strong> {managerEmail}</div>
                    <div><strong>Phone:</strong> {managerPhone}</div>
                    <div><strong>Channel:</strong> {primaryChannel}</div>
                  </div>
                  {notificationConfig && (
                    <div className="mt-1 text-xs">
                      Priority: {notificationConfig.enable_escalation ? 'High (Escalation Enabled)' : 'Normal'} |{' '}
                      {notification.productType === 'costbars' ? (
                        <>Thresholds: Health {notificationConfig.overall_health_threshold}, Commitment {notificationConfig.executive_commitment_threshold}, Risk {notificationConfig.risk_size_complexity_threshold}, Strategic Value {notificationConfig.strategic_value_threshold}, Budget {notificationConfig.budget_overrun_percent}%</>
                      ) : notification.productType === 'timebars' ? (
                        <>Thresholds: Health {notificationConfig.overall_health_threshold} and above, Commitment {notificationConfig.executive_commitment_threshold} and above, Risk {notificationConfig.risk_size_complexity_threshold} and above</>
                      ) : (
                        <>Thresholds: Health {notificationConfig.overall_health_threshold} and above, Commitment {notificationConfig.executive_commitment_threshold} and above</>
                      )}
                      {willSendSMS && (
                        <span className="text-purple-600 ml-2">
                          | SMS to {notificationConfig.escalation_phone} for {executiveProjects.length} executive project{executiveProjects.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Preview Toggle */}
                <div className="mb-3">
                  <Button 
                    onClick={() => toggleMessagePreview(managerName)}
                    variant="outline"
                    size="sm"
                    className="mb-2"
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide Message Preview
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Show Message Preview
                      </>
                    )}
                  </Button>
                  
                  {showPreview && (
                    <div className="bg-gray-50 p-3 rounded border text-sm space-y-3">
                      <div>
                        <strong className="text-gray-800">Pushover Message for {managerName}:</strong>
                        <pre className="whitespace-pre-wrap text-gray-700 mt-2 font-mono text-xs bg-white p-3 rounded border max-h-48 overflow-y-auto">
                          {message}
                        </pre>
                      </div>
                      
                      {willSendSMS && (
                        <div>
                          <strong className="text-purple-800">SMS Message (Executive Projects Only):</strong>
                          <div className="bg-purple-50 p-2 rounded border text-xs">
                            Will be sent to: {notificationConfig.escalation_phone}<br/>
                            Executive projects: {executiveProjects.map(ep => ep.project?.tbName).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {notificationConfig ? (
                      <div>
                        Will send via {primaryChannel} with {notificationConfig.enable_escalation ? 'high' : 'normal'} priority
                        {willSendSMS && (
                          <div className="text-purple-600">+ SMS to {notificationConfig.escalation_phone} for {executiveProjects.length} executive project{executiveProjects.length > 1 ? 's' : ''}</div>
                        )}
                      </div>
                    ) : (
                      'Using default notification settings'
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => sendNotificationToManager(notification)}
                    disabled={isLoading || isSent}
                    className={`flex items-center gap-2 ${isSent ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : isSent ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Sent
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send to {managerName}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Summary and Tips */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border">
            <p><strong>📊 Summary:</strong></p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Total managers to notify: {notifications.length}</li>
              <li>Total projects flagged: {notifications.reduce((sum, n) => sum + n.projectCount, 0)}</li>
              <li>Total issues detected: {notifications.reduce((sum, n) => sum + n.issueCount, 0)}</li>
              <li>Data quality issues: {notifications.reduce((sum, n) => sum + n.dataQualityIssueCount, 0)}</li>
              <li>Managers with SMS escalation: {notifications.filter(n => n.notificationConfig?.enable_escalation && n.notificationConfig?.escalation_phone).length}</li>
            </ul>
            
            <p className="mt-3"><strong>💡 Tips:</strong></p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Each notification uses the same logic as the automated system</li>
              <li>Pushover notifications include all flagged projects</li>
              <li>SMS escalations are only sent for projects marked as "Executives" escalation level</li>
              <li>Timezone, business hours, and quiet hours settings are respected</li>
              <li>Check your Pushover app and phone for actual notifications received</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationSender;