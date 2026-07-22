import fs from "fs";
import path from "path";


interface TeamState {

    name:string;

    side:"CT"|"T";

    score:number;

}


const teams = {

    team1:null as TeamState | null,

    team2:null as TeamState | null

};



let initialized = false;


/**
 * 第一次GSI初始化
 */
export function initTeamMapping(
    config:any,
    map:any
){

    if(initialized)
        return;



    const ctName =
        map.team_ct.name;


    const tName =
        map.team_t.name;



    if(config.team.team1.init_side === "CT"){

        teams.team1 = {

            name:
                config.team.team1.name,

            side:"CT",

            score:
                map.team_ct.score

        };


        teams.team2 = {

            name:
                config.team.team2.name,

            side:"T",

            score:
                map.team_t.score

        };

    }
    else {


        teams.team1 = {

            name:
                config.team.team1.name,

            side:"T",

            score:
                map.team_t.score

        };


        teams.team2 = {

            name:
                config.team.team2.name,

            side:"CT",

            score:
                map.team_ct.score

        };

    }


    initialized=true;


}


export function updateTeamScore(
    map:any
){

    if(!initialized)
        return;



    for(
        const team of [
            teams.team1,
            teams.team2
        ]
    ){

        if(!team)
            continue;


        if(team.side==="CT"){

            team.score =
                map.team_ct.score;

        }
        else {

            team.score =
                map.team_t.score;

        }

    }

}

export function swapSides(){

    if(!teams.team1 || !teams.team2)
        return;


    const side =
        teams.team1.side;


    teams.team1.side =
        teams.team2.side;


    teams.team2.side =
        side;

}

export function getTeams() {

    return teams;

}

export function getTeamNameBySide(
    side:"CT"|"T"
){

    if(!teams.team1 || !teams.team2)
        return null;


    if(
        teams.team1.side === side
    ){
        return teams.team1.name;
    }


    if(
        teams.team2.side === side
    ){
        return teams.team2.name;
    }


    return null;
}