![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Text Notifications User Guide

Timebars Ltd. products — Agilebars, Timebars, and Costbars — include an automated notification system that alerts portfolio and project managers when projects require attention. Notifications are delivered to your phone via the **Pushover** app. An optional SMS escalation channel (Costbars only) is available via Twilio for executive-level alerts.

The system evaluates your in-progress projects automatically every four hours and sends a push notification when your configured thresholds are met. You can also trigger a notification at any time from the admin panel — for example, immediately after publishing a new dataset.

> **Which products support notifications?**
> All three products — Agilebars (AB), Timebars (TB), and Costbars (CB) — support push notifications. The number of conditions evaluated and the available threshold settings differ by product. Costbars includes the full five-scenario evaluation and optional SMS escalation. See [How the System Evaluates Projects](#how-the-system-evaluates-projects) for details.

> **This document has two parts.** **Part 1** is the user guide — setting up
> Pushover, creating a notification configuration, choosing thresholds and testing
> them. **Part 2 — Technical Reference** covers the server side: environment
> variables, authentication, API security, cron scheduling and Strapi integration.
> Part 2 is for system administrators and developers; a portfolio manager never
> needs it.

---

## Table of Contents

### Part 1 — Using Notifications

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

### Part 2 — Technical Reference

12. [Environment Variables](#environment-variables)
13. [Data Sources — How Projects Are Fetched](#data-sources--how-projects-are-fetched)
14. [Authentication Flow](#authentication-flow)
15. [Route Protection](#route-protection)
16. [API Route Security](#api-route-security)
17. [Strapi Collections](#strapi-collections)
18. [Strapi User Fields Required](#strapi-user-fields-required)
19. [Automated Cron Job](#automated-cron-job)
20. [On-Publish Endpoint](#on-publish-endpoint)
21. [Manual Test Button — What It Actually Does](#manual-test-button--what-it-actually-does)
22. [Low-Level Connectivity Test](#low-level-connectivity-test)

---

# Part 1 — Using Notifications

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

#### Choosing your threshold values

Each threshold answers "how bad does this have to get before I want to hear about
it?" The defaults are a reasonable starting point; these are the questions each
one is really asking:

| Threshold | What it watches | A worked example |
|---|---|---|
| **Overall Health** | the project's rolled-up health indicator | set to **Red** to hear only about projects already in trouble; **Yellow** to catch them earlier |
| **Senior Level Commitment** | the recorded level of executive support | set to **Moderate** to be told when sponsorship is drifting below solid backing |
| **Risk / Size / Complexity** | the project's risk and complexity score | set to **51–60** to ignore small, simple projects and hear only about substantial ones |
| **Strategic Value** | the strategic score from portfolio analysis | set to **50** so a high-value project in difficulty reaches you ahead of a low-value one |
| **Budget Overrun %** | forecast cost against budget | set to **10** to be told when a project passes 10% over |
| **Work Hours Overrun %** | forecast hours against budgeted hours | set to **20** to allow more tolerance on effort than on money |

Remember the [chain-of-values rule](#the-chain-of-values-rule): a threshold is not
an exact match. Setting Overall Health to **Yellow** catches Yellow **and** Red,
because the check climbs toward the most critical end of the scale.

**Start loose, then tighten.** Set generous thresholds first, watch what actually
arrives over a reporting cycle or two, and tighten from there. Thresholds that are
too tight produce silence, which reads exactly like a system that is not working;
thresholds that are too loose produce noise, and a manager who stops reading the
alerts. Both failures are quiet, which is why the dry run below matters.

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

### Best Practice

- **Run a dry run every time you change a threshold.** It costs nothing and tells
  you immediately whether the change did what you expected.
- **Start with looser thresholds** and tighten once you have seen real behaviour
  over a reporting cycle.
- **Keep a short cooldown while testing** (an hour), then raise it for live use so
  a manager is not alerted repeatedly about the same project.
- **Reserve executive escalation for genuinely high-impact projects.** An
  escalation channel that fires often stops being treated as an escalation.
- **Write down the thresholds you chose and why.** The numbers are easy to change
  and easy to forget, and the next person to look at them will want the reasoning,
  not just the values.

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

---

# Part 2 — Technical Reference

This part covers server-side configuration, authentication, API security, cron
scheduling and Strapi integration. It is intended for **system administrators and
developers**. Nothing in Part 1 requires it.

---

## Environment Variables

The following env vars must be set on the server:

```bash
PUSHOVER_APP_TOKEN=     # From pushover.net → Your Applications → API Token
PUSHOVER_USER_KEY=      # From pushover.net → Home dashboard, top section
NOTIFICATION_STRAPI_KEY # Used by the automated endpoint to fetch configs and project data from Strapi (no user session needed — designed for cron use)
SYSTEM_ADMIN_EMAIL=     # The email whose active pubset is used to fetch project data for automated runs
```

> **Note:** `PUSHOVER_API_URL` and `ORTHISURL` env vars are not used. The code hardcodes `https://api.pushover.net/1/messages.json` directly in `pushover.js` and `pushover/route.js`.

---

## Data Sources — How Projects Are Fetched

The automated notification route always fetches from the **`timebars` Strapi collection** (the pubset), filtering to the `SYSTEM_ADMIN_EMAIL`'s active pubset. It reads `tbmdjoined` rows and filters down to:

- `tbType === "Project"`
- `tbMDStatus === "In progress"`

Only those rows enter the evaluation engine. Projects that are not of type Project, or whose status is not exactly `"In progress"`, are silently skipped.

The notification configurations are fetched from the **`notifications`** Strapi collection, each linked to an **order** in the **`orders`** collection. The order carries the product licence (e.g., Agilebars Tier 2, Costbars Tier 1), and the system reads the `product_code` from that order to decide which evaluation logic to apply.

### Product code prefix convention

| Prefix | Product | Scenarios evaluated |
|---|---|---|
| `CB*` | Costbars | 5 scenarios |
| `TB*` | Timebars | 3-condition check |
| `AB*` | Agilebars | 2-condition check |

---

## Authentication Flow

When a user signs in, NextAuth runs a JWT callback (`app/auth/auth.js`) that performs two things beyond standard login:

1. Stores the Strapi JWT in the session (`session.jwt`) — used for all subsequent Strapi API calls.
2. Makes an extra call to Strapi to fetch two RBAC fields from the user record:
   - `primary_role` — determines admin access
   - `customer_id` — organisation identifier for data scoping

These are then available on `session.user` throughout the app.

---

## Route Protection

| Route | Guard |
|---|---|
| `/admin` | Must be authenticated **AND** `primary_role === 'admin'` or email is the designated admin email |
| `/admin/notifications` | Must be authenticated only — **no role check** |

`/admin/notifications` is reachable by any logged-in user. The main `/admin` page is the harder gate.

---

## API Route Security

| Route | Protection |
|---|---|
| `POST /api/notifications/automated` | System-only — uses `NOTIFICATION_STRAPI_KEY` env var. No user session required. Designed for cron. |
| `GET/POST /api/notifications/pushover` | Requires `Authorization: Bearer <token>` header |
| `GET/POST /api/notifications/twilio` | **No auth check** — open if reachable |
| `POST /api/notifications/on-publish` | Validated via Strapi JWT token |

> **Note:** The Twilio route validates input but does not verify the caller's identity. As long as it is only called server-side from `AdminNotificationSender` this is acceptable in practice, but it could be called directly by anyone who knows the URL. Consider adding a bearer token check if the route becomes externally reachable.

---

## Strapi Collections

**`orders`** — stores purchases, each linked to a product and a user. Filtered by the `owner` field (email address) to scope to each user's licences.

When `/admin/notifications` loads, it calls `getMyOrders(email, jwt)` which hits:

```
GET /api/orders?populate[0]=product&populate[1]=user
    &filters[owner][$eq]={your-email}
```

Fields displayed from each order:

| UI label | Strapi field |
|---|---|
| Order name | `order.name` |
| Product name / code | `order.product.name` / `order.product.product_code` |
| Cost | `order.total` |
| Expiration | `order.expires_on` |
| Active status | `order.active_status` |

**`notifications`** — stores per-manager notification configurations, each linked back to an order by `order.id`. Multiple notification configs can exist per order (one per manager). Fields cover all thresholds, channels, quiet hours, cooldown, and daily limit settings.

---

## Strapi User Fields Required

Each user record in the Strapi `users` collection needs two custom fields:

| Field | Type | Purpose |
|---|---|---|
| `primary_role` | String | Set to `'admin'` to grant `/admin` access |
| `customer_id` | String / Number | Organisation identifier for data scoping |

If `primary_role` is null or missing, the user passes the `/admin/notifications` check (authenticated only) but is redirected away from `/admin` itself.

---

## Automated Cron Job

The automated notification chain runs as a bash cron job on the production server.

### Chain of execution

```
cron job (server)
  └─ runs automate_pushover_twillio.sh
       └─ internal guard: exits if weekend or outside 09:00–18:00 server time
       └─ POST https://www.timebars.com/api/notifications/automated
            └─ fetches all active notification configs (via NOTIFICATION_STRAPI_KEY)
            └─ fetches all in-progress projects (via fetchProjectDataFromPubset)
            └─ calls evaluateInProgressProjects() ← scenarios run here
            └─ for each flagged manager:
                 checks timezone / quiet hours / cooldown / daily limit
                 sends Pushover (+ SMS if escalation conditions met)
                 updates last_notification_sent + notification_count_today in Strapi
```

### Script location and schedule

The script lives at `~/docker/tbwwwp/automate_pushover_twillio.sh` and is registered in root's crontab via `sudo crontab -e`.

**Recommended schedule — every 4 hours, any day:**

```
0 */4 * * * /home/jcox/docker/tbwwwp/automate_pushover_twillio.sh >> /var/log/ppm-notifications.log 2>&1
```

**Previous schedule — hourly, weekdays only:**

```
0 6-23 * * 1-5 /home/jcox/docker/tbwwwp/automate_pushover_twillio.sh
```

> **Absolute path required:** `sudo crontab -e` registers in root's crontab, so `~/` expands to `/root/` not `/home/jcox/`. Always use the full path.

### Setup checklist

```bash
# Verify script exists and is executable
ls -la /home/jcox/docker/tbwwwp/automate_pushover_twillio.sh
chmod +x /home/jcox/docker/tbwwwp/automate_pushover_twillio.sh

# Create log file writable by root
sudo touch /var/log/ppm-notifications.log
sudo chmod 644 /var/log/ppm-notifications.log

# Verify cron registration
sudo crontab -l
```

---

## On-Publish Endpoint

`POST /api/notifications/on-publish` triggers an immediate notification check when users publish a dataset from any of the three client apps.

### Behaviour differences from automated runs

| Behaviour | Automated cron | On-publish |
|---|---|---|
| Business hours check | Applied | **Bypassed** |
| Quiet hours check | Applied | **Bypassed** |
| Cooldown | Applied | Applied (prevents duplicate sends on rapid re-publish) |
| Daily limit | Applied | Applied |
| Authentication | `NOTIFICATION_STRAPI_KEY` | Strapi JWT token |

### Deduplication

Two-layer deduplication prevents duplicate sends:

1. **In-memory cache** (per user per day) — fast, survives normal runtime restarts
2. **Strapi `last_notification_sent` field** — persistent, survives full server restarts

### Client integration

A reference integration snippet is at `app/admin/notifications/tbrunp-integration-snippet.js`. The design is fire-and-forget: notification failures never block or break the publish operation. Missing notification configs or no in-progress projects result in silent skips.

---

## Manual Test Button — What It Actually Does

The **Run Manual Test** button on `/admin/notifications` calls `evaluateInProgressProjects()` **directly in the browser** using project data and notification configs that were loaded server-side when the page rendered. It does not make any HTTP request and does not write to the server.

- Results and debug logs appear in the UI (Show Debug Logs button) and in the browser console (F12 → Console).
- The server log at `/var/log/ppm-notifications.log` is only written when the cron job fires the real API call.
- The **Send to [Manager]** buttons in `AdminNotificationSender` call the Pushover/Twilio routes directly and bypass the cron, timing gates, and cooldown/daily-limit counters entirely. They are intended for verifying that keys and phone setup work.

---

## Low-Level Connectivity Test

Before configuring anything in the admin UI, confirm Pushover is reachable from the server:

```bash
curl -s \
  --form-string "token=YOUR_PUSHOVER_APP_TOKEN" \
  --form-string "user=YOUR_PUSHOVER_USER_KEY" \
  --form-string "message=Test from Timebars!" \
  --form-string "title=PPM Test" \
  https://api.pushover.net/1/messages.json
```

A successful response: `{"status":1,"request":"..."}` — push arrives on the phone within seconds.

You can also test the app's own API route once the dev server is running:

```bash
curl -X POST http://localhost:3001/api/notifications/pushover \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from Timebars","title":"PPM Test","priority":1}'
```

---

*Document version: 1.0 — 2026-05-07*
