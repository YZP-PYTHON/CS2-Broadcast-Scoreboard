# CS2-Broadcast-Scoreboard

#### 一个基于 GSI 和 React 的 CS2 比赛直播记分板，允许用户通过修改配置文件和查询参数来自定义自己的记分板。

## [English](README.md) | 简体中文

# 效果预览

### 界面
<img width="1920" height="1080" alt="Screenshot 2026-07-26 12-59-41" src="https://github.com/user-attachments/assets/189c7c2d-2bdc-4a26-b88a-f68f2fa3516d" />

### 开启动画

<img width="640" height="360" alt="2026-07-26 12-59-432 00_00_00-00_00_30" src="https://github.com/user-attachments/assets/08eb7133-f5f0-462d-8e9b-64d2b232193a" />

### 结束动画

<img width="640" height="360" alt="2026-07-26 12-59-43_00000000 00_00_00-00_00_30" src="https://github.com/user-attachments/assets/41650d65-9c9d-4775-ba88-a3d091988d5a" />

---
# 如何使用
- ### 安装GSI配置
  - 在steam库中浏览CS2游戏文件，找到 `./game/csgo/cfg `
  - 将仓库中的 `gamestate_integration_scorebord.cfg` 移动到该文件夹

- ### 下载程序
  - 从[release](https://github.com/YZP-PYTHON/CS2-Broadcast-Scoreboard/releases/latest)中下载最新版程序
  - 下载完成后解压，进入release文件夹中，双击start.bat文件(windows)或在命令行中输入bash start.sh(Linux)

- ### 设置OBS浏览器采集
  - 在OBS添加一个浏览器源
  - 设置url为 `http://127.0.0.1:3000`
  - 设置宽度和高度分别为1920和1080
  - 留空自定义CSS部分
  - 将整个源放置在你的游戏画面之上

  - _Vmix 软件设置同理_


---

# 配置部分

- ### `config/match.json` 主要是后端配置，队伍的队名在这里设置 这一部分需在程序启动前配置好
```json
{
    "team" : {
        "team1":{
            "name": "Team A", // 队名
            "init_side": "CT" // 比赛开始时的阵营
        },
        "team2":{
            "name": "Team B", // 队名
            "init_side": "T" // 比赛开始时的阵营
        } 
    }
}
```

- ### `/config/frontend.json`前端部分，面板自定义部分在此
```json
{
    "font": "SourceHanSansSC-Normal.otf",  // 字体设置，需要将字体文件放到/public/font 
    "scoreColor": {   // 比分颜色设置
      "win": "#ef4444",  // 比分较高一方颜色
      "lose": "#3b82f6", // 比分较低一方颜色
      "draw": "#ffffff" // 平局颜色
    },
    "autoEnable": true,  // 计分板自动显示，如开启将会在一局结束，暂停，开始前显示计分板
    "scoreboardItem": [  // 计分板玩家数据显示配置项，详情见下
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
}
```
### 计分板自定义详细配置
* #### `/config/frontend.json`中的`scoreboardItem`

```json
{
        "key": "kills", // 数据匹配名，详情见下方
        "name": "击杀", // 数据显示名
        "fix": 0 // 保留几位小数
    },

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

  - `autoEnable` 计分板在一局结束，热身，开始前将自动启动，true为开启，false为关闭

  - `scoreboardItem` [详细配置](#计分板自定义详细配置)

---

## 免责声明

本仓库不包含或再分发任何字体文件。

字体文件（包括 `.ttf`、`.otf`、`.woff`、`.woff2` 等格式）均被有意排除在本仓库之外。

本项目中涉及的字体仅作为展示效果或运行环境依赖存在，相关字体文件的版权归各自版权所有者所有。本仓库仅提供代码及相关功能，用户需自行从官方或合法渠道获取字体，并遵守字体对应的许可证协议。

因用户未遵守字体授权协议而产生的任何版权或法律问题，与本项目作者无关。


This repository does not include or redistribute any font files. 

Font files (*.ttf, *.otf, *.woff, etc.) are intentionally excluded from this repository.

Any fonts referenced or displayed by this project are not part of this repository and remain the property of their respective copyright owners. This project only provides code and functionality, and users are solely responsible for acquiring fonts from official sources and complying with their respective licenses.

The project authors are not responsible for any font licensing issues caused by unauthorized acquisition or usage by users.s