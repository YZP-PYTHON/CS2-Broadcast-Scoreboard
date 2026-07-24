# CS2-Broadcast-Scoreboard

#### 一个基于 GSI 和 React 的 CS2 比赛直播记分板，允许用户通过修改配置文件和查询参数来自定义自己的记分板。

# 如何使用
- ### 安装GSI配置
  - 在steam库中浏览CS2游戏文件，找到 `./game/csgo/cfg `
  - 将仓库中的 `gamestate_integration_scorebord.cfg` 移动到该文件夹

- ### 设置OBS浏览器采集
  - 在OBS添加一个浏览器源
  - 设置url为 `http://127.0.0.1:3000`
  - 设置宽度和高度分别为1920和1080
  - 留空自定义CSS部分
  - 将整个源放置在你的游戏画面之上

  - _Vmix 软件设置同理_


---

# 配置部分

- ### `config/match.json` 主要是后端配置，队伍的队名在这里设置
```json
{
    "team" : {
        "team1":{
            "name": "Tedam A", // 队名
            "init_side": "CT" // 比赛开始时的阵营
        },
        "team2":{
            "name": "Team B", // 队名
            "init_side": "T" // 比赛开始时的阵营
        } 
    }
}
```

- ### `.env.local`前端部分，面板自定义部分在此
```env
NEXT_PUBLIC_SCORE_WIN= "#ef4444"  // 分数更高方比分颜色
NEXT_PUBLIC_SCORE_LOSE= "#3b82f6" // 分数更低方比分颜色
NEXT_PUBLIC_SCORE_DRAW= "#ffffff" // 平局时颜色（如果判断异常也是这个颜色）
NEXT_PUBLIC_BASE_URL = "http://127.0.0.1:3000/api" // 后端URL 不要动
NEXT_PUBLIC_BASE_AUTO_ENABLE = true // 计分板在一局结束，热身，开始前将自动启动，true为开启，false为关闭
NEXT_PUBLIC_BASE_SCOREBOARD_ITEM = [{"key":"kills","name":"击杀","fix":0},{"key":"deaths","name":"死亡","fix":0},{"key":"assists","name":"助攻","fix":0},{"key":"adr","name":"ADR","fix":1}] // 玩家数据榜的配置 一定要保持在同一行，不要有换行
```
### 计分板自定义详细配置
* #### `.env.local`中的`NEXT_PUBLIC_BASE_SCOREBOARD_ITEM`

```json
[
    {"key":"kills","name":"击杀","fix":0}, // key 为数据匹配名 name为显示名 fix 设置数字保留几位小数
    {"key":"deaths","name":"死亡","fix":0},
    {"key":"assists","name":"助攻","fix":0},
    {"key":"adr","name":"ADR","fix":1}
] //复制进入.env.local一定要变成一行，如果多行会读取错误
```

#### 玩家数据榜中`key`项配置
| 字段 | 示例值 | 含义 | 说明 |
|---|---|---|---|
| name | aaa| 玩家名称 | 玩家在游戏中的昵称 常驻显示，不建议配置|
| steamId | 7xxxxxxxxxxxxx | Steam ID | 玩家唯一 Steam64 ID 太长了，不建议配置|
| team | Team A | 队伍名称 | 玩家所属队伍 会自动分组展示，不建议配置|
| side | CT | 当前阵营 | 当前半场所在阵营（CT 或 T）会自动分组展示，不建议配置 |
| kills | 6 | 击杀数 | 玩家本场比赛累计击杀次数 |
| deaths | 3 | 死亡数 | 玩家本场比赛累计死亡次数 |
| assists | 1 | 助攻数 | 玩家本场比赛累计助攻次数 |
| damage | 415 | 总伤害 | 玩家造成的累计伤害总量 |
| adr | 103.75 | 平均每回合伤害（Average Damage per Round） | 总伤害 ÷ 回合数，衡量持续输出能力 |
| kd | 2 | 击杀死亡比（Kill/Death Ratio） | 击杀数 ÷ 死亡数，越高代表换人效率越高 |
| kpr | 1.5 | 每回合击杀（Kills Per Round） | 击杀数 ÷ 回合数 |
| dpr | 0.75 | 每回合死亡（Deaths Per Round） | 死亡数 ÷ 回合数 |
| kast | 0 | KAST评分 | 回合中完成击杀、助攻、生存或被交易击杀的比例 |
| score | 15 | 游戏积分 | CS2计分板中的 Score 数值 |
| mvps | 2 | MVP次数 | 获得回合 MVP 的次数 |  


- ### 浏览器parms部分配置

   <details>
   <summary>点一下</summary>
     作者太懒了，浏览器parms没有多少配置，如有其他需要请提issue
   </details>

  - `autoEnable` 同 `NEXT_PUBLIC_BASE_AUTO_ENABLE` 计分板在一局结束，热身，开始前将自动启动，true为开启，false为关闭

  - `scoreboardItem` 同 `NEXT_PUBLIC_BASE_SCOREBOARD_ITEM` [详细配置](#计分板自定义详细配置)