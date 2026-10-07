// app/api/notifications/automated/route.js
import { NextResponse } from 'next/server';
import { updateNotification, getMyOrders, getNotificationsByOrder, fetchProjectDataFromPubset } from '@/crud/coreCrud';
import { evaluateInProgressProjects } from '@/lib/notifications/notificationEvaluator';
import { shouldSendNotificationNew } from '@/lib/notifications/pushover';
import { sendNotificationBasedOnEscalation } from '@/lib/notifications/twilio';

import { FRONTEND_URL } from '@/config/site';

// Helper function to check cooldown period
function shouldRespectCooldown(lastNotificationTime, cooldownHours = 4) {
  if (!lastNotificationTime) return true;
  
  const now = new Date();
  const lastTime = new Date(lastNotificationTime);
  const hoursDiff = (now - lastTime) / (1000 * 60 * 60);
  
  return hoursDiff >= cooldownHours;
}

export async function POST(request) {
  // Optional: when NOTIFICATION_CRON_SECRET is set, the cron call must send it as
  // `Authorization: Bearer <secret>`. Unset = open, as in tbwww (the current cron sends no header).
  const cronSecret = process.env.NOTIFICATION_CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    console.log('🤖 Automated notification check started');
    
    const currentServerHour = new Date().getHours();
    console.log(`🕐 Server time: ${new Date().toLocaleString()} (Hour: ${currentServerHour})`);

    // Get system admin credentials for data access
    const systemUserEmail = process.env.SYSTEM_ADMIN_EMAIL || 'jcox@costbars.com';
    const systemJWT = process.env.NOTIFICATION_STRAPI_KEY;

    if (!systemJWT) {
      console.error('❌ System JWT not configured');
      return NextResponse.json({ 
        error: 'System authentication not configured - NOTIFICATION_STRAPI_KEY missing' 
      }, { status: 500 });
    }

    // Check Twilio configuration for escalations
    const twilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
    console.log(`📱 Twilio SMS: ${twilioConfigured ? 'Configured' : 'Not configured (escalations will use Pushover only)'}`);

    // Fetch all active notification configurations
    console.log('📋 Fetching notification configurations...');
    let allNotificationSettings = [];
    
    try {
      const orderList = await getMyOrders(systemUserEmail, systemJWT);
      
      for (const order of orderList) {
        const notifications = await getNotificationsByOrder(order.id, systemJWT);
        allNotificationSettings.push(...notifications.filter(n => n.is_active));
      }
      
      console.log(`⚙️ Found ${allNotificationSettings.length} active notification configurations`);
      
      const timezones = [...new Set(allNotificationSettings.map(n => n.timezone))];
      console.log(`🌍 Timezones configured: ${timezones.join(', ')}`);
      
    } catch (error) {
      console.error('❌ Error fetching notification settings:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch notification settings - Check NOTIFICATION_STRAPI_KEY validity',
        details: error.message 
      }, { status: 500 });
    }

    if (allNotificationSettings.length === 0) {
      console.log('📭 No active notification configurations found');
      return NextResponse.json({ 
        message: 'No active notifications configured', 
        skipped: true 
      });
    }

    // Fetch project data
    console.log('📊 Fetching project data...');
    let pjRows = [];
    
    try {
      const result = await fetchProjectDataFromPubset(systemUserEmail, systemJWT);
      pjRows = result.pjRows || [];
      console.log(`📈 Found ${pjRows.length} projects`);
    } catch (error) {
      console.error('❌ Error fetching project data:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch project data - Check NOTIFICATION_STRAPI_KEY validity',
        details: error.message 
      }, { status: 500 });
    }

    if (pjRows.length === 0) {
      console.log('📭 No project data found');
      return NextResponse.json({ 
        message: 'No project data available', 
        skipped: true 
      });
    }

    // Run the evaluation with ALL active notifications
    console.log('🔍 Evaluating projects for notifications...');
    const evaluationResult = evaluateInProgressProjects(pjRows, allNotificationSettings);
    
    if (!evaluationResult.shouldNotify) {
      console.log('✅ All projects healthy, no notifications needed');
      return NextResponse.json({ 
        message: 'All projects healthy', 
        evaluation: evaluationResult.summary,
        totalConfigurations: allNotificationSettings.length
      });
    }

    console.log(`🚨 ${evaluationResult.flaggedProjects.length} projects flagged for notification`);

    // Group flagged projects by manager
    const projectsByManager = {};
    evaluationResult.flaggedProjects.forEach(fp => {
      const managerName = fp.managerName;
      const notificationConfig = allNotificationSettings.find(ns => ns.manager_name === managerName);
      
      if (notificationConfig) {
        if (!projectsByManager[managerName]) {
          projectsByManager[managerName] = {
            projects: [],
            notificationConfig: notificationConfig
          };
        }
        projectsByManager[managerName].projects.push(fp);
      }
    });

    console.log(`👥 ${Object.keys(projectsByManager).length} managers have flagged projects`);

    // Send notifications to each manager
    const notificationResults = [];
    
    for (const [managerName, managerData] of Object.entries(projectsByManager)) {
      const { projects, notificationConfig } = managerData;
      
      try {
        // Check if we should send notification (timezone, business hours, quiet hours)
        const sendCheck = shouldSendNotificationNew(notificationConfig);
        if (!sendCheck.shouldSend) {
          console.log(`⏸️ Skipping ${managerName}: ${sendCheck.reason}`);
          notificationResults.push({
            manager: managerName,
            status: 'skipped',
            reason: sendCheck.reason,
            timezone: notificationConfig.timezone
          });
          continue;
        }

        // Check cooldown period
        if (!shouldRespectCooldown(notificationConfig.last_notification_sent, notificationConfig.cooldown_hours)) {
          console.log(`⏸️ Skipping ${managerName}: Still in cooldown period`);
          notificationResults.push({
            manager: managerName,
            status: 'skipped',
            reason: 'Cooldown period active',
            timezone: notificationConfig.timezone
          });
          continue;
        }

        // Check max notifications per day
        if (notificationConfig.notification_count_today >= notificationConfig.max_notifications_per_day) {
          console.log(`⏸️ Skipping ${managerName}: Max notifications per day reached`);
          notificationResults.push({
            manager: managerName,
            status: 'skipped',
            reason: 'Max notifications per day reached',
            timezone: notificationConfig.timezone
          });
          continue;
        }

        // Send notifications with escalation support
        const userTime = new Date().toLocaleString('en-US', { timeZone: notificationConfig.timezone });
        console.log(`📤 Sending notification to ${managerName} (${notificationConfig.timezone}: ${userTime})...`);
        
        const isEscalated = notificationConfig?.enable_escalation || false;
        const hasEscalationPhone = !!notificationConfig?.escalation_phone;
        
        console.log(`   📱 Escalation: ${isEscalated ? 'Enabled' : 'Disabled'}`);
        console.log(`   ☎️ SMS Phone: ${hasEscalationPhone ? notificationConfig.escalation_phone : 'Not set'}`);
        
        const result = await sendNotificationBasedOnEscalation(
          notificationConfig,
          projects,
          {
            title: `PPM Alert - ${projects.length} Project${projects.length > 1 ? 's' : ''} Need Attention`,
            url: `${FRONTEND_URL}/admin/notifications`,
            url_title: 'View PPM Dashboard'
          },
          systemJWT
        );

        console.log(`✅ Notification sent successfully to ${managerName}`);
        
        // Log what was sent
        if (result.primary) {
          console.log(`   📧 Pushover: Sent (Message ID: ${result.primary.request_id || 'N/A'})`);
        }
        if (result.escalation && !result.escalation.skipped) {
          console.log(`   📱 SMS: Sent to ${notificationConfig.escalation_phone} (Message ID: ${result.escalation.messageId})`);
        } else if (result.escalation?.skipped) {
          console.log(`   📱 SMS: Skipped (${result.escalation.reason})`);
        }

// Update last_notification_sent and notification_count_today
        try {
          await updateNotification(systemJWT, {
            data: {
              last_notification_sent: new Date().toISOString(),
              notification_count_today: (notificationConfig.notification_count_today || 0) + 1
            }
          }, notificationConfig.id);

          console.log(`🕒 Updated last_notification_sent and notification_count_today for ${managerName}`);
        } catch (updateError) {
          console.error(`❌ Failed to update notification for ${managerName}:`, updateError);
          // Continue processing other notifications despite update failure
        }
        
        notificationResults.push({
          manager: managerName,
          status: 'sent',
          projectCount: projects.length,
          timezone: notificationConfig.timezone,
          userLocalTime: userTime,
          channels: {
            pushover: !!result.primary,
            sms: result.escalation && !result.escalation.skipped ? true : false,
            smsPhone: notificationConfig?.escalation_phone || null
          },
          result: result
        });

      } catch (error) {
        console.error(`❌ Failed to send notification to ${managerName}:`, error);
        notificationResults.push({
          manager: managerName,
          status: 'failed',
          error: error.message,
          timezone: notificationConfig?.timezone
        });
      }
    }

    const sent = notificationResults.filter(r => r.status === 'sent').length;
    const skipped = notificationResults.filter(r => r.status === 'skipped').length;
    const failed = notificationResults.filter(r => r.status === 'failed').length;
    const smsCount = notificationResults.filter(r => r.channels?.sms).length;

    console.log(`📊 Notification Summary: ${sent} sent, ${skipped} skipped, ${failed} failed`);
    console.log(`📱 SMS Summary: ${smsCount} escalation SMS sent`);

    return NextResponse.json({
      success: true,
      summary: {
        authMethod: 'JWT (NOTIFICATION_STRAPI_KEY)',
        totalConfigurations: allNotificationSettings.length,
        totalManagers: Object.keys(projectsByManager).length,
        sent: sent,
        skipped: skipped,
        failed: failed,
        smsEscalations: smsCount,
        twilioConfigured: twilioConfigured
      },
      results: notificationResults,
      evaluation: evaluationResult.summary,
      serverTime: new Date().toLocaleString(),
      serverHour: currentServerHour
    });

  } catch (error) {
    console.error('❌ Automated notification system error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const twilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
    const pushoverConfigured = !!(process.env.PUSHOVER_APP_TOKEN && process.env.PUSHOVER_USER_KEY);
    const jwtConfigured = !!process.env.NOTIFICATION_STRAPI_KEY;
    
    console.log('📋 Configuration check:');
    console.log(`   Pushover: ${pushoverConfigured ? 'Configured' : 'Missing'}`);
    console.log(`   Twilio: ${twilioConfigured ? 'Configured' : 'Missing'}`);
    console.log(`   JWT: ${jwtConfigured ? 'Configured' : 'Missing'}`);
    
    if (pushoverConfigured) {
      console.log(`   - PUSHOVER_APP_TOKEN: Set`);
      console.log(`   - PUSHOVER_USER_KEY: Set`);
    }
    
    if (twilioConfigured) {
      console.log(`   - TWILIO_ACCOUNT_SID: Set`);
      console.log(`   - TWILIO_AUTH_TOKEN: Set`);
      console.log(`   - TWILIO_PHONE_NUMBER: ${process.env.TWILIO_PHONE_NUMBER}`);
    }
    
    return NextResponse.json({ 
      message: 'Automated notification endpoint', 
      schedule: 'Every 4 hours, 24/7 (timezone logic handled per user)',
      status: 'ready',
      features: {
        pushover: pushoverConfigured,
        sms: twilioConfigured,
        systemAuth: jwtConfigured ? 'JWT (NOTIFICATION_STRAPI_KEY)' : 'Not configured'
      },
      authMethod: 'JWT via NOTIFICATION_STRAPI_KEY',
      twilioPhone: process.env.TWILIO_PHONE_NUMBER || 'Not configured',
      configDetails: {
        pushover: {
          appToken: !!process.env.PUSHOVER_APP_TOKEN,
          userKey: !!process.env.PUSHOVER_USER_KEY
        },
        twilio: {
          accountSid: !!process.env.TWILIO_ACCOUNT_SID,
          authToken: !!process.env.TWILIO_AUTH_TOKEN,
          phoneNumber: !!process.env.TWILIO_PHONE_NUMBER
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in GET endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}