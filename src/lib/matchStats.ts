import { promises as fs } from "node:fs";
import path from "node:path";
import type { PlayerData } from "@/types/cs2";
import type { PlayerMatchDamage } from "@/types/match";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "match-damage.json");

let damageStats: Record<string, PlayerMatchDamage> = {};
let lastCountedRound = -1;
let loaded = false;
let writeQueue: Promise<void> = Promise.resolve();

interface DamageStore {
    lastCountedRound: number;
    damageStats: Record<string, PlayerMatchDamage>;
}

// 启动后首次使用时，从文件恢复数据
async function loadDamageStats(): Promise<void> {
    if (loaded) return;

    try {
        const content = await fs.readFile(DATA_FILE, "utf8");
        const store = JSON.parse(content) as DamageStore;

        damageStats = store.damageStats ?? {};
        lastCountedRound = store.lastCountedRound ?? -1;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
        }

        damageStats = {};
        lastCountedRound = -1;
    }

    loaded = true;
}

// 串行写入，避免多次保存相互覆盖
function saveDamageStats(): Promise<void> {
    const snapshot: DamageStore = {
        lastCountedRound,
        damageStats: structuredClone(damageStats)
    };

    writeQueue = writeQueue.then(async () => {
        await fs.mkdir(DATA_DIR, { recursive: true });

        const tempFile = `${DATA_FILE}.tmp`;
        await fs.writeFile(
            tempFile,
            JSON.stringify(snapshot, null, 2),
            "utf8"
        );
        await fs.rename(tempFile, DATA_FILE);
    });

    return writeQueue;
}

// 统计回合伤害并持久化
export async function updateRoundDamage(
    round: number,
    players: PlayerData
): Promise<Record<string, PlayerMatchDamage>> {
    await loadDamageStats();

    if (round === lastCountedRound) {
        return damageStats;
    }

    for (const [steamId, player] of Object.entries(players)) {
        if (!damageStats[steamId]) {
            damageStats[steamId] = {
                steamId,
                name: player.name,
                damage: 0,
                rounds: 0
            };
        }

        const stat = damageStats[steamId];
        stat.name = player.name;
        stat.damage += player.state.round_totaldmg ?? 0;
        stat.rounds++;
    }

    lastCountedRound = round;
    await saveDamageStats();

    return damageStats;
}

// 获取当前统计数据
export async function getDamageStats() {
    await loadDamageStats();
    return damageStats;
}

// 重置比赛统计并持久化
export async function resetMatchDamage(): Promise<void> {
    await loadDamageStats();

    damageStats = {};
    lastCountedRound = -1;

    await saveDamageStats();
}