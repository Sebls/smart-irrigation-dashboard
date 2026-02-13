"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { ActivityFeed } from "@/features/activity/components/activity-feed"
import type { ActivityEvent, PlantEntity, Sensor, Zone } from "@/lib/types"
import { api } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ActivityPage() {
  const [zoneId, setZoneId] = useState<string>("all")
  const [plantId, setPlantId] = useState<string>("all")
  const [sensorId, setSensorId] = useState<string>("all")

  const [zones, setZones] = useState<Zone[] | null>(null)
  const [plants, setPlants] = useState<PlantEntity[] | null>(null)
  const [sensors, setSensors] = useState<Sensor[] | null>(null)
  const [events, setEvents] = useState<ActivityEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listZones(), api.listPlants(), api.listSensors(), api.listActivityEvents({ limit: 500 })])
      .then(([z, p, s, e]) => {
        if (cancelled) return
        setZones(z)
        setPlants(p)
        setSensors(s)
        setEvents(e)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setZones([])
        setPlants([])
        setSensors([])
        setEvents([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return (events ?? [])
      .filter((e) => (zoneId === "all" ? true : e.zone_id === zoneId))
      .filter((e) => (plantId === "all" ? true : e.plant_id === plantId))
      .filter((e) => (sensorId === "all" ? true : e.sensor_id === sensorId))
  }, [events, plantId, sensorId, zoneId])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-muted-foreground">Global feed with zone/plant/sensor filters</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Select value={zoneId} onValueChange={setZoneId}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zones</SelectItem>
              {(zones ?? []).map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name} ({z.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={plantId} onValueChange={setPlantId}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Plant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plants</SelectItem>
              {(plants ?? []).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sensorId} onValueChange={setSensorId}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sensors</SelectItem>
              {(sensors ?? []).map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {events === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ActivityFeed events={filtered} />
        )}
      </div>
    </DashboardLayout>
  )
}

