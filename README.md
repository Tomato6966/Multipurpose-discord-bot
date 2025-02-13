# Public Bot and Support Server!

<a href="https://discord.gg/AsgD3gtPnb"><img src="https://discord.com/api/guilds/1070626568260562954/widget.png?style=banner2"></a>
 
# Important notes and thank ❤️
- PROJECT IS NOT MAINTAINED ANYMORE (PR FOR UPDATES ARE WELCOME) - I have stopped making public source codes such as this one in that size
First of all, thanks for using this Source Code, it was and is a ton of work to create and maintain it!
That's why I'm asking everyone to [**donate a little bit of money**](https://paypal.me/MilratoDevelopment) or if that's not possible, then join my ["new" Discord Server](https://discord.gg/AsgD3gtPnb)!

  **NOTE:** It is suggested to use the [Sharded (&Clustered) version](https://github.com/Tomato6966/Multipurpose-discord-bot/tree/sharded_with_mongo), if you plan on using it for a VERIFIED BOT (on more then 2000 Servers!)
 

# Installation Guide 🔥

## ✅ Hosting Requirements

<details>
  <summary>Click to expand</summary>

  * [nodejs](https://nodejs.org) version 16.6 or higher, I recommend the latest STABLE version
  * [python](https://python.org) version 3.8 or higher, to install the database `enmap` (better-sqlite3)
  * A VPS would be advised, so you don't need to keep your PC/laptop/RasPi 24/7 online! [Click here for a debian setup](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/).
  * Check out my recommended Host: [BERO-HOST](https://bero.host) and use code `milrato` for cheap OP VPS (kvm)
  * [Click here for a Direct Order Link](https://bero-host.de/server/prepaid-kvm-rootserver-paket-mieten)

</details>

## 🤖 Bot Requirements

<details>
  <summary>Click to expand</summary>
  **NOTE:** It is suggested to use the [Sharded (&Clustered) version](https://github.com/Tomato6966/Multipurpose-discord-bot/tree/sharded_with_mongo), if you plan on using it for a VERIFIED BOT (on more then 2000 Servers!)
 
  1. Download the [Source Code](https://github.com/Tomato6966/Multipurpose-discord-bot/releases/latest)
     * Either by: `git clone https://github.com/Tomato6966/Multipurpose-discord-bot`
     * Or by downloading it as a zip from the releases tab or a branch.
  
</details>

## 🎶 Music Requirements

<details>
  <summary>Click to expand</summary>

  *To allow your Bot to play music, you need to connect it to a LavaLink station!*
  *There are many public ones out there for example lava.link*
  An example for a public configuration will be listed down below.
   
  1. Make sure `Java 11` is installed on your system!
     * [Click here for a Download for **Linux**](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/3.5.2-java-11)
     * [Click here for a Download for **Windows**](https://downloads.milrato.eu/windows/java/jdk-11.0.11.exe) ​
  2. Download [Lavalink.jar](https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar)
     * Here is a direct link: https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar
     * If you are on linux do this: `wget https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar` (prep: `apt-get install -y wget`)
  3. Download [application.yml](https://cdn.discordapp.com/attachments/734517910025928765/934084553751015475/application.yml)
     * Download my example, it's the configuration for the lavalink.jar file!
  4. Now put application.yml and Lavalink.jar in the same folder and start it
     * To start LavaLink type: `java -jar Lavalink.jar`
     * Make sure to keep your terminal Open!
     * If you want to use something like `npm i -g pm2` to host it without keeping your terminal open type: `pm2 start java -- -jar Lavalink.jar`
  5. The settings like **password** in application.yml and **port** must be provided in the `botconfig/config.json` of the Bot
     * If you used the default settings, than no adjustments are needed and it should look like this: 
     ```json
     {
        "clientsettings": {
            "nodes": [
                {
                    "host": "localhost",
                    "port": 2333,
                    "password": "youshallnotpass"
                }
            ]
        }
     }
     ```
  6. You don't want to host your own LavaLink?
     * [Here is a list of many free-to-use LavaLink Servers!](https://lavalink.darrennathanael.com/#how2host)
     * Or just use something like this: 
     ```json
     {
        "clientsettings": {
            "nodes": [
                {
                    "host": "lava.link",
                    "port": 80,
                    "password": "Anything for the Password"
                }
            ]
        }
     }
     ```

</details>

## 🤖 Configuration and Starting

<details>
  <summary>Click to expand</summary>

  **NOTE:** *You can do the exact same configuration inside of the `example.env` file, just make sure to rename it to `.env` or use environment variables!*
 
   1. Check `🎶 Music Requirements` that you started lavalink / use a valid public lavalink station.
   2. Fill in all required data in `./botconfig/config.json` **NOTE:** *If you're on replit.com, it is exposed to everyone!(use .env instead)*
   3. Fill in all required data in the `.json` files in `./social_log/` (`./social_log/streamconfig.json` & `./social_log/twitter.json`), if you want the SOCIAL LOGS to work! (the key `authToken` in streamconfig does not need to be filled in!)
   4. You can adjust some settings in the other `./botconfig/*.json` Files, **BUT PLEASE __KEEP__ MY CREDITS & ADS!** This is the only way on how my hard work is "revenued".
   5. Now start the bot by opening a cmd line in that folder and typing: `node index.js` or `npm start`
     * If you don't want to keep the terminal open or if you're on linux, check out [pm2 (and my tutorial)](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/4-pm2-tutorial) and type: `pm2 start --name Bot_Name index.js`
  
</details>

## ❓ Where to get which Api-Key(s)

<details>
  <summary>Click to expand</summary>

  **NOTE:** *You can do the exact same configuration inside of the `example.env` file, just make sure to rename it to `.env` or use environment variables!*
 
  1. `./botconfig/config.json`
     * `token` you can get from: [discord-Developers](https://discord.com/developers/applications)
     * `memer_api` you can get from: [Meme-Development DC](https://discord.gg/Mc2FudJkgP)
     * `spotify.clientSecret` you can get from: [Spotify-Developer](https://developer.spotify.com)
     * `spotify.clientID` you can get from: [Spotify-Developer](https://developer.spotify.com)
     * `fnbr` is a FNBR token, which you may get from [FNBRO.co](https://fnbr.co/api/docs) (needed for fnshop)
     * `fortnitetracker` is a FORTNITE TRACKER token, which you may get from [fortnitetracker.com](https://fortnitetracker.com/site-api) (needed for fnstats)
  2. `./social_log/streamconfig.json`
     * `twitch_clientID` you can get from: [Twitch-Developer](https://dev.twitch.tv/docs/api) ([developer-console](https://dev.twitch.tv/console))
     * `twitch_secret` you can get from: [Twitch-Developer](https://dev.twitch.tv/docs/api) ([developer-console](https://dev.twitch.tv/console))
     * `authToken` is not required to be filled in --> will be done automatically
  3. `./social_log/twitter.json`
     * `consumer_key` you can get from: [twitter Developers](https://developer.twitter.com)
     * `consumer_secret` you can get from: [twitter Developers](https://developer.twitter.com)
     * `access_token` you can get from: [twitter Developers](https://developer.twitter.com)
     * `access_token_secret` you can get from: [twitter Developers](https://developer.twitter.com)
  
</details>


## SUPPORT ME AND MILRATO DEVELOPMENT

> You can always support me by inviting one of my **Discord Bots**

[![2021's best Music Bot | Lava Music](https://cdn.discordapp.com/attachments/748533465972080670/817088638780440579/test3.png)](https://lava.milrato.dev)
[![Musicium Music Bot](https://cdn.discordapp.com/attachments/742446682381221938/770055673965707264/test1.png)](https://musicium.musicium.dev)
[![Milrato Multi Bot](https://cdn.discordapp.com/attachments/742446682381221938/770056826724679680/test1.png)](https://milrato.milrato.dev)

# Credits

> If you consider using this Bot, make sure to credit me!
> Example: `Bot Coded by [Tomato#6966](https://discord.gg/AsgD3gtPnb) but modified by [modifier/your Name](https://discord.gg/)`

# Contributing

> If you want to help improve the Bot code, fix spelling or design Errors or if possible even code errors, you may create PULL REQUESTS.
> Please consider, that [**Tomato6966**](https://github.com/Tomato6966) is the main Developer of this Bot, everyone else helped just once or sometimes more often.
> Thanks to any1 who considers helping me!
