"use client"

import { useMemo, useState } from "react"
import type { Sensor, SensorReadingRecord } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime, formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Activity } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type TimeRange = "1h" | "24h" | "7d" | "30d" | "all"

function sinceFromRange(now: Date, range: TimeRange): Date | null {
  switch (range) {
    case "1h":
      return new Date(now.getTime() - 1 * 60 * 60 * 1000)
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case "all":
      return null
  }
}

interface SensorReadingsTableProps {
  sensor: Sensor
  readings: SensorReadingRecord[]
  now: Date
}

export function SensorReadingsTable({ sensor, readings, now }: SensorReadingsTableProps) {
  const [range, setRange] = useState<TimeRange>("7d")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const filtered = useMemo(() => {
    const since = sinceFromRange(now, range)
    return readings
      .filter((r) => (since ? r.recorded_at >= since : true))
      .slice()
      .sort((a, b) => b.recorded_at.getTime() - a.recorded_at.getTime())
  }, [now, range, readings])

  const empty = filtered.length === 0
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)

  const chartRows = useMemo(() => {
    // small chart: last N points in ascending time
    const points = filtered.slice(0, 60).slice().sort((a, b) => a.recorded_at.getTime() - b.recorded_at.getTime())
    return points.map((p) => ({
      t: formatTime(p.recorded_at),
      v: Math.round(p.value * 100) / 100,
    }))
  }, [filtered])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-medium">Historical readings</CardTitle>
          <div className="flex flex-wrap gap-3">
            <Select value={range} onValueChange={(v) => { setPage(1); setRange(v as TimeRange) }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPage(1)
                setPageSize(Number(v))
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {empty ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Activity className="h-5 w-5" />
              </EmptyMedia>
              <EmptyTitle>No readings yet</EmptyTitle>
              <EmptyDescription>
                Telemetry only persists readings for known/provisioned sensors.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-4">
            <div className="h-56 rounded-lg border border-border p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRows}>
                  <XAxis dataKey="t" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.15 160)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>reading.id</TableHead>
                  <TableHead>reading.sensor_id</TableHead>
                  <TableHead>reading.recorded_at</TableHead>
                  <TableHead>reading.value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span>{r.id}</span>
                        <CopyToClipboardButton value={r.id} label="ID" />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span>{r.sensor_id}</span>
                        <CopyToClipboardButton value={r.sensor_id} label="ID" />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{formatDateTime(r.recorded_at)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.value.toFixed(2)}
                      {sensor.unit ? ` ${sensor.unit}` : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {pageRows.length} of {filtered.length} (page {safePage} of {totalPages})
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

