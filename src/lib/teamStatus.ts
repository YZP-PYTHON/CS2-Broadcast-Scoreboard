interface TeamState {

    name:string;

    gsiName:string;

    side:"CT"|"T";

    score:number;

}


const teams = {

    team1:null as TeamState | null,

    team2:null as TeamState | null

};



let initialized = false;


function syncTeamSides(
    map:any
){

    if(!teams.team1 || !teams.team2)
        return;


    const ctName = map.team_ct.name;
    const tName = map.team_t.name;


    if(
        ctName === teams.team1.gsiName &&
        tName === teams.team2.gsiName
    ){
        teams.team1.side = "CT";
        teams.team2.side = "T";
        return;
    }


    if(
        ctName === teams.team2.gsiName &&
        tName === teams.team1.gsiName
    ){
        teams.team2.side = "CT";
        teams.team1.side = "T";
        return;
    }

}


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


    const team1Side =
        config.team.team1.init_side === "CT"
            ? "CT"
            : "T";

    const team2Side =
        config.team.team2.init_side === "CT"
            ? "CT"
            : "T";

    const team1GsiName =
        team1Side === "CT"
            ? ctName
            : tName;

    const team2GsiName =
        team2Side === "CT"
            ? ctName
            : tName;

    teams.team1 = {

        name:
            config.team.team1.name,

        gsiName:
            team1GsiName,

        side: team1Side,

        score:
            team1Side === "CT"
                ? map.team_ct.score
                : map.team_t.score

    };


    teams.team2 = {

        name:
            config.team.team2.name,

        gsiName:
            team2GsiName,

        side: team2Side,

        score:
            team2Side === "CT"
                ? map.team_ct.score
                : map.team_t.score

    };


    initialized=true;


}


export function updateTeamScore(
    map:any
){

    if(!initialized)
        return;


    syncTeamSides(map);


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