import { createAnthropicClient } from "@/lib/anthropic"

export const runtime = "nodejs"

const MODEL = "claude-sonnet-4-20250514"

function buildReplySystemPrompt(params: {
  tone: string
  aboutMe?: string
  aboutThem?: string
  platform?: string
}) {
  const platform = params.platform || "dating app"
  const aboutMe = params.aboutMe?.trim() || "not provided"
  const aboutThem = params.aboutThem?.trim() || "not provided"

  return `You are a dating coach who writes natural, human replies for ${platform}.
The user is: ${aboutMe}. Their match: ${aboutThem}.
Tone: ${params.tone}.
Generate exactly 3 reply options to continue this conversation.
Each should feel genuine and not try-hard.
Separate each with ---OPTION---
No numbering, no explanation, just the replies.`
}

function buildOpenerSystemPrompt(params: { tone: string; profile: string }) {
  return `You are a dating coach crafting opening messages.
Tone: ${params.tone}. Profile description: ${params.profile}.
Generate 3 unique openers that reference something specific from their profile.
Separate with ---OPTION---. Short, punchy, human.`
}

function buildBioSystemPrompt(params: { style: string; bioPrompts: Record<string, string> }) {
  return `Write two dating profile bios: one 150 chars, one 300 chars.
Style: ${params.style}. User details: ${JSON.stringify(params.bioPrompts)}.
Format: 150-CHAR BIO: [bio] | 300-CHAR BIO: [bio]
Sound like a real person, not a resume.`
}

function getTextContent(content: unknown) {
  if (!Array.isArray(content)) {
    return ""
  }

  return content
    .map((block) => {
      if (block && typeof block === "object" && "text" in block) {
        return String((block as { text: string }).text)
      }
      return ""
    })
    .join("")
    .trim()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mode, tone, conversation, profile, aboutMe, aboutThem, platform, bioPrompts } = body ?? {}

    if (!mode || !tone) {
      return new Response("Missing mode or tone.", { status: 400 })
    }

    const client = createAnthropicClient()

    let systemPrompt = ""
    let userMessage = ""

    if (mode === "reply") {
      if (!conversation || typeof conversation !== "string") {
        return new Response("Conversation text required.", { status: 400 })
      }

      systemPrompt = buildReplySystemPrompt({ tone, aboutMe, aboutThem, platform })
      userMessage = `Conversation:\n${conversation}`
    } else if (mode === "opener") {
      if (!profile || typeof profile !== "string") {
        return new Response("Profile text required.", { status: 400 })
      }

      systemPrompt = buildOpenerSystemPrompt({ tone, profile })
      userMessage = "Generate openers."
    } else if (mode === "bio") {
      systemPrompt = buildBioSystemPrompt({ style: tone, bioPrompts: bioPrompts ?? {} })
      userMessage = "Write the bios."
    } else {
      return new Response("Unsupported mode.", { status: 400 })
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    })

    const text = getTextContent(response.content)
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    return new Response("Failed to generate response.", { status: 500 })
  }
}
