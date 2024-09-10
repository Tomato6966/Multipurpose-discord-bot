import chalk from "chalk";
import type { ExtendedClient } from "..";
import { readdirSync } from "fs";
import Enmap from "enmap";
import { GiveawaysManager } from "discord-giveaways";
import ee from "../botconfig/embed.json" assert { type: "json" };
import { ColorResolvable, EmbedBuilder } from "discord.js";

export default async (client: ExtendedClient) => {
    let dateNow = Date.now();
    console.log(chalk.greenBright(`${String(chalk.magenta("[x] :: "))}Now loading the Commands ...`));
    try {
        readdirSync("./commands/").forEach(async (dir) => {
            const commands = readdirSync(`./commands/${dir}`).filter((file) => file.endsWith(".ts"));
            for (let file of commands) {
                try {
                    let pull = await import(`../commands/${dir}/${file}`).catch((e) => { console.log(e) });
                    if (pull.default.name) {
                        client.commands.set(pull.default.name, pull.default);
                    } else {
                        continue;
                    }

                    if (pull.default.aliases && Array.isArray(pull.default.aliases)) {
                        pull.default.aliases.forEach((alias) => {
                            client.aliases.set(alias, pull.default.name);
                        })
                    };
                } catch (e) {
                    console.log(chalk.grey.bgRed(String(e.stack)));
                }
            };

            console.log(chalk.magenta(`[x] :: `) + chalk.greenBright(`Loaded the ${client.commands.size} Commands after: `) + chalk.green(`${Date.now() - dateNow}ms`));
        });
    } catch (e) {
        console.log(chalk.grey.bgRed(String(e.stack)));
    };

    client.backupDB = new Enmap({
        name: 'backups',
        dataDir: "./databases"
    });

    client.giveawayDB = new Enmap({
        name: 'giveaways',
        dataDir: "./databases"
    });
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        // async getAllGiveaways() {
        //     return client.giveawayDB.fetch().array();
        // };

        async saveGiveaway(messageId, giveawayData) {
            client.giveawayDB.set(messageId, giveawayData);
            return true;
        };

        async editGiveaway(messageId, giveawayData) {
            client.giveawayDB.set(messageId, giveawayData);
            return true;
        };

        async deleteGiveaway(messageId) {
            client.giveawayDB.delete(messageId);
            return true;
        };
    };

    const color = ee.color as ColorResolvable;
    const wrongcolor = ee.wrongcolor as ColorResolvable;
    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: color,
            embedColorEnd: wrongcolor,
            reaction: '🎉'
        }
    });

    client.giveawaysManager = manager;
    client.giveawaysManager.on("giveawayReactionAdded", async (giveaway, member, reaction) => {
        try {
            const isNotAllowed = await giveaway.exemptMembers(member);
            if (isNotAllowed) {
                member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(wrongcolor)
                            .setThumbnail(member.guild.iconURL())
                            .setAuthor({
                                name: `Missing the Requirements`,
                                iconURL: `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128`
                            })
                            .setDescription(`> **Your are not fullfilling the Requirements for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), please make sure to fullfill them!.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                            .setFooter({
                                text: member.guild.name,
                                iconURL: member.guild.iconURL() ?? undefined
                            })
                    ]
                }).catch(() => { });
                reaction.users.remove(member.user).catch(() => { });
                return;
            }

            let BonusEntries = await giveaway.checkBonusEntries(member.user).catch(() => { }) || 0;
            if (!BonusEntries) BonusEntries = 0;

            member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setThumbnail(member.guild.iconURL())
                        .setAuthor({
                            name: `Giveaway Entry Confirmed`,
                            iconURL: `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`
                        })
                        .setDescription(`> **Your entry for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.**\n\n**Prize:**\n> ${giveaway.prize}\n\n**Winnersamount:**\n> \`${giveaway.winnerCount}\`\n\n**Your Bonus Entries**\n> \`${BonusEntries}\`\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                        .setFooter({
                            text: member.guild.name,
                            iconURL: member.guild.iconURL() ?? undefined
                        })
                ]
            }).catch(() => { });
            console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
        } catch (e) {
            console.log(e);
        }
    });

    client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
        try {
            member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(wrongcolor)
                        .setThumbnail(member.guild.iconURL())
                        .setAuthor({
                            name: `Giveaway Left!`,
                            iconURL: `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`
                        })
                        .setDescription(`> **You left [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) and aren't participating anymore.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                        .setFooter({
                            text: member.guild.name,
                            iconURL: member.guild.iconURL() ?? undefined
                        })
                ]
            }).catch(() => { });
            console.log(`${member.user.tag} left giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
        } catch (e) {
            console.log(e);
        }
    });

    client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
        for (const winner of winners) {
            winner.send({
                content: `Congratulations, **${winner.user.tag}**! You won the Giveaway.`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setThumbnail(winner.guild.iconURL())
                        .setAuthor({
                            name: `Giveaway Won!`,
                            iconURL: `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`
                        })
                        .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
                        .setFooter({
                            text: winner.guild.name,
                            iconURL: winner.guild.iconURL() ?? undefined
                        })
                ]
            }).catch(() => { });
        }
        console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
    });

    manager.on('giveawayRerolled', (giveaway, winners) => {
        for (const winner of winners) {
            winner.send({
                content: `Congratulations, **${winner.user.tag}**! You won the Giveaway through a \`reroll\`.`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(wrongcolor)
                        .setThumbnail(winner.guild.iconURL())
                        .setAuthor({
                            name: `Giveaway Won!`,
                            iconURL: `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`
                        })
                        .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
                        .setFooter({
                            text: winner.guild.name,
                            iconURL: winner.guild.iconURL() ?? undefined
                        })
                ]
            }).catch(() => { });
        }
    });
}