import { NextResponse } from "next/server";
import { suggestNextBestExperiment } from "@/lib/doe";
import type { DoeRun } from "@/lib/doe";

export async function POST(request: Request) {
  const { runs } = await request.json();
  const suggestion = suggestNextBestExperiment((runs ?? []) as DoeRun[]);
  return NextResponse.json(suggestion);
}
