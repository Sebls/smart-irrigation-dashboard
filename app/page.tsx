"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { StatsCardsDb } from "@/features/overview/components/stats-cards-db"
import { ZoneCardDb } from "@/features/zones/components/zone-card-db"
import type { Sensor, Zone } from "@/lib/types"
import { api } from "@/lib/api"

export default function OverviewPage() {
  const [zones, setZones] = useState<Zone[] | null>(null)
  const [sensors, setSensors] = useState<Sensor[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listZones(), api.listSensors()])
      .then(([z, s]) => {
        if (cancelled) return
        setZones(z)
        setSensors(s)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setZones([])
        setSensors([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const perZone = useMemo(() => {
    const z = zones ?? []
    const s = sensors ?? []
    const sensorsByZone = s.reduce<Record<string, number>>((acc, row) => {
      if (!row.zone_id) return acc
      acc[row.zone_id] = (acc[row.zone_id] ?? 0) + 1
      return acc
    }, {})
    return z.map((zone) => ({
      zone,
      sensorCount: sensorsByZone[zone.id] ?? 0,
    }))
  }, [sensors, zones])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor your irrigation system at a glance
          </p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {zones === null || sensors === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <StatsCardsDb zones={zones} sensors={sensors} />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Irrigation Zones</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {perZone.map(({ zone, sensorCount }) => (
                  <ZoneCardDb
                    key={zone.id}
                    zone={zone}
                    sensorCount={sensorCount}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
