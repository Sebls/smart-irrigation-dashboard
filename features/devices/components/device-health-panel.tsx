"use client"

import type { Device, DeviceLog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"

function countRecentIssues(logs: DeviceLog[], since: Date) {
  return logs.filter((l) => l.recorded_at >= since && (l.level === "error" || l.level === "critical")).length
}

function healthFromIssueCount(n: number): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (n === 0) return { label: "Healthy", variant: "default" }
  if (n <= 2) return { label: "Degraded", variant: "secondary" }
  return { label: "Unhealthy", variant: "destructive" }
}

interface DeviceHealthPanelProps {
  device: Device
  logs: DeviceLog[]
  /** deterministic reference time (mock base now) */
  now: Date
}

export function DeviceHealthPanel({ device, logs, now }: DeviceHealthPanelProps) {
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const issueCount = countRecentIssues(logs, last24h)
  const health = healthFromIssueCount(issueCount)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Liveness / Health</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Online</p>
          <p className="mt-1">
            <Badge variant={device.is_online ? "default" : "secondary"}>
              {device.is_online ? "online" : "offline"}
            </Badge>
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Last seen</p>
          <p className="mt-1 font-mono text-xs">{formatDateTime(device.last_seen_at)}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Uptime (s)</p>
          <p className="mt-1 font-mono text-xs">{device.uptime ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Health (last 24h)</p>
          <p className="mt-1 flex items-center gap-2">
            <Badge variant={health.variant}>{health.label}</Badge>
            <span className="text-xs text-muted-foreground">{issueCount} issue(s)</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

