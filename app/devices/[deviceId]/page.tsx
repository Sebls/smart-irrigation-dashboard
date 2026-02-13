"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { mockDeviceImagesDb, mockDeviceLogsDb, mockDevicesDb, mockTelemetryIdentityByDeviceId, MOCK_BASE_NOW } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { formatDateTime } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { DeviceHealthPanel } from "@/features/devices/components/device-health-panel"
import { DeviceTelemetryIdentityPanel } from "@/features/devices/components/device-telemetry-identity-panel"
import { DeviceImagesSection } from "@/features/devices/components/device-images-section"
import { DeviceLogsSection } from "@/features/devices/components/device-logs-section"
import type { Device, DeviceImage, DeviceLog } from "@/lib/types"
import { api } from "@/lib/api"

interface DeviceDetailPageProps {
  params: Promise<{ deviceId: string }>
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

export default function DeviceDetailPage({ params }: DeviceDetailPageProps) {
  const { deviceId } = use(params)

  const uuid = isUuid(deviceId)
  const [deviceApi, setDeviceApi] = useState<Device | null>(null)
  const [imagesApi, setImagesApi] = useState<DeviceImage[] | null>(null)
  const [logsApi, setLogsApi] = useState<DeviceLog[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uuid) return
    let cancelled = false
    Promise.allSettled([
      api.getDevice(deviceId),
      api.listDeviceImages(deviceId),
      api.listDeviceLogs(deviceId),
    ]).then((results) => {
      if (cancelled) return
      const [deviceRes, imagesRes, logsRes] = results

      if (deviceRes.status === "rejected") {
        setError(deviceRes.reason instanceof Error ? deviceRes.reason.message : String(deviceRes.reason))
        setDeviceApi(null)
        setImagesApi([])
        setLogsApi([])
        return
      }

      setDeviceApi(deviceRes.value)
      setImagesApi(imagesRes.status === "fulfilled" ? imagesRes.value : [])
      setLogsApi(logsRes.status === "fulfilled" ? logsRes.value : [])
    })
    return () => {
      cancelled = true
    }
  }, [deviceId, uuid])

  if (uuid) {
    if (error) {
      return notFound()
    }
    if (deviceApi === null || imagesApi === null || logsApi === null) {
      return (
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/devices">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Device</h1>
                <p className="text-muted-foreground">Loading…</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      )
    }
  }

  const device = uuid ? deviceApi : mockDevicesDb.find((d) => d.id === deviceId)
  if (!device) return notFound()

  const logs = uuid ? logsApi! : mockDeviceLogsDb.filter((l) => l.device_id === device.id)
  const images = uuid ? imagesApi! : mockDeviceImagesDb.filter((img) => img.device_id === device.id)
  const identities = mockTelemetryIdentityByDeviceId[device.id] ?? []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/devices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">{device.name}</h1>
              <Badge variant={device.is_active ? "default" : "secondary"}>
                {device.is_active ? "Active" : "Inactive"}
              </Badge>
              <Badge variant={device.is_online ? "default" : "secondary"}>
                {device.is_online ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{device.description ?? "Device detail"}</p>
          </div>
        </div>

        {uuid && error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">device.id</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs">{device.id}</span>
                <CopyToClipboardButton value={device.id} label="Copy" />
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">device.hardware_id</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs">{device.hardware_id ?? "—"}</span>
                {device.hardware_id ? (
                  <CopyToClipboardButton value={device.hardware_id} label="Copy" />
                ) : null}
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">device.updated_at</p>
              <p className="mt-1 font-mono text-xs">{formatDateTime(device.updated_at)}</p>
            </div>
          </CardContent>
        </Card>

        <DeviceHealthPanel device={device} logs={logs} now={uuid ? new Date() : MOCK_BASE_NOW} />
        <DeviceTelemetryIdentityPanel identities={identities} />
        <DeviceImagesSection images={images} />
        <DeviceLogsSection logs={logs} now={uuid ? new Date() : MOCK_BASE_NOW} />
      </div>
    </DashboardLayout>
  )
}

