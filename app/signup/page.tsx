"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/80 p-8 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">RIZZ AI</p>
            <h1 className="text-2xl font-semibold">Create your account</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Sign up with Google and keep your best replies on lock.
        </p>
        <Button
          size="lg"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/app" })}
        >
          Sign up with Google
        </Button>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
