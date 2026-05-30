import { GROQ_API_URL, getGroqApiKey } from "@/lib/groq"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

export const runtime = "nodejs"

const MODEL = "llama-3.3-70b-versatile"
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 8
const RATE_LIMIT_BURST_MAX = 3
const RATE_LIMIT_BURST_WINDOW_MS = 10_000
const rateLimit = new Map<string, { count: number; resetAt: number; burstCount: number; burstResetAt: number }>()

const ReplySchema = z.object({
  mode: z.literal("reply"),
  tone: z.string().min(1).max(32),
  conversation: z.string().min(1).max(4000),
  aboutMe: z.string().max(600).optional(),
  aboutThem: z.string().max(600).optional(),
  platform: z.string().max(32).optional(),
})

const OpenerSchema = z.object({
  mode: z.literal("opener"),
  tone: z.string().min(1).max(32),
  profile: z.string().min(1).max(2000),
})

const BioPromptsSchema = z
  .object({
    jobVibe: z.string().max(200).optional(),
    hobbies: z.string().max(200).optional(),
    lookingFor: z.string().max(200).optional(),
    funFact: z.string().max(200).optional(),
  })
  .partial()

const BioSchema = z.object({
  mode: z.literal("bio"),
  tone: z.string().min(1).max(32),
  bioPrompts: BioPromptsSchema.optional(),
})

const RequestSchema = z.discriminatedUnion("mode", [ReplySchema, OpenerSchema, BioSchema])

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

function getTextContent(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return ""
  }

  const message = (payload as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message
  return message?.content?.trim() ?? ""
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return request.headers.get("x-real-ip") || "unknown"
}

function checkRateLimit(key: string) {
  const now = Date.now()
  const entry = rateLimit.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      burstCount: 1,
      burstResetAt: now + RATE_LIMIT_BURST_WINDOW_MS,
    })
    return { allowed: true, resetAt: now + RATE_LIMIT_WINDOW_MS }
  }

  if (now > entry.burstResetAt) {
    entry.burstCount = 0
    entry.burstResetAt = now + RATE_LIMIT_BURST_WINDOW_MS
  }

  if (entry.burstCount >= RATE_LIMIT_BURST_MAX || entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetAt: entry.resetAt }
  }

  entry.count += 1
  entry.burstCount += 1
  return { allowed: true, resetAt: entry.resetAt }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const ip = getClientIp(request)
    const userKey = (session.user?.email || "anonymous").toString()
    const rateLimitKey = `${userKey}:${ip}`
    const rateLimitResult = checkRateLimit(rateLimitKey)
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000))
      return new Response("Too many requests", {
        status: 429,
        headers: { "Retry-After": retryAfter.toString() },
      })
    }

    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return new Response("Invalid request.", { status: 400 })
    }

    const { mode, tone } = parsed.data

    if (!mode || !tone) {
      return new Response("Missing mode or tone.", { status: 400 })
    }

    let systemPrompt = ""
    let userMessage = ""

    if (mode === "reply") {
      const conversation = parsed.data.conversation
      const aboutMe = parsed.data.aboutMe?.trim() || undefined
      const aboutThem = parsed.data.aboutThem?.trim() || undefined
      const platform = parsed.data.platform?.trim() || undefined

      systemPrompt = buildReplySystemPrompt({ tone, aboutMe, aboutThem, platform })
      userMessage = `Conversation:\n${conversation}`
    } else if (mode === "opener") {
      const profile = parsed.data.profile
      systemPrompt = buildOpenerSystemPrompt({ tone, profile })
      userMessage = "Generate openers."
    } else {
      const prompts = parsed.data.bioPrompts ?? {}
      const hasPrompt = Object.values(prompts).some((value) => value && value.trim().length > 0)
      if (!hasPrompt) {
        return new Response("Bio prompts required.", { status: 400 })
      }

      systemPrompt = buildBioSystemPrompt({ style: tone, bioPrompts: prompts })
      userMessage = "Write the bios."
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getGroqApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.9,
        max_tokens: 600,
      }),
    })

    const payload = await response.json()
    if (!response.ok) {
      return new Response("Groq request failed.", { status: response.status })
    }

    const text = getTextContent(payload)
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
