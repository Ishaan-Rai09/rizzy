"use client"

import { cn } from "@/lib/utils"

export type ToneOption = {
  label: string
  value: string
  emoji?: string
}

type ToneSelectorProps = {
  label?: string
  options: ToneOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ToneSelector({ label, options, value, onChange, className }: ToneSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                "bg-secondary text-secondary-foreground border-border",
                "hover:border-primary/60 hover:text-foreground",
                isActive && "bg-primary text-primary-foreground border-primary"
              )}
              aria-pressed={isActive}
            >
              <span className="inline-flex items-center gap-2">
                {option.emoji ? <span aria-hidden>{option.emoji}</span> : null}
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
