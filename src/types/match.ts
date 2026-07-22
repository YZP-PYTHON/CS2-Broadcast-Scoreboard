export interface PlayerMatchDamage {
    steamId: string;

    name: string;

    damage: number; // 累计伤害

    rounds: number; // 参与统计的回合数
}

// types/match.ts

import type { Scoreboard } from "./scoreboard";

export interface TeamInfo {

    name: string;

    side: "CT" | "T";

    score: number;

    timeoutsRemaining: number;

}

export interface MatchState {

    // 比赛信息
    map: string;

    mode: string;

    phase: "warmup" | "live" | "intermission" | "gameover";

    round: number;

    ctScore: number;

    tScore: number;

    // 队伍信息
    teams: {

        CT: TeamInfo;

        T: TeamInfo;

    };

    // 所有选手
    scoreboard: Scoreboard[];

}