import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

function joinUrl(base: string, path: string) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base
  const p = path.startsWith("/") ? path : `/${path}`
  return `${b}${p}`
}

function withTrailingSlash(path: string) {
  if (!path) return "/"
  return path.endsWith("/") ? path : `${path}/`
}

function backendBaseUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL
  if (!url) {
    throw new Error(
      "Missing backend URL. Set NEXT_PUBLIC_BACKEND_URL (or BACKEND_URL) in .env, e.g. http://localhost:8000"
    )
  }
  return joinUrl(url, "/api/v1")
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  const incomingPathname = req.nextUrl.pathname
  const hadTrailingSlash = incomingPathname.endsWith("/")
  const upstreamPath = `/${path.join("/")}${hadTrailingSlash ? "/" : ""}`

  const upstream = new URL(joinUrl(backendBaseUrl(), upstreamPath))
  upstream.search = req.nextUrl.search

  const headers = new Headers(req.headers)
  headers.delete("host")

  const method = req.method.toUpperCase()
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer()

  const res = await fetch(upstream.toString(), {
    method,
    headers,
    body,
    // Follow upstream redirects (e.g. FastAPI trailing-slash 307) on the server,
    // so the browser never sees cross-origin Location headers.
    redirect: "follow",
    cache: "no-store",
  })

  const outHeaders = new Headers(res.headers)
  // Avoid double-compression issues in some setups.
  outHeaders.delete("content-encoding")

  return new Response(res.body, {
    status: res.status,
    headers: outHeaders,
  })
}

export function GET(req: NextRequest, ctx: any) {
  return proxy(req, ctx)
}
export function POST(req: NextRequest, ctx: any) {
  return proxy(req, ctx)
}
export function PUT(req: NextRequest, ctx: any) {
  return proxy(req, ctx)
}
export function PATCH(req: NextRequest, ctx: any) {
  return proxy(req, ctx)
}
export function DELETE(req: NextRequest, ctx: any) {
  return proxy(req, ctx)
}

