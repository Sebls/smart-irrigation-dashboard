"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Zone } from "@/lib/types"

interface ZoneCardDbProps {
  zone: Zone
  plantCount: number
  sensorCount: number
}

export function ZoneCardDb({ zone, plantCount, sensorCount }: ZoneCardDbProps) {
  return (
    <Link href={`/zones/${zone.id}`}>
      <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{zone.name}</CardTitle>
          <Badge variant={zone.is_active ? "default" : "secondary"} className="text-xs">
            {zone.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">Plants: {plantCount}</p>
          <p className="text-xs text-muted-foreground">Sensors: {sensorCount}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

