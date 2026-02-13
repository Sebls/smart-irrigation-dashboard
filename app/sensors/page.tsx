"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Activity } from "lucide-react"
import type { PlantEntity, Sensor, Zone } from "@/lib/types"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"

export default function SensorsPage() {
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [selectedPlant, setSelectedPlant] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  const [zones, setZones] = useState<Zone[] | null>(null)
  const [plants, setPlants] = useState<PlantEntity[] | null>(null)
  const [sensors, setSensors] = useState<Sensor[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listZones(), api.listPlants(), api.listSensors({ limit: 1000 })])
      .then(([z, p, s]) => {
        if (cancelled) return
        setZones(z)
        setPlants(p)
        setSensors(s)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setZones([])
        setPlants([])
        setSensors([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const zoneById = useMemo(() => {
    return Object.fromEntries((zones ?? []).map((z) => [z.id, z]))
  }, [zones])

  const plantById = useMemo(() => {
    return Object.fromEntries((plants ?? []).map((p) => [p.id, p]))
  }, [plants])

  const filteredPlants = useMemo(() => {
    const p = plants ?? []
    if (selectedZone === "all") return p
    return p.filter((row) => row.zone_id === selectedZone)
  }, [plants, selectedZone])

  const types = useMemo(() => {
    const set = new Set((sensors ?? []).map((s) => s.type).filter(Boolean))
    return Array.from(set).sort()
  }, [sensors])

  const filteredSensors = useMemo(() => {
    const rows = sensors ?? []
    return rows
      .filter((s) => (selectedZone === "all" ? true : s.zone_id === selectedZone))
      .filter((s) => (selectedPlant === "all" ? true : s.plant_id === selectedPlant))
      .filter((s) => (selectedType === "all" ? true : s.type === selectedType))
  }, [selectedPlant, selectedType, selectedZone, sensors])

  const stats = useMemo(() => {
    const all = sensors ?? []
    const active = all.filter((s) => s.is_active).length
    return {
      totalSensors: all.length,
      activeSensors: active,
      zonesMonitored: (zones ?? []).length,
      plantsTracked: (plants ?? []).length,
    }
  }, [plants, sensors, zones])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sensor Measurements</h1>
          <p className="text-muted-foreground">
            Explore sensor data across zones and plants
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
                <p className="text-xs text-muted-foreground">Total Sensors</p>
                <p className="text-xl font-bold">{stats.totalSensors}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10" />
              <div>
                <p className="text-xs text-muted-foreground">Active Sensors</p>
                <p className="text-xl font-bold">{stats.activeSensors}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10" />
              <div>
                <p className="text-xs text-muted-foreground">Zones Monitored</p>
                <p className="text-xl font-bold">{stats.zonesMonitored}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10" />
              <div>
                <p className="text-xs text-muted-foreground">Plants Tracked</p>
                <p className="text-xl font-bold">{stats.plantsTracked}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-medium">
                Filter Measurements
              </CardTitle>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {(zones ?? []).map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select plant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plants</SelectItem>
                    {filteredPlants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sensor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Sensors ({filteredSensors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Plant</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSensors.map((sensor) => {
                    const zone = sensor.zone_id ? zoneById[sensor.zone_id] : null
                    const plant = sensor.plant_id ? plantById[sensor.plant_id] : null
                    return (
                      <TableRow key={sensor.id}>
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/sensors/${sensor.id}`}
                              className="underline underline-offset-4 hover:text-primary"
                            >
                              {sensor.id}
                            </Link>
                            <CopyToClipboardButton value={sensor.id} label="ID" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{sensor.name}</TableCell>
                        <TableCell className="font-mono text-xs">{sensor.type}</TableCell>
                        <TableCell className="font-mono text-xs">{sensor.unit ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={sensor.is_active ? "default" : "secondary"}>
                            {sensor.is_active ? "true" : "false"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {zone ? zone.name : sensor.zone_id ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {plant ? plant.name : sensor.plant_id ?? "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{formatDateTime(sensor.updated_at)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
