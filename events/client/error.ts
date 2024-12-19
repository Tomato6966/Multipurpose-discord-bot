import chalk from "chalk";
import { Events } from "discord.js";

export default {
    name: Events.Error,
    async execute(error: Error) {
        console.log(chalk.red.dim(String(error)));
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