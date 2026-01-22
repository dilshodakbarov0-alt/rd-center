import { NextResponse } from "next/server";
import { MaterialProjectV1Schema } from "@/lib/validators";

export const runtime = "edge";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 400 });
  }

  const { project } = await request.json();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Validate and correct this project JSON. Return JSON with fields: corrected (MaterialProjectV1) and issues (array of strings).\n${JSON.stringify(
                  project
                )}`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  const parsed = JSON.parse(text);
  const corrected = MaterialProjectV1Schema.parse(parsed.corrected);

  return NextResponse.json({ corrected, issues: parsed.issues ?? [] });
}
