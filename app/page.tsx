"use client"

import { DashboardLayout } from "@/layouts/dashboard/dashboard-layout"
import { StatsCards } from "@/features/overview/components/stats-cards"
import { ZoneCard } from "@/features/zones/components/zone-card"
import { QuickWeather } from "@/features/weather/components/quick-weather"
import { WaterOverview } from "@/features/water/components/water-overview"
import { mockZones, mockWaterTank, mockWeather } from "@/lib/mock-data"

export default function OverviewPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor your irrigation system at a glance
          </p>
        </div>

        <StatsCards
          zones={mockZones}
          waterTank={mockWaterTank}
          weather={mockWeather}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Irrigation Zones</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {mockZones.map((zone) => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <QuickWeather weather={mockWeather} />
            <WaterOverview waterTank={mockWaterTank} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
