"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Leaf, Activity, Thermometer } from "lucide-react"
import type { IrrigationZone } from "@/lib/types"

interface StatsCardsProps {
  zones: IrrigationZone[]
}

export function StatsCards({ zones }: StatsCardsProps) {
  const totalPlants = zones.reduce((acc, zone) => acc + zone.plantCount, 0)
  const activeZones = zones.filter(z => z.isActive).length
  const avgHumidity = Math.round(zones.reduce((acc, zone) => acc + zone.avgHumidity, 0) / zones.length)
  const avgTemp = Math.round(zones.reduce((acc, zone) => acc + zone.temperature, 0) / zones.length)

  const stats = [
    {
      title: "Active Zones",
      value: `${activeZones}/${zones.length}`,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Plants",
      value: totalPlants,
      icon: Leaf,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Avg Soil Humidity",
      value: `${avgHumidity}%`,
      icon: Droplets,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Avg Temperature",
      value: `${avgTemp}°C`,
      icon: Thermometer,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
