"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { ActivityFeed } from "@/features/activity/components/activity-feed"
import { mockActivityEventsDb, mockPlantsDb, mockSensorsDb, mockZonesDb } from "@/lib/mock-data"
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

  const filtered = useMemo(() => {
    return mockActivityEventsDb
      .filter((e) => (zoneId === "all" ? true : e.zone_id === zoneId))
      .filter((e) => (plantId === "all" ? true : e.plant_id === plantId))
      .filter((e) => (sensorId === "all" ? true : e.sensor_id === sensorId))
  }, [plantId, sensorId, zoneId])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-muted-foreground">Global feed with zone/plant/sensor filters</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={zoneId} onValueChange={setZoneId}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zones</SelectItem>
              {mockZonesDb.map((z) => (
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
              {mockPlantsDb.map((p) => (
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
              {mockSensorsDb.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ActivityFeed events={filtered} />
      </div>
    </DashboardLayout>
  )
}

