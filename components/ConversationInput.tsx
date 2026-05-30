"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type ConversationInputProps = {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  maxLength?: number
  className?: string
}

export function ConversationInput({
  label,
  placeholder,
  value,
  onChange,
  onClear,
  maxLength = 4000,
  className,
}: ConversationInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        {onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs"
          >
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={7}
          className={cn(
            "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "min-h-[160px]"
          )}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  )
}
