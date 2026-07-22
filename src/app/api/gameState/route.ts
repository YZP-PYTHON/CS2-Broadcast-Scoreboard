import { getMatchState } from "@/lib/matchStateStore";
export async function GET(){
    return Response.json(getMatchState());
}