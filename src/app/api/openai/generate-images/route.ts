import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 400 });
  }

  const { prompt } = await request.json();

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt ?? "Construction material surface",
      n: 3,
      size: "1024x1024",
    }),
  });

  const data = await response.json();
  return NextResponse.json({ images: data.data ?? [] });
}
