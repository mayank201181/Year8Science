import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { currentAccount } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.AI_MODEL || "claude-opus-4-8";

const SYSTEM = `You are Professor Photon, a warm, encouraging science tutor for a 12–13 year old studying UK Year 8 / Cambridge Lower Secondary science.

Rules:
- Explain clearly and simply, using everyday analogies a curious kid would enjoy.
- Keep answers short: a few short sentences or 3–5 bullet points. Never write essays.
- Be scientifically accurate and age-appropriate.
- If asked for a HINT on a quiz question, give a nudge or a question back — do NOT just reveal the answer.
- Be positive and supportive; celebrate curiosity.
- Stay on science and study topics. If asked something off-topic, unsafe, or inappropriate, gently steer back to learning. Never discuss anything unsuitable for a child.
- Plain text only (no markdown headers). Short paragraphs or simple bullets with "-".`;

const PROMPTS: Record<string, (t: string, c: string) => string> = {
  explain: (t, c) => `Topic: ${t}\n\nExplain this part of my guide in a simpler way:\n"""${c}"""`,
  example: (t, c) => `Topic: ${t}\n\nGive me a fun real-world example that makes this easier to remember:\n"""${c}"""`,
  hint: (t, c) => `Topic: ${t}\n\nGive me a HINT (not the answer) for this question:\n"""${c}"""`,
  why: (t, c) => `Topic: ${t}\n\nExplain in simple terms why this is the case:\n"""${c}"""`,
};

export async function POST(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "The AI tutor isn't set up yet. Ask a grown-up to add an API key." }, { status: 503 });
  }

  const { kind, topic, context, question } = await req.json().catch(() => ({}));
  const t = String(topic || "science");
  let userText: string;
  if (kind && PROMPTS[kind]) {
    userText = PROMPTS[kind](t, String(context || question || ""));
  } else {
    userText = `Topic: ${t}\n\nMy question: ${String(question || context || "")}`;
  }
  if (!userText.trim()) return NextResponse.json({ error: "Ask me something!" }, { status: 400 });

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM,
      messages: [{ role: "user", content: userText }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return NextResponse.json({ text: text || "Hmm, I couldn't think of anything — try rephrasing!" });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "I'm a bit busy right now — try again in a moment!" }, { status: 429 });
    }
    return NextResponse.json({ error: "Sorry, I couldn't answer that just now." }, { status: 500 });
  }
}
