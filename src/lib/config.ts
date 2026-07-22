import { promises as fs } from "node:fs";
import path from "node:path";

const configPath =
    path.join(
        process.cwd(),
        "config",
        "match.json"
    );


export interface MatchConfig {

    teams:{
        [key:string]:{

            name:string;

            players:string[];

        }
    };


    starting_side:{
        [key:string]:
        "CT"|"T";
    };

}


export async function getMatchConfig(): Promise<MatchConfig> {


    const file = await
        fs.readFile(
            configPath,
            "utf-8"
        );


    return JSON.parse(file);

}