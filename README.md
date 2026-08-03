# CS2-Broadcast-Scoreboard

#### A broadcast scoreboard for CS2 built with GSI and React. Users can customize the scoreboard by modifying configuration files and query parameters.

## English | [简体中文](readme_cn.md)  

# Project Preview

### Interface
<img width="1920" height="1080" alt="Screenshot 2026-07-26 12-59-41" src="https://github.com/user-attachments/assets/189c7c2d-2bdc-4a26-b88a-f68f2fa3516d" />

### Enable Animation

<img width="640" height="360" alt="2026-07-26 12-59-432 00_00_00-00_00_30" src="https://github.com/user-attachments/assets/08eb7133-f5f0-462d-8e9b-64d2b232193a" />

### Closed Animation

<img width="640" height="360" alt="2026-07-26 12-59-43_00000000 00_00_00-00_00_30" src="https://github.com/user-attachments/assets/41650d65-9c9d-4775-ba88-a3d091988d5a" />

---
# Usage
- ### Install GSI Config
  - Browse the CS2 game files in your Steam library.

    Turnd To `./game/csgo/cfg `
  - Copy the repository file `gamestate_integration_scoreboard.cfg` to `./game/csgo/cfg`.

- ### Download Program
  - Download the files from the [release](https://github.com/YZP-PYTHON/CS2-Broadcast-Scoreboard/releases/latest)
  - After you download the program,Go to /release，click `start.bat` (windows) or in bash `bash start.sh` (Linux)

- ### Configure the OBS Browser Source
  - Add a **Browser Source** to your OBS scene.
  - Set the URL to `http://127.0.0.1:3000`.
  - Set the width to **1920** and the height to **1080**.
  - Leave the **Custom CSS** field blank.
  - Place the browser source above your game capture in the scene.

  - _The configuration is similar when using vMix._


---

# Configuration

- ### `config/match.json`
  This file contains the primary backend configuration. Configure the team names here before launching the application.
```json
{
    "team" : {
        "team1":{
            "name": "Team A", // Team Name
            "init_side": "CT" // Side when the games starts
        },
        "team2":{
            "name": "Team B", // Team Name
            "init_side": "T" // Side when the games starts
        } 
    }
}
```

- ### `/config/frontend.json`
    This file contains the frontend configuration, including panel customization options.
```json
{
    "font": "SourceHanSansSC-Normal.otf",  // Font setting. Font files must be placed in the ./public/font folder
    "scoreColor": {   // Score Color Settings
      "win": "#ef4444",  // Color of upper side
      "lose": "#3b82f6", // Color of lower side
      "draw": "#ffffff" // Color of draw
    },
    "autoEnable": true,  // Automatically display the scoreboard. When enabled, the scoreboard will be shown at the end of each round, during pauses, and before each round begins.
    "showGameState": true, // Show or hide the game state timer
    "showTeamScore": true, // Show or hide the team score
    "showDataSheet": true, // Show or hide the player statistics table
    "showBackground": true, // Show or hide the blurred background
    "scoreboardItem": [  // Player data display settings for the scoreboard. See below for details.
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
### Detailed Scoreboard Configuration
* #### `scoreboardItem` in  `/config/frontend.json`

```json
{
        "key": "kills", // Data mapping name. See below for   details.
        "name": "击杀", // Display Name
        "fix": 0 // Decimal Places
    },

```

#### Player Data Leaderboard `key` Configuration
| Field | Example Value | Meaning | Description |
|---|---|---|---|
| name | aaa | Player Name | The player's in-game nickname. Displayed by default. Configuration is not recommended. |
| steamId | 7xxxxxxxxxxxxx | Steam ID | The player's unique Steam64 ID. Too long to configure manually, not recommended. |
| team | Team A | Team Name | The team the player belongs to. Players are automatically grouped by team. Configuration is not recommended. |
| side | CT | Current Side | The player's current side in the half (CT or T). Automatically grouped and displayed. Configuration is not recommended. |
| kills | 6 | Kills | The total number of kills achieved by the player in the current match. |
| deaths | 3 | Deaths | The total number of deaths suffered by the player in the current match. |
| assists | 1 | Assists | The total number of assists made by the player in the current match. |
| damage | 415 | Total Damage | The total damage dealt by the player in the current match. |
| adr | 103.75 | Average Damage per Round (ADR) | Total damage ÷ number of rounds. Measures the player's consistent damage output. |
| kd | 2 | Kill/Death Ratio (K/D) | Kills ÷ deaths. A higher value indicates better fragging efficiency. |
| kpr | 1.5 | Kills Per Round (KPR) | Kills ÷ number of rounds. |
| dpr | 0.75 | Deaths Per Round (DPR) | Deaths ÷ number of rounds. |
| kast | 0 | KAST Rating | Comming s∞n The percentage of rounds where the player achieved a Kill, Assist, Survived, or was Traded. |
| score | 15 | Score | The Score value displayed on the CS2 scoreboard. |
| mvps | 2 | MVP Count | The number of rounds in which the player earned MVP. |


- ### Query Parameters

   <details>
   <summary>🤔</summary>
    The author was too lazy to add more browser parameters. If you need any additional options, feel free to open an issue.
  </details>

  - `autoEnable` Automatically display the scoreboard. When enabled, the scoreboard will be shown at the end of each round, during pauses, and before each round begins.

  - `scoreboardItem` [Details](#Detailed Scoreboard Configuration)

  - `showGameState` Show or hide the game state timer

  - `showTeamScore` Show or hide the team score

  - `showDataSheet` Show or hide the player statistics table
  
  - `showBackground` Show or hide the blurred background

  - example:
    - `http://127.0.0.1:3000/?autoEnable=true&showGameState=true&showDataSheet=true&showTeamScore=true&showBackground=true`

---

## Legal Disclaimer
This repository does not include or redistribute any font files. 

Font files (*.ttf, *.otf, *.woff, etc.) are intentionally excluded from this repository.

Any fonts referenced or displayed by this project are not part of this repository and remain the property of their respective copyright owners. This project only provides code and functionality, and users are solely responsible for acquiring fonts from official sources and complying with their respective licenses.

The project authors are not responsible for any font licensing issues caused by unauthorized acquisition or usage by users.

本仓库不包含或再分发任何字体文件。

字体文件（包括 `.ttf`、`.otf`、`.woff`、`.woff2` 等格式）均被有意排除在本仓库之外。

本项目中涉及的字体仅作为展示效果或运行环境依赖存在，相关字体文件的版权归各自版权所有者所有。本仓库仅提供代码及相关功能，用户需自行从官方或合法渠道获取字体，并遵守字体对应的许可证协议。

因用户未遵守字体授权协议而产生的任何版权或法律问题，与本项目作者无关。