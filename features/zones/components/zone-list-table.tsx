"use client"

import Link from "next/link"
import type { Zone } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"

interface ZoneListTableProps {
  zones: Zone[]
}

export function ZoneListTable({ zones }: ZoneListTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Zones ({zones.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Deleted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((z) => (
              <TableRow key={z.id}>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Link className="underline underline-offset-4 hover:text-primary" href={`/zones/${z.id}`}>
                      {z.id}
                    </Link>
                    <CopyToClipboardButton value={z.id} label="ID" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{z.name}</TableCell>
                <TableCell>
                  <Badge variant={z.is_active ? "default" : "secondary"}>
                    {z.is_active ? "true" : "false"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(z.created_at)}</TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(z.updated_at)}</TableCell>
                <TableCell className="font-mono text-xs">{formatDateTime(z.deleted_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

