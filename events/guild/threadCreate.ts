import { Events } from "discord.js";
import type { AnyThreadChannel } from "discord.js";
import { ExtendedClient } from "../..";
import chalk from "chalk";

export default {
    name: Events.ThreadCreate,
    async execute(client: ExtendedClient, thread: AnyThreadChannel) {
        try {
            if (thread.joinable && !thread.joined) {
                await thread.join()
            }
        } catch (e) {
            console.log(chalk.grey(String(e)))
        }
    }
};