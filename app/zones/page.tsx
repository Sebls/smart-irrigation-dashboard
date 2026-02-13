"use client"

import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { ZoneCard } from "@/features/zones/components/zone-card"
import { ZoneListTable } from "@/features/zones/components/zone-list-table"
import { mockZones } from "@/lib/mock-data"
import { mockZonesDb } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Droplets, Leaf, Thermometer } from "lucide-react"

export default function ZonesPage() {
  const activeZones = mockZones.filter((z) => z.isActive).length
  const totalPlants = mockZones.reduce((acc, zone) => acc + zone.plantCount, 0)
  const avgHumidity = Math.round(
    mockZones.reduce((acc, zone) => acc + zone.avgHumidity, 0) / mockZones.length
  )
  const avgTemp = Math.round(
    mockZones.reduce((acc, zone) => acc + zone.temperature, 0) / mockZones.length
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Irrigation Zones</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your irrigation zones
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Zones</p>
                <p className="text-xl font-bold">
                  {activeZones}/{mockZones.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <Leaf className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Plants</p>
                <p className="text-xl font-bold">{totalPlants}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Droplets className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Humidity</p>
                <p className="text-xl font-bold">{avgHumidity}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Thermometer className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Temperature</p>
                <p className="text-xl font-bold">{avgTemp}°C</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockZones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Zones list (data view)</h2>
            <p className="text-sm text-muted-foreground">
              Requirements-driven table view with persisted fields.
            </p>
          </div>
          <ZoneListTable zones={mockZonesDb} />
        </div>
      </div>
    </DashboardLayout>
  )
}
