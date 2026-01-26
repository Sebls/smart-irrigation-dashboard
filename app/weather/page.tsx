"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { mockWeather, mockZones } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  TrendingUp,
} from "lucide-react"
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

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": CloudSun,
}

export default function WeatherPage() {
  const CurrentIcon = weatherIcons[mockWeather.condition]

  const forecastData = mockWeather.forecast.map((day) => ({
    day: day.date.toLocaleDateString("en-US", { weekday: "short" }),
    high: day.high,
    low: day.low,
    precipitation: day.precipitation,
    condition: day.condition,
  }))

  // Simulated hourly temperature data
  const hourlyTempData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date()
    hour.setHours(i)
    const baseTemp = mockWeather.temperature
    const variation = Math.sin((i - 6) * (Math.PI / 12)) * 6
    return {
      hour: hour.toLocaleTimeString("en-US", { hour: "2-digit" }),
      temp: Math.round((baseTemp + variation) * 10) / 10,
    }
  })

  const avgZoneTemp = Math.round(
    mockZones.reduce((acc, zone) => acc + zone.temperature, 0) / mockZones.length
  )
  const avgZoneHumidity = Math.round(
    mockZones.reduce((acc, zone) => acc + zone.airHumidity, 0) / mockZones.length
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Weather</h1>
          <p className="text-muted-foreground">
            Current conditions and forecast
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Current Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-chart-3/10">
                    <CurrentIcon className="h-14 w-14 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-5xl font-bold">
                      {mockWeather.temperature}°C
                    </p>
                    <p className="text-lg capitalize text-muted-foreground">
                      {mockWeather.condition.replace("-", " ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                    <Droplets className="h-6 w-6 text-chart-2" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="text-lg font-semibold">
                        {mockWeather.humidity}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                    <Wind className="h-6 w-6 text-chart-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind</p>
                      <p className="text-lg font-semibold">12 km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                    <TrendingUp className="h-6 w-6 text-chart-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">UV Index</p>
                      <p className="text-lg font-semibold">6 (High)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                    <CloudRain className="h-6 w-6 text-chart-4" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rain</p>
                      <p className="text-lg font-semibold">
                        {mockWeather.forecast[0]?.precipitation || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Zone Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-chart-3" />
                  <span className="text-sm">Outdoor Temp</span>
                </div>
                <span className="font-semibold">
                  {mockWeather.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-primary" />
                  <span className="text-sm">Avg Zone Temp</span>
                </div>
                <span className="font-semibold">{avgZoneTemp}°C</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-chart-2" />
                  <span className="text-sm">Outdoor Humidity</span>
                </div>
                <span className="font-semibold">{mockWeather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="text-sm">Avg Zone Humidity</span>
                </div>
                <span className="font-semibold">{avgZoneHumidity}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              5-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-5">
              {mockWeather.forecast.map((day, i) => {
                const DayIcon = weatherIcons[day.condition]
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-xl bg-secondary/50 p-4"
                  >
                    <p className="text-sm font-medium">
                      {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <DayIcon className="my-4 h-10 w-10 text-chart-3" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <CloudRain className="h-3 w-3" />
                      {day.precipitation}%
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Temperature Throughout the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyTempData}>
                    <defs>
                      <linearGradient
                        id="tempGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="oklch(0.7 0.1 80)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="oklch(0.7 0.1 80)"
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
                      domain={["dataMin - 2", "dataMax + 2"]}
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
                      formatter={(value: number) => [`${value}°C`, "Temperature"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="oklch(0.7 0.1 80)"
                      strokeWidth={2}
                      fill="url(#tempGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Precipitation Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData}>
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: "oklch(0.65 0 0)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: "oklch(0.65 0 0)" }}
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
                      formatter={(value: number) => [
                        `${value}%`,
                        "Precipitation",
                      ]}
                    />
                    <Bar
                      dataKey="precipitation"
                      fill="oklch(0.65 0.12 200)"
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
              Irrigation Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWeather.forecast
                .filter((day) => day.precipitation >= 50)
                .map((day, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg border border-chart-2/30 bg-chart-2/5 p-4"
                  >
                    <CloudRain className="h-8 w-8 text-chart-2" />
                    <div>
                      <p className="font-medium">
                        Rain expected on{" "}
                        {day.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {day.precipitation}% chance of precipitation. Consider
                        reducing irrigation for zones with adequate humidity.
                      </p>
                    </div>
                  </div>
                ))}
              {mockWeather.forecast.filter((day) => day.precipitation >= 50)
                .length === 0 && (
                <div className="flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <Sun className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Clear weather ahead</p>
                    <p className="text-sm text-muted-foreground">
                      No significant rain in the forecast. Continue regular
                      irrigation schedules.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
