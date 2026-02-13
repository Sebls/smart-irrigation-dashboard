"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { PlantCard } from "@/features/zones/components/plant-card"
import { mockActivityEventsDb, mockIrrigationJobsDb, mockPlantsDb, mockSensorsDb, mockZones, mockZonesDb } from "@/lib/mock-data"
import { useMounted } from "@/composables/use-mounted"
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
import { cn, formatDateTime, formatTimeAgo } from "@/lib/utils"
import { ZonePlantsSection } from "@/features/zones/components/zone-plants-section"
import { ZoneSensorsSection } from "@/features/zones/components/zone-sensors-section"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { IrrigationJobTable } from "@/features/irrigation-jobs/components/irrigation-job-table"
import { ActivityFeed } from "@/features/activity/components/activity-feed"

interface ZoneDetailPageProps {
  params: Promise<{ zoneId: string }>
}

export default function ZoneDetailPage({ params }: ZoneDetailPageProps) {
  const { zoneId } = use(params)
  const zoneDb = mockZonesDb.find((z) => z.id === zoneId)
  const zone = mockZones.find((z) => z.id === zoneId)
  const mounted = useMounted()

  // Requirements-driven zone detail (persisted fields)
  if (zoneDb) {
    const plants = mockPlantsDb.filter((p) => p.zone_id === zoneDb.id)
    const sensors = mockSensorsDb.filter((s) => s.zone_id === zoneDb.id)
    const jobs = mockIrrigationJobsDb.filter((j) => j.zone_id === zoneDb.id)
    const events = mockActivityEventsDb.filter((e) => e.zone_id === zoneDb.id)

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
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{zoneDb.name}</h1>
                <Badge variant={zoneDb.is_active ? "default" : "secondary"}>
                  {zoneDb.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground">Zone detail (data view)</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Zone fields</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">zone.id</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-xs">{zoneDb.id}</span>
                  <CopyToClipboardButton value={zoneDb.id} label="Copy" />
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">zone.created_at</p>
                <p className="mt-1 font-mono text-xs">{formatDateTime(zoneDb.created_at)}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">zone.updated_at</p>
                <p className="mt-1 font-mono text-xs">{formatDateTime(zoneDb.updated_at)}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">zone.deleted_at</p>
                <p className="mt-1 font-mono text-xs">{formatDateTime(zoneDb.deleted_at)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <ZonePlantsSection plants={plants} />
            <ZoneSensorsSection sensors={sensors} />
          </div>

          <IrrigationJobTable title="Irrigation jobs (zone-scoped)" jobs={jobs} />
          <ActivityFeed events={events} />
        </div>
      </DashboardLayout>
    )
  }

  // Existing demo zone detail (UI prototype)
  if (!zone) {
    notFound()
  }

  const now = new Date()
  const timeSinceIrrigation = mounted ? formatTimeAgo(zone.lastIrrigated, { now }) : "—"
  const timeSinceSensorUpdate = mounted ? formatTimeAgo(new Date(now.getTime() - 15 * 60 * 1000), { now }) : "—"
  const timeSinceTempChange = mounted ? formatTimeAgo(new Date(now.getTime() - 1 * 60 * 60 * 1000), { now }) : "—"

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
                    <p className="text-xs text-muted-foreground">{timeSinceSensorUpdate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/10">
                    <Thermometer className="h-4 w-4 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature change detected</p>
                    <p className="text-xs text-muted-foreground">{timeSinceTempChange}</p>
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
