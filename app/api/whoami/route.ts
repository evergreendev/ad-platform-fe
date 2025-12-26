import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: Request) {
    const jwt = await getToken({ req: req as any })

    const accessToken = (jwt as any)?.accessToken
    if (!accessToken) {
        return NextResponse.json({ error: "No access token (not signed in?)" }, { status: 401 })
    }

    const apiRes = await fetch("https://localhost:7227/whoami", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    })

    const text = await apiRes.text()
    return new NextResponse(text, {
        status: apiRes.status,
        headers: { "content-type": apiRes.headers.get("content-type") ?? "application/json" },
    })
}
