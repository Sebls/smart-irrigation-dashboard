"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { IrrigationJobTable } from "@/features/irrigation-jobs/components/irrigation-job-table"
import { mockIrrigationJobsDb, mockPlantsDb, mockZonesDb } from "@/lib/mock-data"
import type { IrrigationJobScope } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function IrrigationJobsPage() {
  const [scope, setScope] = useState<IrrigationJobScope | "all">("all")
  const [zoneId, setZoneId] = useState<string>("all")
  const [plantId, setPlantId] = useState<string>("all")

  const filtered = useMemo(() => {
    return mockIrrigationJobsDb
      .filter((j) => (scope === "all" ? true : j.scope === scope))
      .filter((j) => (zoneId === "all" ? true : j.zone_id === zoneId))
      .filter((j) => (plantId === "all" ? true : j.plant_id === plantId))
  }, [plantId, scope, zoneId])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Irrigation jobs</h1>
          <p className="text-muted-foreground">Global list with optional scope filters</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={scope} onValueChange={(v) => setScope(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scopes</SelectItem>
              <SelectItem value="global">global</SelectItem>
              <SelectItem value="zone">zone</SelectItem>
              <SelectItem value="plant">plant</SelectItem>
            </SelectContent>
          </Select>

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
        </div>

        <IrrigationJobTable jobs={filtered} />
      </div>
    </DashboardLayout>
  )
}

