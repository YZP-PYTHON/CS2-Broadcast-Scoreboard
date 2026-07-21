export interface MatchStats {
    kills: number;
    assists: number;
    deaths: number;
    mvps: number;
    score: number;
}


export interface Player {
    name: string;
    clan?: string;
    observer_slot: number;
    team: "T" | "CT";

    state: {
        health: number;
        armor: number;
        helmet: boolean;
        flashed: number;
        smoked: number;
        burning: number;
        money: number;
        round_kills: number;
        round_killhs: number;
        round_totaldmg: number;
        equip_value: number;
    };

    match_stats: MatchStats;

    weapons: Record<string, unknown>;
}


export interface PlayerData {
    [steamId: string]: Player;
}