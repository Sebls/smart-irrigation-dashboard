"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { IrrigationJobTable } from "@/features/irrigation-jobs/components/irrigation-job-table"
import type { IrrigationJob, IrrigationJobScope, PlantEntity, Zone } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"

export default function IrrigationJobsPage() {
  const [scope, setScope] = useState<IrrigationJobScope | "all">("all")
  const [zoneId, setZoneId] = useState<string>("all")
  const [plantId, setPlantId] = useState<string>("all")

  const [zones, setZones] = useState<Zone[] | null>(null)
  const [plants, setPlants] = useState<PlantEntity[] | null>(null)
  const [jobs, setJobs] = useState<IrrigationJob[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listZones(), api.listPlants(), api.listIrrigationJobs({ limit: 500 })])
      .then(([z, p, j]) => {
        if (cancelled) return
        setZones(z)
        setPlants(p)
        setJobs(j)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setZones([])
        setPlants([])
        setJobs([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return (jobs ?? [])
      .filter((j) => (scope === "all" ? true : j.scope === scope))
      .filter((j) => (zoneId === "all" ? true : j.zone_id === zoneId))
      .filter((j) => (plantId === "all" ? true : j.plant_id === plantId))
  }, [jobs, plantId, scope, zoneId])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Irrigation jobs</h1>
          <p className="text-muted-foreground">Global list with optional scope filters</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

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
        </div>

        {jobs === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <IrrigationJobTable jobs={filtered} />
        )}
      </div>
    </DashboardLayout>
  )
}

