"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { DeviceListTable } from "@/features/devices/components/device-list-table"
import type { Device } from "@/lib/types"
import { api } from "@/lib/api"

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .listDevices()
      .then((rows) => {
        if (cancelled) return
        setDevices(rows)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setDevices([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Browse all devices</p>
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : devices === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <DeviceListTable devices={devices} />
        )}
      </div>
    </DashboardLayout>
  )
}

