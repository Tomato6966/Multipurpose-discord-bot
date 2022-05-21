const Discord = require("discord.js")
const Platforms = {
    "pc": "PC",
    "psn": "Playstation",
    "xbl": "Xbox"
};
const fortnite = require("fortnite");
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
module.exports = async client => {

    const SelectionMap = new Map();


    client.on("interactionCreate", async interaction => {
        if(!interaction.isButton()) return;
        if(interaction.message.author?.id != client.user.id) return;
        if(!interaction.customId.includes("epicgamesverify")) return;
        let { user, guildId } = interaction;
        await dbEnsure(client.epicgamesDB, user.id, { 
            epic: "",
            user: user.id,
            guild: guildId,
            Platform: "",
            InputMethod: "",
        });
        await dbEnsure(client.epicgamesDB, guildId, { 
            logChannel: "",
            verifychannel: "",
        });
        const guild = client.guilds.cache.get(guildId);
        if(!guild) return;
        let data = await client.epicgamesDB.get(user.id);
        let guilddata = await client.epicgamesDB.get(guildId);
        if(guilddata.verifychannel == interaction.channelId && interaction.customId == "epicgamesverify" && data.epic && data.epic.length > 5) {
            interaction.reply({
                content: `:question: **You already connected your EpicGames Account to __${guild.name}__**\n> Do you want to change it?\n**Name:** \`${data.epic}\`\n**Platform:** \`${Platforms[data.Platform]}\`\n**Input Method:** \`${data.InputMethod}\``,
                ephemeral: true,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageButton().setStyle("PRIMARY").setEmoji("✋").setLabel("Yes Change it!").setCustomId("epicgamesverify_f"),
                            new Discord.MessageButton().setStyle("SECONDARY").setEmoji("✋").setLabel("No I want to keep it!").setCustomId("no"),
                        ]
                    )
                ]
            });
        } else {
            await user.fetch().catch(() => null);
            //else force Create it!  
            user.send({
                content: `:question: **Select your Platform**\n> Where do you play on?`,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageSelectMenu().setMaxValues(1).setMinValues(1).setPlaceholder("Select the Platform").setCustomId("Platform").addOptions([
                                {
                                    label: "PC | Computer",
                                    value: "pc",
                                    description: "If you play on Computer / Laptop",
                                    emoji: "840608514648047666"
                                },
                                {
                                    label: "Playstation",
                                    value: "psn",
                                    description: "If you play on a Playstation",
                                    emoji: "840608342040117249"
                                },
                                {
                                    label: "Xbox",
                                    value: "xbl",
                                    description: "If you play on a XBOX",
                                    emoji: "840608097701330996"
                                },
                                {
                                    label: "Others",
                                    value: "others",
                                    description: "If you play on something else..",
                                }
                            ])
                        ]
                    )
                ]
            }).then(async msg => {
                await msg.fetch().catch(() => null);
                await interaction.reply({
                    content: "👍 **Check your DIRECT Messages! And answer my Questions**",
                    ephemeral: true,
                })
                let Platform = await msg.channel.awaitMessageComponent({ filter: (i) => i.user.id === user.id && i.customId == "Platform", time: 120_000, max: 1, errors: ['time'] }).then(i => {i.deferUpdate().catch(() => null); return i.values[0]}).catch(() => null) || false;
                if(!Platform) {
                    return user.send(":x: Cancelled, due to no reaction in under 2 Minutes!")
                }
                user.send(`:question: **What is your EPIC GAMES Username?**\n> Make sure to send just the Username and send it 1:1 as it is \`Epicgames.com\``)
                let Username = await msg.channel.awaitMessages({ filter: (m) => m.author.id === user.id, time: 120_000, max: 1, errors: ['time'] }).then(c => c.first()?.content).catch(() => null) || false;
                if(!Username) {
                    return user.send(":x: Cancelled, due to not sending the Username in under 2 Minutes!")
                }
                let others = await client.epicgamesDB.all().then(d => d.find(d => d?.data?.guild && d?.data?.guild == guildId && d?.data?.epic && d?.data?.epic == Username)?.data);
                if(others && others.length > 0) return user.send(`:x: **Someone with the User-ID: \`${others.user}\` Linked their Account with this Epic Games Name!**`) 
                let fortniteClient = new fortnite("e032828b-886d-4ed6-9aa1-0e2e725592a8");
                let tdata = await fortniteClient.user(Username, Platform == "others" ? "pc" : Platform).catch(() => null) || false;
                if(!tdata || tdata.code === 404) {
                    return user.send(":x: Could not find your Epic Games Account, please try again and make sure you send the right name!")
                }
                await client.epicgamesDB.set(user.id+".epic", Username);
                await client.epicgamesDB.set(user.id+".Platform", Platform);
                user.send({
                    content: `:question: **Select your Platform**\n> Where do you play on?`,
                    components: [
                        new Discord.MessageActionRow()
                        .addComponents(
                            [
                                new Discord.MessageSelectMenu().setMaxValues(1).setMinValues(1).setPlaceholder("Select the Input Method").setCustomId("InputMethod").addOptions([
                                    {
                                        label: "Keyboard and Mouse",
                                        value: "kbm",
                                        description: "If you play on Keyboard and Mouse",
                                        emoji: "⌨️"
                                    },
                                    {
                                        label: "Controller",
                                        value: "controller",
                                        description: "If you play on a Controller",
                                        emoji: "🎮"
                                    },
                                    {
                                        label: "Touch",
                                        value: "touch",
                                        description: "If you play on a Touch Device",
                                        emoji: "📱"
                                    },
                                    {
                                        label: "Others",
                                        value: "others",
                                        description: "If you play on something else..",
                                    }
                                ])
                            ]
                        )
                    ]
                }).then(async msg => {
                    let InputMethod = await msg.channel.awaitMessageComponent({ filter: (i) => i.user.id === user.id && i.customId == "InputMethod", time: 120_000, max: 1, errors: ['time'] }).then(i => {i.deferUpdate().catch(() => null); return i.values[0]}).catch(() => null) || false;
                    if(!InputMethod) {
                        await client.epicgamesDB.set(user.id+".InputMethod", "others");
                        user.send("Set the Default Input Method due to no reaction in under 2 Minutes!");
                    } else {
                        await client.epicgamesDB.set(user.id+".InputMethod", InputMethod);
                    }
                    user.send("✋ **Successfully Linked your Account!**").catch(() => null);
                    let logChannel = guild.channels.cache.get(guilddata.logChannel) || await guild.channels.fetch(guilddata.logChannel).catch(() => null) || false
                    if(guilddata.logChannel && guilddata.logChannel.length > 5 && logChannel && logChannel.id) { 
                        logChannel.send({
                            embeds: [
                                new Discord.MessageEmbed().setColor("GREEN")
                                    .setAuthor(client.getAuthor(user.tag, user.displayAvatarURL({dynamic: true})))
                                    .setTitle(`Linked/Updated their EPICGAMES Account!`)
                                    .addField("**Epic Games Name:**", `\`\`\`${Username}\`\`\``)
                                    .addField("**Platform:**", `\`\`\`${Platform}\`\`\``)
                                    .addField("**Input Method:**", `\`\`\`${InputMethod}\`\`\``)
                                    .setFooter(client.getFooter("ID: " + user.id, user.displayAvatarURL({dynamic: true})))
                            ]
                        }).catch(() => null)
                    }
                })
            }).catch((e) => {
                console.error(e)
                interaction.reply({
                    content: "❌ **I can't dm you... Please enable your DMS first!**",
                    ephemeral: true,
                })
            });
        }
    });
}