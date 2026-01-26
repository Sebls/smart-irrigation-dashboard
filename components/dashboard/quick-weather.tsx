"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, CloudSun } from "lucide-react"
import type { Weather } from "@/lib/types"

interface QuickWeatherProps {
  weather: Weather
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": CloudSun,
}

export function QuickWeather({ weather }: QuickWeatherProps) {
  const CurrentIcon = weatherIcons[weather.condition]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Current Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-chart-3/10">
              <CurrentIcon className="h-8 w-8 text-chart-3" />
            </div>
            <div>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm capitalize text-muted-foreground">
                {weather.condition.replace("-", " ")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-lg font-semibold">{weather.humidity}%</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-2">
          {weather.forecast.slice(0, 5).map((day, i) => {
            const DayIcon = weatherIcons[day.condition]
            return (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg bg-secondary/50 p-2"
              >
                <p className="text-xs text-muted-foreground">
                  {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <DayIcon className="my-1 h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">{day.high}°</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
