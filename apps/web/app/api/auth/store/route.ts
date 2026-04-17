import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const accessToken = body?.accessToken;
    const refreshToken = body?.refreshToken;
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ message: 'Missing access or refresh token.' }, { status: 400 });
    }
    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === 'production';
    cookieStore.set('tm_access', accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 60 * 30 });
    cookieStore.set('tm_refresh', refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set('tm_client', '1', { httpOnly: false, sameSite: 'lax', secure, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Failed to store session cookies.' }, { status: 500 });
  }
}
