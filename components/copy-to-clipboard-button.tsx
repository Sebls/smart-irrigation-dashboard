"use client"

import { useCallback, useMemo, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyToClipboardButtonProps {
  value: string
  label?: string
  className?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
}

export function CopyToClipboardButton({
  value,
  label = "Copy",
  className,
  variant = "ghost",
  size = "sm",
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false)

  const canCopy = useMemo(() => typeof navigator !== "undefined" && !!navigator.clipboard, [])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // If clipboard isn't available (or permission denied), silently no-op.
      // The ID is still visible for manual selection.
    }
  }, [value])

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onCopy}
      disabled={!canCopy}
      className={cn("gap-2", className)}
      title={value}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="hidden sm:inline">{copied ? "Copied" : label}</span>
    </Button>
  )
}

