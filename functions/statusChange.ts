import moment from "moment";
import config from "../botconfig/config.json" assert { type: "json" };
import { nFormatter } from "../handlers/functions";
import { ActivityType, type PresenceStatusData } from "discord.js";
import { ExtendedClient } from "..";

let StatusTypes = {
    competing: ActivityType.Competing,
    custom: ActivityType.Custom,
    listening: ActivityType.Listening,
    playing: ActivityType.Playing,
    streaming: ActivityType.Streaming,
    watching: ActivityType.Watching
};

var state = false;
export function change_status(client: ExtendedClient) {
    if (!client.user) return;
    if (!state) {
        client.user.setActivity({
            name: `${config.status.text}`
                .replace("{prefix}", config.prefix)
                .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                .replace("{name}", client.user.username)
                .replace("{tag}", client.user.tag)
                .replace("{commands}", `${client.commands?.size ? client.commands.size : 0}`)
                .replace("{usedcommands}", nFormatter(Math.ceil(client.stats.get("global", "commands") * [...client.guilds.cache.values()].length / 10), 2))
                .replace("{songsplayed}", nFormatter(Math.ceil(client.stats.get("global", "songs") * [...client.guilds.cache.values()].length / 10), 2)),
            type: StatusTypes[config.status.type.toLowerCase()],
            url: config.status.url
        });
        client.user.setPresence({
            status: config.status.mode as PresenceStatusData
        });
    } else {
        client.user.setActivity({
            name: `${config.status.text2}`
                .replace("{prefix}", config.prefix)
                .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                .replace("{name}", client.user.username)
                .replace("{tag}", client.user.tag)
                .replace("{commands}", `${client.commands?.size ? client.commands.size : 0}`)
                .replace("{usedcommands}", nFormatter(Math.ceil(client.stats.get("global", "commands") * [...client.guilds.cache.values()].length / 10), 2))
                .replace("{songsplayed}", nFormatter(Math.ceil(client.stats.get("global", "songs") * [...client.guilds.cache.values()].length / 10), 2)),
            type: StatusTypes[config.status.type.toLowerCase()],
            url: config.status.url
        });
        client.user.setPresence({
            status: config.status.mode as PresenceStatusData
        });
    }
    state = !state;
    if (client.ad.enabled) {
        setTimeout(() => {
            if (!client.user) return;
            client.user.setActivity({
                name: `${client.ad.statusad}`
            });
        }, (90 - 15) * 1000);
    }
}

/**********************************************************
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 *********************************************************/