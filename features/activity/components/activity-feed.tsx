"use client"

import type { ActivityEvent } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"

interface ActivityFeedProps {
  events: ActivityEvent[]
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Activity feed ({events.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Plant</TableHead>
              <TableHead>Sensor</TableHead>
              <TableHead>Occurred at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events
              .slice()
              .sort((a, b) => b.occurred_at.getTime() - a.occurred_at.getTime())
              .map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{e.id}</span>
                      <CopyToClipboardButton value={e.id} label="ID" />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{e.type}</span>
                      <CopyToClipboardButton value={e.type} label="Copy" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xl whitespace-normal">{e.message}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {e.zone_id ? (
                      <div className="flex items-center gap-2">
                        <span>{e.zone_id}</span>
                        <CopyToClipboardButton value={e.zone_id} label="ID" />
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {e.plant_id ? (
                      <div className="flex items-center gap-2">
                        <span>{e.plant_id}</span>
                        <CopyToClipboardButton value={e.plant_id} label="ID" />
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {e.sensor_id ? (
                      <div className="flex items-center gap-2">
                        <span>{e.sensor_id}</span>
                        <CopyToClipboardButton value={e.sensor_id} label="ID" />
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{formatDateTime(e.occurred_at)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

