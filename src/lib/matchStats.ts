import type { PlayerData } from "@/types/cs2";
import type { PlayerMatchDamage } from "@/types/match";

const damageStats: Record<string, PlayerMatchDamage> = {};

// 已统计到的回合号
let lastCountedRound = -1;

/**
 * 回合结束时累计伤害（每回合仅统计一次）
 */
export function updateRoundDamage(
    round: number,
    players: PlayerData
) {

    // 已经统计过该回合
    if (round === lastCountedRound) {
        return damageStats;
    }

    lastCountedRound = round;

    Object.entries(players).forEach(
        ([steamId, player]) => {

            if (!damageStats[steamId]) {
                damageStats[steamId] = {
                    steamId,
                    name: player.name,
                    damage: 0,
                    rounds: 0
                };
            }

            damageStats[steamId].name = player.name;

            damageStats[steamId].damage +=
                player.state.round_totaldmg;

            damageStats[steamId].rounds++;
        }
    );

    return damageStats;
}

/**
 * 获取当前累计数据
 */
export function getDamageStats() {
    return damageStats;
}

/**
 * 新比赛开始时重置
 */
export function resetMatchDamage() {

    Object.keys(damageStats).forEach(
        key => delete damageStats[key]
    );

    lastCountedRound = -1;
}