"use client"

import Link from "next/link"
import type { Device } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"

interface DeviceListTableProps {
  devices: Device[]
}

export function DeviceListTable({ devices }: DeviceListTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Devices ({devices.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Online</TableHead>
              <TableHead>Hardware ID</TableHead>
              <TableHead>Last seen</TableHead>
              <TableHead>Uptime (s)</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Link className="underline underline-offset-4 hover:text-primary" href={`/devices/${d.id}`}>
                      {d.id}
                    </Link>
                    <CopyToClipboardButton value={d.id} label="ID" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell className="text-muted-foreground">{d.description ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={d.is_active ? "default" : "secondary"}>
                    {d.is_active ? "true" : "false"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={d.is_online ? "default" : "secondary"}>
                    {d.is_online ? "true" : "false"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {d.hardware_id ? (
                    <div className="flex items-center gap-2">
                      <span>{d.hardware_id}</span>
                      <CopyToClipboardButton value={d.hardware_id} label="HW" />
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(d.last_seen_at)}</TableCell>
                <TableCell className="font-mono text-xs">{d.uptime ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(d.created_at)}</TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(d.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

