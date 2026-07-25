export interface Scoreboard {

    steamId: string;
    name:string;
    team:string;
    side:"CT"|"T";

    //basic stats
    kills:number;
    deaths:number;
    assists:number;
    damage:number;
    mvps:number;
    score:number;

    //计算数据

    kd:number;
    kpr:number;
    dpr:number;
    adr:number;
    kast:number;



}

export interface Config {
    scoreColor: {
        win: string;
        lose: string;
        draw: string;
    };

    autoEnable: boolean;

    scoreboardItem: {
        key: string;
        name: string;
        fix: number;
    }[];
}

