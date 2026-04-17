import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set('tm_access', '', { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 0 });
  cookieStore.set('tm_refresh', '', { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 0 });
  cookieStore.set('tm_client', '', { httpOnly: false, sameSite: 'lax', secure, path: '/', maxAge: 0 });
  return NextResponse.json({ success: true });
}
