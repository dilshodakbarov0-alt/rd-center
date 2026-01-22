import { NextResponse } from "next/server";
import { MaterialProjectV1Schema } from "@/lib/validators";
import { MaterialProjectV1JsonSchema } from "@/lib/schemas";

export const runtime = "edge";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 400 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Return JSON for MaterialProjectV1. Use numeric values. Ensure constraints.eps_policy matches policy.",
        },
        { role: "user", content: prompt ?? "Generate material project" },
      ],
      response_format: {
        type: "json_schema",
        json_schema: MaterialProjectV1JsonSchema,
      },
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = content ? JSON.parse(content) : null;
  const validated = MaterialProjectV1Schema.parse(parsed);

  return NextResponse.json({ project: validated, raw: parsed });
}
