"use client";
import { useState } from "react";
import { useEffect } from "react";
import { getMatchState,getTeamsState } from "@/lib/frontend/api";

export function formatTime(seconds: number): string {

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = parseInt(seconds % 60);


  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}


export default function Home() {
  const [time, setTime] = useState("0:10");
  const [team1, setTeam1] = useState("TeamA")
  const [team2, setTeam2] = useState("TeamB")
  const [score, setScore] = useState([0,1])
  const [pauesed, setPaused] = useState(false)
  const [showScorebord, setShowScoreboard] = useState(false)
  const [scoreColor,setScoreColor] = useState({
    win:
      process.env.NEXT_PUBLIC_SCORE_WIN 
      ?? "#ef4444",

    lose:
      process.env.NEXT_PUBLIC_SCORE_LOSE
      ?? "#3b82f6",

    draw:
      process.env.NEXT_PUBLIC_SCORE_DRAW
      ?? "#ffffff"
  });
  const [scoreColorNow ,setScoreColorNow] = useState({
    CT : "#ffffff",
    T : "#ffffff"
  })
  const [timeColor, setTimeColor] = useState("#ffffff")
  

  useEffect(() => {
    const timer = setInterval(async () => {

      try {

        const data = await getMatchState()

        console.log(data)

        const time_ends = await Number(data.phase_ends_in)

        const time = formatTime(time_ends)

        setTime(time)

        if (data === null){
          console.log("MatchState data is null")
          return;
          
        }

        if (data.phase === "over"){
          setTime("")
          setPaused(false)
          setShowScoreboard(true)
        }else if(data.phase === "paused"){
          setTime("PAUSED")
          setTimeColor("#ef4444")
          setPaused(true)
          setShowScoreboard(true)
        }else if(data.phase === "live" || data.phase ==="bomb"){
          setShowScoreboard(false)
        }
        else{
          setPaused(false)
          setTimeColor("#ffffff")
          setShowScoreboard(true)
        }

        const team = await getTeamsState()

        if(team === null){
          console.log("TeamState is null")
          return;
        }

        if(team.team1.side === "CT"){
          setScore([
            team.team1.score,
            team.team2.score
          ]);
          setTeam1(team.team1.name);
          setTeam2(team.team2.name);
          

        }else{
          setScore([
            team.team2.score,
            team.team1.score
          ]);
          setTeam1(team.team2.name);
          setTeam2(team.team1.name);
        }


        // console.log(data);

      } catch (err) {

        console.error("API error:", err);

      }

    }, 500);



    console.log(
      "score changed:",
      score
    );

    console.log(
      "color config:",
      scoreColor
    );


    if(score[0] > score[1]){
        setScoreColorNow({
          CT: scoreColor.win,
          T: scoreColor.lose
        });

    }else if(score[0] < score[1]){
      setScoreColorNow({
        CT: scoreColor.lose,
        T: scoreColor.win
      });

    }else{
      setScoreColorNow({
        CT: scoreColor.draw,
        T: scoreColor.draw
      });

    }

    return () => {
      clearInterval(timer);
    };

  },[score,scoreColor]);
  
  return (
    <div className="relative w-full h-full">
    {showScorebord &&(
    <div>
      <div className="absolute inset-0 bg-black blur-3xl z-1 opacity-[0.90]">
        
      </div>

      {/* 内容层 */}
      <div className={`relative z-10 flex-col items-center justify-center mt-[63px] h-screen `}>
        <div style={{color:timeColor}} className="text-[123px] [text-shadow:0_2px_10px_rgba(0,0,0,0.8)] flex fixed top-[73px] left-1/2 -translate-x-1/2 leading-none">
          {time}
        </div>
        <div className="relative w-screen h-[390px]">

          {/* 左队 */}
          <div className="absolute left-[200px] top-1/2 -translate-y-1/2 text-[96px] text-white">
            {team1}
          </div>

          {/* 比分 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center text-[103px] text-white gap-5">
              <div style={{color: scoreColorNow.CT}}>{score[0]}</div>
              <div>:</div>
              <div style={{color: scoreColorNow.T}}>{score[1]}</div>
            </div>
          </div>

          {/* 右队 */}
          <div className="absolute right-[200px] top-1/2 -translate-y-1/2 text-[96px] text-white">
            {team2}
          </div>

        </div>
        <div>
          <div>
            
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
      
    )}

      
  </div>
    
    
  );
}