export function Scoreboard({players,data,color}){

    console.log("scoreboard",data);
    console.log("scoreboard",Array.isArray(data));
    console.log("scoreboard",typeof data);
    return(
        <div className="">
            <table className={`w-[790px] border-separate border-spacing-0
            text-white text-[35px] border-white/60 mb-[30px] rounded-3xl 
            shadow-[0_0_40px_rgba(0,0,0,0.4)] bg-[#001A35]/80 border overflow-hidden`}>
            <thead className={`bg-gradient-to-r ${color} rounded-t-3xl`}>
                <tr className="border-b border-white/20 py-2">
                <th className="px-[50px] py-3 text-left rounded-tl-3xl">选手</th>
                {data?.slice(0, 5).map((item)=>(
                    <th className="px-4 py-3 text-center" key={item.key}>{item.name}</th>
                    
                ))}
                
                </tr>
            </thead>

                <tbody className="bg-gradient-to-r from-white/5 to-transparent ">
                    
                        
                    {players?.map((player) => (
                        <tr
                            key={player.steamId}
                            className="relative
                            after:absolute
                            after:left-5
                            after:right-5
                            after:top-0
                            after:h-[2pt]
                            after:bg-black/50"
                        >
                            
                            <td className="px-5 py-6">{player.name}</td>
                            {data?.slice(0,5).map((item)=>(
                                <td className="px-5 py-6 text-center" key={item.key}>
                                    {player[item.key]?.toFixed(Number(item.fix))}
                                    {console.log("scoreboard",item.fix)}
                                </td>
                                
                            ))}
                            
                           
                        </tr>
                    ))}
                        
                   
                    
                </tbody>
            </table>
        </div>
    )
}