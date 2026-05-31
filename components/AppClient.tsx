"use client"

import { useMemo, useState } from "react"
import { ToneSelector, ToneOption } from "@/components/ToneSelector"
import { ConversationInput } from "@/components/ConversationInput"
import { ReplyCard } from "@/components/ReplyCard"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseOptions } from "@/lib/parseOptions"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"
import { OpenerTab } from "@/components/OpenerTab"
import { BioTab } from "@/components/BioTab"
import { ArrowRight, Sparkles } from "lucide-react"
import { User, ChevronDown, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

const toneOptions: ToneOption[] = [
  { label: "Funny", value: "Funny", emoji: "😂" },
  { label: "Flirty", value: "Flirty", emoji: "😏" },
  { label: "Confident", value: "Confident", emoji: "💪" },
  { label: "Direct", value: "Direct", emoji: "🎯" },
]

const platformOptions = ["Tinder", "Hinge", "Bumble", "Instagram", "Other"]

type TabKey = "reply" | "opener" | "bio"

export function AppClient() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = session?.user?.name || session?.user?.email || "You"

  const [activeTab, setActiveTab] = useState<TabKey>("reply")
  const [conversation, setConversation] = useState("")
  const [aboutMe, setAboutMe] = useState("")
  const [aboutThem, setAboutThem] = useState("")
  const [platform, setPlatform] = useState("Tinder")
  const [tone, setTone] = useState("Funny")
  const [replies, setReplies] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

  const isConversationEmpty = useMemo(
    () => conversation.trim().length === 0,
    [conversation]
  )

  const handleGenerateReplies = async () => {
    if (isConversationEmpty) {
      toast.error("Paste a conversation first.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reply",
          tone,
          conversation,
          aboutMe,
          aboutThem,
          platform,
        }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || "Failed to generate replies.")
      }

      const options = parseOptions(text)
      setReplies(options)
    } catch (error) {
      toast.error("Could not generate replies. Try again.")
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
          mode: "reply",
          tone,
          conversation,
          aboutMe,
          aboutThem,
          platform,
        }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || "Failed to regenerate.")
      }

      const [replacement] = parseOptions(text)
      if (replacement) {
        setReplies((prev) => prev.map((item, idx) => (idx === index ? replacement : item)))
      }
    } catch (error) {
      toast.error("Could not regenerate. Try again.")
    } finally {
      setRegeneratingIndex(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        {/* Top-right user menu */}
        <div className="absolute top-6 right-6 z-20">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-2 text-sm hover:shadow"
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-primary" />
              <span className="max-w-[10rem] truncate text-sm text-foreground">{displayName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border/60 bg-card/90 p-3 text-sm shadow-lg">
                <p className="mb-2 truncate text-foreground">Signed in as <span className="font-semibold">{displayName}</span></p>
                <p className="mb-3 text-xs text-muted-foreground">Welcome back — you're all set to generate replies.</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground hover:opacity-90"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="pointer-events-none absolute -top-40 left-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-10 h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
        <div className="container mx-auto px-6 py-14">
          <div className="flex flex-col gap-10">
            <header className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Sparkles className="size-4 text-primary" />
                RIZZ AI
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground">
                  Turn awkward chats into confident, human replies.
                </h1>
                <p className="text-lg text-muted-foreground">
                  Paste the convo, set the vibe, and get three tailored replies, openers, or bios in seconds.
                </p>
              </div>
            </header>

            <div className="flex flex-wrap gap-3">
              {([
                { key: "reply", label: "Reply" },
                { key: "opener", label: "Opener" },
                { key: "bio", label: "Bio" },
              ] as { key: TabKey; label: string }[]).map((tab) => {
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={
                      isActive
                        ? "rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                        : "rounded-full border border-border/70 bg-card/70 px-5 py-2 text-sm text-muted-foreground hover:text-foreground"
                    }
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 shadow-2xl shadow-black/30">
              {activeTab === "reply" ? (
                <div className="space-y-8">
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <ConversationInput
                      label="Paste your chat here (their message last)"
                      placeholder="You: Had a fun weekend?\nThem: Totally. Went hiking in Malibu..."
                      value={conversation}
                      onChange={setConversation}
                      onClear={() => setConversation("")}
                    />

                    <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Context panel</p>
                        <h3 className="text-lg font-semibold text-foreground">Add quick context</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">About you</label>
                          <textarea
                            value={aboutMe}
                            onChange={(event) => setAboutMe(event.target.value)}
                            placeholder="2-3 sentences about you"
                            rows={3}
                            className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">About them (optional)</label>
                          <textarea
                            value={aboutThem}
                            onChange={(event) => setAboutThem(event.target.value)}
                            placeholder="What you know about them"
                            rows={3}
                            className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Platform</label>
                          <Select value={platform} onValueChange={setPlatform}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {platformOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <ToneSelector
                      label="Tone selector"
                      options={toneOptions}
                      value={tone}
                      onChange={setTone}
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" size="lg" onClick={handleGenerateReplies} disabled={isLoading}>
                        Generate Replies
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      <LoadingSkeleton />
                    ) : replies.length > 0 ? (
                      <AnimatePresence>
                        <div className="grid gap-4">
                          {replies.map((reply, index) => (
                            <motion.div
                              key={`${reply}-${index}`}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <ReplyCard
                                text={reply}
                                onCopy={() => handleCopy(reply)}
                                onRegenerate={() => handleRegenerate(index)}
                                isRegenerating={regeneratingIndex === index}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/70 bg-background/30 p-8 text-center text-sm text-muted-foreground">
                        Paste a conversation and generate replies to see them here.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {activeTab === "opener" ? <OpenerTab /> : null}
              {activeTab === "bio" ? <BioTab /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
