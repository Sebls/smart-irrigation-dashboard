"use client"

import Link from "next/link"
import type { Sensor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"

interface ZoneSensorsSectionProps {
  sensors: Sensor[]
}

export function ZoneSensorsSection({ sensors }: ZoneSensorsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Sensors in zone ({sensors.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>sensor.id</TableHead>
              <TableHead>sensor.name</TableHead>
              <TableHead>sensor.type</TableHead>
              <TableHead>sensor.unit</TableHead>
              <TableHead>sensor.is_active</TableHead>
              <TableHead>sensor.zone_id</TableHead>
              <TableHead>created_at</TableHead>
              <TableHead>updated_at</TableHead>
              <TableHead>deleted_at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensors.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Link className="underline underline-offset-4 hover:text-primary" href={`/sensors/${s.id}`}>
                      {s.id}
                    </Link>
                    <CopyToClipboardButton value={s.id} label="ID" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span>{s.type}</span>
                    <CopyToClipboardButton value={s.type} label="Copy" />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {s.unit ? (
                    <div className="flex items-center gap-2">
                      <span>{s.unit}</span>
                      <CopyToClipboardButton value={s.unit} label="Copy" />
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "true" : "false"}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {s.zone_id ? (
                    <div className="flex items-center gap-2">
                      <span>{s.zone_id}</span>
                      <CopyToClipboardButton value={s.zone_id} label="ID" />
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(s.created_at)}</TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(s.updated_at)}</TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(s.deleted_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

