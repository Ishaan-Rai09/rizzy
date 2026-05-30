import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Sparkles, Shield, Zap } from "lucide-react"

const features = [
  {
    title: "Real replies, not robotic",
    description: "Human-sounding options that feel confident and natural, never corporate.",
  },
  {
    title: "Context-aware tone shifts",
    description: "Funny, flirty, confident, or direct - the vibe actually changes.",
  },
  {
    title: "Secure access",
    description: "Sign in with Google to unlock replies and keep your sessions synced."
  },
]

const steps = [
  {
    title: "Paste the convo",
    description: "Drop in your chat with their last message at the end.",
  },
  {
    title: "Set the vibe",
    description: "Pick a tone and add quick context for better personalization.",
  },
  {
    title: "Pick your winner",
    description: "Copy a reply or regenerate a single card until it lands.",
  },
]

const pricing = [
  {
    name: "Free",
    price: "$0",
    tag: "Starter",
    perks: ["Reply, opener, bio generators", "Tone selector", "Copy with toasts"],
  },
  {
    name: "Pro",
    price: "$12",
    tag: "Power",
    perks: ["Faster generations", "Priority models", "Early access features"],
  },
]

const faqs = [
  {
    q: "Does it sound generic?",
    a: "No. The prompts are tuned for short, human replies with real tone shifts.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. We use Google sign-in to keep the experience fast and secure.",
  },
  {
    q: "Can I use this on any dating app?",
    a: "Yes. Pick the platform to nudge the phrasing style.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-48 right-[-120px] h-[420px] w-[420px] rounded-full bg-primary/20 blur-[160px]" />
        <div className="pointer-events-none absolute top-40 left-[-120px] h-[320px] w-[320px] rounded-full bg-primary/10 blur-[140px]" />

        <header className="container mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="size-5 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-[0.3em] text-muted-foreground">RIZZ AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </header>

        <section className="container mx-auto px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <Zap className="size-4 text-primary" />
                Real-time dating assistant
              </div>
              <h1 className="text-5xl sm:text-6xl font-semibold leading-tight">
                Make every reply feel intentional, confident, and you.
              </h1>
              <p className="text-lg text-muted-foreground">
                RIZZ AI turns raw convos into smooth reply options, punchy openers, and bios that feel like a real person.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Sign in to start
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent" asChild>
                  <Link href="/login">Continue with Google</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Shield className="size-4 text-primary" /> No cringe output</span>
                <span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-primary" /> 3 replies every run</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl shadow-black/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Live preview</span>
                    <span>Funny tone</span>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">Them: You seem like trouble.</p>
                    <p className="text-sm">You: Only the fun kind. Want to see for yourself?</p>
                  </div>
                  <div className="grid gap-3">
                    {[
                      "I come with a warning label and great playlist choices.",
                      "Only guilty of stealing fries. Want evidence?",
                      "Define trouble... and how much you're into it.",
                    ].map((line) => (
                      <div key={line} className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-[80px]" />
            </div>
          </div>
        </section>
      </div>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">How it works</p>
            <h2 className="text-4xl font-semibold">Three steps to smooth replies</h2>
            <p className="text-muted-foreground">
              Dial in the vibe, personalize with quick context, and keep the chat flowing.
            </p>
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/login">Open the generator</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-border/60 bg-card/70 p-5 flex gap-4">
                <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {pricing.map((plan) => (
            <div key={plan.name} className="rounded-3xl border border-border/60 bg-card/80 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{plan.tag}</p>
                  <h3 className="text-3xl font-semibold mt-2">{plan.name}</h3>
                </div>
                <div className="text-3xl font-semibold text-primary">{plan.price}</div>
              </div>
              <div className="mt-6 space-y-3">
                {plan.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary" />
                    {perk}
                  </div>
                ))}
              </div>
              <Button className="mt-6" variant={plan.name === "Pro" ? "default" : "outline"} asChild>
                <Link href="/login">{plan.name === "Pro" ? "Go Pro" : "Get Started"}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">FAQ</p>
            <h2 className="text-4xl font-semibold mt-3">Questions, answered</h2>
            <p className="text-muted-foreground mt-4">Everything you need to know before you hit send.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border/60 bg-background/40 p-5">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-border/60 bg-primary/10 p-10 text-center space-y-4">
          <h2 className="text-4xl font-semibold">Ready to sound like you?</h2>
          <p className="text-muted-foreground">Jump into the generator or sign in to save your sessions.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent" asChild>
              <Link href="/signup">Sign up with Google</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
