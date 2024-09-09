import chalk from "chalk";
import { Events } from "discord.js";
import config from "../../botconfig/config.json" assert { type: "json" };

export default {
    name: Events.Debug,
    async execute(message: string) {
        if (!config.debug) return;
        console.log(chalk.grey(String(message)));
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