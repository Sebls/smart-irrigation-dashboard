"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity, Leaf, Thermometer, Droplets } from "lucide-react"
import type { PlantEntity, Sensor, Zone } from "@/lib/types"

interface StatsCardsDbProps {
  zones: Zone[]
  plants: PlantEntity[]
  sensors: Sensor[]
}

export function StatsCardsDb({ zones, plants, sensors }: StatsCardsDbProps) {
  const activeZones = zones.filter((z) => z.is_active).length
  const totalZones = zones.length
  const totalPlants = plants.length
  const totalSensors = sensors.length

  const stats = [
    {
      title: "Active Zones",
      value: `${activeZones}/${totalZones}`,
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
      title: "Total Sensors",
      value: totalSensors,
      icon: Droplets,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Zones Monitored",
      value: totalZones,
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

