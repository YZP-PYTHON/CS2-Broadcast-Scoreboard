"use client";
// export const dynamic = "force-dynamic";
import { useState } from "react";
import { useEffect } from "react";
import { getMatchState,getTeamsState,getScoreboard } from "@/lib/frontend/api";
import { Scoreboard } from "@/components/Scoreboard";

import { useSearchParams } from "next/navigation";

import type { Config } from "@/types/scoreboard";

import { getConfig } from "@/lib/frontend/api";

export function formatTime(seconds: number): string {

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);


  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}


export default function Home() {
  const searchParams = useSearchParams();
  const [time, setTime] = useState("0:10");
  const [team1, setTeam1] = useState("TeamA")
  const [team2, setTeam2] = useState("TeamB")
  const [score, setScore] = useState([0,1])
  const [pauesed, setPaused] = useState(false)
  const [showScorebord, setShowScoreboard] = useState(false)

  const [scoreColorNow ,setScoreColorNow] = useState({
    CT : "#ffffff",
    T : "#ffffff"
  })
  
  const [timeColor, setTimeColor] = useState("#ffffff")

  const [scoreboard,setScoreboard] = useState([null,null]);

  const [isBlink, setIsBlink] = useState(false)

  const [config, setConfig] = useState<Config>({
    "font":"",
    "scoreColor": {
      "win": "#ef4444",
      "lose": "#3b82f6",
      "draw": "#ffffff"
    },
    "autoEnable": true,
    "scoreboardItem": [
      {
        "key": "kills",
        "name": "击杀",
        "fix": 0
      },
      {
        "key": "deaths",
        "name": "死亡",
        "fix": 0
      },
      {
        "key": "assists",
        "name": "助攻",
        "fix": 0
      },
      {
        "key": "adr",
        "name": "ADR",
        "fix": 1
      }
    ]
  });

  const [loading, setLoading] = useState(true);

  const [scoreboardConfig,setScoreboardConfig] = useState([
    {"key":"kills","name":"击杀","fix":0},
    {"key":"deaths","name":"死亡","fix":0},
    {"key":"assists","name":"助攻","fix":0},
    {"key":"adr","name":"ADR","fix":1}])

  useEffect(() => {
    async function init() {
        const cfg = await getConfig();

        // console.log(cfg)

        // URL 参数覆盖配置文件
        if (searchParams.get("autoEnable") !== null) {
            cfg.autoEnable = searchParams.get("autoEnable") === "true";
        }

        if (searchParams.get("scoreboardItem")) {
            cfg.scoreboardItem = JSON.parse(
                searchParams.get("scoreboardItem")!
            );
        }

        setConfig(cfg);
        setScoreboardConfig(cfg.scoreboardItem)
        setLoading(false);
        if (cfg.font.trim() !== "") {
          try {
              const font = new FontFace(
                  "ScoreboardFont",
                  `url(/font/${cfg.font})`
              );

              await font.load();

              // console.log("font",font.status);
              // console.log("font",font);

              document.fonts.add(font);

              document.documentElement.style.setProperty(
                  "--font-family",
                  '"ScoreboardFont", "Bahnschrift", "Segoe UI", "Microsoft YaHei", sans-serif'
              );
          } catch (e) {
              console.error("字体加载失败：", e);
              // 什么都不用做，CSS 默认字体会生效
          }
      }

    }

    init();
  }, [searchParams]);

  useEffect(() => {

    

    let running = true;

    const update = async () => {

      

      try {

        const data = await getMatchState()

        if (data === null){
          console.log("MatchState data is null")
          return;
          
        }

        // console.log("data",data)

        const time_ends = await Number(data.phase_ends_in)

        const time = formatTime(time_ends)

        setTime(time)

        if (data.phase === "over"){
          setTime("回合结束")
          setPaused(false)
          // setIsBlink(true)
          setShowScoreboard(true)
          setTimeColor("#ffffff")
        }else if(data.phase === "paused"){
          setTime("PAUSED")
          setTimeColor("#ef4444")
          setPaused(true)
          setIsBlink(true)
          setShowScoreboard(true)
        }else if(data.phase === "live" || data.phase ==="bomb" || data.phase === "defuse" || data.phase === "warmup"){
          if(config.autoEnable){
            setShowScoreboard(false)
          }else{
            setShowScoreboard(true)
          }
          // console.log("live")
          setIsBlink(false)
          setPaused(false)
          setTimeColor("#ffffff")
        }else if(data.phase === "freezetime" && time_ends <= 5){
          if(config.autoEnable){
            setShowScoreboard(false)
          }else{
            setShowScoreboard(true)
          }
          setPaused(false)
          setIsBlink(false)
          setTimeColor("#ffffff")

        }
        else{
          // console.log("111")
          setPaused(false)
          setIsBlink(false)
          setTimeColor("#ffffff")
          setShowScoreboard(true)
        }

        const team = await getTeamsState()

        if (!team) {
            console.log("TeamState is null");
            return;
        }
        if (!team?.team1 || !team?.team2) {

          console.log("TeamState is invalid");

          return;

        }

        

        const scoreboard = await getScoreboard()

        if (scoreboard === null){
          console.log("Scoreboard is null")
          return;
        }

        if(team.team1.side === "CT"){
          setScore([
            team.team1.score,
            team.team2.score
          ]);
          setTeam1(team.team1.name);
          setTeam2(team.team2.name);
          setScoreboard([
            scoreboard[team.team1.name],
            scoreboard[team.team2.name]
          ])
          

        }else{
          setScore([
            team.team2.score,
            team.team1.score
          ]);
          setTeam1(team.team2.name);
          setTeam2(team.team1.name);

          setScoreboard([
            scoreboard[team.team2.name],
            scoreboard[team.team1.name]
          ])
        }

      // console.log(scoreboard);

        // console.log(data);

      } catch (err) {

        console.error("API error:", err);

      }
      if (running) {
            setTimeout(update, 500);
      }

    };

    

    update();


    return () => {
        running = false;
    };

  },[config,loading])
  

  useEffect(() => {

    if(score[0] > score[1]){
        setScoreColorNow({
          CT: config.scoreColor.win,
          T: config.scoreColor.lose
        });

    }else if(score[0] < score[1]){
      setScoreColorNow({
        CT: config.scoreColor.lose,
        T: config.scoreColor.win
      });

    }else{
      setScoreColorNow({
        CT: config.scoreColor.draw,
        T: config.scoreColor.draw
      });

    }
    // console.log(showScorebord);

  },[score,config,showScorebord]);

  return (
    <div className="relative w-full h-full">

    <div className={`${showScorebord ? "scoreboard-show" : "scoreboard-hide"}`}>
      <div className="absolute inset-0 bg-black blur-3xl z-1 opacity-[0.90]">
        
      </div>

      {/* 内容层 */}
      <div className={`relative z-10 flex-col items-center justify-center mt-[63px] h-screen `}>
        <div style={{color:timeColor}} className={`text-[123px] [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]
         flex fixed top-[73px] left-1/2 -translate-x-1/2 leading-none 
         ${isBlink ? "animate-[blink_1000ms_steps(1)_infinite]" : ""} ${showScorebord?"timmer-text-show":"timmer-text-hide"}`}>
          
          <span style={{color:timeColor}} className={`${isBlink
              ? "animate-[blink_1000ms_steps(1)_infinite]"
              : ""}
            `}
          >
            {time}
          </span>
          
        </div>
        <div className={`relative w-screen h-[390px] ${showScorebord?"score-text-show":"score-text-hide"}`}>

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
        <div >
          <div className={` absolute left-[119px] top-[285px] ${showScorebord ? "" : "table-hide" } `}>
            <Scoreboard players = {scoreboard[0]} data = {scoreboardConfig} color={"from-blue-600 to-blue-400"} animate={showScorebord} />
          </div>
          <div className={`absolute right-[120px] top-[285px] ${showScorebord ? "" : "table-hide" } `}>
            <Scoreboard players= {scoreboard[1]} data={scoreboardConfig} color={"bg-gradient-to-r from-red-600 to-red-400"} animate={showScorebord}/>
          </div>
        </div>
      </div>
    </div>
  </div>
    
    
  );
}