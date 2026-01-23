import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const SIGNIN_URL = "/api/auth/signin";
const AUTH_BASE_URL = process.env.AUTH_BASE_URL;

async function handler(req: NextRequest) {
    const jwt = await getToken({req: req as any})
    const accessToken = (jwt)?.accessToken;

    if (!accessToken) {
        return NextResponse.redirect(new URL(SIGNIN_URL, req.url));
    }
    const upstream = `${AUTH_BASE_URL}/Users`;

    const res = await fetch(upstream, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    const resBody = await res.arrayBuffer();

    return new NextResponse(resBody, {
        status: res.status, headers: {
            "content-type": res.headers.get("content-type") ?? "application/json"
        }
    })
}

export async function GET(req: NextRequest) {
    return handler(req)
}
