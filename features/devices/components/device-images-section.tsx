"use client"

import type { DeviceImage } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button"
import { JsonViewer } from "@/components/json-viewer"
import { formatDateTime } from "@/lib/utils"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Camera } from "lucide-react"
import { api } from "@/lib/api"

function groupByType(images: DeviceImage[]) {
  return images.reduce<Record<string, DeviceImage[]>>((acc, img) => {
    acc[img.type] ||= []
    acc[img.type]!.push(img)
    return acc
  }, {})
}

interface DeviceImagesSectionProps {
  images: DeviceImage[]
}

export function DeviceImagesSection({ images }: DeviceImagesSectionProps) {
  if (images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Device images / cameras</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Camera className="h-5 w-5" />
              </EmptyMedia>
              <EmptyTitle>No images yet</EmptyTitle>
              <EmptyDescription>
                This device has no images captured yet.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const grouped = groupByType(images)
  const types = Object.keys(grouped).sort()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Device images / cameras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {types.map((type) => {
          const imgs = (grouped[type] ?? []).slice().sort((a, b) => b.captured_at.getTime() - a.captured_at.getTime())
          const latest = imgs[0]!
          return (
            <div key={type} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{type}</p>
                  <p className="text-xs text-muted-foreground">Latest captured: {formatDateTime(latest.captured_at)}</p>
                </div>
                <CopyToClipboardButton value={type} label="Copy type" />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="overflow-hidden rounded-lg border border-border bg-secondary/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={api.deviceLatestImageByTypeFileUrl(latest.device_id, type)}
                      alt={`${type} latest`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Latest metadata_json</p>
                    <JsonViewer data={latest.metadata_json ?? {}} />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Image URL</TableHead>
                    <TableHead>Captured</TableHead>
                    <TableHead>Zone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imgs.map((img) => (
                    <TableRow key={img.id}>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span>{img.id}</span>
                          <CopyToClipboardButton value={img.id} label="ID" />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{img.device_id}</TableCell>
                      <TableCell className="font-mono text-xs">{img.type}</TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-56">
                            {api.deviceImageFileUrl(img.device_id, img.id)}
                          </span>
                          <CopyToClipboardButton value={api.deviceImageFileUrl(img.device_id, img.id)} label="URL" />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{formatDateTime(img.captured_at)}</TableCell>
                      <TableCell className="font-mono text-xs">{img.zone_id ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

