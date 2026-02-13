"use client"

import { useMemo, useState } from "react"
import type { DeviceLog, DeviceLogLevel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FileText } from "lucide-react"

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

interface DeviceLogsSectionProps {
  logs: DeviceLog[]
  now: Date
}

export function DeviceLogsSection({ logs, now }: DeviceLogsSectionProps) {
  const [level, setLevel] = useState<DeviceLogLevel | "all">("all")
  const [range, setRange] = useState<TimeRange>("7d")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const filtered = useMemo(() => {
    const since = sinceFromRange(now, range)
    return logs
      .filter((l) => (level === "all" ? true : l.level === level))
      .filter((l) => (since ? l.recorded_at >= since : true))
      .slice()
      .sort((a, b) => b.recorded_at.getTime() - a.recorded_at.getTime())
  }, [level, logs, now, range])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)

  const empty = logs.length === 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-medium">Device logs</CardTitle>
          <div className="flex flex-wrap gap-3">
            <Select value={level} onValueChange={(v) => { setPage(1); setLevel(v as any) }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="debug">debug</SelectItem>
                <SelectItem value="info">info</SelectItem>
                <SelectItem value="warn">warn</SelectItem>
                <SelectItem value="error">error</SelectItem>
                <SelectItem value="critical">critical</SelectItem>
              </SelectContent>
            </Select>

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
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
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
                <FileText className="h-5 w-5" />
              </EmptyMedia>
              <EmptyTitle>No logs yet</EmptyTitle>
              <EmptyDescription>This device has not produced any logs yet.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Recorded at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span>{l.id}</span>
                        <CopyToClipboardButton value={l.id} label="ID" />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{l.level}</TableCell>
                    <TableCell className="max-w-xl whitespace-normal">{l.message}</TableCell>
                    <TableCell className="font-mono text-xs">{formatDateTime(l.recorded_at)}</TableCell>
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

