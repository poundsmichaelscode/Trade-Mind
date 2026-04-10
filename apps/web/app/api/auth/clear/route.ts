import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("tm_access");
  cookieStore.delete("tm_refresh");
  cookieStore.delete("tm_client");
  return NextResponse.json({ success: true });
}
