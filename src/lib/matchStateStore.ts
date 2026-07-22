import type { Scoreboard } from "@/types/scoreboard";
import type { matchStats } from "@/types/cs2";

let scoreboardStore:any = {};

export function updateScoreboard(
    newScoreboard: any
) {

    scoreboardStore = newScoreboard;
}

export function getScoreboard() {
    return scoreboardStore;
}

let matchStateStore: matchStats = {
    phase: "warmup",
    phase_ends_in: 0,
    round: 0
};

export function updateMatchState(
    newMatchState: matchStats
) {

    matchStateStore = newMatchState;
}

export function getMatchState() {
    return matchStateStore;
}
