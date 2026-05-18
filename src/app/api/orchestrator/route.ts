import { NextRequest, NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/orchestrator';
import type { OrchestratorInput } from '@/lib/orchestrator-types';

export async function POST(req: NextRequest) {
  let body: OrchestratorInput;
  try {
    body = await req.json() as OrchestratorInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.type) {
    return NextResponse.json({ error: 'Missing required field: type' }, { status: 400 });
  }

  try {
    const result = await runOrchestrator(body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Orchestrator error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Bolajon AI Orchestrator',
    version: '2.0',
    status: 'operational',
    supported_input_types: ['session_result', 'generate_content', 'analyze_video', 'method_extract', 'daily_plan'],
    agents: ['adaptive_engine', 'aba_analyst', 'methodologist', 'speech_expert', 'content_generator', 'safety_filter', 'orchestrator'],
    ai_providers: ['openai', 'anthropic', 'gemini', 'local'],
  });
}
