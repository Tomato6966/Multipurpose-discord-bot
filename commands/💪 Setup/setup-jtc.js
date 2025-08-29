var { MessageEmbed } = require("discord.js");
var Discord = require("discord.js");
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var { databasing } = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { getNumberEmojis, allEmojis } = require("../../botconfig/emojiFunctions");
module.exports = {
    name: "setup-jtc",
    category: "💪 Setup",
    aliases: ["setup-jointocreate", "setupjtc", "setupjointocreate", "jtc-setup", "jtcsetup"],
    cooldown: 5,
    usage: "setup-jtc  -->  Follow Steps",
    description: "Manage 25 different Join to Create Systems",
    type: "system",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");
        let ls = client.settings.get(message.guild.id, "language");
        var timeouterror;
        try {
            const NumberEmojis = getNumberEmojis();
            first_layer();
            async function first_layer() {
                let menuoptions = [];
                for (let i = 0; i < 100; i++) {
                    const emoji = NumberEmojis[index + 1];
                    menuoptions.push({
                        value: `${i + 1} Join-To-Create System`,
                        description: `Manage/Edit the ${i + 1} Join-to-Create Setup`,
                        ...(emoji ? { emoji } : {}),
                    });
                }

                let row1 = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("MenuSelection")
                        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder("Click me to setup the Join-to-Create System!")
                        .addOptions(
                            menuoptions.slice(0, 25).map(option => {
                                let Obj = {
                                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                    value: option.value.substring(0, 50),
                                    description: option.description.substring(0, 50),
                                };
                                if (option.emoji) Obj.emoji = option.emoji;
                                return Obj;
                            })
                        )
                );
                let row2 = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("MenuSelection2")
                        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder("Click me to setup the Join-to-Create System!")
                        .addOptions(
                            menuoptions.slice(25, 50).map(option => {
                                let Obj = {
                                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                    value: option.value.substring(0, 50),
                                    description: option.description.substring(0, 50),
                                };
                                if (option.emoji) Obj.emoji = option.emoji;
                                return Obj;
                            })
                        )
                );
                let row3 = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("MenuSelection3")
                        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder("Click me to setup the Join-to-Create System!")
                        .addOptions(
                            menuoptions.slice(50, 75).map(option => {
                                let Obj = {
                                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                    value: option.value.substring(0, 50),
                                    description: option.description.substring(0, 50),
                                };
                                if (option.emoji) Obj.emoji = option.emoji;
                                return Obj;
                            })
                        )
                );
                let row4 = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("MenuSelection4")
                        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder("Click me to setup the Join-to-Create System!")
                        .addOptions(
                            menuoptions.slice(75, 100).map(option => {
                                let Obj = {
                                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                    value: option.value.substring(0, 50),
                                    description: option.description.substring(0, 50),
                                };
                                if (option.emoji) Obj.emoji = option.emoji;
                                return Obj;
                            })
                        )
                );

                //define the embed
                let MenuEmbed = new Discord.MessageEmbed()
                    .setColor(es.color)
                    .setAuthor(
                        "Join-to-Create Setup",
                        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/studio-microphone_1f399-fe0f.png",
                        "https://discord.gg/milrato"
                    )
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]));
                //send the menu msg
                let menumsg = await message.reply({ embeds: [MenuEmbed], components: [row1, row2, row3, row4] });
                //function to handle the menuselection
                function menuselection(menu) {
                    let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0]);
                    if (menu?.values[0] == "Cancel")
                        return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]));
                    menu?.deferUpdate();
                    let SetupNumber = menu?.values[0].split(" ")[0];
                    second_layer(SetupNumber, menuoptiondata);
                }
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
                        menuselection(menu);
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
            async function second_layer(SetupNumber, menuoptiondata) {
                var pre = `jtcsettings${SetupNumber}`;
                let thedb = client.jtcsettings;
                thedb?.ensure(
                    message.guild.id,
                    {
                        channel: "",
                        channelname: "{user}' Lounge",
                        guild: message.guild.id,
                    },
                    pre
                );
                let menuoptions = [
                    {
                        value: "Create Channel Setup",
                        description: `Create a Join to Create Channel`,
                        emoji: allEmojis.msg.setup,
                    },
                    {
                        value: "Use Current Channel",
                        description: `Use your connected VC as a new Setup`,
                        emoji: allEmojis.msg.dj,
                    },
                    {
                        value: "Change the Temp Names",
                        description: `Change the temporary Names of new VCS`,
                        emoji: allEmojis.msg.setup,
                    },
                    {
                        value: "Cancel",
                        description: `Cancel and stop the Ticket-Setup!`,
                        emoji: allEmojis.msg.cancel,
                    },
                ];
                //define the selection
                let Selection = new MessageSelectMenu()
                    .setCustomId("MenuSelection")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder(
                        `Click me to manage the ${SetupNumber} Join-To-Create System!\n\n**You've picked:**\n> ${menuoptiondata.value}`
                    )
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
                        client.getAuthor(
                            SetupNumber + " Join-to-Create Setup",
                            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/studio-microphone_1f399-fe0f.png",
                            "https://discord.gg/milrato"
                        )
                    )
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]));
                //send the menu msg
                let menumsg = await message.reply({
                    embeds: [MenuEmbed],
                    components: [new MessageActionRow().addComponents(Selection)],
                });
                //function to handle the menuselection
                function menuselection(menu) {
                    if (menu?.values[0] == "Cancel")
                        return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]));
                    menu?.deferUpdate();
                    handle_the_picks(menu?.values[0], SetupNumber, thedb, pre);
                }
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                    time: 90000,
                });
                //Menu Collections
                collector.on("collect", menu => {
                    if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        if (menu?.values[0] == "Cancel")
                            return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]));
                        menuselection(menu);
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
            async function handle_the_picks(optionhandletype, SetupNumber, thedb, pre) {
                switch (optionhandletype) {
                    case "Create Channel Setup":
                        {
                            var maxbitrate = 96000;
                            var boosts = message.guild.premiumSubscriptionCount;
                            if (boosts >= 2) maxbitrate = 128000;
                            if (boosts >= 15) maxbitrate = 256000;
                            if (boosts >= 30) maxbitrate = 384000;
                            message.guild.channels
                                .create("Join to Create", {
                                    type: "GUILD_VOICE",
                                    bitrate: maxbitrate,
                                    userLimit: 4,
                                    permissionOverwrites: [
                                        //update the permissions
                                        {
                                            //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                                            id: message.guild.id,
                                            allow: ["VIEW_CHANNEL", "CONNECT"],
                                            deny: ["SPEAK"],
                                        },
                                    ],
                                })
                                .then(vc => {
                                    if (message.channel.parent) vc.setParent(message.channel.parent.id);
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable6"]))
                                                .setColor(es.color)
                                                .setDescription(
                                                    eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable7"])
                                                )
                                                .setFooter(client.getFooter(es)),
                                        ],
                                    });
                                    thedb?.set(message.guild.id, vc.id, `${pre}.channel`);
                                });
                        }
                        break;
                    case "Use Current Channel":
                        {
                            var { channel } = message.member.voice;
                            if (!channel)
                                return message.reply({
                                    embeds: [
                                        new Discord.MessageEmbed()
                                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable8"]))
                                            .setColor(es.wrongcolor)
                                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable9"]))
                                            .setFooter(client.getFooter(es)),
                                    ],
                                });
                            message.reply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable10"]))
                                        .setColor(es.color)
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable11"]))
                                        .setFooter(client.getFooter(es)),
                                ],
                            });
                            thedb?.set(message.guild.id, channel.id, `${pre}.channel`);
                        }
                        break;
                    case "Change the Temp Names":
                        {
                            var tempmsg = await message.reply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable12"]))
                                        .setColor(es.color)
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable13"]))
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
                                    thedb?.set(
                                        message.guild.id,
                                        `${collected.first().content}`.substring(0, 32),
                                        pre + ".channelname"
                                    );
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable14"]))
                                                .setColor(es.color)
                                                .setDescription(
                                                    `**New Channel Name:**\n> \`${thedb?.get(message.guild.id, pre + ".channelname")}\`\n\n**What it could look like:**\n> \`${thedb?.get(message.guild.id, pre + ".channelname").replace("{user}", `${message.author.username}`)}\``
                                                )
                                                .setFooter(client.getFooter(es)),
                                        ],
                                    });
                                })
                                .catch(e => {
                                    timeouterror = e;
                                });
                            if (timeouterror)
                                return message.reply({
                                    embeds: [
                                        new Discord.MessageEmbed()
                                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable16"]))
                                            .setColor(es.wrongcolor)
                                            .setDescription(`Cancelled the Operation!`.substring(0, 2000))
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
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable45"])),
                ],
            });
        }
    },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
