#!/bin/bash

# PPM Automated Notifications Script
# Run this 4 times per day during business hours
# Moved from tbwww: notifications now run on Timebars Cloud (helpapp).
# Run on the box that hosts tbhelpapp, from cron (sudo crontab -e), e.g.
#   0 */4 * * * /path/to/send-notification.sh
# Optional: if NOTIFICATION_CRON_SECRET is set in helpapp's .env.local, export the same value here.
# sudo crontab -e
# NEW: Run every hour from 6am-11pm Eastern (covers all NA timezones)
# old 0 6-23 * * 1-5 ~/docker/tbwwwp/automate_pushover_twillio.sh
# Run every 4 hours instead of just business hours
# 0 */4 * * * ~/docker/tbwwwp/automate_pushover_twillio.sh


LOG_FILE="/var/log/ppm-notifications.log"
API_URL="${NOTIFICATION_API_URL:-https://cloud.timebars.com/api/notifications/automated}"
# API_URL="http://localhost:3009/api/notifications/automated"

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check if it's a weekday and business hours
CURRENT_DAY=$(date +%u)  # 1=Monday, 7=Sunday
CURRENT_HOUR=$(date +%H)

if [ $CURRENT_DAY -gt 5 ]; then
    log_message "Weekend detected, skipping notification check"
    exit 0
fi

if [ $CURRENT_HOUR -lt 9 ] || [ $CURRENT_HOUR -gt 18 ]; then
    log_message "Outside business hours, skipping notification check"
    exit 0
fi

log_message "Starting automated notification check..."

# Make the API call
AUTH_HEADER=()
[ -n "$NOTIFICATION_CRON_SECRET" ] && AUTH_HEADER=(-H "Authorization: Bearer $NOTIFICATION_CRON_SECRET")
RESPONSE=$(curl -s -X POST "${AUTH_HEADER[@]}" "$API_URL" -w "HTTP_STATUS:%{http_code}")
HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo $RESPONSE | sed -E 's/HTTP_STATUS:[0-9]*$//')

if [ "$HTTP_STATUS" -eq 200 ]; then
    log_message "SUCCESS: $BODY"
else
    log_message "ERROR: HTTP $HTTP_STATUS - $BODY"
fi

log_message "Notification check completed"