"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { mockZones, mockWaterTank } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, TrendingDown, Calendar, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function WaterPage() {
  const totalWaterUsage = mockZones.reduce((acc, zone) => acc + zone.waterUsage, 0)
  const avgDailyConsumption = Math.round(
    mockWaterTank.consumption.reduce((acc, c) => acc + c.amount, 0) /
      mockWaterTank.consumption.length
  )

  const consumptionData = mockWaterTank.consumption.map((c) => ({
    day: c.date.toLocaleDateString("en-US", { weekday: "short" }),
    amount: Math.round(c.amount),
  }))

  // Generate hourly data for today
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    usage: Math.round(Math.random() * 15 + 5),
  }))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Water Management</h1>
          <p className="text-muted-foreground">
            Monitor water usage and tank levels
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Tank Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="flex h-48 w-32 flex-col justify-end overflow-hidden rounded-2xl border-4 border-border bg-secondary">
                  <div
                    className={cn(
                      "w-full transition-all duration-1000",
                      mockWaterTank.level >= 50
                        ? "bg-primary"
                        : mockWaterTank.level >= 25
                          ? "bg-chart-3"
                          : "bg-destructive"
                    )}
                    style={{ height: `${mockWaterTank.level}%` }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Droplets className="mx-auto h-8 w-8 text-primary-foreground/80" />
                    <span className="text-2xl font-bold text-primary-foreground">
                      {mockWaterTank.level}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-semibold">{mockWaterTank.capacity}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current Level
                  </span>
                  <span className="font-semibold">
                    {Math.round(
                      (mockWaterTank.level / 100) * mockWaterTank.capacity
                    )}
                    L
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Est. Days Remaining
                  </span>
                  <span className="font-semibold">
                    {Math.round(
                      ((mockWaterTank.level / 100) * mockWaterTank.capacity) /
                        avgDailyConsumption
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Zone Usage
                  </p>
                  <p className="text-2xl font-bold">{totalWaterUsage}L/day</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10">
                  <TrendingDown className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Daily Consumption
                  </p>
                  <p className="text-2xl font-bold">{avgDailyConsumption}L</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
                  <Calendar className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">7-Day Total</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      mockWaterTank.consumption.reduce(
                        (acc, c) => acc + c.amount,
                        0
                      )
                    )}
                    L
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10">
                  <Activity className="h-6 w-6 text-chart-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Zones</p>
                  <p className="text-2xl font-bold">
                    {mockZones.filter((z) => z.isActive).length}/
                    {mockZones.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Weekly Water Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consumptionData}>
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: "oklch(0.65 0 0)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "oklch(0.65 0 0)" }}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0.015 160)",
                        border: "1px solid oklch(0.25 0.02 160)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0 0)",
                      }}
                      labelStyle={{ color: "oklch(0.65 0 0)" }}
                      formatter={(value: number) => [`${value}L`, "Consumption"]}
                    />
                    <Bar
                      dataKey="amount"
                      fill="oklch(0.55 0.15 160)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Today's Hourly Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="oklch(0.55 0.15 160)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="oklch(0.55 0.15 160)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={3}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.015 160)",
                      border: "1px solid oklch(0.25 0.02 160)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    labelStyle={{ color: "oklch(0.65 0 0)" }}
                    formatter={(value: number) => [`${value}L`, "Usage"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="oklch(0.55 0.15 160)"
                    strokeWidth={2}
                    fill="url(#hourlyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Zone Water Usage Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockZones.map((zone) => (
                <div key={zone.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          zone.isActive ? "bg-primary" : "bg-muted-foreground"
                        )}
                      />
                      <span className="text-sm font-medium">{zone.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {zone.waterUsage}L/day
                    </span>
                  </div>
                  <Progress
                    value={(zone.waterUsage / totalWaterUsage) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
