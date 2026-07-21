export interface Scoreboard {

    steamId: string;
    team:string;
    name:string;

    //basic stats
    kills:number;
    deaths:number;
    assists:number;
    mvps:number;
    score:number;

    //计算数据

    kd:number;
    kpr:number;
    dpr:number;
    adr:number;
    kast:number;



}

export interface DamageTracker {

    // 比赛累计伤害
    totalDamage:number;


    // 上一次收到的当前回合伤害
    lastRoundDamage:number;


    // 当前回合编号
    round:number;

}