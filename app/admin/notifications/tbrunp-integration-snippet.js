// tbrunp-integration-snippet.js
//
// Reference snippet for integrating the on-publish notification check into
// the tbrunp client apps (Timebars, Costbars, Agilebars).
//
// HOW TO USE
// ──────────
// 1. Add the #notificationResult element near your publish button in the HTML.
// 2. Call checkPublishNotifications(token, product) right after the
//    existing "Successfully published" block inside publishToTimebarsCloud().
// 3. Ensure WWW_URL is set in your app config to "https://www.timebars.com"
//    (or "https://www.timebars.app" for staging).
//
// The call is fire-and-forget — it never blocks or breaks the publish flow.
// ─────────────────────────────────────────────────────────────────────────────


// ─── 1. HTML TO ADD NEAR YOUR PUBLISH BUTTON ─────────────────────────────────
//
// Place this div immediately below #publishingResult in your publish UI:
//
//   <div id="notificationResult" style="display:none; margin-top:8px; font-size:14px; padding:6px 10px; border-radius:4px;"></div>
//
// No other HTML changes needed.


// ─── 2. ADD TO YOUR APP CONFIG ───────────────────────────────────────────────
//
// Add this constant alongside API_URL and other config values:
//
//   const WWW_URL = "https://www.timebars.com"   // production
//   const WWW_URL = "https://www.timebars.app"   // staging
//
// IMPORTANT: always use https:// — http:// triggers a server-side redirect to
// HTTPS which browsers refuse to follow for CORS preflight requests, producing:
// "Redirect is not allowed for a preflight request"


// ─── 3. NOTIFICATION CHECK FUNCTION ─────────────────────────────────────────
//
// Add this function to the same file as publishToTimebarsCloud.
// The `product` param is one of: "timebars" | "costbars" | "agilebars"
//
// IDENTITY: the server does NOT read email from the request body.
// It calls Strapi's GET /users/me with the Bearer token and trusts only
// what Strapi returns (strapiUser.email). This means a caller cannot
// impersonate another user by passing a different email — the token is
// the sole source of identity.

async function checkPublishNotifications(token, product) {
  const statusEl = document.getElementById('notificationResult');
  if (!statusEl) return;

  statusEl.style.display = 'block';
  statusEl.style.background = '#f0f4ff';
  statusEl.style.color = '#444';
  statusEl.innerHTML = '⏳ Checking project health...';

  try {
    const res = await fetch(`${WWW_URL}/api/notifications/on-publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product }),
    });

    const data = await res.json();

    if (data.status === 'sent') {
      // Issues found — notification was dispatched to Pushover (and SMS if configured)
      statusEl.style.background = '#fff3cd';
      statusEl.style.color = '#856404';
      statusEl.innerHTML = `🚨 ${data.message}`;
    } else if (data.status === 'healthy') {
      // No threshold violations in the published data
      statusEl.style.background = '#d1e7dd';
      statusEl.style.color = '#0f5132';
      statusEl.innerHTML = `✅ ${data.message}`;
    } else if (data.status === 'skipped' && data.reason === 'duplicate') {
      // Already notified today — show the time of the earlier notification
      const sentTime = data.sentAt
        ? new Date(data.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      statusEl.style.background = '#e9ecef';
      statusEl.style.color = '#6c757d';
      statusEl.innerHTML = `ℹ️ Already notified today${sentTime ? ` at ${sentTime}` : ''}`;
    } else if (data.status === 'skipped' && data.reason === 'no_configs') {
      // User has no notification configurations set up — silent, no UI noise
      statusEl.style.display = 'none';
    } else {
      // No in-progress projects or other benign skip — no UI noise
      statusEl.style.display = 'none';
    }
  } catch (e) {
    // Network / server error — never surface to the user, publish already succeeded
    console.log('Notification check failed (non-critical):', e.message);
    statusEl.style.display = 'none';
  }
}


// ─── 4. MODIFY publishToTimebarsCloud ────────────────────────────────────────
//
// Inside the existing if (strapiRes.ok) { ... } block, add ONE line after the
// "Successfully published" UI update. No other changes to the function needed.
//
// BEFORE (existing code, abbreviated):
//
//   if (strapiRes.ok) {
//     $("#publishingResult").text('Successfully published')
//     $("#publishingResult").css('display', 'block');
//     let liHTML = `${datasetName}`
//     $("#pubsetNameFeedingDashboard").text(liHTML)
//   }
//
// AFTER (add the one checkPublishNotifications call):
//
//   if (strapiRes.ok) {
//     $("#publishingResult").text('Successfully published')
//     $("#publishingResult").css('display', 'block');
//     let liHTML = `${datasetName}`
//     $("#pubsetNameFeedingDashboard").text(liHTML)
//
//     // Non-blocking PPM notification check — never throws, never delays publish UI
//     checkPublishNotifications(token, 'timebars')  // change product per app
//   }
//
//
// For Costbars:  checkPublishNotifications(token, 'costbars')
// For Agilebars: checkPublishNotifications(token, 'agilebars')
//
// The `product` value is informational only (logged server-side for debugging).
// Evaluation is always driven by the user's order product_code in Strapi.


// ─── 5. RESPONSE STATES SUMMARY ──────────────────────────────────────────────
//
// status: 'sent'     → Issues found, Pushover (+SMS if configured) dispatched
//                      UI: yellow warning — "X projects flagged — notification sent"
//
// status: 'healthy'  → Evaluation ran, no threshold violations
//                      UI: green check — "Projects look good — no issues found"
//
// status: 'skipped', reason: 'duplicate'
//                    → Already notified today (in-memory or Strapi dedup)
//                      UI: grey info — "Already notified today at HH:MM"
//
// status: 'skipped', reason: 'no_configs'
//                    → No active notification settings configured
//                      UI: hidden (no noise for unconfigured users)
//
// status: 'skipped', reason: 'no_projects'
//                    → No in-progress projects in the pubset
//                      UI: hidden
