export interface PlayerMatchDamage {
    steamId: string;

    name: string;

    damage: number; // 累计伤害

    rounds: number; // 参与统计的回合数
}