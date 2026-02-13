"use client"

import type { IrrigationJobStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface JobStatusBadgeProps {
  status: IrrigationJobStatus
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const variant =
    status === "succeeded"
      ? "default"
      : status === "running"
        ? "secondary"
        : status === "queued"
          ? "outline"
          : "destructive"

  return <Badge variant={variant as any}>{status}</Badge>
}

