"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { mockZones } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Activity, Droplets, Thermometer, Wind } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  LineChart,
} from "recharts"

type SensorType = "humidity" | "temperature" | "air-quality"

export default function SensorsPage() {
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [selectedPlant, setSelectedPlant] = useState<string>("all")
  const [sensorType, setSensorType] = useState<SensorType>("humidity")

  const filteredZones =
    selectedZone === "all"
      ? mockZones
      : mockZones.filter((z) => z.id === selectedZone)

  const allPlants = filteredZones.flatMap((z) => z.plants)
  const filteredPlants =
    selectedPlant === "all"
      ? allPlants
      : allPlants.filter((p) => p.id === selectedPlant)

  const allSensors = filteredPlants.flatMap((p) =>
    p.sensors.map((s) => ({ ...s, plantName: p.name }))
  )

  const totalSensors = mockZones.flatMap((z) =>
    z.plants.flatMap((p) => p.sensors)
  ).length
  const avgHumidity = Math.round(
    allSensors.reduce((acc, s) => acc + s.humidity, 0) / (allSensors.length || 1)
  )

  // Generate comparison chart data
  const comparisonData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date()
    hour.setHours(hour.getHours() - 23 + i)
    const data: Record<string, number | string> = {
      time: hour.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
    allSensors.slice(0, 5).forEach((sensor, idx) => {
      const reading = sensor.readings[i]
      if (reading) {
        data[`sensor${idx}`] = Math.round(reading.value * 10) / 10
      }
    })
    return data
  })

  const chartColors = [
    "oklch(0.55 0.15 160)",
    "oklch(0.65 0.12 200)",
    "oklch(0.7 0.1 80)",
    "oklch(0.55 0.18 280)",
    "oklch(0.6 0.15 30)",
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sensor Measurements</h1>
          <p className="text-muted-foreground">
            Explore sensor data across zones and plants
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Sensors</p>
                <p className="text-xl font-bold">{totalSensors}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <Droplets className="h-5 w-5 text-chart-1" />
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
                <p className="text-xs text-muted-foreground">Zones Monitored</p>
                <p className="text-xl font-bold">{mockZones.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Wind className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plants Tracked</p>
                <p className="text-xl font-bold">{allPlants.length}</p>
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
                    {mockZones.map((zone) => (
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
                    {allPlants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={sensorType}
                  onValueChange={(v) => setSensorType(v as SensorType)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sensor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="humidity">Soil Humidity</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="air-quality">Air Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Sensor Comparison (Last 24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.015 160)",
                      border: "1px solid oklch(0.25 0.02 160)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    labelStyle={{ color: "oklch(0.65 0 0)" }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 16 }}
                    formatter={(value, entry, index) => (
                      <span style={{ color: "oklch(0.65 0 0)" }}>
                        {allSensors[index]?.plantName} - {allSensors[index]?.name}
                      </span>
                    )}
                  />
                  {allSensors.slice(0, 5).map((sensor, idx) => (
                    <Line
                      key={sensor.id}
                      type="monotone"
                      dataKey={`sensor${idx}`}
                      stroke={chartColors[idx]}
                      strokeWidth={2}
                      dot={false}
                      name={`${sensor.plantName} - ${sensor.name}`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              All Sensors ({allSensors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Sensor
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Plant
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Zone
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Current Value
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allSensors.map((sensor) => {
                    const plant = filteredPlants.find((p) =>
                      p.sensors.some((s) => s.id === sensor.id)
                    )
                    const zone = filteredZones.find((z) =>
                      z.plants.some((p) => p.id === plant?.id)
                    )
                    const lastReadings = sensor.readings.slice(-5)
                    const trend =
                      lastReadings[lastReadings.length - 1]?.value -
                      lastReadings[0]?.value

                    return (
                      <tr key={sensor.id} className="border-b border-border/50">
                        <td className="py-3 text-sm font-medium">{sensor.name}</td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {sensor.plantName}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {zone?.name}
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-semibold text-primary">
                            {sensor.humidity}%
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              sensor.humidity >= 60
                                ? "bg-primary/10 text-primary"
                                : sensor.humidity >= 40
                                  ? "bg-chart-3/10 text-chart-3"
                                  : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {sensor.humidity >= 60
                              ? "Optimal"
                              : sensor.humidity >= 40
                                ? "Moderate"
                                : "Low"}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-sm font-medium ${
                              trend > 0
                                ? "text-primary"
                                : trend < 0
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {trend > 0 ? "+" : ""}
                            {trend.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
