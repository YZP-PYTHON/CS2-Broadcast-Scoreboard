import type {
    Player,
    PlayerData
} from "@/types/cs2";

import type {
    PlayerMatchDamage
} from "@/types/match";

import type {
    Scoreboard
} from "@/types/scoreboard";

import {
    getTeamNameBySide
} from "@/lib/teamStatus";

export async function buildScoreboard(
    players: PlayerData,
    damages: Record<string, PlayerMatchDamage>,
    totalRounds: number,
): Promise<Scoreboard[]> {
    return Promise.all(
        Object.entries(players).map(async ([steamId, player]) => {
            const damage = damages[steamId];
            const kills = player.match_stats.kills;
            const deaths = player.match_stats.deaths;
            const teamName = await getTeamNameBySide(player.team);

            return {
                steamId,
                team: teamName ?? player.team,
                side: player.team,
                name: player.name,
                kills,
                deaths,
                damage: damage ? damage.damage : 0,
                assists: player.match_stats.assists,
                mvps: player.match_stats.mvps,
                score: player.match_stats.score,
                kd: deaths === 0 ? kills : kills / deaths,
                kpr: totalRounds === 0 ? 0 : kills / totalRounds,
                dpr: totalRounds === 0 ? 0 : deaths / totalRounds,
                adr: totalRounds === 0 ? 0 : damage ? damage.damage / totalRounds : 0,
                kast: 0,
            };
        }),
    );
}

export function groupByTeam(
    players:Scoreboard[]
){

    return players.reduce(
        (result,player)=>{

            if(!result[player.team]){
                result[player.team]=[];
            }


            result[player.team].push(player);


            return result;

        },
        {} as Record<string,Scoreboard[]>
    );

}