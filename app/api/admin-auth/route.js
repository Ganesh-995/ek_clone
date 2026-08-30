import { createHmac, timingSafeEqual } from 'node:crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ek-admin-123';

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (typeof password !== 'string') {
      return Response.json({ message: 'Invalid request.' }, { status: 400 });
    }

    const actual = Buffer.from(password);
    const expected = Buffer.from(ADMIN_PASSWORD);

    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return Response.json({ message: 'Incorrect password.' }, { status: 401 });
    }

    const token = createHmac('sha256', ADMIN_PASSWORD).update('ek-products-admin').digest('hex');
    return Response.json({ token });
  } catch {
    return Response.json({ message: 'Invalid request.' }, { status: 400 });
  }
}
