import { getScoreboard } from "@/lib/matchStateStore";
export async function GET(){
    return Response.json(getScoreboard());
}