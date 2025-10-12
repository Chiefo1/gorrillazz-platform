import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "strong"
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  return (
    <div className={cn("rounded-2xl", variant === "default" ? "glass" : "glass-strong", className)}>{children}</div>
  )
}
