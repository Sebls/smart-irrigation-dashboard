"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Activity } from "lucide-react"
import type { Plant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PlantCardProps {
  plant: Plant
  zoneId: string
}

const healthColors = {
  excellent: "bg-primary text-primary-foreground",
  good: "bg-chart-1 text-primary-foreground",
  "needs-attention": "bg-chart-3 text-foreground",
  critical: "bg-destructive text-destructive-foreground",
}

const healthLabels = {
  excellent: "Excellent",
  good: "Good",
  "needs-attention": "Needs Attention",
  critical: "Critical",
}

export function PlantCard({ plant, zoneId }: PlantCardProps) {
  return (
    <Link href={`/zones/${zoneId}/plants/${plant.id}`}>
      <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{plant.name}</CardTitle>
          <Badge className={cn("text-xs", healthColors[plant.health])}>
            {healthLabels[plant.health]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
              <img
                src={plant.imageUrl || "/placeholder.svg"}
                alt={plant.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Soil Humidity</span>
                <span className="ml-auto font-semibold">{plant.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-chart-2" />
                <span className="text-sm text-muted-foreground">Sensors</span>
                <span className="ml-auto font-semibold">{plant.sensors.length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Humidity Level</span>
              <span className="font-medium">{plant.humidity}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  plant.humidity >= 60
                    ? "bg-primary"
                    : plant.humidity >= 40
                      ? "bg-chart-3"
                      : "bg-destructive"
                )}
                style={{ width: `${plant.humidity}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {plant.sensors.slice(0, 4).map((sensor) => (
              <div
                key={sensor.id}
                className="flex items-center justify-between rounded-lg bg-secondary/50 px-2 py-1.5"
              >
                <span className="text-xs text-muted-foreground truncate">{sensor.name}</span>
                <span className="text-xs font-semibold">{sensor.humidity}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
