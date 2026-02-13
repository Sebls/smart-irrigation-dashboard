"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { mockSensorsDb, mockSensorReadingsDbBySensorId, mockZones, MOCK_BASE_NOW } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { SensorIdentityPanel } from "@/features/sensors/components/sensor-identity-panel"
import { SensorLatestReadingCard } from "@/features/sensors/components/sensor-latest-reading-card"
import { SensorReadingsTable } from "@/features/sensors/components/sensor-readings-table"
import type { Sensor, SensorReadingRecord } from "@/lib/types"

interface SensorDetailPageProps {
  params: Promise<{ sensorId: string }>
}

export default function SensorDetailPage({ params }: SensorDetailPageProps) {
  const { sensorId } = use(params)
  const sensorDb = mockSensorsDb.find((s) => s.id === sensorId)

  const sensorFromDemo = mockZones
    .flatMap((z) => z.plants)
    .flatMap((p) => p.sensors)
    .find((s) => s.id === sensorId)

  const sensor: Sensor | null = sensorDb
    ? sensorDb
    : sensorFromDemo
      ? {
          id: sensorFromDemo.id,
          name: sensorFromDemo.name,
          type: "soil_humidity",
          unit: "%",
          is_active: true,
          zone_id: null,
          plant_id: sensorFromDemo.plantId,
          created_at: MOCK_BASE_NOW,
          updated_at: MOCK_BASE_NOW,
          deleted_at: null,
        }
      : null

  if (!sensor) notFound()

  const readings: SensorReadingRecord[] =
    mockSensorReadingsDbBySensorId[sensor.id] ??
    (sensorFromDemo
      ? sensorFromDemo.readings.map((r, idx) => ({
          id: `${sensor.id}-reading-${idx + 1}`,
          sensor_id: sensor.id,
          recorded_at: r.timestamp,
          value: r.value,
        }))
      : [])
  const latest = readings.slice().sort((a, b) => b.recorded_at.getTime() - a.recorded_at.getTime())[0] ?? null

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
        <SensorReadingsTable sensor={sensor} readings={readings} now={MOCK_BASE_NOW} />
      </div>
    </DashboardLayout>
  )
}

