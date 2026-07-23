"use client";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
export async function getMatchState() {

    const response = await fetch(`${base_url}/gameState`);
    
    const data = await response.json();

    return data;


    
}

export async function getTeamsState() {

    const response = await fetch(`${base_url}/teams`);

    const data = await response.json();
    
    return data;
    
}

export async function getScoreboard() {
    const response = await fetch(`${base_url}/scoreboard`);

    const data = await response.json();

    return data;

}