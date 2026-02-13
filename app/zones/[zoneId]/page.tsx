"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { PlantCard } from "@/features/zones/components/plant-card"
import { mockZones } from "@/lib/mock-data"
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
import type { ActivityEvent, IrrigationJob, PlantEntity, Sensor, Zone } from "@/lib/types"
import { api } from "@/lib/api"

interface ZoneDetailPageProps {
  params: Promise<{ zoneId: string }>
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

export default function ZoneDetailPage({ params }: ZoneDetailPageProps) {
  const { zoneId } = use(params)
  const uuid = isUuid(zoneId)
  const zoneDemo = mockZones.find((z) => z.id === zoneId)
  const mounted = useMounted()

  const [zoneDb, setZoneDb] = useState<Zone | null>(null)
  const [plantsDb, setPlantsDb] = useState<PlantEntity[] | null>(null)
  const [sensorsDb, setSensorsDb] = useState<Sensor[] | null>(null)
  const [jobsDb, setJobsDb] = useState<IrrigationJob[] | null>(null)
  const [eventsDb, setEventsDb] = useState<ActivityEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uuid) return
    let cancelled = false
    Promise.all([
      api.getZone(zoneId),
      api.listPlants(),
      api.listSensors(),
      api.listIrrigationJobs({ zone_id: zoneId, limit: 500 }),
      api.listActivityEvents({ zone_id: zoneId, limit: 500 }),
    ])
      .then(([z, plants, sensors, jobs, events]) => {
        if (cancelled) return
        setZoneDb(z)
        setPlantsDb(plants.filter((p) => p.zone_id === z.id))
        setSensorsDb(sensors.filter((s) => s.zone_id === z.id))
        setJobsDb(jobs)
        setEventsDb(events)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setZoneDb(null)
        setPlantsDb([])
        setSensorsDb([])
        setJobsDb([])
        setEventsDb([])
      })
    return () => {
      cancelled = true
    }
  }, [uuid, zoneId])

  // Requirements-driven zone detail (persisted fields) for UUID zones
  if (uuid) {
    if (error && zoneDb === null) {
      notFound()
    }
    if (zoneDb === null || plantsDb === null || sensorsDb === null || jobsDb === null || eventsDb === null) {
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
                <h1 className="text-2xl font-bold">Zone</h1>
                <p className="text-muted-foreground">Loading…</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      )
    }

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

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

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
            <ZonePlantsSection plants={plantsDb} />
            <ZoneSensorsSection sensors={sensorsDb} />
          </div>

          <IrrigationJobTable title="Irrigation jobs (zone-scoped)" jobs={jobsDb} />
          <ActivityFeed events={eventsDb} />
        </div>
      </DashboardLayout>
    )
  }

  // Existing demo zone detail (UI prototype)
  if (!zoneDemo) {
    notFound()
  }

  const now = new Date()
  const timeSinceIrrigation = mounted ? formatTimeAgo(zoneDemo.lastIrrigated, { now }) : "—"
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
              <h1 className="text-2xl font-bold">{zoneDemo.name}</h1>
              <Badge
                variant={zoneDemo.isActive ? "default" : "secondary"}
                className={cn(
                  zoneDemo.isActive && "bg-primary text-primary-foreground"
                )}
              >
                {zoneDemo.isActive ? "Active" : "Idle"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Zone details and plant monitoring
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Power className="mr-2 h-4 w-4" />
            {zoneDemo.isActive ? "Stop Irrigation" : "Start Irrigation"}
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
                <p className="text-xl font-bold">{zoneDemo.avgHumidity}%</p>
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
                <p className="text-xl font-bold">{zoneDemo.plantCount}</p>
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
                <p className="text-xl font-bold">{zoneDemo.temperature}°C</p>
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
                <p className="text-xl font-bold">{zoneDemo.airHumidity}%</p>
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
                  Plants in Zone ({zoneDemo.plants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {zoneDemo.plants.map((plant) => (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      zoneId={zoneDemo.id}
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
                  <span className="font-semibold">{zoneDemo.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-chart-2" />
                    <span className="text-sm">Air Humidity</span>
                  </div>
                  <span className="font-semibold">{zoneDemo.airHumidity}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <span className="text-sm">Air Quality</span>
                  </div>
                  <span className="font-semibold">{zoneDemo.airQuality}</span>
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
