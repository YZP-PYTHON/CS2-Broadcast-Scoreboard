
import { promises as fs } from "node:fs";
import path from "node:path";

export interface TeamState {
    name: string;
    gsiName: string;
    side: "CT" | "T";
    score: number;
}

interface TeamStore {
    version: 1;
    initialized: boolean;
    teams: {
        team1: TeamState | null;
        team2: TeamState | null;
    };
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "team-state.json");

const teams: TeamStore["teams"] = {
    team1: null,
    team2: null,
};

let initialized = false;
let loaded = false;
let loadPromise: Promise<void> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function snapshot(): TeamStore {
    return {
        version: 1,
        initialized,
        teams: structuredClone(teams),
    };
}

function isValidTeam(team: unknown): team is TeamState {
    if (!team || typeof team !== "object") return false;

    const value = team as Partial<TeamState>;

    return (
        typeof value.name === "string" &&
        typeof value.gsiName === "string" &&
        (value.side === "CT" || value.side === "T") &&
        typeof value.score === "number" &&
        Number.isFinite(value.score)
    );
}

/**
 * 从磁盘恢复队伍状态。
 * 多个并发请求只会执行一次读取。
 */
async function loadTeamState(): Promise<void> {
    if (loaded) return;

    if (!loadPromise) {
        loadPromise = (async () => {
            try {
                const content = await fs.readFile(DATA_FILE, "utf8");
                const store = JSON.parse(content) as TeamStore;

                if (
                    store.version !== 1 ||
                    !store.teams ||
                    !isValidTeam(store.teams.team1) ||
                    !isValidTeam(store.teams.team2) ||
                    typeof store.initialized !== "boolean"
                ) {
                    throw new Error("队伍持久化文件格式无效");
                }

                teams.team1 = store.teams.team1;
                teams.team2 = store.teams.team2;
                initialized = store.initialized;
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                    teams.team1 = null;
                    teams.team2 = null;
                    initialized = false;
                } else {
                    throw error;
                }
            }

            loaded = true;
        })();
    }

    try {
        await loadPromise;
    } finally {
        loadPromise = null;
    }
}

/**
 * 将当前状态写入磁盘。
 * 写入队列可避免并发保存互相覆盖。
 */
function saveTeamState(): Promise<void> {
    const store = snapshot();

    const write = writeQueue.catch(() => {}).then(async () => {
        await fs.mkdir(DATA_DIR, { recursive: true });

        const tempFile = `${DATA_FILE}.tmp`;

        await fs.writeFile(
            tempFile,
            JSON.stringify(store, null, 2),
            "utf8",
        );

        await fs.rename(tempFile, DATA_FILE);
    });

    writeQueue = write;
    return write;
}

/**
 * 首次 GSI 初始化。
 * 如果已从磁盘恢复队伍，则不覆盖已保存的映射。
 */
export async function initTeamMapping(
    config: any,
    map: any,
): Promise<void> {
    await loadTeamState();

    if (initialized) return;

    const ctName = map.team_ct?.name;
    const tName = map.team_t?.name;

    if (!ctName || !tName) return;

    const team1Side: "CT" | "T" =
        config.team.team1.init_side === "CT" ? "CT" : "T";

    const team2Side: "CT" | "T" =
        team1Side === "CT" ? "T" : "CT";

    const team1IsCT = team1Side === "CT";
    const team2IsCT = team2Side === "CT";

    teams.team1 = {
        name: config.team.team1.name,
        gsiName: team1IsCT ? ctName : tName,
        side: team1Side,
        score: Number(
            team1IsCT ? map.team_ct.score : map.team_t.score,
        ) || 0,
    };

    teams.team2 = {
        name: config.team.team2.name,
        gsiName: team2IsCT ? ctName : tName,
        side: team2Side,
        score: Number(
            team2IsCT ? map.team_ct.score : map.team_t.score,
        ) || 0,
    };

    initialized = true;
    await saveTeamState();
}

/**
 * 根据 GSI 的 CT 队伍名称同步阵营。
 */
function syncTeamSides(map: any): boolean {
    if (!teams.team1 || !teams.team2) return false;

    const ctName = map.team_ct?.name;
    if (!ctName) return false;

    const oldTeam1Side = teams.team1.side;
    const oldTeam2Side = teams.team2.side;

    if (ctName === teams.team1.gsiName) {
        teams.team1.side = "CT";
        teams.team2.side = "T";
    } else if (ctName === teams.team2.gsiName) {
        teams.team1.side = "T";
        teams.team2.side = "CT";
    }

    return (
        oldTeam1Side !== teams.team1.side ||
        oldTeam2Side !== teams.team2.side
    );
}

/**
 * 更新比分与阵营。
 * 只有状态确实发生变化时才写盘。
 */
export async function updateTeamScore(map: any): Promise<void> {
    await loadTeamState();

    if (!initialized || !teams.team1 || !teams.team2) return;

    let changed = syncTeamSides(map);

    for (const team of [teams.team1, teams.team2]) {
        const newScore = Number(
            team.side === "CT"
                ? map.team_ct?.score
                : map.team_t?.score,
        );

        if (!Number.isFinite(newScore)) continue;

        if (team.score !== newScore) {
            team.score = newScore;
            changed = true;
        }
    }

    if (changed) {
        await saveTeamState();
    }
}

/**
 * 手动交换双方阵营，并持久化。
 * 后续 GSI 更新仍会按照实际队伍名称校正阵营。
 */
export async function swapSides(): Promise<void> {
    await loadTeamState();

    if (!teams.team1 || !teams.team2) return;

    const side = teams.team1.side;
    teams.team1.side = teams.team2.side;
    teams.team2.side = side;

    await saveTeamState();
}

/**
 * 获取当前队伍状态。
 */
export async function getTeams() {
    await loadTeamState();
    return structuredClone(teams);
}

/**
 * 根据当前阵营获取自定义队伍名称。
 */
export async function getTeamNameBySide(
    side: "CT" | "T",
): Promise<string | null> {
    await loadTeamState();

    if (!teams.team1 || !teams.team2) return null;

    if (teams.team1.side === side) return teams.team1.name;
    if (teams.team2.side === side) return teams.team2.name;

    return null;
}

/**
 * 显式重置队伍状态。
 * 仅在确认开始新比赛时调用。
 */
export async function resetTeamState(): Promise<void> {
    await loadTeamState();

    teams.team1 = null;
    teams.team2 = null;
    initialized = false;

    await saveTeamState();
}
