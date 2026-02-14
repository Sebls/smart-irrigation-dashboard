"use client"

import type { Sensor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"

interface SensorIdentityPanelProps {
  sensor: Sensor
}

export function SensorIdentityPanel({ sensor }: SensorIdentityPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Sensor identity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">sensor.id</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs">{sensor.id}</span>
            <CopyToClipboardButton value={sensor.id} label="Copy" />
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">sensor.type</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs">{sensor.type}</span>
            <CopyToClipboardButton value={sensor.type} label="Copy" />
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">sensor.unit</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs">{sensor.unit ?? "—"}</span>
            {sensor.unit ? <CopyToClipboardButton value={sensor.unit} label="Copy" /> : null}
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">sensor.is_active</p>
          <p className="mt-1">
            <Badge variant={sensor.is_active ? "default" : "secondary"}>
              {sensor.is_active ? "true" : "false"}
            </Badge>
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">sensor.zone_id</p>
          <p className="mt-1 font-mono text-xs">{sensor.zone_id ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">created_at</p>
          <p className="mt-1 font-mono text-xs">{formatDateTime(sensor.created_at)}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">updated_at</p>
          <p className="mt-1 font-mono text-xs">{formatDateTime(sensor.updated_at)}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">deleted_at</p>
          <p className="mt-1 font-mono text-xs">{formatDateTime(sensor.deleted_at)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

