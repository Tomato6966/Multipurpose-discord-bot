var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var { duration } = require(`${process.cwd()}/handlers/functions`);
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { getNumberEmojis } = require("../../botconfig/emojiFunctions");
module.exports = {
    name: "setup-autodelete",
    category: "💪 Setup",
    aliases: ["setupautodelete", "autodelete-setup"],
    cooldown: 5,
    usage: "setup-autodelete  --> Follow the Steps",
    description: "Define a Channel where every message is replaced with an EMBED or disable this feature",
    memberpermissions: ["ADMINISTRATOR"],
    type: "system",
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");
        let ls = client.settings.get(message.guild.id, "language");
        try {
            const NumberEmojis = getNumberEmojis();
            first_layer();
            async function first_layer() {
                let menuoptions = [
                    {
                        value: "Add a Channel",
                        description: `Add a auto delete Messages-Channel`,
                        emoji: NumberEmojis[1],
                    },
                    {
                        value: "Remove a Channel",
                        description: `Remove a Channel from the Setup`,
                        emoji: NumberEmojis[2],
                    },
                    {
                        value: "Show all Channels",
                        description: `Show all setup Channels!`,
                        emoji: "📑",
                    },
                ];
                //define the selection
                let Selection = new MessageSelectMenu()
                    .setCustomId("MenuSelection")
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder("Click me to setup the Auto Delete System!")
                    .addOptions(
                        menuoptions.map(option => {
                            let Obj = {
                                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                value: option.value.substring(0, 50),
                                description: option.description.substring(0, 50),
                            };
                            if (option.emoji) Obj.emoji = option.emoji;
                            return Obj;
                        })
                    );

                //define the embed
                let MenuEmbed = new Discord.MessageEmbed()
                    .setColor(es.color)
                    .setAuthor(
                        "Auto Delete Setup",
                        "https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96",
                        "https://discord.gg/milrato"
                    )
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]));
                let used1 = false;
                //send the menu msg
                let menumsg = await message.reply({
                    embeds: [MenuEmbed],
                    components: [new MessageActionRow().addComponents(Selection)],
                });
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                    time: 90000,
                });
                //Menu Collections
                collector.on("collect", menu => {
                    if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0]);
                        if (menu?.values[0] == "Cancel")
                            return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]));
                        menu?.deferUpdate();
                        used1 = true;
                        handle_the_picks(menu?.values[0], menuoptiondata);
                    } else
                        menu?.reply({
                            content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
                            ephemeral: true,
                        });
                });
                //Once the Collections ended edit the menu message
                collector.on("end", collected => {
                    menumsg.edit({
                        embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                        components: [],
                        content: `${collected && collected.first() && collected.first().values ? `${allEmojis.msg.SUCCESS} **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}`,
                    });
                });
            }
            async function handle_the_picks(optionhandletype, menuoptiondata) {
                client.setups.ensure(message.guild.id, {
                    autodelete: [
                        /*{ id: "840330596567089173", delay: 15000 }*/
                    ],
                });
                switch (optionhandletype) {
                    case "Add a Channel":
                        {
                            let tempmsg = await message.reply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setTitle(`**Which Channel do you wanna add?**`)
                                        .setColor(es.color)
                                        .setDescription(
                                            `Please Ping the **Channel** now! / Send the **ID** the **Channel/Category/Talk**!\nAnd add the **Duration** in **Seconds** afterwards!\n\n**Example:**\n> \`#Channel 30\``
                                        )
                                        .setFooter(client.getFooter(es)),
                                ],
                            });
                            await tempmsg.channel
                                .awaitMessages({
                                    filter: m => m.author.id === message.author.id,
                                    max: 1,
                                    time: 90000,
                                    errors: ["time"],
                                })
                                .then(collected => {
                                    var message = collected.first();
                                    var channel =
                                        message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() ||
                                        message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                                    if (channel) {
                                        try {
                                            var a = client.setups.get(message.guild.id, "autodelete");
                                            //remove invalid ids
                                            for (const id of a) {
                                                if (!message.guild.channels.cache.get(id.id)) {
                                                    client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete");
                                                }
                                            }
                                            a = client.setups.get(message.guild.id, "autodelete");
                                            if (a.map(d => d.id).includes(channel.id))
                                                return message.reply({
                                                    embeds: [
                                                        new Discord.MessageEmbed()
                                                            .setTitle(
                                                                `<:no:833101993668771842> This Channel is already Setupped!`
                                                            )
                                                            .setDescription(
                                                                `Remove it first with \`${prefix}setup-autodelete\` --> Then Pick Remove!`
                                                            )
                                                            .setColor(es.color)
                                                            .setFooter(client.getFooter(es)),
                                                    ],
                                                });
                                            var args = message.content.split(" ");
                                            var time = Number(args[1]);
                                            if (!time || isNaN(time))
                                                return message.reply({
                                                    embeds: [
                                                        new Discord.MessageEmbed()
                                                            .setTitle(`<:no:833101993668771842> Invalid Input | Time wrong`)
                                                            .setDescription(
                                                                `You probably forgot / didn't add a Time!\nTry this: \`${channel.id} 30\``
                                                            )
                                                            .setColor(es.color)
                                                            .setFooter(client.getFooter(es)),
                                                    ],
                                                });
                                            if (time > 60 * 60 || time < 3)
                                                return message.reply({
                                                    embeds: [
                                                        new Discord.MessageEmbed()
                                                            .setTitle(`<:no:833101993668771842> Time out of Range!`)
                                                            .setDescription(
                                                                `The longest Amount is 1 hour aka 3600 Seconds and the Time must be at least 3 Seconds long!`
                                                            )
                                                            .setColor(es.color)
                                                            .setFooter(client.getFooter(es)),
                                                    ],
                                                });
                                            client.setups.push(
                                                message.guild.id,
                                                { id: channel.id, delay: time * 1000 },
                                                "autodelete"
                                            );
                                            return message.reply({
                                                embeds: [
                                                    new Discord.MessageEmbed()
                                                        .setTitle(
                                                            `${allEmojis.msg.SUCCESS} I will now delete Messages after \`${time} Seconds\` in **${channel.name}**`
                                                        )
                                                        .setColor(es.color)
                                                        .setFooter(client.getFooter(es)),
                                                ],
                                            });
                                        } catch (e) {
                                            return message.reply({
                                                embeds: [
                                                    new Discord.MessageEmbed()
                                                        .setTitle(
                                                            eval(
                                                                client.la[ls]["cmds"]["setup"]["setup-autoembed"][
                                                                    "variable10"
                                                                ]
                                                            )
                                                        )
                                                        .setColor(es.wrongcolor)
                                                        .setDescription(
                                                            eval(
                                                                client.la[ls]["cmds"]["setup"]["setup-autoembed"][
                                                                    "variable11"
                                                                ]
                                                            )
                                                        )
                                                        .setFooter(client.getFooter(es)),
                                                ],
                                            });
                                        }
                                    } else {
                                        return message.reply("you didn't ping a valid Channel");
                                    }
                                })
                                .catch(e => {
                                    console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                    return message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(
                                                    eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"])
                                                )
                                                .setColor(es.wrongcolor)
                                                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                                .setFooter(client.getFooter(es)),
                                        ],
                                    });
                                });
                        }
                        break;
                    case "Remove a Channel":
                        {
                            let tempmsg = await message.reply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable13"]))
                                        .setColor(es.color)
                                        .setDescription(
                                            eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable14"])
                                        )
                                        .setFooter(client.getFooter(es)),
                                ],
                            });
                            await tempmsg.channel
                                .awaitMessages({
                                    filter: m => m.author.id === message.author.id,
                                    max: 1,
                                    time: 90000,
                                    errors: ["time"],
                                })
                                .then(collected => {
                                    var message = collected.first();
                                    var channel =
                                        message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() ||
                                        message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                                    if (channel) {
                                        try {
                                            var a = client.setups.get(message.guild.id, "autodelete");
                                            //remove invalid ids
                                            for (const id of a) {
                                                if (!message.guild.channels.cache.get(id.id)) {
                                                    client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete");
                                                }
                                            }
                                            a = client.setups.get(message.guild.id, "autodelete");
                                            if (!a.map(d => d.id).includes(channel.id))
                                                return message.reply({
                                                    embeds: [
                                                        new Discord.MessageEmbed()
                                                            .setTitle(
                                                                `<:no:833101993668771842> This Channel has not been Setup yet!`
                                                            )
                                                            .setColor(es.color)
                                                            .setFooter(client.getFooter(es)),
                                                    ],
                                                });
                                            client.setups.remove(message.guild.id, d => d.id == channel.id, "autodelete");
                                            return message.reply({
                                                embeds: [
                                                    new Discord.MessageEmbed()
                                                        .setTitle(
                                                            `${allEmojis.msg.SUCCESS} Successfully removed **${channel.name}** out of the Setup!`
                                                        )
                                                        .setColor(es.color)
                                                        .setFooter(client.getFooter(es)),
                                                ],
                                            });
                                        } catch (e) {
                                            return message.reply({
                                                embeds: [
                                                    new Discord.MessageEmbed()
                                                        .setTitle(
                                                            eval(
                                                                client.la[ls]["cmds"]["setup"]["setup-autoembed"][
                                                                    "variable18"
                                                                ]
                                                            )
                                                        )
                                                        .setColor(es.wrongcolor)
                                                        .setDescription(
                                                            eval(
                                                                client.la[ls]["cmds"]["setup"]["setup-autoembed"][
                                                                    "variable19"
                                                                ]
                                                            )
                                                        )
                                                        .setFooter(client.getFooter(es)),
                                                ],
                                            });
                                        }
                                    } else {
                                        return message.reply("you didn't ping a valid Channel");
                                    }
                                })
                                .catch(e => {
                                    console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                    return message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(
                                                    eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"])
                                                )
                                                .setColor(es.wrongcolor)
                                                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                                .setFooter(client.getFooter(es)),
                                        ],
                                    });
                                });
                        }
                        break;
                    case "Show all Channels":
                        {
                            var a = client.setups.get(message.guild.id, "autodelete");
                            //remove invalid ids
                            for (const id of a) {
                                if (!message.guild.channels.cache.get(id.id)) {
                                    client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete");
                                }
                            }
                            a = client.setups.get(message.guild.id, "autodelete");

                            message.reply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setTitle(`📑 Settings of the Auto Deletion System`)
                                        .setColor(es.color)
                                        .setDescription(
                                            `**Channels where Messages will automatically be deleted:**\n${a.map(d => `<#${d.id}> [After: ${duration(d.delay).join(", ")}]`)}`
                                        )
                                        .setFooter(client.getFooter(es)),
                                ],
                            });
                        }
                        break;
                }
            }
        } catch (e) {
            console.log(String(e.stack).grey.bgRed);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable26"])),
                ],
            });
        }
    },
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
