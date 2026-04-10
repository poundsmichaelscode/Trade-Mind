import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken, refreshToken } = await request.json();
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set("tm_access", accessToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 30 });
  cookieStore.set("tm_refresh", refreshToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set("tm_client", "1", { httpOnly: false, sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return NextResponse.json({ success: true });
}
