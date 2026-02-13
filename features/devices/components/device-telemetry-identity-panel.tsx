"use client"

import type { TelemetryReadingIdentity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"

interface DeviceTelemetryIdentityPanelProps {
  identities: TelemetryReadingIdentity[]
}

export function DeviceTelemetryIdentityPanel({ identities }: DeviceTelemetryIdentityPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Sensor provisioning / telemetry identity</CardTitle>
      </CardHeader>
      <CardContent>
        {identities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No telemetry identity information available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sensor ID</TableHead>
                <TableHead>Local name</TableHead>
                <TableHead>Telemetry sensorId</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {identities.map((row) => (
                <TableRow key={row.telemetry_sensor_id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{row.sensor_id}</span>
                      <CopyToClipboardButton value={row.sensor_id} label="ID" />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.local_name ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{row.telemetry_sensor_id}</span>
                      <CopyToClipboardButton value={row.telemetry_sensor_id} label="Key" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

