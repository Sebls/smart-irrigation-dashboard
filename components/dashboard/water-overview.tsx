"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets } from "lucide-react"
import type { WaterTank } from "@/lib/types"
import { cn } from "@/lib/utils"

interface WaterOverviewProps {
  waterTank: WaterTank
}

export function WaterOverview({ waterTank }: WaterOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Water Tank Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex h-32 w-20 flex-col justify-end overflow-hidden rounded-xl border-2 border-border bg-secondary">
              <div
                className={cn(
                  "w-full transition-all duration-500",
                  waterTank.level >= 50 ? "bg-primary" :
                  waterTank.level >= 25 ? "bg-chart-3" : "bg-destructive"
                )}
                style={{ height: `${waterTank.level}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplets className="h-8 w-8 text-primary-foreground/80" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Level</p>
              <p className="text-2xl font-bold">{waterTank.level}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="text-lg font-semibold">{waterTank.capacity}L</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">7-Day Usage</p>
              <p className="text-lg font-semibold">
                {Math.round(waterTank.consumption.reduce((acc, c) => acc + c.amount, 0))}L
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
