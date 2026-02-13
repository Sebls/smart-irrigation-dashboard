import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: unknown
  className?: string
  maxHeightClassName?: string
}

export function JsonViewer({
  data,
  className,
  maxHeightClassName = "max-h-80",
}: JsonViewerProps) {
  return (
    <ScrollArea className={cn("rounded-md border border-border bg-secondary/30", maxHeightClassName, className)}>
      <pre className="p-3 text-xs leading-relaxed text-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </ScrollArea>
  )
}

