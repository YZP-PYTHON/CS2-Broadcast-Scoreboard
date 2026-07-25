"use client";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
export async function getMatchState() {

    const response = await fetch(`${base_url}/gameState`,{cache: "no-store"});
    
    const data = await response.json();

    return data;


    
}

export async function getTeamsState() {

const response = await fetch(`${base_url}/teams` ,{cache: "no-store"});

    const data = await response.json();
    
    return data;
    
}

export async function getScoreboard() {
    const response = await fetch(`${base_url}/scoreboard`,{cache: "no-store"});

    const data = await response.json();

    return data;

}

export async function getConfig() {

    const response = await fetch(`${base_url}/config`);

    const data = await response.json();

    return data;
}