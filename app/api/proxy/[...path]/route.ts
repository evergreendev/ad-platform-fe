import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_BASE_URL = process.env.API_BASE_URL;

type ProxyRouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handler(req: NextRequest, params: { path: string[] }) {
  const jwt = await getToken({ req });
  const accessToken = jwt?.accessToken;
  const accessTokenExpires = jwt?.accessTokenExpires;
  const isAccessTokenExpired =
    typeof accessTokenExpires === "number" && Date.now() >= accessTokenExpires;

  if (!accessToken || isAccessTokenExpired) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url || "");
  const upstream = `${API_BASE_URL}/api/${params.path.join("/")}${url.search}`;

  //Forward body only for methods that support it
  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : req.body;
  const contentType = req.headers.get("content-type");

  const upstreamRes = await fetch(upstream, {
    method: req.method,
    headers: {
      ...(contentType ? { "content-type": contentType } : {}),
      Authorization: `Bearer ${accessToken}`,
    },
    body,
    cache: "no-store",
  });

  const resBody = await upstreamRes.arrayBuffer();

  return new NextResponse(resBody, {
    status: upstreamRes.status,
    headers: {
      "content-type":
        upstreamRes.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(req: NextRequest, ctx: ProxyRouteContext) {
  const params = await Promise.resolve(ctx.params);
  return handler(req, params);
}
export async function POST(req: NextRequest, ctx: ProxyRouteContext) {
  const params = await Promise.resolve(ctx.params);
  return handler(req, params);
}
export async function PUT(req: NextRequest, ctx: ProxyRouteContext) {
  const params = await Promise.resolve(ctx.params);
  return handler(req, params);
}
export async function PATCH(req: NextRequest, ctx: ProxyRouteContext) {
  const params = await Promise.resolve(ctx.params);
  return handler(req, params);
}
export async function DELETE(req: NextRequest, ctx: ProxyRouteContext) {
  const params = await Promise.resolve(ctx.params);
  return handler(req, params);
}
