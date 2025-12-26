import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const API_BASE_URL = process.env.API_BASE_URL;
const SIGNIN_URL = "/api/auth/signin"

async function handler(req: NextRequest, params: { path: string[] }) {
    const jwt = await getToken({req: req as any})
    const accessToken = (jwt)?.accessToken;

    if (!accessToken) {
        return NextResponse.redirect(new URL(SIGNIN_URL, req.url));
    }

    const url = new URL(req.url||"");
    const upstream = `${API_BASE_URL}/${params.path.join("/")}${url.search}`;

    //Forward body only for methods that support it
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : req.body;

    const upstreamRes = await fetch(upstream, {
        method: req.method,
        headers: {
            ...(req.headers
            ? { "content-type": req.headers.get("content-type")! }
            : {}),
            Authorization: `Bearer ${accessToken}`,
        },
        body,
        cache: "no-store",
    })

    const resBody = await upstreamRes.arrayBuffer();

    return new NextResponse(resBody, {
        status: upstreamRes.status,
        headers: {
            "content-type": upstreamRes.headers.get("content-type") ?? "application/json"
        }
    })
}

export async function GET(req: NextRequest, ctx: any) {
    const params = await Promise.resolve(ctx.params)
    return handler(req, params)
}
export async function POST(req: NextRequest, ctx: any) {
    const params = await Promise.resolve(ctx.params)
    return handler(req, params)
}
export async function PUT(req: NextRequest, ctx: any) {
    const params = await Promise.resolve(ctx.params)
    return handler(req, params)
}
export async function PATCH(req: NextRequest, ctx: any) {
    const params = await Promise.resolve(ctx.params)
    return handler(req, params)
}
export async function DELETE(req: NextRequest, ctx: any) {
    const params = await Promise.resolve(ctx.params)
    return handler(req, params)
}
