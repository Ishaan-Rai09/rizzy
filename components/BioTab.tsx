"use client"

import { useMemo, useState } from "react"
import { ToneSelector, ToneOption } from "@/components/ToneSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"
import { Copy } from "lucide-react"

const styleOptions: ToneOption[] = [
  { label: "Funny", value: "Funny", emoji: "😂" },
  { label: "Mysterious", value: "Mysterious", emoji: "🖤" },
  { label: "Confident", value: "Confident", emoji: "💪" },
  { label: "Wholesome", value: "Wholesome", emoji: "✨" },
]

type BioPrompts = {
  jobVibe: string
  hobbies: string
  lookingFor: string
  funFact: string
}

export function BioTab() {
  const [style, setStyle] = useState("Funny")
  const [prompts, setPrompts] = useState<BioPrompts>({
    jobVibe: "",
    hobbies: "",
    lookingFor: "",
    funFact: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bio150, setBio150] = useState("")
  const [bio300, setBio300] = useState("")

  const hasAnyPrompt = useMemo(
    () => Object.values(prompts).some((value) => value.trim().length > 0),
    [prompts]
  )

  const handleGenerate = async () => {
    if (!hasAnyPrompt) {
      toast.error("Fill out at least one prompt.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "bio",
          tone: style,
          bioPrompts: prompts,
        }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || "Failed to generate bios.")
      }

      const parsed150 = text.match(/150-CHAR BIO:\s*([^|\n]+)/i)?.[1]?.trim() ?? ""
      const parsed300 = text.match(/300-CHAR BIO:\s*(.+)/i)?.[1]?.trim() ?? ""

      setBio150(parsed150)
      setBio300(parsed300)
    } catch (error) {
      toast.error("Could not generate bios. Try again.")
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

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Answer a few prompts</p>
            <h3 className="text-lg font-semibold text-foreground">Build your bio kit</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Job / vibe</label>
              <Input
                value={prompts.jobVibe}
                onChange={(event) => setPrompts((prev) => ({ ...prev, jobVibe: event.target.value }))}
                placeholder="Product designer by day, espresso explorer by night"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Hobbies</label>
              <Input
                value={prompts.hobbies}
                onChange={(event) => setPrompts((prev) => ({ ...prev, hobbies: event.target.value }))}
                placeholder="Running, vintage markets, late-night ramen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Looking for</label>
              <Input
                value={prompts.lookingFor}
                onChange={(event) => setPrompts((prev) => ({ ...prev, lookingFor: event.target.value }))}
                placeholder="Someone who loves sunsets and good banter"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Fun fact</label>
              <Input
                value={prompts.funFact}
                onChange={(event) => setPrompts((prev) => ({ ...prev, funFact: event.target.value }))}
                placeholder="I can name every Taylor Swift album in order"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Style selector</p>
            <h3 className="text-lg font-semibold text-foreground">Pick a bio mood</h3>
          </div>
          <ToneSelector options={styleOptions} value={style} onChange={setStyle} />
          <Button type="button" size="lg" onClick={handleGenerate} disabled={isLoading}>
            Generate Bio
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton count={2} />
        ) : (
          <AnimatePresence>
            <div className="grid gap-4 md:grid-cols-2">
              {bio150 ? (
                <motion.div
                  key="bio-150"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card/90 border-border/70">
                    <CardContent className="px-6 pt-6 space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">150-char bio</p>
                      <p className="text-sm leading-relaxed text-foreground/90">{bio150}</p>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-4">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleCopy(bio150)}>
                        <Copy className="size-4" />
                        Copy
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : null}

              {bio300 ? (
                <motion.div
                  key="bio-300"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <Card className="bg-card/90 border-border/70">
                    <CardContent className="px-6 pt-6 space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">300-char bio</p>
                      <p className="text-sm leading-relaxed text-foreground/90">{bio300}</p>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-4">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleCopy(bio300)}>
                        <Copy className="size-4" />
                        Copy
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : null}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
