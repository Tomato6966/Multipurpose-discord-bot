/**********************************************************
 * @INFO  [TABLE OF CONTENTS]
 * 1  Import_Modules
   * 1.1 Validating script for advertisement
 * 2  CREATE_THE_DISCORD_BOT_CLIENT
 * 3  create_the_languages_objects
 * 4  Raise_the_Max_Listeners
 * 5  Define_the_Client_Advertisments
 * 6  LOAD_the_BOT_Functions
 * 7  LOAD_the_BOT_Events
 * 8  Login_to_the_Bot
 * 
 *   BOT CODED BY: TOMato6966 | https://mivator.com
 *********************************************************/

/**********************************************************
 * @param {1} Import_Modules for this FIle
 *********************************************************/
import { ActivityType, Client, GatewayIntentBits, Partials } from "discord.js";
import colors from "colors";
import enmap from "enmap";
import * as fs from "fs";
import path from "path";
import OS from "os";
import Events from "events";
import emojis from "./botconfig/emojis.json" assert { type: "json" };
import config from "./botconfig/config.json" assert { type: "json" };
import advertisement from "./botconfig/advertisement.json" assert { type: "json" };
import { delay } from "./handlers/functions";
import "dotenv/config";
import chalk from 'chalk';
import { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import type { Collection, EmbedFooterOptions, PresenceStatusData } from "discord.js";
import Enmap from "enmap";
import { Manager } from "erela.js";

let StatusTypes = {
    competing: ActivityType.Competing,
    custom: ActivityType.Custom,
    listening: ActivityType.Listening,
    playing: ActivityType.Playing,
    streaming: ActivityType.Streaming,
    watching: ActivityType.Watching
};

interface Language {
    [key: string]: any;
}

interface Advertisement {
    enabled: boolean;
    statusad: {
        name: string;
        type: string;
        url: string;
    },
    spacedot: string;
    textad: string;
}

interface Stat {
    timestamp: number;
    type: string;
}

type StatKey = string;

interface AliasCollection extends Collection<string, string> { }

interface StatsCollection extends Collection<StatKey, Stat[]> { }

export interface ExtendedClient extends Client {
    la: { [lang: string]: Language };
    ad: Advertisement;
    commands: Collection<any, any>;
    aliases: AliasCollection;
    notes: Enmap;
    economy: Enmap;
    invitesdb: Enmap;
    tiktok: Enmap;
    youtube_log: Enmap;
    snipes: Enmap;
    musicsettings: Enmap;
    settings: Enmap;
    jointocreatemap: Enmap;
    joinvc: Enmap;
    queuesaves: Enmap;
    modActions: Enmap;
    userProfiles: Enmap;
    jtcsettings: Enmap;
    jtcsettings2: Enmap;
    jtcsettings3: Enmap;
    roster: Enmap;
    autosupport: Enmap;
    menuticket: Enmap;
    menuapply: Enmap;
    apply: Enmap;
    points: Enmap;
    voicepoints: Enmap;
    reactionrole: Enmap;
    social_log: Enmap;
    blacklist: Enmap;
    customcommands: Enmap;
    keyword: Enmap;
    premium: Enmap;
    stats: Enmap;
    mutes: Enmap;
    afkDB: Enmap;
    setups: Enmap;
    slashCommands: Collection<string, any>;
    invites: {};
    categories: string[];
    cooldowns: Collection<any, any>;
    defaultEQ: any;
    bassboost: any;
    eqs: any;
    manager: Manager;
    getFooter(es: any, stringurl?: string): EmbedFooterOptions;
    getInvite(id: string): Promise<String>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

/**********************************************************
 * @param {2} CREATE_THE_DISCORD_BOT_CLIENT with some default settings
 *********************************************************/
const client = new Client({
    failIfNotExists: false,
    shards: "auto",
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
    },
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions
    ],
    presence: {
        activities: [{
            name: `${config.status.text}`.replace("{prefix}", config.prefix),
            type: StatusTypes[config.status.type.toLocaleLowerCase()],
            url: config.status.url
        }],
        status: config.status.mode as PresenceStatusData
    }
}) as ExtendedClient;

/**********************************************************
 * @param {3} create_the_languages_objects to select via CODE
 *********************************************************/
client.la = {};
const langs: string[] = fs.readdirSync('./languages').filter(file => file.endsWith('.json'));
for (const lang of langs.filter(file => file.endsWith(".json"))) {
    const languageCode = lang.split('.json').join("");
    client.la[languageCode] = await import(`./languages/${lang}`) as Language;
}

Object.freeze(client.la);

/**********************************************************
 * @param {4} Raise_the_Max_Listeners to 0 (default 10)
 *********************************************************/
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = `${OS.cpus().length}`;

/**********************************************************
 * @param {5} Define_the_Client_Advertisments from the Config File
 *********************************************************/
client.ad = {
    enabled: advertisement.adenabled,
    statusad: advertisement.statusad,
    spacedot: advertisement.spacedot,
    textad: advertisement.textad
}

/**********************************************************
 * @param {6} LOAD_the_BOT_Functions 
 *********************************************************/
function requireHandlers() {
    const handlers = [
        "extraevents", "clientvariables", "command", "loaddb", "erelahandler", "slashCommands",
        "logger", "anti_nuke", "antidiscord", "antilinks", "anticaps", "antispam", "blacklist", "keyword", "antimention", "autobackup",
        "apply", "ticket", "ticketevent",
        "roster", "joinvc", "epicgamesverification", "boostlog",
        "welcome", "leave", "ghost_ping_detector", "antiselfbot",
        "jointocreate", "reactionrole", "ranking", "timedmessages",
        "membercount", "autoembed", "suggest", "validcode", "dailyfact", "autonsfw",
        "aichat", "mute", "automeme", "counter"
    ];

    const social_log_handlers = [
        "twitterfeed", /*"twitterfeed2",*/ "livelog", "youtube", "tiktok"
    ]

    handlers.forEach(async (handler) => {
        try {
            const module = await import(`./handlers/${handler}`).catch(e => {
                console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
            });

            if (module.default) {
                module.default(client);
            } else {
                if (config.debug) console.log(chalk.grey("No Default Export found for Handler: ") + handler);
            }
        } catch (e) {
            console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
        }
    });

    social_log_handlers.forEach(async (handler) => {
        try {
            const module = await import(`./social_log/${handler}`).catch(e => {
                console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
            });

            if (module.default) {
                module.default(client);
            } else {
                if (config.debug) console.log(chalk.grey("No Default Export found for Handler: ") + handler);
            }
        } catch (e) {
            console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
        }
    })
} requireHandlers();

/**********************************************************
 * @param {7} LOAD_the_BOT_Events
 *********************************************************/
const allevents: string[] = [];
let dateNow = Date.now();
console.log(chalk.greenBright(`${String(chalk.magenta("[x] :: "))}Now loading the Events ...`))
const eventFoldersPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(eventFoldersPath);
for (const folder of eventFolders) {
    const eventsPath = path.join(eventFoldersPath, folder);
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const { default: event } = await import(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else if (event.rest) {
            client.rest.on(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        allevents.push(`${event.name}`);
    };
}
console.log(chalk.magenta(`[x] :: `) + chalk.green(chalk.greenBright(`Loaded the ${allevents.length} Events after: `) + `${Date.now() - dateNow}ms`))
try {
    const stringlength2 = 69;
    console.log("\n")
    console.log(chalk.bold.yellow(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
    console.log(chalk.bold.yellow(`     ┃ `) + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + chalk.bold.yellow("┃"))
    console.log(chalk.bold.yellow(`     ┃ `) + chalk.bold.yellow(`Logging into the BOT...`) + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `Logging into the BOT...`.length) + chalk.bold.yellow("┃"))
    console.log(chalk.bold.yellow(`     ┃ `) + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + chalk.bold.yellow("┃"))
    console.log((chalk.bold.yellow`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
} catch {
    /* */
}

/**********************************************************
 * @param {8} Login_to_the_Bot
 *********************************************************/
client.login(process.env.token || config.token);

/**********************************************************
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 *********************************************************/