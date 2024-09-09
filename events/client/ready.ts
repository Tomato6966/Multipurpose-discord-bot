import config from "../../botconfig/config.json" assert { type: "json" };
import Discord, { Events, type PresenceStatusData } from "discord.js";
import moment from "moment";
import { nFormatter } from "../../handlers/functions";
import type { ExtendedClient } from "../..";
import chalk from "chalk"
import { change_status } from "../../functions/statusChange";

// TODO: Fix client.stats
export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: ExtendedClient) {
        if (!client || !client.user) return;
        try {
            try {
                const stringlength = 69;
                console.log("\n");
                console.log(chalk.bold.greenBright(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
                console.log(chalk.bold.greenBright(`     ┃ `) + " ".repeat(-1 + stringlength - ` ┃ `.length) + chalk.bold.greenBright("┃"))
                console.log(chalk.bold.greenBright(`     ┃ `) + chalk.bold.greenBright(`Discord Bot is online!`) + " ".repeat(-1 + stringlength - ` ┃ `.length - `Discord Bot is online!`.length) + chalk.bold.greenBright("┃"))
                console.log(chalk.bold.greenBright(`     ┃ `) + chalk.bold.greenBright(` /--/ ${client.user.tag} /--/ `) + " ".repeat(-1 + stringlength - ` ┃ `.length - ` /--/ ${client.user.tag} /--/ `.length) + chalk.bold.greenBright("┃"))
                console.log(chalk.bold.greenBright(`     ┃ `) + " ".repeat(-1 + stringlength - ` ┃ `.length) + chalk.bold.greenBright("┃"))
                console.log(chalk.bold.greenBright(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
            } catch { /* */ }

            console.table({
                'Bot User:': `${client.user.tag}`,
                'Guild(s):': `${client.guilds.cache.size} Servers`,
                'Watching:': `${client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0)} Members`,
                'Prefix:': `${config.prefix}`,
                'Commands:': `${client.commands?.size ? client.commands.size : 0}`,
                'Discord.js:': `v${Discord.version}`,
                'Node.js:': `${process.version}`,
                'Plattform:': `${process.platform} ${process.arch}`,
                'Memory:': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
            });

            change_status(client);

            setInterval(() => {
                change_status(client);
            }, 90 * 1000);
        } catch (e) {
            console.log(chalk.grey.bgRed(String(e.stack)));
        };
    }
};

/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/milrato
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
