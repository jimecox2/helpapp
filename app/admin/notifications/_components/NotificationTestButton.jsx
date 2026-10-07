// app/admin/notifications/_components/NotificationTestButton.jsx
'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw, AlertTriangle, CheckCircle, Clock, Eye, EyeOff, User, Bell } from 'lucide-react';
import { evaluateInProgressProjects } from '@/lib/notifications/notificationEvaluator';

const NotificationTestButton = ({ pjRows, notificationSettings, orderList, session, onTestComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [lastRunTime, setLastRunTime] = useState(null);
  const [showDebugLogs, setShowDebugLogs] = useState(false);


  // Derive product types from orderList (order.product.product_code is reliably populated)
  const productInfo = useMemo(() => {
    if (!Array.isArray(orderList) || orderList.length === 0) {
      return { hasCostbars: false, hasAgilebars: false, hasTimebars: false, scenarioCount: 0 };
    }
    let hasCostbars = false;
    let hasAgilebars = false;
    let hasTimebars = false;
    orderList.forEach(order => {
      const code = (order?.product?.product_code || '').toUpperCase();
      if (code.startsWith('CB')) hasCostbars = true;
      else if (code.startsWith('AB')) hasAgilebars = true;
      else if (code.startsWith('TB')) hasTimebars = true;
    });
    const parts = [];
    if (hasCostbars)  parts.push('5');
    if (hasTimebars)  parts.push('3');
    if (hasAgilebars) parts.push('2');
    const scenarioCount = parts.length > 0 ? parts.join('+') : 0;
    return { hasCostbars, hasAgilebars, hasTimebars, scenarioCount };
  }, [orderList]);

  // Safely get array values with fallbacks
  const safeManagersArray = lastResult?.summary?.managers || [];
  const safeFlaggedProjects = lastResult?.flaggedProjects || [];
  const safeDebugLogs = lastResult?.allDebugLogs || [];
  const safeNotifications = lastResult?.notifications || [];
  
  // Calculate stats safely
  const totalProjects = Array.isArray(pjRows) ? pjRows.length : 0;
  const inProgressProjects = Array.isArray(pjRows) ? 
    pjRows.filter(p => p.tbMDStatus === "In progress" || p.tbMDStatus === "In Progress").length : 0;
  const activeNotifications = Array.isArray(notificationSettings) ? 
    notificationSettings.filter(ns => ns.is_active).length : 0;

  const runManualTest = useCallback(async () => {
    setIsRunning(true);
    
    try {
      console.log('🧪 Manual Test Started');
      console.log(`📋 Total Projects: ${totalProjects}`);
      console.log(`⚙️  Notification Settings: ${notificationSettings?.length || 0}`);
      
      console.log("Input data: ", { 
        pjRowsCount: totalProjects, 
        notificationSettingsCount: notificationSettings?.length || 0,
        activeNotificationSettings: activeNotifications,
        inProgressProjects: inProgressProjects,
        notificationThresholds: Array.isArray(notificationSettings) ? notificationSettings.map(ns => ({
          manager: ns.manager_name,
          strategicValueThreshold: ns.strategic_value_threshold,
          budgetOverrunPercent: ns.budget_overrun_percent,
          workOverrunPercent: ns.work_overrun_percent,
          isActive: ns.is_active
        })) : []
      });

      // Run the evaluation
      const result = evaluateInProgressProjects(pjRows || [], notificationSettings || []);
      
      // Log detailed results
      console.log('📊 Test Results:', result);
      
      if (result.shouldNotify) {
        console.log('🚨 WOULD SEND NOTIFICATIONS TO:');
        const managers = result.summary?.managers || [];
        if (Array.isArray(managers)) {
          managers.forEach(manager => {
            console.log(`   👤 ${manager}`);
          });
        }
        console.log('📨 Individual Notification Messages:');
        result.notifications?.forEach((notification, index) => {
          console.log(`\n--- MESSAGE ${index + 1} for ${notification.managerName} ---`);
          console.log(notification.message);
        });
      } else {
        console.log('✅ No notifications needed - all projects healthy');
      }
      
      setLastResult(result);
      setLastRunTime(new Date());
      
      // Pass results back to parent component
      if (onTestComplete) {
        onTestComplete(result);
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      const errorResult = {
        shouldNotify: false,
        error: error.message,
        summary: { 
          totalProjects: 0, 
          flaggedProjects: 0,
          managers: [],
          totalIssues: 0,
          totalDataQualityIssues: 0
        },
        flaggedProjects: [],
        allDebugLogs: [`ERROR: ${error.message}`, `Stack: ${error.stack}`],
        notifications: []
      };
      
      setLastResult(errorResult);
      
      // Pass error result back to parent component
      if (onTestComplete) {
        onTestComplete(errorResult);
      }
    } finally {
      setIsRunning(false);
    }
  }, [pjRows, notificationSettings, totalProjects, activeNotifications, inProgressProjects, onTestComplete]);

  const toggleDebugLogs = useCallback(() => {
    setShowDebugLogs(prev => !prev);
  }, []);



  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Notification Testing & Message Generation
        </CardTitle>
        <CardDescription>
          Manually trigger the notification evaluation algorithm to test with current project data and generate individual notification messages for each active manager configuration.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Test Controls */}
        <div className="flex items-center gap-4 mb-4">
          <Button 
            onClick={runManualTest} 
            disabled={isRunning || totalProjects === 0 || !Array.isArray(notificationSettings) || notificationSettings.length === 0}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Manual Test
              </>
            )}
          </Button>

          
          {lastRunTime && (
            <span suppressHydrationWarning className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              Last run: {lastRunTime.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Data Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-lg font-bold text-blue-600">{totalProjects}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <div className="text-lg font-bold text-green-600">{inProgressProjects}</div>
            <div className="text-sm text-gray-600">In Progress Projects</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-lg font-bold text-purple-600">{activeNotifications}</div>
            <div className="text-sm text-gray-600">Active Notifications</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-lg font-bold text-orange-600">{productInfo.scenarioCount}</div>
            <div className="text-sm text-gray-600">Scenarios Active</div>
          </div>
        </div>

        {/* Prerequisites Check */}
        {(totalProjects === 0 || !Array.isArray(notificationSettings) || notificationSettings.length === 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Prerequisites Missing</span>
            </div>
            <ul className="mt-2 text-sm text-yellow-700">
              {totalProjects === 0 && (() => {
                const apps = [];
                if (productInfo.hasCostbars)  apps.push('Costbars');
                if (productInfo.hasTimebars)  apps.push('Timebars');
                if (productInfo.hasAgilebars) apps.push('Agilebars');
                const appList = apps.length > 0 ? apps.join(' / ') : 'your app';
                return <li>• No project data found — publish your projects from the {appList} app and ensure Project Status is set to <strong>In-Progress</strong></li>;
              })()}
              {(!Array.isArray(notificationSettings) || notificationSettings.length === 0) && <li>• No notification configurations found</li>}
              {activeNotifications === 0 && <li>• No active notification configurations found</li>}
            </ul>
          </div>
        )}

        {/* Test Results */}
        {lastResult && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              {lastResult.shouldNotify ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-700">Notifications Required</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-700">All Projects Healthy</span>
                </>
              )}
            </h3>

            {lastResult.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                <div className="text-red-800 font-medium">Test Error:</div>
                <div className="text-red-700 text-sm">{lastResult.error}</div>
              </div>
            )}

            {lastResult.summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{lastResult.summary.totalProjects || 0}</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${(lastResult.summary.flaggedProjects || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {lastResult.summary.flaggedProjects || 0}
                  </div>
                  <div className="text-xs text-gray-600">Flagged</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{lastResult.summary.totalIssues || 0}</div>
                  <div className="text-xs text-gray-600">Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{lastResult.summary.totalDataQualityIssues || 0}</div>
                  <div className="text-xs text-gray-600">Data Issues</div>
                </div>
              </div>
            )}

            {/* Debug Logs Section */}
            {safeDebugLogs.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Button 
                    onClick={toggleDebugLogs}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {showDebugLogs ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide Debug Logs
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Show Debug Logs
                      </>
                    )}
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    {safeDebugLogs.length} log entries
                  </Badge>
                </div>
                
                {showDebugLogs && (
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-96 overflow-y-auto">
                    {safeDebugLogs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
                
                {!showDebugLogs && (
                  <div className="bg-gray-100 border border-gray-200 rounded p-3 text-sm text-gray-600">
                    Debug logs are available. Click "Show Debug Logs" above to view detailed analysis of why each project was or wasn't selected for notifications.
                  </div>
                )}
              </div>
            )}

            {/* Individual Notification Messages */}
            {lastResult.shouldNotify && safeNotifications.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  Individual Notification Messages ({safeNotifications.length})
                </h4>
                
                <div className="space-y-4">
                  {safeNotifications.map((notification, index) => (
                    <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium text-gray-900">{notification.managerName}</h5>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{notification.projectCount} project{notification.projectCount > 1 ? 's' : ''}</span>
                              <span>{notification.issueCount} issue{notification.issueCount > 1 ? 's' : ''}</span>
                              <span>Channel: {notification.primaryChannel}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-800">
                            {notification.dataQualityIssueCount > 0 ? 'Data Issues' : 'Ready'}
                          </Badge>
                        </div>
                      </div>

                      {/* Flagged Projects Summary */}
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">Flagged Projects:</div>
                        <div className="flex flex-wrap gap-1">
                          {notification.flaggedProjects.map((fp, fpIndex) => (
                            <Badge key={fpIndex} variant="outline" className="text-xs">
                              {fp.project?.tbName || 'Unknown Project'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Note:</strong> This is a test run only. Click &ldquo;Send This Message&rdquo; for individual notifications to actually send them.</p>

          {productInfo.hasCostbars && (
            <>
              <p className="mt-2"><strong>Costbars — 5 Scenarios Tested:</strong></p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li><strong>Scenario 1:</strong> Health at/above threshold <strong>AND</strong> Strategic Value above threshold</li>
                <li><strong>Scenario 2:</strong> Health at/above threshold <strong>AND</strong> missing Strategic Value <strong>AND</strong> Risk/Complexity at/above threshold</li>
                <li><strong>Scenario 3:</strong> Health field empty <strong>AND</strong> Commitment at/above threshold <strong>AND</strong> Risk/Complexity at/above threshold</li>
                <li><strong>Scenario 4:</strong> Budget Overrun above threshold on a high-value project</li>
                <li><strong>Scenario 5:</strong> Work Hours Overrun above threshold on a high-value project</li>
              </ul>
              <p className="mt-1 text-xs text-gray-500">Thresholds are user-configured. All chain comparisons climb toward worst value.</p>
            </>
          )}

          {productInfo.hasTimebars && (
            <>
              <p className="mt-2"><strong>Timebars — 3 Conditions Evaluated (all must be true):</strong></p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li><strong>Condition 1:</strong> Overall Health meets or exceeds the configured threshold (empty = treated as Red)</li>
                <li><strong>Condition 2:</strong> Senior Commitment meets or exceeds the configured threshold (empty = treated as Moderate)</li>
                <li><strong>Condition 3:</strong> Risk/Size/Complexity meets or exceeds the configured threshold (empty = treated as triggering)</li>
              </ul>
              <p className="mt-1 text-xs text-gray-500">Chain climbs toward worst health, highest commitment, and highest risk score.</p>
            </>
          )}

          {productInfo.hasAgilebars && (
            <>
              <p className="mt-2"><strong>Agilebars — 2 Conditions Evaluated (both must be true):</strong></p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li><strong>Condition 1:</strong> Overall Health meets or exceeds the configured threshold (empty = treated as Red)</li>
                <li><strong>Condition 2:</strong> Senior Commitment meets or exceeds the configured threshold (empty = treated as Moderate)</li>
              </ul>
              <p className="mt-1 text-xs text-gray-500">Chain climbs toward worst health and highest commitment level.</p>
            </>
          )}

          <p className="mt-2">Check the browser console (F12) for detailed logging and debug information.</p>
          {safeDebugLogs.length > 0 && (
            <p><strong>💡 Tip:</strong> Click &ldquo;Show Debug Logs&rdquo; above to see exactly why each project was evaluated and whether it triggered notifications.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTestButton;