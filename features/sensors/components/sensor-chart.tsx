"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SoilSensor } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface SensorChartProps {
  sensor: SoilSensor
}

export function SensorChart({ sensor }: SensorChartProps) {
  const chartData = sensor.readings.map((reading) => ({
    time: formatTime(reading.timestamp),
    value: Math.round(reading.value * 10) / 10,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
          <span className="text-lg font-bold text-primary">{sensor.humidity}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.15 160)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.55 0.15 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }}
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
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="oklch(0.55 0.15 160)"
                strokeWidth={2}
                fill={`url(#gradient-${sensor.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
