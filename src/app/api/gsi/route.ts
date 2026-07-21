export const runtime = "nodejs";

export async function POST(
    req: Request
) {

    const body = await req.json();

    console.log("GSI payload:", body);

    return Response.json({
        ok: true
    });
}