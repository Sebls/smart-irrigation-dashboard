"use client"

import type { PlantEntity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"

interface ZonePlantsSectionProps {
  plants: PlantEntity[]
}

export function ZonePlantsSection({ plants }: ZonePlantsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Plants in zone ({plants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>plant.id</TableHead>
              <TableHead>plant.name</TableHead>
              <TableHead>plant.zone_id</TableHead>
              <TableHead>plant.image_url</TableHead>
              <TableHead>plant.health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span>{p.id}</span>
                    <CopyToClipboardButton value={p.id} label="ID" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span>{p.zone_id}</span>
                    <CopyToClipboardButton value={p.zone_id} label="ID" />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{p.image_url ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs">{p.health ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

