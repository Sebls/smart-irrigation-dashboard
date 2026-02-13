"use client"

import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { DeviceListTable } from "@/features/devices/components/device-list-table"
import { mockDevicesDb } from "@/lib/mock-data"

export default function DevicesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Browse all devices</p>
        </div>

        <DeviceListTable devices={mockDevicesDb} />
      </div>
    </DashboardLayout>
  )
}

