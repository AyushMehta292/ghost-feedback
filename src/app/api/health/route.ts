import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/pingDatabase";

export async function GET() {
  const db = await pingDatabase();

  if (!db.ok) {
    return NextResponse.json(
      { status: "error", db: "disconnected", detail: db.error },
      { status: 503 }
    );
  }

  return NextResponse.json({ status: "ok", db: "connected" });
}
