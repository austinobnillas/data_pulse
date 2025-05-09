import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const backendUrl = process.env.SMART_DASHBOARD_API_URL;

        if (!backendUrl) {
            console.error("Missing SMART_DASHBOARD_API_URL in environment");
            return NextResponse.json({ msg: "Server misconfiguration." }, { status: 500 });
        }

        const cookie = req.headers.get("cookie");

        const res = await fetch(`${backendUrl}/api/notes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(cookie ? { cookie } : {}),
            },
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(
                {
                    msg: error.msg || "Note Retrieval failed",
                    errors: error.errors || [],
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log(data);

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error("get notes route error:", error);
        return NextResponse.json(
            { msg: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
