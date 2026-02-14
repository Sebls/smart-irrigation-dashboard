"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { mockSensorsDb, mockSensorReadingsDbBySensorId, MOCK_BASE_NOW } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { SensorIdentityPanel } from "@/features/sensors/components/sensor-identity-panel"
import { SensorLatestReadingCard } from "@/features/sensors/components/sensor-latest-reading-card"
import { SensorReadingsTable } from "@/features/sensors/components/sensor-readings-table"
import type { Sensor, SensorReadingRecord } from "@/lib/types"
import { api } from "@/lib/api"

interface SensorDetailPageProps {
  params: Promise<{ sensorId: string }>
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

export default function SensorDetailPage({ params }: SensorDetailPageProps) {
  const { sensorId } = use(params)
  const uuid = isUuid(sensorId)

  const [sensorApi, setSensorApi] = useState<Sensor | null>(null)
  const [readingsApi, setReadingsApi] = useState<SensorReadingRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uuid) return
    let cancelled = false
    Promise.all([
      api.getSensor(sensorId),
      api.listSensorReadings({ sensor_id: sensorId, limit: 500 }),
    ])
      .then(([s, rs]) => {
        if (cancelled) return
        setSensorApi(s)
        setReadingsApi(rs)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setSensorApi(null)
        setReadingsApi([])
      })
    return () => {
      cancelled = true
    }
  }, [sensorId, uuid])

  const sensorDb = useMemo(() => (uuid ? null : mockSensorsDb.find((s) => s.id === sensorId)), [sensorId, uuid])

  const sensor: Sensor | null = uuid
    ? sensorApi
    : sensorDb

  // Keep hook order stable: only return after all hooks above ran.
  if (uuid && error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/sensors">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Sensor</h1>
              <p className="text-muted-foreground">Sensor detail</p>
            </div>
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  if (uuid && (sensorApi === null || readingsApi === null)) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/sensors">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Sensor</h1>
              <p className="text-muted-foreground">Loading…</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!sensor) return notFound()

  const readings: SensorReadingRecord[] = uuid
    ? readingsApi!
    : mockSensorReadingsDbBySensorId[sensorId] ??
      []

  const latest =
    readings.slice().sort((a, b) => b.recorded_at.getTime() - a.recorded_at.getTime())[0] ?? null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/sensors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{sensor.name}</h1>
            <p className="text-muted-foreground">Sensor detail</p>
          </div>
        </div>

        <SensorIdentityPanel sensor={sensor} />
        <SensorLatestReadingCard sensor={sensor} latest={latest} />
        <SensorReadingsTable sensor={sensor} readings={readings} now={uuid ? new Date() : MOCK_BASE_NOW} />
      </div>
    </DashboardLayout>
  )
}

