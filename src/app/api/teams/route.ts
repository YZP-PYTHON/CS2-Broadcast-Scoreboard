import { getTeams } from "@/lib/teamStatus";
export async function GET(){
    return Response.json( await getTeams());
}