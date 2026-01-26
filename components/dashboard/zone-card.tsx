"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Leaf, Thermometer, Clock } from "lucide-react"
import type { IrrigationZone } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ZoneCardProps {
  zone: IrrigationZone
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const timeSinceIrrigation = getTimeSince(zone.lastIrrigated)

  return (
    <Link href={`/zones/${zone.id}`}>
      <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{zone.name}</CardTitle>
          <Badge
            variant={zone.isActive ? "default" : "secondary"}
            className={cn(
              "text-xs",
              zone.isActive && "bg-primary text-primary-foreground"
            )}
          >
            {zone.isActive ? "Active" : "Idle"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="text-sm font-semibold">{zone.avgHumidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                <Leaf className="h-4 w-4 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plants</p>
                <p className="text-sm font-semibold">{zone.plantCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                <Thermometer className="h-4 w-4 text-chart-3" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temp</p>
                <p className="text-sm font-semibold">{zone.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
                <Clock className="h-4 w-4 text-chart-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Watered</p>
                <p className="text-sm font-semibold">{timeSinceIrrigation}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Soil Humidity</span>
              <span className="font-medium">{zone.avgHumidity}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  zone.avgHumidity >= 60 ? "bg-primary" : 
                  zone.avgHumidity >= 40 ? "bg-chart-3" : "bg-destructive"
                )}
                style={{ width: `${zone.avgHumidity}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function getTimeSince(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}m ago`
  }
  if (hours < 24) {
    return `${hours}h ago`
  }
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
