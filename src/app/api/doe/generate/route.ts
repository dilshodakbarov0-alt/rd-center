import { NextResponse } from "next/server";
import { generateDoePlan } from "@/lib/doe";

export async function POST(request: Request) {
  const { runs } = await request.json();
  const doePlan = generateDoePlan(runs ?? 12);
  return NextResponse.json({ doePlan });
}
