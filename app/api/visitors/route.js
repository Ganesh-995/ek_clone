import { randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { cookies } from 'next/headers';

const activeWindowMs = 5 * 60 * 1000;

function getMetricsStore() {
  return getStore('site-metrics');
}

export async function GET() {
  const store = getMetricsStore();
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);

  const cookieStore = await cookies();
  const visitorCookie = cookieStore.get('ek_visitor')?.value;
  const [visitorId, lastVisitDate] = visitorCookie?.split('.') || [];
  const currentVisitorId = visitorId || randomUUID();

  const savedMetrics = (await store.get('visitors', { type: 'json' })) || { total: 0, today: 0, date: today, active: {} };
  const metrics = savedMetrics.date === today ? savedMetrics : { ...savedMetrics, today: 0, date: today, active: {} };

  const isNewVisitor = !visitorId;
  if (isNewVisitor) metrics.total += 1;
  if (isNewVisitor || lastVisitDate !== today) metrics.today += 1;

  metrics.active[currentVisitorId] = now;
  metrics.active = Object.fromEntries(
    Object.entries(metrics.active).filter(([, timestamp]) => now - timestamp < activeWindowMs)
  );

  await store.setJSON('visitors', metrics);

  if (isNewVisitor || lastVisitDate !== today) {
    cookieStore.set('ek_visitor', `${currentVisitorId}.${today}`, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax'
    });
  }

  return Response.json(
    { total: metrics.total, today: metrics.today, live: Object.keys(metrics.active).length },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
