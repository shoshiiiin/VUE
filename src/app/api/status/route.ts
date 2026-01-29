import { NextResponse } from "next/server";

export async function GET() {
  const isConnected = !!process.env.GOOGLE_API_KEY;
  return NextResponse.json({ connected: isConnected });
}
