// app/admin/utils/twilio.js
import { FRONTEND_URL } from '@/config/site';

// for the routes
export const sendTwilioNotification = async ({ to, message }, jwt) => {
  try {
    const response = await fetch(`${FRONTEND_URL}/api/notifications/twilio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ to, message }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send SMS');
    }

    return result;
  } catch (error) {
    console.error('Error sending Twilio notification:', error);
    throw error;
  }
};


export const sendTwilioSMS = async (to, message, options = {}) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio configuration missing. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
    }

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    // Prepare the payload
    const payload = new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: message,
    });

    // Add optional parameters
    if (options.statusCallback) {
      payload.append('StatusCallback', options.statusCallback);
    }

    console.log(`📱 Sending SMS to ${to}...`);

    // Send SMS via Twilio API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', result);
      throw new Error(result.message || 'Failed to send SMS');
    }

    console.log('✅ SMS sent successfully:', result.sid);

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      to: result.to,
      from: result.from
    };

  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    throw error;
  }
};

export const formatSMSMessage = (notificationConfig, projects) => {
  // SMS messages should be concise and focused on executive-level projects only
  const managerName = notificationConfig.manager_name;

  // Filter for projects with tbMDEscalationLevel === "Executives"
  const executiveProjects = projects.filter(p =>
    p.project?.tbMDEscalationLevel === "Executives"
  );

  if (executiveProjects.length === 0) {
    console.log(`   📱 No SMS sent - no projects with "Executives" escalation level found`);
    return null; // No SMS should be sent if no executive-level projects
  }

  let message = `PPM NOTIFICATION ALERT\n`;

  if (executiveProjects.length === 1) {
    const project = executiveProjects[0].project;
    const evaluation = executiveProjects[0].evaluation;

    message += `PROJECT: ${project?.tbName || 'Unknown'} (ID: ${project?.tbID || 'No ID'})\n`;
    message += `Cost: $${project?.tbCost ? parseInt(project.tbCost).toLocaleString() : 'Unknown'}, `;
    message += `Health: ${project?.tbMDHealthOverall || 'Unknown'}, `;
    message += `Strategic Value: ${evaluation?.strategicValue || project?.tbMDPriorityStrategic || 'Unknown'}, `;
    message += `Senior Commitment: ${project?.tbMDSeniorLevelCommitment || 'Unknown'}, `;
    message += `Risk/Complexity: ${project?.tbMDRiskVsSizeAndComplexity || 'Unknown'}\n`;

    // Add specific violation
    if (evaluation?.scenarios?.includes('CRITICAL_HIGH_VALUE')) {
      message += `THRESHOLD VIOLATION: Critical high-value project with Red health status (Strategic Value: ${project?.tbMDPriorityStrategic || 'Unknown'} > ${notificationConfig.strategic_value_threshold})\n`;
    } else if (evaluation?.scenarios?.includes('BUDGET_OVERRUN_HIGH_VALUE')) {
      message += `THRESHOLD VIOLATION: Budget overrun detected (${evaluation?.budgetOverrun?.toFixed(1)}% > ${notificationConfig.budget_overrun_percent}%)\n`;
    } else if (evaluation?.scenarios?.includes('WORK_OVERRUN_HIGH_VALUE')) {
      message += `THRESHOLD VIOLATION: Work hours overrun (${evaluation?.workOverrun?.toFixed(1)}% > ${notificationConfig.work_overrun_percent || 20}%)\n`;
    } else if (evaluation?.scenarios?.includes('MISSING_HEALTH_STATUS')) {
      message += `THRESHOLD VIOLATION: Missing health status on complex project\n`;
    }

  } else {
    message += `${executiveProjects.length} EXECUTIVE PROJECTS NEED ATTENTION:\n`;
    executiveProjects.slice(0, 2).forEach((fp, index) => {
      const project = fp.project;
      message += `${index + 1}. ${project?.tbName || 'Unknown'} (ID: ${project?.tbID || 'No ID'})\n`;
    });
    if (executiveProjects.length > 2) {
      message += `+${executiveProjects.length - 2} more executive projects\n`;
    }
  }

  message += `Dashboard: ${FRONTEND_URL}/admin/notifications`;

  // Ensure message is under Twilio's 1600-character limit
  if (message.length > 1600) {
    message = message.slice(0, 1597) + '...';
  }

  return message;
};

export const sendNotificationBasedOnEscalation = async (notificationConfig, projects, options = {}, jwt) => {
  const managerName = notificationConfig.manager_name;
  const isEscalated = notificationConfig.enable_escalation;

  try {
    let results = {
      primary: null,
      escalation: null
    };

    // Always send primary notification (Pushover) — routes through /api/notifications/pushover
    // so that PUSHOVER_APP_TOKEN and PUSHOVER_USER_KEY are read server-side.
    if (notificationConfig.primary_channel === 'push' || !notificationConfig.primary_channel) {
      const { sendPushoverNotification, buildNotificationMessageNew } = await import('@/lib/notifications/pushover');

      const projectData = {
        project_name: projects.length === 1 ? projects[0].project?.tbName : `${projects.length} Projects`,
        issues: projects.flatMap(p => {
          const issues = [];
          if (p.evaluation?.scenarios?.includes('CRITICAL_HIGH_VALUE')) {
            issues.push(`${p.project?.tbName}: Critical high-value project with Red health status`);
          }
          if (p.evaluation?.scenarios?.includes('BUDGET_OVERRUN_HIGH_VALUE')) {
            issues.push(`${p.project?.tbName}: Budget overrun detected on high-value project`);
          }
          if (p.evaluation?.scenarios?.includes('MISSING_HEALTH_STATUS')) {
            issues.push(`${p.project?.tbName}: Missing health status on complex project`);
          }
          if (p.evaluation?.scenarios?.includes('WORK_OVERRUN_HIGH_VALUE')) {
            issues.push(`${p.project?.tbName}: Work hours issues on high-value project`);
          }
          return issues;
        })
      };

      const pushoverMessage = buildNotificationMessageNew(notificationConfig, projectData);

      results.primary = await sendPushoverNotification(pushoverMessage, {
        title: options.title || `PPM Alert - ${projects.length} Project${projects.length > 1 ? 's' : ''} Need Attention`,
        priority: isEscalated ? 1 : 0,
        sound: 'pushover',
        url: options.url || '',
        url_title: options.url_title || 'View PPM Dashboard'
      }, jwt);
    }

    // Send escalation SMS only if enabled, phone number provided, and executive projects exist
    if (isEscalated && notificationConfig.escalation_phone) {
      const executiveProjects = projects.filter(p =>
        p.project?.tbMDEscalationLevel === 'Executives'
      );

      console.log(`📱 SMS Check for ${managerName}:`);
      console.log(`   Total flagged projects: ${projects.length}`);
      console.log(`   Executive-level projects: ${executiveProjects.length}`);
      console.log(`   Looking for escalation level: "Executives"`);

      if (executiveProjects.length > 0) {
        const smsMessage = formatSMSMessage(notificationConfig, projects);

        if (smsMessage) {
          console.log(`   📤 Sending SMS for ${executiveProjects.length} executive projects`);
          results.escalation = await sendTwilioSMS(
            notificationConfig.escalation_phone,
            smsMessage
          );
        } else {
          console.log(`   ⏸️ No SMS sent - no valid executive projects found`);
          results.escalation = {
            skipped: true,
            reason: 'No valid executive projects found'
          };
        }
      } else {
        console.log(`   ⏸️ No SMS sent - no projects with "Executives" escalation level`);
        results.escalation = {
          skipped: true,
          reason: 'No projects with "Executives" escalation level'
        };
      }
    }

    return results;

  } catch (error) {
    console.error(`❌ Error sending notifications to ${managerName}:`, error);
    throw error;
  }
};


