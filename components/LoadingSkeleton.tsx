"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`skeleton-${index}`} className="bg-card/70 border-border/60">
          <CardContent className="px-6 pt-6 space-y-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-4 flex gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
