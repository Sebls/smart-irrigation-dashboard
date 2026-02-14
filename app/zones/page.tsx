"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { ZoneCardDb } from "@/features/zones/components/zone-card-db"
import { ZoneListTable } from "@/features/zones/components/zone-list-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Droplets } from "lucide-react"
import type { Sensor, Zone } from "@/lib/types"
import { api } from "@/lib/api"

export default function ZonesPage() {
  const [zonesDb, setZonesDb] = useState<Zone[] | null>(null)
  const [sensorsDb, setSensorsDb] = useState<Sensor[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listZones(), api.listSensors()])
      .then(([z, s]) => {
        if (cancelled) return
        setZonesDb(z)
        setSensorsDb(s)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setZonesDb([])
        setSensorsDb([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const zones = zonesDb ?? []
    const sensors = sensorsDb ?? []
    return {
      activeZones: zones.filter((z) => z.is_active).length,
      totalZones: zones.length,
      totalSensors: sensors.length,
    }
  }, [sensorsDb, zonesDb])

  const perZone = useMemo(() => {
    const zones = zonesDb ?? []
    const sensors = sensorsDb ?? []
    const sensorsByZone = sensors.reduce<Record<string, number>>((acc, row) => {
      if (!row.zone_id) return acc
      acc[row.zone_id] = (acc[row.zone_id] ?? 0) + 1
      return acc
    }, {})
    return zones.map((zone) => ({
      zone,
      sensorCount: sensorsByZone[zone.id] ?? 0,
    }))
  }, [sensorsDb, zonesDb])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Irrigation Zones</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your irrigation zones
          </p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Zones</p>
                <p className="text-xl font-bold">
                  {stats.activeZones}/{stats.totalZones}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Droplets className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Sensors</p>
                <p className="text-xl font-bold">{stats.totalSensors}</p>
              </div>
            </CardContent>
          </Card>
          <div />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zonesDb === null || sensorsDb === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            perZone.map(({ zone, sensorCount }) => (
              <ZoneCardDb key={zone.id} zone={zone} sensorCount={sensorCount} />
            ))
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Zones list (data view)</h2>
            <p className="text-sm text-muted-foreground">
              Requirements-driven table view with persisted fields.
            </p>
          </div>
          {zonesDb === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <ZoneListTable zones={zonesDb} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
