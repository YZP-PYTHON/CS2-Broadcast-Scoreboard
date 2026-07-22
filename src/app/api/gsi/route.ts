import type { PlayerData } from "@/types/cs2";
import {
    updateRoundDamage,
    resetMatchDamage,
    getDamageStats
} from "@/lib/matchStats";
import { promises as fs } from "node:fs";
import path from "node:path";

import {buildScoreboard, groupByTeam} from "@/lib/mapper";

import {
    initTeamMapping,
    updateTeamScore,
    getTeams
} from "@/lib/teamStatus";

import { getMatchConfig } from "@/lib/config";
import type { matchStats } from "@/types/cs2";

import { updateScoreboard,
    getScoreboard,
    updateMatchState,
    getMatchState } from "@/lib/matchStateStore";

const config = await getMatchConfig();




export const runtime = "nodejs";

export async function POST(
    req: Request
) {

    const body = await req.json();

    // console.log("body", body)

    // console.log("player_data", body.allplayers)


    const player_data: PlayerData = body.allplayers;

    // console.log("config", config);

    const phase_countdowns = body.phase_countdowns

    const matchStats:matchStats = {
        "phase": phase_countdowns.phase,
        "phase_ends_in": phase_countdowns.phase_ends_in,
        "round": body.map.round
    }

    updateMatchState(matchStats);

    // console.log("matchStats", getMatchState());


    initTeamMapping(
        config,
        body.map
    );


    updateTeamScore(
        body.map
    );


    const teams =
        getTeams();

    // console.log("teams", teams);

    if (body.map?.round === 0) {
        resetMatchDamage();  // 新开比赛重置
        console.log("新对局，重置")
    }


    if (phase_countdowns.phase === "over" && phase_countdowns.phase_ends_in <= 1) {

        const stats = updateRoundDamage(
            body.map.round,
            player_data
        );

        // console.log("damage stats", stats);

    }



    const scoreboard = buildScoreboard(
        player_data,
        getDamageStats(),
        body.map.round
    );

    const gbt = groupByTeam(scoreboard);

    // console.log("scoreboard", scoreboard);

    updateScoreboard(gbt);

    // console.log("scoreboard", getScoreboard());

    
    

    return Response.json({
        ok: true
    });
}