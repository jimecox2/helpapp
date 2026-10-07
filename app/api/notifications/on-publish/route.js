// app/api/notifications/on-publish/route.js
import { NextResponse } from 'next/server';
import { getMyOrders, getNotificationsByOrder, fetchProjectDataFromPubset, updateNotification } from '@/crud/coreCrud';
import { evaluateInProgressProjects } from '@/lib/notifications/notificationEvaluator';
import { sendNotificationBasedOnEscalation } from '@/lib/notifications/twilio';
import { API_URL, FRONTEND_URL } from '@/config/site';

// CORS is configured centrally in next.config.mjs for this route.

// ─── In-memory daily dedup cache (Layer 1) ───────────────────────────────────
// Survives normal runtime. Cleared on server restart — Layer 2 (Strapi) covers that.
// Key: `${email}:${YYYY-MM-DD}`, Value: { count: number, sentAt: ISOString }
const publishCache = new Map();

function getTodayStr() {
  return new Date().toISOString().split('T')[0]; // "2026-04-24"
}

function getCacheKey(email) {
  return `${email}:${getTodayStr()}`;
}

function checkCache(email) {
  return publishCache.get(getCacheKey(email)) || null;
}

function recordCacheSent(email) {
  const key = getCacheKey(email);
  const existing = publishCache.get(key) || { count: 0 };
  publishCache.set(key, {
    count: existing.count + 1,
    sentAt: new Date().toISOString(),
  });
}

// ─── Validate Strapi JWT ──────────────────────────────────────────────────────
async function validateStrapiJwt(jwt) {
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user?.email ? user : null;
  } catch {
    return null;
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // 1. Extract JWT from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const jwt = authHeader.split(' ')[1];

    // 2. Validate JWT via Strapi — derives email from the token, no env key needed
    const strapiUser = await validateStrapiJwt(jwt);
    if (!strapiUser) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    const email = strapiUser.email;
    console.log(`📬 on-publish triggered by ${email}`);

    // 3. In-memory dedup check (Layer 1 — fast)
    const cached = checkCache(email);
    if (cached) {
      console.log(`⏸️ on-publish skipped for ${email}: already notified today at ${cached.sentAt}`);
      return NextResponse.json({
        status: 'skipped',
        reason: 'duplicate',
        message: 'Already notified today',
        sentAt: cached.sentAt,
      });
    }

    // 4. Fetch orders and active notification configs for this user
    let activeConfigs = [];
    try {
      const orderList = await getMyOrders(email, jwt);
      for (const order of orderList) {
        const notifications = await getNotificationsByOrder(order.id, jwt);
        activeConfigs.push(...notifications.filter(n => n.is_active));
      }
    } catch (err) {
      console.error('❌ on-publish: failed to fetch notification configs:', err);
      return NextResponse.json({ error: 'Failed to fetch notification configs', details: err.message }, { status: 500 });
    }

    if (activeConfigs.length === 0) {
      return NextResponse.json({ status: 'skipped', reason: 'no_configs', message: 'No active notification configurations found' });
    }

    // 5. Strapi date check (Layer 2 — persistent, survives server restarts)
    // Filter out any configs already notified today from any source (cron or prior publish)
    const todayStr = getTodayStr();
    const filteredConfigs = activeConfigs.filter(config => {
      if (!config.last_notification_sent) return true;
      const lastDate = new Date(config.last_notification_sent).toISOString().split('T')[0];
      if (lastDate === todayStr) {
        console.log(`⏸️ Strapi layer: config for ${config.manager_name} already has last_notification_sent today`);
        return false;
      }
      return true;
    });

    if (filteredConfigs.length === 0) {
      recordCacheSent(email);
      return NextResponse.json({
        status: 'skipped',
        reason: 'duplicate',
        message: 'Already notified today',
        sentAt: activeConfigs[0]?.last_notification_sent,
      });
    }

    // 6. Fetch user's published project data using their own JWT
    let pjRows = [];
    try {
      const result = await fetchProjectDataFromPubset(email, jwt);
      pjRows = result.pjRows || [];
      console.log(`📊 on-publish: ${pjRows.length} in-progress projects found for ${email}`);
    } catch (err) {
      console.error('❌ on-publish: failed to fetch project data:', err);
      return NextResponse.json({ error: 'Failed to fetch project data', details: err.message }, { status: 500 });
    }

    if (pjRows.length === 0) {
      return NextResponse.json({ status: 'skipped', reason: 'no_projects', message: 'No in-progress projects found' });
    }

    // 7. Run the same evaluation engine used by the automated route and manual UI
    const evaluation = evaluateInProgressProjects(pjRows, filteredConfigs);

    if (!evaluation.shouldNotify) {
      console.log(`✅ on-publish: all projects healthy for ${email}`);
      return NextResponse.json({ status: 'healthy', message: 'Projects look good — no issues found', summary: evaluation.summary });
    }

    console.log(`🚨 on-publish: ${evaluation.flaggedProjects.length} projects flagged for ${email}`);

    // 8. Send notifications immediately — no business hours / quiet hours checks on publish
    const results = [];
    for (const notification of evaluation.notifications) {
      const { notificationConfig, flaggedProjects, managerName, projectCount } = notification;
      try {
        await sendNotificationBasedOnEscalation(
          notificationConfig,
          flaggedProjects,
          {
            title: `Publish Alert — ${projectCount} Project${projectCount > 1 ? 's' : ''} Need Attention`,
            url: `${FRONTEND_URL}/admin/notifications`,
            url_title: 'View PPM Dashboard',
          },
          jwt
        );

        // Update Strapi record — persistent dedup entry (Layer 2)
        try {
          await updateNotification(
            jwt,
            {
              data: {
                last_notification_sent: new Date().toISOString(),
                notification_count_today: (notificationConfig.notification_count_today || 0) + 1,
              },
            },
            notificationConfig.id
          );
        } catch (updateErr) {
          console.error(`❌ Failed to update Strapi notification record for ${managerName}:`, updateErr);
        }

        results.push({ manager: managerName, status: 'sent', projectCount });
        console.log(`✅ on-publish notification sent to ${managerName}`);
      } catch (err) {
        console.error(`❌ on-publish: failed to send notification to ${managerName}:`, err);
        results.push({ manager: managerName, status: 'failed', error: err.message });
      }
    }

    // 9. Record in in-memory cache (Layer 1) if at least one notification went out
    if (results.some(r => r.status === 'sent')) {
      recordCacheSent(email);
    }

    const flaggedCount = evaluation.flaggedProjects.length;

    return NextResponse.json({
      status: 'sent',
      message: `${flaggedCount} project${flaggedCount !== 1 ? 's' : ''} flagged — notification sent`,
      flaggedProjects: flaggedCount,
      sentCount: results.filter(r => r.status === 'sent').length,
      results,
      summary: evaluation.summary,
    });
  } catch (error) {
    console.error('❌ on-publish notification system error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'on-publish notification endpoint',
    description: 'POST with Authorization: Bearer <strapi-jwt> to trigger a notification check immediately after a publish event',
    dedup: 'At most 1 notification per user per day (in-memory cache + Strapi last_notification_sent)',
    noTimeChecks: 'Business hours and quiet hours are bypassed — publish events are always immediate',
  });
}
