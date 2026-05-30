const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export function getGroqApiKey() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY")
  }
  return apiKey
}

export { GROQ_API_URL }
