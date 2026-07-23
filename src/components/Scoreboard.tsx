export function Scoreboard(players:any,data:string[],color:string){
    return(
        <div>
            <table className="w-full border-collapse text-white">
            <thead>
                <tr className="border-b border-white/20">
                <th className="px-4 py-2 text-left">玩家</th>
                <th className="px-4 py-2 text-center">K</th>
                <th className="px-4 py-2 text-center">A</th>
                <th className="px-4 py-2 text-center">D</th>
                <th className="px-4 py-2 text-center">ADR</th>
                </tr>
            </thead>

            <tbody>
                {players.map((player) => (
                <tr
                    key={player.steamId}
                    className="border-b border-white/10 hover:bg-white/5"
                >
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2 text-center">{player.kills}</td>
                    <td className="px-4 py-2 text-center">{player.assists}</td>
                    <td className="px-4 py-2 text-center">{player.deaths}</td>
                    <td className="px-4 py-2 text-center">
                    {player.adr.toFixed(1)}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}