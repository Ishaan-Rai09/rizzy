"use client"

import { useMemo, useState } from "react"
import { ToneSelector, ToneOption } from "@/components/ToneSelector"
import { ConversationInput } from "@/components/ConversationInput"
import { ReplyCard } from "@/components/ReplyCard"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { Button } from "@/components/ui/button"
import { parseOptions } from "@/lib/parseOptions"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"

const toneOptions: ToneOption[] = [
  { label: "Funny", value: "Funny", emoji: "😂" },
  { label: "Flirty", value: "Flirty", emoji: "😏" },
  { label: "Confident", value: "Confident", emoji: "💪" },
  { label: "Direct", value: "Direct", emoji: "🎯" },
]

export function OpenerTab() {
  const [profile, setProfile] = useState("")
  const [tone, setTone] = useState("Funny")
  const [openers, setOpeners] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

  const isEmpty = useMemo(() => profile.trim().length === 0, [profile])

  const handleGenerate = async () => {
    if (isEmpty) {
      toast.error("Paste their profile or bio first.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "opener",
          tone,
          profile,
        }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || "Failed to generate openers.")
      }

      const options = parseOptions(text)
      setOpeners(options)
    } catch (error) {
      toast.error("Could not generate openers. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied! 🔥")
    } catch (error) {
      toast.error("Copy failed. Try again.")
    }
  }

  const handleRegenerate = async (index: number) => {
    setRegeneratingIndex(index)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "opener",
          tone,
          profile,
        }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || "Failed to regenerate.")
      }

      const [replacement] = parseOptions(text)
      if (replacement) {
        setOpeners((prev) => prev.map((item, idx) => (idx === index ? replacement : item)))
      }
    } catch (error) {
      toast.error("Could not regenerate. Try again.")
    } finally {
      setRegeneratingIndex(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ConversationInput
          label="Paste their profile or bio"
          placeholder="e.g. Weekend climber. Lives for matcha. Ask me about my dog..."
          value={profile}
          onChange={setProfile}
          onClear={() => setProfile("")}
        />

        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Tone selector</p>
            <h3 className="text-lg font-semibold text-foreground">Pick the opener vibe</h3>
          </div>
          <ToneSelector options={toneOptions} value={tone} onChange={setTone} />
          <Button type="button" size="lg" onClick={handleGenerate} disabled={isLoading}>
            Generate Openers
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <AnimatePresence>
            <div className="grid gap-4">
              {openers.map((opener, index) => (
                <motion.div
                  key={`${opener}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ReplyCard
                    text={opener}
                    onCopy={() => handleCopy(opener)}
                    onRegenerate={() => handleRegenerate(index)}
                    isRegenerating={regeneratingIndex === index}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
