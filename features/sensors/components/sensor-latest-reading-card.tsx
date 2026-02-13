"use client"

import type { Sensor, SensorReadingRecord } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"

interface SensorLatestReadingCardProps {
  sensor: Sensor
  latest: SensorReadingRecord | null
}

export function SensorLatestReadingCard({ sensor, latest }: SensorLatestReadingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Latest reading</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">reading.id</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs">{latest?.id ?? "—"}</span>
            {latest?.id ? <CopyToClipboardButton value={latest.id} label="Copy" /> : null}
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">reading.sensor_id</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs">{sensor.id}</span>
            <CopyToClipboardButton value={sensor.id} label="Copy" />
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">reading.recorded_at</p>
          <p className="mt-1 font-mono text-xs">{formatDateTime(latest?.recorded_at ?? null)}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">reading.value</p>
          <p className="mt-1 font-mono text-xs">
            {latest ? `${latest.value.toFixed(2)}${sensor.unit ? ` ${sensor.unit}` : ""}` : "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

