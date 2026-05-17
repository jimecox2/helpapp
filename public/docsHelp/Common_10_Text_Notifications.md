# Text Notifications Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

Timebars Ltd. products — Agilebars, Timebars, and Costbars — include an automated notification system that alerts portfolio and project managers when projects require attention. Notifications are delivered to your phone via the **Pushover** app. An optional SMS escalation channel (Costbars only) is available via Twilio for executive-level alerts.

The system evaluates your in-progress projects automatically every four hours and sends a push notification when your configured thresholds are met. You can also trigger a notification at any time from the admin panel — for example, immediately after publishing a new dataset.

> **Which products support notifications?**
> All three products — Agilebars (AB), Timebars (TB), and Costbars (CB) — support push notifications. The number of conditions evaluated and the available threshold settings differ by product. Costbars includes the full five-scenario evaluation and optional SMS escalation. See [How the System Evaluates Projects](#how-the-system-evaluates-projects) for details.

> **System administrators and developers:** For server environment configuration, cron scheduling, authentication, API security, and Strapi integration details, see [Text Notifications — Technical Details](https://www.timebars.com/knowledgebase/helparticles/common-10-text-notifications-technical-details).

---

## Table of Contents

1. [Overview](#overview)
2. [Preparing Your Projects for Notifications](#preparing-your-projects-for-notifications)
3. [Setting Up Pushover on Your Phone](#setting-up-pushover-on-your-phone)
4. [Creating a Notification Configuration](#creating-a-notification-configuration)
5. [How the System Evaluates Projects](#how-the-system-evaluates-projects)
   - [Agilebars — 2-Condition Check](#agilebars--2-condition-check)
   - [Timebars — 3-Condition Check](#timebars--3-condition-check)
   - [Costbars — 5-Scenario Check](#costbars--5-scenario-check)
   - [The Chain-of-Values Rule](#the-chain-of-values-rule)
6. [When Notifications Are Sent](#when-notifications-are-sent)
   - [Automated Schedule](#automated-schedule)
   - [On-Publish Notifications](#on-publish-notifications)
   - [Timing Gates](#timing-gates)
7. [Escalation — SMS for Costbars](#escalation--sms-for-costbars)
8. [Testing Your Configuration](#testing-your-configuration)
9. [Managing Notifications](#managing-notifications)
10. [Troubleshooting](#troubleshooting)
11. [Quick Reference — Fields by Product](#quick-reference--fields-by-product)

---

## Overview

The notification system works in three stages:

1. **Evaluate** — The system reads your in-progress projects and checks them against the thresholds you have configured.
2. **Gate** — Before sending, the system checks timing rules: business hours, quiet hours, cooldown period, and daily send limits.
3. **Send** — If at least one project triggers an alert and all timing gates pass, a push notification is sent to the manager's phone via Pushover.

You manage all of this from the **Notifications** page in the admin panel at `/admin/notifications`.

---

## Preparing Your Projects for Notifications

Before notifications can fire, two things must be true about each project record, and the relevant metadata fields must be populated. The notification engine silently skips projects that do not meet the prerequisites.

### Prerequisites — every product

| Requirement | Field | Value |
|---|---|---|
| Must be a project-type bar | `tbType` | `Project` |
| Must be actively in progress | `tbMDStatus` | `In progress` (exact match, case-sensitive) |

Tasks, milestones, allocations, and projects with any other status (e.g., Complete, On Hold) are not evaluated.

### Fields the engine reads — by product

The engine reads these metadata fields from your project records. Empty fields are not neutral — each has a default behaviour that may trigger an alert.

**Agilebars — 2 fields:**

| Field | Form label | Pick-list values | Empty treated as |
|---|---|---|---|
| `tbMDHealthOverall` | Health Overall | Red, Yellow, Green | **Red** (triggers) |
| `tbMDSeniorLevelCommitment` | Senior Level Commitment | Full, Strong, Moderate, Limited, Not Clear, Not Assessed | **Moderate** (triggers) |

**Timebars — 3 fields (includes the 2 above, plus):**

| Field | Form label | Pick-list values | Empty treated as |
|---|---|---|---|
| `tbMDRiskVsSizeAndComplexity` | Risk Vs Size And Complexity | 0–10 Very Small and Simple … 91–100 Extremely Complex and Risky | **Score 51+** (triggers) |

**Costbars — 5 scenarios (includes the 3 above, plus):**

| Field | Form label | Notes | Used in scenario |
|---|---|---|---|
| `tbMDPriorityStrategic` | Strategic Priority | Numeric score — higher = more critical | 1, 2, 4, 5 |
| `tbCost` | Actual Cost | Current actual cost spend | 4 (Budget Overrun) |
| `tbBudgetCost` | Budget Cost | Approved budget | 4 (Budget Overrun) |
| `tbWork` | Actual Work (hours) | Current actual hours | 5 (Work Overrun) |
| `blWork` | Baseline Work (hours) | Baseline hours snapshot | 5 (Work Overrun) |
| `tbMDEscalationLevel` | Escalation Level | Set to `Executives` to trigger SMS escalation | SMS only |

> **Tip — force a test result:** Set Health Overall = Green, Senior Level Commitment = Not Assessed, and (for TB/CB) Risk = 0–10 Very Small and Simple on a test project. These are the most permissive values and will match against almost any notification threshold, making it easy to verify the system end-to-end.

---

## Setting Up Pushover on Your Phone

Pushover is a third-party push notification service used to deliver alerts to your phone. It has a one-time cost of approximately $5 USD and includes a free 30-day trial.

**Step 1 — Install and create an account**

1. Install **Pushover** from the App Store (iOS) or Google Play (Android).
2. Create an account at [pushover.net](https://pushover.net) or directly within the app.

**Step 2 — Get your User Key**

After logging in to [pushover.net](https://pushover.net), your **User Key** is displayed on the home dashboard in the top section. Copy it — this is your `PUSHOVER_USER_KEY`.

**Step 3 — Create an App Token**

1. In pushover.net, go to **Your Applications** → **Create an Application / API Token**.
2. Give it a name such as `Timebars PPM`.
3. Copy the **API Token** — this is your `PUSHOVER_APP_TOKEN`.

**Step 4 — Confirm the keys are in your environment**

Your system administrator will have added these two values to the server's environment configuration file:

```
PUSHOVER_APP_TOKEN=    ← From pushover.net → Your Applications → API Token
PUSHOVER_USER_KEY=     ← From pushover.net → Home dashboard, top section
```

Once these are in place, notifications can be sent. You can verify the connection is working from the [Testing](#testing-your-configuration) section before creating your first configuration.

---

## Creating a Notification Configuration

Navigate to **`/admin/notifications`** and click **Add Notification** (or the **+** button). The form has four tabs.

### Tab 1 — Basic

| Field | Description |
|---|---|
| Manager Name | The name of the person who will receive this notification |
| Phone | Manager's phone number (used for SMS escalation if enabled) |
| Email | Manager's email address |
| Timezone | The manager's local timezone — used for business hours and quiet hours calculations |
| Order | Select the product licence order this config belongs to |
| Active | Toggle to **ON** to enable this notification config |

### Tab 2 — Preferences

| Field | Description |
|---|---|
| Primary Channel | Set to **push** to use Pushover. (SMS is the escalation channel, not the primary channel.) |
| Business Hours Only | If enabled, notifications are only sent between 09:00 and 17:00 in the manager's timezone |
| Send on Weekends | If disabled, notifications are skipped on Saturday and Sunday |
| Quiet Hours Start / End | Times during which notifications are suppressed (e.g., 22:00–07:00) |
| Cooldown (hours) | Minimum hours between notifications for this manager. Set to a low value (e.g., 1 hour) during initial testing. |
| Daily Limit | Maximum number of notifications per day for this manager |

### Tab 3 — Thresholds

The fields shown on this tab depend on your product licence. See [How the System Evaluates Projects](#how-the-system-evaluates-projects) for a full explanation of each threshold.

**Agilebars (AB) — 2 fields:**

| Field | Options | Default |
|---|---|---|
| Overall Health Threshold | Green, Yellow, Red | Red |
| Senior Level Commitment Threshold | Full, Strong, Moderate, Limited, Not Clear, Not Assessed | Moderate |

**Timebars (TB) — 3 fields:**

| Field | Options | Default |
|---|---|---|
| Overall Health Threshold | Green, Yellow, Red | Red |
| Senior Level Commitment Threshold | Full, Strong, Moderate, Limited, Not Clear, Not Assessed | Moderate |
| Risk / Size / Complexity Threshold | 0–10 Very Small and Simple … 91–100 Extremely Complex and Risky | 51–60 Significant Complexity |

**Costbars (CB) — 5 fields:**

| Field | Options | Default |
|---|---|---|
| Overall Health Threshold | Green, Yellow, Red | Red |
| Senior Level Commitment Threshold | Full, Strong, Moderate, Limited, Not Clear, Not Assessed | Moderate |
| Risk / Size / Complexity Threshold | 0–10 Very Small and Simple … 91–100 Extremely Complex and Risky | 51–60 Significant Complexity |
| Strategic Value Threshold | Numeric (e.g., 50) | 50 |
| Budget Overrun % Threshold | Numeric percentage (e.g., 10) | 10 |
| Work Hours Overrun % Threshold | Numeric percentage (e.g., 20) | 20 |

### Tab 4 — Escalation

Escalation is a Costbars-only feature that sends an SMS via Twilio in addition to the Pushover notification. See [Escalation — SMS for Costbars](#escalation--sms-for-costbars). For Agilebars and Timebars, leave escalation off.

---

## How the System Evaluates Projects

The system reads all projects in your published dataset where `Status = In progress` and evaluates each one against your notification configuration. The logic applied depends on your product licence.

### The Chain-of-Values Rule

All categorical threshold comparisons use a **chain-of-values** model. Rather than checking for an exact match, the system checks whether a project's value is **at or beyond the threshold you set**, climbing toward the most critical end of the scale.

**Overall Health** — climbs toward Red (worst):

| Threshold you set | Fires for these project health values |
|---|---|
| Green | Green, Yellow, Red |
| Yellow | Yellow, Red |
| Red | Red only |

An empty health field on a project is treated as **Red**.

**Senior Level Commitment** — climbs toward Full (strongest):

| Threshold you set | Fires for these project commitment values |
|---|---|
| Not Assessed | Not Assessed, Not Clear, Limited, Moderate, Strong, Full |
| Not Clear | Not Clear, Limited, Moderate, Strong, Full |
| Limited | Limited, Moderate, Strong, Full |
| Moderate | Moderate, Strong, Full |
| Strong | Strong, Full |
| Full | Full only |

An empty commitment field on a project is treated as **Moderate**.

**Risk / Size / Complexity** — climbs toward higher complexity:

Each label maps to a numeric score. The system fires when a project's score is **greater than or equal to** the score of your configured threshold.

| Label | Score |
|---|---|
| Not Assessed | 0 |
| 0–10 Very Small and Simple | 10 |
| 11–20 Small and Straightforward | 20 |
| 21–30 Medium with Some Complexity | 30 |
| 31–40 Large with Moderate Complexity | 40 |
| 41–50 Complex but Manageable | 50 |
| 51–60 Significant Complexity | 60 |
| 61–70 Large and Complex | 70 |
| 71–80 Very Large and Complex | 80 |
| 81–90 Highly Complex and Risky | 90 |
| 91–100 Extremely Complex and Risky | 100 |

An empty risk field on a project is treated as triggering (score 51+).

---

### Agilebars — 2-Condition Check

A notification fires when **both** conditions are true for the same in-progress project:

1. The project's **Overall Health** is at or beyond your configured health threshold (climbing toward Red).
2. The project's **Senior Level Commitment** is at or above your configured commitment threshold (climbing toward Full).

> **Example:** You configure Health = Yellow and Commitment = Moderate. The system will send a notification for any in-progress project where health is Yellow **or** Red, **and** commitment is Moderate, Strong, **or** Full — both must be true simultaneously.

---

### Timebars — 3-Condition Check

A notification fires when **all three** conditions are true for the same in-progress project:

1. The project's **Overall Health** is at or beyond your configured health threshold.
2. The project's **Senior Level Commitment** is at or above your configured commitment threshold.
3. The project's **Risk / Size / Complexity** score is greater than or equal to the score of your configured risk threshold.

> **Example:** You configure Health = Yellow, Commitment = Moderate, Risk = 51–60 Significant Complexity (score 60). A notification fires for any in-progress project where health is Yellow or Red, **and** commitment is Moderate or higher, **and** risk score is ≥ 60.

---

### Costbars — 5-Scenario Check

Costbars evaluates five independent scenarios against every in-progress project. A notification fires if **any one** scenario triggers.

| # | Scenario | Fires when |
|---|---|---|
| 1 | **Critical High-Value Project** | Health is at or beyond your health threshold **AND** strategic value exceeds your strategic value threshold |
| 2 | **Missing Strategic Data** | Health is at or beyond threshold **AND** strategic value field is blank **AND** risk score ≥ your risk threshold |
| 3 | **Missing Health Status** | Health field is blank **AND** commitment is at or above your commitment threshold **AND** risk score ≥ your risk threshold |
| 4 | **Budget Overrun** | Actual cost exceeds budget by more than your budget overrun % **AND** the project is high-value (strategic value ≥ threshold) |
| 5 | **Work Hours Overrun** | Actual hours exceed baseline hours by more than your work overrun % **AND** the project is high-value |

The notification message you receive identifies which scenario(s) triggered and which project(s) were flagged.

> **SMS escalation note:** If escalation is enabled on your configuration and a flagged project has its `Escalation Level` field set to `Executives`, an SMS is sent in addition to the Pushover notification. See [Escalation — SMS for Costbars](#escalation--sms-for-costbars).

---

## When Notifications Are Sent

### Automated Schedule

The system runs an automated check every **four hours**, around the clock. Each run evaluates all active notification configurations against your published dataset. If a configuration's timing gates pass and projects are flagged, a notification is sent.

### On-Publish Notifications

When you publish a dataset from any of the three client apps, the system can trigger an **immediate** notification check — bypassing the four-hour schedule. This is useful for ensuring managers are alerted as soon as new data is available.

On-publish notifications bypass business hours and quiet hours checks. Cooldown and daily limit rules still apply to prevent duplicate sends on rapid re-publishes.

> **Note:** On-publish notifications require no additional configuration. They are triggered automatically when you publish, provided you have an active notification configuration set up.

### Timing Gates

Before any notification is sent during an automated run, the system checks each manager's configuration against the following gates in order:

| Gate | What it checks |
|---|---|
| **Active** | The notification config must have Active set to ON |
| **Business hours** | If enabled, the current time must be between 09:00 and 17:00 in the manager's timezone |
| **Weekend block** | If weekends are disabled, the current day must be Monday–Friday |
| **Quiet hours** | The current time must be outside the configured quiet hours window |
| **Cooldown** | Sufficient hours must have passed since the last notification was sent to this manager |
| **Daily limit** | The manager must not have reached their configured maximum notifications for the current day |

If any gate fails, the notification is skipped for that run. Manual sends from the admin panel bypass all timing gates and send immediately.

---

## Escalation — SMS for Costbars

Costbars configurations include an optional SMS escalation channel. When enabled, any flagged project that has its `Escalation Level` metadata field set to `Executives` will trigger an SMS message in addition to the standard Pushover notification.

To configure escalation:

1. Open the notification configuration form and go to **Tab 4 — Escalation**.
2. Enable the escalation toggle.
3. Enter the **escalation phone number** to receive the SMS.

> **Important:** SMS escalation only fires when the flagged project's `tbMDEscalationLevel` field is set to `Executives`. Projects with other escalation level values receive the Pushover notification only. Agilebars and Timebars projects always receive Pushover only — the escalation level field is not used in those products.

---

## Testing Your Configuration

### Manual Dry Run

On the `/admin/notifications` page, scroll to the **Notification Testing & Message Generation** section and click **Run Manual Test**. This runs the full evaluation logic in your browser using your current project data and notification configurations. It shows:

- How many in-progress projects were found
- Which projects were flagged and which scenario or condition triggered
- The full notification message that would be sent
- Debug logs for each condition checked (click **Show Debug Logs**)

No notification is sent during a dry run. Data is not written to the server.

### Sending a Test Notification

If projects are flagged during the dry run, an **AdminNotificationSender** section appears below the results. Click **Send to [Manager Name]** to fire the actual Pushover notification immediately. This bypasses all timing gates and is intended for verifying that your Pushover keys and phone setup are working correctly.

> **Tip:** If you want to force a flagged result during testing, temporarily set permissive threshold values — for example, Health = Green (fires for all health values), Commitment = Not Assessed (fires for all), and a low risk or strategic value threshold. Remember to restore your intended thresholds after testing.

### Low-Level API Test

To confirm that Pushover itself is reachable (before configuring anything in the admin UI), your system administrator can run a direct test from the server:

```bash
curl -s \
  --form-string "token=YOUR_PUSHOVER_APP_TOKEN" \
  --form-string "user=YOUR_PUSHOVER_USER_KEY" \
  --form-string "message=Test from Timebars!" \
  --form-string "title=PPM Test" \
  https://api.pushover.net/1/messages.json
```

A successful response looks like: `{"status":1,"request":"..."}` and a push notification arrives on the phone within seconds.

---

## Managing Notifications

All notification configurations for your licences are listed on `/admin/notifications`. From this page you can:

- **Add** a new notification configuration with the **+** button
- **Edit** an existing configuration by clicking on it
- **Toggle Active** on or off directly from the list to temporarily pause a configuration without deleting it
- **View the threshold summary** for each configuration at a glance — the list shows the key configured values by product

Multiple configurations can exist for the same order (for example, one per portfolio manager). Each fires independently based on its own thresholds and timing settings.

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| No push notification received | Run the curl test in [Low-Level API Test](#low-level-api-test) to verify your Pushover token and user key are valid |
| Pushover returns `status:0` | Your `PUSHOVER_APP_TOKEN` or `PUSHOVER_USER_KEY` is incorrect — check for typos or placeholder values |
| Dry run shows "No flagged projects" | Lower your thresholds temporarily (e.g., Health = Green) to verify the evaluator runs at all. Also confirm your projects have `Status = In progress`. |
| Notification was expected but not sent during automated run | Check Active = ON, verify the manager's timezone is correct, and review business hours / quiet hours / cooldown / daily limit settings |
| SMS not received (Costbars) | Confirm escalation is enabled on the config **and** that the flagged project's `Escalation Level` field is set to `Executives` |
| On-publish notification not received | Confirm cooldown has elapsed since the last send — on-publish sends still respect the cooldown setting |
| Admin panel shows a 500 error on the notifications page | Contact your system administrator — this typically indicates a missing server-side environment variable |

---

## Quick Reference — Fields by Product

| Field | Agilebars (AB) | Timebars (TB) | Costbars (CB) |
|---|:---:|:---:|:---:|
| Overall Health Threshold | ✓ | ✓ | ✓ |
| Senior Level Commitment Threshold | ✓ | ✓ | ✓ |
| Risk / Size / Complexity Threshold | — | ✓ | ✓ |
| Strategic Value Threshold | — | — | ✓ |
| Budget Overrun % Threshold | — | — | ✓ |
| Work Hours Overrun % Threshold | — | — | ✓ |
| SMS Escalation | — | — | ✓ |
| Conditions evaluated | 2 | 3 | 5 scenarios |
| Automated check frequency | Every 4 hours | Every 4 hours | Every 4 hours |
| On-publish notification | ✓ | ✓ | ✓ |

---

*For server environment configuration, cron scheduling, authentication, API security, and Strapi integration details, see [Text Notifications — Technical Details](./Common_10_Text_Notifications_Technical_Details.md).*
