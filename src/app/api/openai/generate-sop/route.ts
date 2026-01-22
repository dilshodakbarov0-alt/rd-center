import { NextResponse } from "next/server";
import { SOPDocV1Schema } from "@/lib/validators";
import { SOPDocV1JsonSchema } from "@/lib/schemas";

export const runtime = "edge";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 400 });
  }

  const { prompt } = await request.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return SOPDocV1 JSON only." },
        { role: "user", content: prompt ?? "Generate SOP" },
      ],
      response_format: {
        type: "json_schema",
        json_schema: SOPDocV1JsonSchema,
      },
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = content ? JSON.parse(content) : null;
  const validated = SOPDocV1Schema.parse(parsed);

  return NextResponse.json({ sop: validated, raw: parsed });
}
