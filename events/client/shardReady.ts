import chalk from "chalk";
import { Events } from "discord.js";

export default {
    name: Events.ShardReady,
    async execute(shardId: number) {
        const color = chalk.bold.hex("#7EFEE7");
        try {
            const stringlength2 = 69;
            console.log("\n")
            console.log(color(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
            console.log(color(`     ┃ `) + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + color("┃"))
            console.log(color(`     ┃ `) + color(`Bot Shard #${shardId} is ready!`) + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `Bot Shard #${shardId} is ready!`.length) + color("┃"))
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