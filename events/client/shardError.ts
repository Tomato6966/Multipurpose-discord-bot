import { Events } from "discord.js";

export default {
    name: Events.ShardError,
    async execute(error: Error, shardId: number) {
        console.log(` || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Shard #${shardId} Errored || <==> ||`)
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