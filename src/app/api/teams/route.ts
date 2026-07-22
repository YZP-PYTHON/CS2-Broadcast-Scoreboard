import { getTeams } from "@/lib/teamStatus";
export async function GET(){
    return Response.json(getTeams());
}