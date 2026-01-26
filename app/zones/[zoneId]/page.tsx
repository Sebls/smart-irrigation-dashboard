"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PlantCard } from "@/components/dashboard/plant-card"
import { mockZones } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Droplets,
  Leaf,
  Thermometer,
  Wind,
  Activity,
  Clock,
  Power,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoneDetailPageProps {
  params: Promise<{ zoneId: string }>
}

export default function ZoneDetailPage({ params }: ZoneDetailPageProps) {
  const { zoneId } = use(params)
  const zone = mockZones.find((z) => z.id === zoneId)

  if (!zone) {
    notFound()
  }

  const timeSinceIrrigation = getTimeSince(zone.lastIrrigated)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/zones">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{zone.name}</h1>
              <Badge
                variant={zone.isActive ? "default" : "secondary"}
                className={cn(
                  zone.isActive && "bg-primary text-primary-foreground"
                )}
              >
                {zone.isActive ? "Active" : "Idle"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Zone details and plant monitoring
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Power className="mr-2 h-4 w-4" />
            {zone.isActive ? "Stop Irrigation" : "Start Irrigation"}
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Humidity</p>
                <p className="text-xl font-bold">{zone.avgHumidity}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <Leaf className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plants</p>
                <p className="text-xl font-bold">{zone.plantCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Thermometer className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-xl font-bold">{zone.temperature}°C</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Wind className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Air Humidity</p>
                <p className="text-xl font-bold">{zone.airHumidity}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10">
                <Clock className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Watered</p>
                <p className="text-xl font-bold">{timeSinceIrrigation}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Plants in Zone ({zone.plants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {zone.plants.map((plant) => (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      zoneId={zone.id}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Environmental Sensors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-chart-3" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="font-semibold">{zone.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-chart-2" />
                    <span className="text-sm">Air Humidity</span>
                  </div>
                  <span className="font-semibold">{zone.airHumidity}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <span className="text-sm">Air Quality</span>
                  </div>
                  <span className="font-semibold">{zone.airQuality}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Droplets className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Irrigation completed</p>
                    <p className="text-xs text-muted-foreground">{timeSinceIrrigation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/10">
                    <Activity className="h-4 w-4 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sensor reading updated</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/10">
                    <Thermometer className="h-4 w-4 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature change detected</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
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
