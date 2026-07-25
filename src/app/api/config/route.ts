import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
    try {
        const file = path.join(
            process.cwd(),
            "config",
            "frontend.json"
        );

        const text = await readFile(file, "utf8");

        return Response.json(JSON.parse(text));
    } catch (err) {
        console.log(err)
        return Response.json(
            { error: "Failed to read config" },
            { status: 500 }
        );
    }
}