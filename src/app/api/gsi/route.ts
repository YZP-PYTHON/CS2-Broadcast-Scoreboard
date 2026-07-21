import type { PlayerData } from "@/types/cs2";
import {
    updateRoundDamage,
    resetMatchDamage
} from "@/lib/matchStats";


export const runtime = "nodejs";

export async function POST(
    req: Request
) {

    const body = await req.json();

    // console.log("body", body)

    // console.log("player_data", body.allplayers)


    const player_data: PlayerData = body.allplayers;

    
    Object.entries(player_data).forEach(
        ([steamId, player]) => {

            console.log(
                steamId,
                player.name,
                player.match_stats.kills
            );

        }
    );

    if (body.map?.round === 0) {
        resetMatchDamage();  // 新开比赛重置
        console.log("新对局，重置")
    }

    if (body.round?.phase === "over") {

        const stats = updateRoundDamage(
            body.map.round,
            player_data
        );

        console.log("damage stats", stats);

    }



    

    return Response.json({
        ok: true
    });
}