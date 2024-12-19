import chalk from "chalk";
import { ExtendedClient } from "..";
import { AttachmentBuilder } from "discord.js";
import { ChannelType } from "discord.js";

export default (client: ExtendedClient) => {
    // CMD
    client.on("messageCreate", async (message) => {
        if (!message.channel.isTextBased() && !message.inGuild()) return;
        try {
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            client.settings.ensure(message.guild.id, {
                aichat: "no",
            });

            let chatbot = client.settings.get(message.guild.id, "aichat");
            if (!chatbot || chatbot === "no") return;
            if (message.channel.id == chatbot) {
                if (message.attachments.size > 0) {
                    const attachment = new AttachmentBuilder("https://media.moddb.com/images/downloads/1/193/192889/MOSHED-2020-2-20-22-48-16.gif");
                    return message.channel.send({
                        files: [attachment],
                        content: `I am not allowed to read files!`
                    })
                };

                try {
                    fetch(`http://api.brainshop.ai/get?bid=153861&key=0ZjvbPWKAxJvcJ96&uid=1&msg=${encodeURIComponent(message.content)}`)
                        .then(res => res.json())
                        .then(data => {
                            message.channel.send({ content: data.cnt }).catch(() => { })
                        });
                } catch (e) {
                    message.channel.send({
                        content: `<:no:833101993668771842> AI CHAT API IS DOWN`
                    }).catch(() => { });
                };
            }
        } catch (e) {
            console.log(chalk.grey(String(e)));
        }
    });

    // AFK SYSTEM
    client.on("messageCreate", async (message) => {
        try {
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            for (const user of [...message.mentions.users.values()]) {
                if (client.afkDB.has(message.guild.id + user.id)) {
                    await message.reply({
                        content: `<:Crying:867724032316407828> **${user.tag}** went AFK <t:${Math.floor(client.afkDB.get(message.guild.id + user.id, "stamp") / 1000)}:R>!${client.afkDB.get(message.guild.id + user.id, "message") && client.afkDB.get(message.guild.id + user.id, "message").length > 1 ? `\n\n__His Message__\n>>> ${String(client.afkDB.get(message.guild.id + user.id, "message")).substring(0, 1800).split(`@`).join(`\`@\``)}` : ""}`
                    }).then(msg => {
                        setTimeout(() => {
                            try {
                                msg.delete().catch(() => { });
                            } catch { }
                        }, 5000)
                    }).catch(() => { })
                }
            }
        } catch (e) {
            console.log(chalk.grey(String(e)));
        }
    });

    client.on("messageCreate", async (message) => {
        try {
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            if (message.content && !message.content.toLowerCase().startsWith("[afk]") && client.afkDB.has(message.guild.id + message.author.id)) {
                if (Math.floor(client.afkDB.get(message.guild.id + message.author.id, "stamp") / 10000) == Math.floor(Date.now() / 10000)) return console.log("AFK CMD");
                await message.reply({ content: `:tada: Welcome back **${message.author.username}!** :tada:\n> You went <t:${Math.floor(client.afkDB.get(message.guild.id + message.author.id, "stamp") / 1000)}:R> Afk` }).then(msg => {
                    setTimeout(() => { msg.delete().catch(() => { }) }, 5000)
                }).catch(() => { })
                client.afkDB.delete(message.guild.id + message.author.id)
            }
        } catch (e) {
            console.log(chalk.grey(String(e)))
        }
    });

    // Autodelete
    client.on("messageCreate", async (message) => {
        if (message.inGuild()) {
            client.setups.ensure(message.guild.id, {
                autodelete: [[/*{ id: "840330596567089173", delay: 15000 }*/]]
            });
            let channels = client.setups.get(message.guild.id, "autodelete");
            if (channels && channels.some(ch => ch.id == message.channel.id) && message.channel.type == ChannelType.GuildText) {
                setTimeout(() => {
                    try {
                        if (message.deletable) {
                            message.delete().catch(() => {
                                setTimeout(() => {
                                    message.delete().catch(() => { });
                                })
                            })
                        } else {
                            message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                                setTimeout(() => {
                                    if (m.deletable) m.delete().catch(() => { })
                                }, 3500)
                            })
                        }
                    } catch (e) {
                        console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
                    }
                }, channels.find(ch => ch.id == message.channel.id).delay || 30000)
            }
        }
    });

    // Sniping System
    client.on("messageDelete", async message => {
        if (!message.guild || message.guild.available === false || !message.channel || !message.author) return;
        let snipes = client.snipes.has(message.channel.id) ? client.snipes.get(message.channel.id) : [];
        if (snipes.length > 15) snipes.splice(0, 14);
        snipes.unshift({
            tag: message.author.tag,
            id: message.author.id,
            avatar: message.author.displayAvatarURL(),
            content: message.content,
            image: message.attachments.first()?.proxyURL || null,
            time: Date.now(),
        });
        client.snipes.set(message.channel.id, snipes)
    })
}