"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { SensorChart } from "@/features/sensors/components/sensor-chart"
import { mockZones } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Droplets, Activity, Camera, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlantDetailPageProps {
  params: Promise<{ zoneId: string; plantId: string }>
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

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { zoneId, plantId } = use(params)
  const zone = mockZones.find((z) => z.id === zoneId)
  const plant = zone?.plants.find((p) => p.id === plantId)

  if (!zone || !plant) {
    notFound()
  }

  const avgSensorHumidity = Math.round(
    plant.sensors.reduce((acc, s) => acc + s.humidity, 0) / plant.sensors.length
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/zones/${zoneId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{plant.name}</h1>
              <Badge className={cn("text-xs", healthColors[plant.health])}>
                {healthLabels[plant.health]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {zone.name} - Plant monitoring and sensor data
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Plant Camera Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-secondary">
                  <img
                    src={plant.imageUrl || "/placeholder.svg"}
                    alt={plant.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 backdrop-blur-sm">
                    <Camera className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Live Feed</span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Soil Humidity Sensors ({plant.sensors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {plant.sensors.map((sensor) => (
                    <SensorChart key={sensor.id} sensor={sensor} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Plant Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg className="h-32 w-32 -rotate-90 transform">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="oklch(0.22 0.02 160)"
                        strokeWidth="12"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="oklch(0.55 0.15 160)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(plant.humidity / 100) * 352} 352`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{plant.humidity}%</span>
                      <span className="text-xs text-muted-foreground">Humidity</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-5 w-5 text-primary" />
                      <span className="text-sm">Avg Sensor Reading</span>
                    </div>
                    <span className="font-semibold">{avgSensorHumidity}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-chart-2" />
                      <span className="text-sm">Active Sensors</span>
                    </div>
                    <span className="font-semibold">{plant.sensors.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Sensor Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plant.sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{sensor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: just now
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {sensor.humidity}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sensor.humidity >= 60
                          ? "Optimal"
                          : sensor.humidity >= 40
                            ? "Moderate"
                            : "Low"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {plant.health === "needs-attention" || plant.health === "critical" ? (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Attention Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This plant has low soil humidity levels. Consider scheduling
                    irrigation soon to prevent stress.
                  </p>
                  <Button
                    className="mt-4 w-full bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    Start Irrigation
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
