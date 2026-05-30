"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type ReplyCardProps = {
  text: string
  onCopy: () => void
  onRegenerate?: () => void
  isRegenerating?: boolean
}

export function ReplyCard({ text, onCopy, onRegenerate, isRegenerating }: ReplyCardProps) {
  return (
    <Card className="bg-card/90 border-border/70 shadow-lg shadow-black/20">
      <CardContent className="px-6 pt-6">
        <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-4 flex items-center gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
          <Copy className="size-4" />
          Copy
        </Button>
        {onRegenerate ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className={cn(isRegenerating && "opacity-60")}
            aria-label="Regenerate this reply"
          >
            <RefreshCw className={cn("size-4", isRegenerating && "animate-spin")} />
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
