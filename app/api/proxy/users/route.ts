import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_BASE_URL = process.env.AUTH_BASE_URL;

async function handler(req: NextRequest) {
  const jwt = await getToken({ req });
  const accessToken = jwt?.accessToken;
  const accessTokenExpires = jwt?.accessTokenExpires;
  const isAccessTokenExpired =
    typeof accessTokenExpires === "number" && Date.now() >= accessTokenExpires;

  if (!accessToken || isAccessTokenExpired) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const upstream = `${AUTH_BASE_URL}/Users`;

  const res = await fetch(upstream, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const resBody = await res.arrayBuffer();

  return new NextResponse(resBody, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(req: NextRequest) {
  return handler(req);
}
