/* PUSHOVER STUFF */

// app/admin/utils/pushover.js

import { FRONTEND_URL } from '@/config/site';

export const sendPushoverNotification = async (message, options = {}, jwt) => {
  try {
    const payload = {
      message,
      title: options.title || 'PPM Notification',
      priority: options.priority || 0,
      sound: options.sound || 'pushover',
      url: options.url || '',
      url_title: options.url_title || '',
    };

    const response = await fetch(`${FRONTEND_URL}/api/notifications/pushover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send notification');
    }

    return result;
  } catch (error) {
    console.error('Error sending Pushover notification:', error);
    throw error;
  }
};

export const buildNotificationMessage = (notificationConfig, projectData = {}) => {
  if (!notificationConfig || !notificationConfig.manager_name) {
    throw new Error('Invalid notification configuration');
  }

  const {
    manager_name,
    days_overdue_threshold,
    budget_overrun_percent,
    overall_health_threshold,
    executive_commitment_threshold,
    strategic_value_threshold,
    likelyhood_of_success,
    risk_size_complexity_threshold,
  } = notificationConfig;

  let message = `PPM Alert for ${manager_name}\n\n`;
  message += `Your configured notification thresholds:\n`;
  message += `• Days Overdue: ${days_overdue_threshold} days\n`;
  message += `• Budget Overrun: ${budget_overrun_percent}%\n`;
  message += `• Health Status: ${overall_health_threshold}\n`;
  message += `• Executive Commitment: ${executive_commitment_threshold}\n`;

  if (strategic_value_threshold) {
    message += `• Strategic Value: ${strategic_value_threshold}\n`;
  }
  if (likelyhood_of_success) {
    message += `• Success Likelihood: ${likelyhood_of_success}\n`;
  }
  if (risk_size_complexity_threshold) {
    message += `• Risk/Complexity: ${risk_size_complexity_threshold}\n`;
  }

  if (projectData.project_name) {
    message += `\nProject: ${projectData.project_name}\n`;
  }
  if (projectData.issues && projectData.issues.length > 0) {
    message += `\nIssues detected:\n`;
    projectData.issues.forEach(issue => {
      message += `• ${issue}\n`;
    });
  }

  message += `\nPlease review your projects in the PPM system.`;

  // Trim message to Pushover's 1024-character limit or Twilio's 1600-character limit
  return message.length > 1024 ? message.slice(0, 1021) + '...' : message;
};

export const shouldSendNotification = (notificationConfig) => {
  try {
    const { timezone, business_hours_start, business_hours_end, enable_quiet_hours } = notificationConfig;
    
    const userTime = new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour12: false });
    const [hours] = userTime.split(':').map(Number);
    
    // Check business hours if configured
    if (business_hours_start !== undefined && business_hours_end !== undefined) {
      const startHour = parseInt(business_hours_start);
      const endHour = parseInt(business_hours_end);
      
      if (hours < startHour || hours >= endHour) {
        return {
          shouldSend: false,
          reason: `Outside business hours (${startHour}:00 - ${endHour}:00 in ${timezone})`
        };
      }
    }
    
    // Check quiet hours if enabled
    if (enable_quiet_hours) {
      if (hours >= 22 || hours < 6) { // Example: Quiet hours from 10 PM to 6 AM
        return {
          shouldSend: false,
          reason: `Quiet hours active (22:00 - 06:00 in ${timezone})`
        };
      }
    }
    
    return { shouldSend: true };
  } catch (error) {
    console.error('Error in shouldSendNotification:', error);
    return {
      shouldSend: false,
      reason: `Invalid notification configuration: ${error.message}`
    };
  }
};


// imported into // app/admin/utils/twilio.js
export const sendPushoverNotificationNew = async (message, options = {}) => {
  try {
    const appToken = process.env.PUSHOVER_APP_TOKEN;
    const userKey = process.env.PUSHOVER_USER_KEY;
    
    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: appToken,
        user: userKey,
        message: message,
        title: options.title || 'PPM Notification',
        priority: (options.priority || 0).toString(),
        sound: options.sound || 'pushover',
        url: options.url || '',
        url_title: options.url_title || ''
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending Pushover notification:', error);
    throw error;
  }
};

// imported into // app/admin/utils/twilio.js
export const buildNotificationMessageNew = (notificationConfig, projectData = {}) => {
  const { 
    manager_name,
    days_overdue_threshold,
    budget_overrun_percent,
    overall_health_threshold,
    executive_commitment_threshold,
    strategic_value_threshold,
    likelyhood_of_success,
    risk_size_complexity_threshold
  } = notificationConfig;

  // Build dynamic message based on thresholds
  let message = `PPM Alert for ${manager_name}\n\n`;
  
  message += `Your configured notification thresholds:\n`;
  message += `• Days Overdue: ${days_overdue_threshold} days\n`;
  message += `• Budget Overrun: ${budget_overrun_percent}%\n`;
  message += `• Health Status: ${overall_health_threshold}\n`;
  message += `• Executive Commitment: ${executive_commitment_threshold}\n`;
  
  if (strategic_value_threshold) {
    message += `• Strategic Value: ${strategic_value_threshold}\n`;
  }
  
  if (likelyhood_of_success) {
    message += `• Success Likelihood: ${likelyhood_of_success}\n`;
  }
  
  if (risk_size_complexity_threshold) {
    message += `• Risk/Complexity: ${risk_size_complexity_threshold}\n`;
  }

  // Add project-specific data if available
  if (projectData.project_name) {
    message += `\nProject: ${projectData.project_name}\n`;
  }
  
  if (projectData.issues && projectData.issues.length > 0) {
    message += `\nIssues detected:\n`;
    projectData.issues.forEach(issue => {
      message += `• ${issue}\n`;
    });
  }

  message += `\nPlease review your projects in the PPM system.`;
  
  return message;
};

// ??
export const sendNotificationBasedOnChannel= async (notificationConfig, message, options = {}) => {
  const { primary_channel, secondary_channel, manager_name } = notificationConfig;
  
  try {
    let primaryResult = null;
    let secondaryResult = null;

    // Send via primary channel
    switch (primary_channel) {
      case 'push':
        primaryResult = await sendPushoverNotification(message, {
          title: options.title || `PPM Alert - ${manager_name}`,
          priority: options.priority || (notificationConfig.enable_escalation ? 1 : 0),
          sound: options.sound || 'pushover',
          url: options.url || '',
          url_title: options.url_title || 'View PPM Dashboard'
        });
        break;
      
      case 'sms':
        // TODO: Implement SMS sending
        console.log('SMS notification not yet implemented');
        break;
      
      case 'email':
        // TODO: Implement email sending
        console.log('Email notification not yet implemented');
        break;
      
      default:
        throw new Error(`Unsupported primary channel: ${primary_channel}`);
    }

    // Send via secondary channel if configured and different from primary
    if (secondary_channel && secondary_channel !== 'none' && secondary_channel !== primary_channel) {
      switch (secondary_channel) {
        case 'push':
          secondaryResult = await sendPushoverNotification(message, {
            title: `[Secondary] ${options.title || `PPM Alert - ${manager_name}`}`,
            priority: options.priority || 0,
            sound: options.sound || 'pushover',
            url: options.url || '',
            url_title: options.url_title || 'View PPM Dashboard'
          });
          break;
        
        case 'sms':
          console.log('SMS secondary notification not yet implemented');
          break;
        
        case 'email':
          console.log('Email secondary notification not yet implemented');
          break;
      }
    }

    return {
      primary: primaryResult,
      secondary: secondaryResult
    };

  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};



/**
 * CLARIFIED QUIET HOURS LOGIC
 * 
 * This function determines if a notification should be sent based on user preferences.
 * The logic hierarchy is:
 * 
 * 1. is_active = false → Never send
 * 2. weekend_notifications = false + (Sat/Sun) → Don't send on weekends
 * 3. business_hours_only = true → Only send 9am-5pm (overrides quiet hours)
 * 4. quiet_hours (8pm-6am default) → Don't send during quiet hours
 * 
 * Examples:
 * - If business_hours_only = true, ignore quiet_hours and only send 9am-5pm
 * - If business_hours_only = false, respect quiet_hours (don't send 8pm-6am)
 * - Weekend notifications are separate from business hours/quiet hours
 */
export const shouldSendNotificationNew = (notificationConfig) => {
  const now = new Date();
  const { 
    is_active, 
    business_hours_only, 
    quiet_hours_start, 
    quiet_hours_end, 
    weekend_notifications,
    timezone 
  } = notificationConfig;

  // Check if notification is active
  if (!is_active) {
    return { shouldSend: false, reason: 'Notification is not active' };
  }

  // Convert current time to user's timezone
  const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const currentHour = userTime.getHours();
  const currentMinute = userTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const dayOfWeek = userTime.getDay(); // 0 = Sunday, 6 = Saturday
  
  console.log(`🕐 Time check for ${notificationConfig.manager_name}:`);
  console.log(`   User timezone: ${timezone}`);
  console.log(`   User local time: ${userTime.toLocaleString()}`);
  console.log(`   Day of week: ${dayOfWeek} (0=Sun, 1=Mon...6=Sat)`);
  console.log(`   Current time: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
  
  // Check weekend notifications FIRST
  if (!weekend_notifications && (dayOfWeek === 0 || dayOfWeek === 6)) {
    console.log(`   ❌ Weekend notifications disabled`);
    return { shouldSend: false, reason: 'Weekend notifications disabled' };
  }
  
  // Check business hours only setting (overrides quiet hours)
  if (business_hours_only) {
    const businessStart = 9 * 60; // 9 AM
    const businessEnd = 17 * 60; // 5 PM
    
    console.log(`   📋 Business hours only: 9am-5pm`);
    
    if (currentTimeInMinutes < businessStart || currentTimeInMinutes > businessEnd) {
      console.log(`   ❌ Outside business hours (9am-5pm)`);
      return { shouldSend: false, reason: 'Outside business hours (9am-5pm)' };
    }
    
    console.log(`   ✅ Within business hours`);
    return { shouldSend: true };
  }

  // Check quiet hours (only if business_hours_only is false)
  if (quiet_hours_start && quiet_hours_end) {
    const [startHour, startMinute] = quiet_hours_start.split(':').map(Number);
    const [endHour, endMinute] = quiet_hours_end.split(':').map(Number);
    
    const quietStart = startHour * 60 + startMinute;
    const quietEnd = endHour * 60 + endMinute;
    
    console.log(`   🤫 Quiet hours: ${quiet_hours_start}-${quiet_hours_end}`);
    
    // Handle quiet hours that span midnight (e.g., 20:00-06:00)
    if (quietStart > quietEnd) {
      // Quiet hours span midnight (e.g., 8pm to 6am)
      if (currentTimeInMinutes >= quietStart || currentTimeInMinutes <= quietEnd) {
        console.log(`   ❌ Within quiet hours (spans midnight)`);
        return { shouldSend: false, reason: `Within quiet hours (${quiet_hours_start}-${quiet_hours_end})` };
      }
    } else {
      // Quiet hours within same day (e.g., 12:00-14:00)
      if (currentTimeInMinutes >= quietStart && currentTimeInMinutes <= quietEnd) {
        console.log(`   ❌ Within quiet hours (same day)`);
        return { shouldSend: false, reason: `Within quiet hours (${quiet_hours_start}-${quiet_hours_end})` };
      }
    }
    
    console.log(`   ✅ Outside quiet hours`);
  }

  console.log(`   ✅ All checks passed - OK to send`);
  return { shouldSend: true };
};

export const processNotificationQueueNew = async (notifications, projectData = []) => {
  const results = [];
  
  for (const notification of notifications) {
    try {
      const sendCheck = shouldSendNotification(notification);
      
      if (!sendCheck.shouldSend) {
        results.push({
          notification_id: notification.id,
          manager_name: notification.manager_name,
          status: 'skipped',
          reason: sendCheck.reason
        });
        continue;
      }

      const message = buildNotificationMessage(notification, projectData);
      
      const result = await sendNotificationBasedOnChannel(notification, message, {
        title: `PPM Alert - ${notification.manager_name}`,
        priority: notification.enable_escalation ? 1 : 0,
        url: FRONTEND_URL || '',
        url_title: 'View PPM Dashboard'
      });

      results.push({
        notification_id: notification.id,
        manager_name: notification.manager_name,
        status: 'sent',
        channels: {
          primary: notification.primary_channel,
          secondary: notification.secondary_channel
        },
        result: result
      });

    } catch (error) {
      console.error(`Error processing notification for ${notification.manager_name}:`, error);
      results.push({
        notification_id: notification.id,
        manager_name: notification.manager_name,
        status: 'failed',
        error: error.message
      });
    }
  }

  return results;
};


// nw grok original workingn 


export const sendPushoverNotificationxxx = async (message, options = {}, jwt) => {
  try {
    const payload = {
      message,
      title: options.title || 'PPM Notification',
      priority: options.priority || 0,
      sound: options.sound || 'pushover',
      url: options.url || '',
      url_title: options.url_title || '',
    };

    const response = await fetch(`${FRONTEND_URL}/api/notifications/pushover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send notification');
    }

    return result;
  } catch (error) {
    console.error('Error sending Pushover notification:', error);
    throw error;
  }
};

export const buildNotificationMessagexxx = (notificationConfig, projectData = {}) => {
  if (!notificationConfig || !notificationConfig.manager_name) {
    throw new Error('Invalid notification configuration');
  }

  const {
    manager_name,
    days_overdue_threshold,
    budget_overrun_percent,
    overall_health_threshold,
    executive_commitment_threshold,
    strategic_value_threshold,
    likelyhood_of_success,
    risk_size_complexity_threshold,
  } = notificationConfig;

  let message = `PPM Alert for ${manager_name}\n\n`;
  message += `Your configured notification thresholds:\n`;
  message += `• Days Overdue: ${days_overdue_threshold} days\n`;
  message += `• Budget Overrun: ${budget_overrun_percent}%\n`;
  message += `• Health Status: ${overall_health_threshold}\n`;
  message += `• Executive Commitment: ${executive_commitment_threshold}\n`;

  if (strategic_value_threshold) {
    message += `• Strategic Value: ${strategic_value_threshold}\n`;
  }
  if (likelyhood_of_success) {
    message += `• Success Likelihood: ${likelyhood_of_success}\n`;
  }
  if (risk_size_complexity_threshold) {
    message += `• Risk/Complexity: ${risk_size_complexity_threshold}\n`;
  }

  if (projectData.project_name) {
    message += `\nProject: ${projectData.project_name}\n`;
  }
  if (projectData.issues && projectData.issues.length > 0) {
    message += `\nIssues detected:\n`;
    projectData.issues.forEach(issue => {
      message += `• ${issue}\n`;
    });
  }

  message += `\nPlease review your projects in the PPM system.`;

  // Trim message if it exceeds Twilio's 1600-character limit (or 160 per segment)
  return message.length > 1600 ? message.slice(0, 1597) + '...' : message;
};

export const sendNotificationBasedOnChannelxxx = async (notificationConfig, message, options = {}) => {
  const { primary_channel, secondary_channel, manager_name } = notificationConfig;
  
  try {
    let primaryResult = null;
    let secondaryResult = null;

    // Send via primary channel
    switch (primary_channel) {
      case 'push':
        primaryResult = await sendPushoverNotification(message, {
          title: options.title || `PPM Alert - ${manager_name}`,
          priority: options.priority || (notificationConfig.enable_escalation ? 1 : 0),
          sound: options.sound || 'pushover',
          url: options.url || '',
          url_title: options.url_title || 'View PPM Dashboard'
        });
        break;
      
      case 'sms':
        // TODO: Implement SMS sending
        console.log('SMS notification not yet implemented');
        break;
      
      case 'email':
        // TODO: Implement email sending
        console.log('Email notification not yet implemented');
        break;
      
      default:
        throw new Error(`Unsupported primary channel: ${primary_channel}`);
    }

    // Send via secondary channel if configured and different from primary
    if (secondary_channel && secondary_channel !== 'none' && secondary_channel !== primary_channel) {
      switch (secondary_channel) {
        case 'push':
          secondaryResult = await sendPushoverNotification(message, {
            title: `[Secondary] ${options.title || `PPM Alert - ${manager_name}`}`,
            priority: options.priority || 0,
            sound: options.sound || 'pushover',
            url: options.url || '',
            url_title: options.url_title || 'View PPM Dashboard'
          });
          break;
        
        case 'sms':
          console.log('SMS secondary notification not yet implemented');
          break;
        
        case 'email':
          console.log('Email secondary notification not yet implemented');
          break;
      }
    }

    return {
      primary: primaryResult,
      secondary: secondaryResult
    };

  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};


export const shouldSendNotificationxxx = (notificationConfig) => {
  const now = new Date();
  const { 
    is_active, 
    business_hours_only, 
    quiet_hours_start, 
    quiet_hours_end, 
    weekend_notifications,
    timezone 
  } = notificationConfig;

  // Check if notification is active
  if (!is_active) {
    return { shouldSend: false, reason: 'Notification is not active' };
  }

  // Check timezone and convert current time
  const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const currentHour = userTime.getHours();
  const currentMinute = userTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // Check business hours
  if (business_hours_only) {
    const businessStart = 9 * 60; // 9 AM
    const businessEnd = 17 * 60; // 5 PM
    
    if (currentTimeInMinutes < businessStart || currentTimeInMinutes > businessEnd) {
      return { shouldSend: false, reason: 'Outside business hours' };
    }
  }

  // Check quiet hours
  if (quiet_hours_start && quiet_hours_end) {
    const [startHour, startMinute] = quiet_hours_start.split(':').map(Number);
    const [endHour, endMinute] = quiet_hours_end.split(':').map(Number);
    
    const quietStart = startHour * 60 + startMinute;
    const quietEnd = endHour * 60 + endMinute;
    
    if (currentTimeInMinutes >= quietStart && currentTimeInMinutes <= quietEnd) {
      return { shouldSend: false, reason: 'Within quiet hours' };
    }
  }

  // Check weekend notifications
  if (!weekend_notifications) {
    const dayOfWeek = userTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      return { shouldSend: false, reason: 'Weekend notifications disabled' };
    }
  }

  return { shouldSend: true };
};

export const processNotificationQueuexxx = async (notifications, projectData = []) => {
  const results = [];
  
  for (const notification of notifications) {
    try {
      const sendCheck = shouldSendNotification(notification);
      
      if (!sendCheck.shouldSend) {
        results.push({
          notification_id: notification.id,
          manager_name: notification.manager_name,
          status: 'skipped',
          reason: sendCheck.reason
        });
        continue;
      }

      const message = buildNotificationMessage(notification, projectData);
      
      const result = await sendNotificationBasedOnChannel(notification, message, {
        title: `PPM Alert - ${notification.manager_name}`,
        priority: notification.enable_escalation ? 1 : 0,
        url: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
        url_title: 'View PPM Dashboard'
      });

      results.push({
        notification_id: notification.id,
        manager_name: notification.manager_name,
        status: 'sent',
        channels: {
          primary: notification.primary_channel,
          secondary: notification.secondary_channel
        },
        result: result
      });

    } catch (error) {
      console.error(`Error processing notification for ${notification.manager_name}:`, error);
      results.push({
        notification_id: notification.id,
        manager_name: notification.manager_name,
        status: 'failed',
        error: error.message
      });
    }
  }

  return results;
};