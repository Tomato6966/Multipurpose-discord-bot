import chalk from "chalk";
import { Events } from "discord.js";

export default {
    name: Events.ShardReconnecting,
    async execute(shardId: number) {
        const color = chalk.bold.hex("#FFA500");
        try {
            const stringlength2 = 69;
            console.log("\n")
            console.log(color(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
            console.log(color(`     ┃ `) + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + color("┃"))
            console.log(color(`     ┃ `) + color(`Bot Shard #${shardId} is reconnecting!`) + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `Bot Shard #${shardId} is reconnecting!`.length) + color("┃"))
            console.log(color(`     ┃ `) + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + color("┃"))
            console.log((color`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
        } catch {
            /* */
        }
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