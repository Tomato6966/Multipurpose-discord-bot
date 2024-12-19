import chalk from "chalk";
import { RateLimitData, RESTEvents } from "discord.js";

export default {
    name: RESTEvents.RateLimited,
    rest: true,
    async execute(rateLimitInfo: RateLimitData) {
        console.log(chalk.grey(JSON.stringify(rateLimitInfo)));
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