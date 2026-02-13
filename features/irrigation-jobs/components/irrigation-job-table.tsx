"use client"

import type { IrrigationJob } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"
import { JobStatusBadge } from "./job-status-badge"

interface IrrigationJobTableProps {
  title?: string
  jobs: IrrigationJob[]
}

export function IrrigationJobTable({ title = "Irrigation jobs", jobs }: IrrigationJobTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {title} ({jobs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Plant</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Duration (s)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Ended</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs
              .slice()
              .sort((a, b) => b.requested_at.getTime() - a.requested_at.getTime())
              .map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{j.id}</span>
                      <CopyToClipboardButton value={j.id} label="ID" />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{j.scope}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {j.zone_id ? (
                      <div className="flex items-center gap-2">
                        <span>{j.zone_id}</span>
                        <CopyToClipboardButton value={j.zone_id} label="ID" />
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {j.plant_id ? (
                      <div className="flex items-center gap-2">
                        <span>{j.plant_id}</span>
                        <CopyToClipboardButton value={j.plant_id} label="ID" />
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{j.action}</span>
                      <CopyToClipboardButton value={j.action} label="Copy" />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{j.duration_seconds}</TableCell>
                  <TableCell>
                    <JobStatusBadge status={j.status} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{formatDateTime(j.requested_at)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatDateTime(j.started_at)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatDateTime(j.ended_at)}</TableCell>
                  <TableCell className="max-w-sm whitespace-normal text-sm text-muted-foreground">
                    {j.error_message ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

