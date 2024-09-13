import config from "../../botconfig/config.json" assert { type: "json" };
import Discord, { Events, type PresenceStatusData } from "discord.js";
import moment from "moment";
import { nFormatter } from "../../handlers/functions";
import type { ExtendedClient } from "../..";
import chalk from "chalk"
import { change_status } from "../../functions/statusChange";

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

            const botUser = `Bot User: `;
            const botUserData = `${client.user.tag}`;
            const guilds = `Guild(s): `;
            const guildsData = `${client.guilds.cache.size} Servers`;
            const watching = `Watching: `;
            const watchingData = `${client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0)} Members`;
            const prefix = `Prefix: `;
            const prefixData = `${config.prefix}`;
            const commands = `Commands: `;
            const commandsData = `${client.commands?.size ? client.commands.size : 0}`;
            const discordjs = `Discord.js: `;
            const discordjsData = `v${Discord.version}`;
            const nodejs = `Node.js: `;
            const nodejsData = `${process.version}`;
            const platform = `Platform: `;
            const platformData = `${process.platform} ${process.arch}`;
            const memory = `Memory: `;
            const memoryData = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`;

            const stringlength = 69;
            console.log("\n");
            console.log(chalk.bold.grey(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
            console.log(chalk.bold.grey(`     ┃ `) + " ".repeat(-1 + stringlength - ` ┃ `.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + chalk.bold.grey(`Bot Data:`) + " ".repeat(-1 + stringlength - ` ┃ `.length - `Bot Data:`.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + " ".repeat(-1 + stringlength - ` ┃ `.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + " ".repeat(-1 + stringlength - ` ┃ `.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(botUser)}${chalk.bold.greenBright(botUserData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - botUser.length - botUserData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(guilds)}${chalk.bold.greenBright(guildsData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - guilds.length - guildsData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(watching)}${chalk.bold.greenBright(watchingData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - watching.length - watchingData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(prefix)}${chalk.bold.greenBright(prefixData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - prefix.length - prefixData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(commands)}${chalk.bold.greenBright(commandsData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - commands.length - commandsData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(discordjs)}${chalk.bold.greenBright(discordjsData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - discordjs.length - discordjsData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(nodejs)}${chalk.bold.greenBright(nodejsData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - nodejs.length - nodejsData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(platform)}${chalk.bold.greenBright(platformData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - platform.length - platformData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + `${chalk.bold.grey(memory)}${chalk.bold.greenBright(memoryData)}` + " ".repeat(-1 + stringlength - ` ┃ `.length - memory.length - memoryData.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┃ `) + " ".repeat(-1 + stringlength - ` ┃ `.length) + chalk.bold.grey("┃"))
            console.log(chalk.bold.grey(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`));

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
