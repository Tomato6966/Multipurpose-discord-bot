var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var { databasing } = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { getNumberEmojis, isEmoji, allEmojis } = require("../../botconfig/emojiFunctions");
module.exports = {
    name: "setup-autosupport",
    category: "💪 Setup",
    aliases: ["setupautosupport", "autosupport-setup", "autosupportsetup", "autosupportsystem"],
    cooldown: 5,
    usage: "setup-autosupport --> Follow Steps",
    description: "Manage up to 25 different Auto-Support Messages in a DISCORD-MENU",
    memberpermissions: ["ADMINISTRATOR"],
    type: "system",
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");
        let ls = client.settings.get(message.guild.id, "language");
        try {
            let theDB = client.autosupport;
            let pre;
            const defaultEmoji = "🅾️";
            const NumberEmojis = getNumberEmojis();

            first_layer();
            async function first_layer() {
                let menuoptions = [];
                for (let i = 1; i <= 100; i++) {
                    menuoptions.push({
                        value: `${i}. Auto Support`,
                        description: `Manage/Edit the ${i}. Auto Support Setup`,
                        emoji: NumberEmojiIds[i],
                    });
                }

                let row1 = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("MenuSelection")
                        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder("Click me to setup the Auto Support System!")
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
                        .setPlaceholder("Click me to setup the Auto Support System!")
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
                        .setPlaceholder("Click me to setup the Auto Support System!")
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
                        .setPlaceholder("Click me to setup the Auto Support System!")
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
                        client.getAuthor(
                            "Auto Support Setup",
                            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png",
                            "https://discord.gg/milrato"
                        )
                    )
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]));

                //send the menu msg
                let menumsg = await message.reply({
                    embeds: [MenuEmbed],
                    components: [
                        row1,
                        row2,
                        row3,
                        row4,
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setStyle("LINK")
                                .setURL("https://youtu.be/QGESDc31d4U")
                                .setLabel("Tutorial Video")
                                .setEmoji(allEmojis.msg.youtube)
                        ),
                    ],
                });
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                    time: 90000,
                    errors: ["time"],
                });
                //Menu Collections
                collector.on("collect", menu => {
                    if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0]);
                        if (menu?.values[0] == "Cancel")
                            return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]));
                        menu?.deferUpdate();
                        let SetupNumber = menu?.values[0].split(".")[0];
                        pre = `autosupport${SetupNumber}`;
                        theDB = client.autosupport; //change to the right database
                        second_layer();
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
                        content: `${allEmojis.msg.SUCCESS} **Selected: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`,
                    });
                });
            }
            async function second_layer() {
                //setup-autosupport
                theDB.ensure(
                    message.guild.id,
                    {
                        messageId: "",
                        channelId: "",
                        data: [
                            /*
              {
                value: "",
                emoji: "",
                description: "",
                sendEmbed: true,
                replyMsg: "{user} Welcome to the Support!"
              }
            */
                        ],
                    },
                    pre
                );
                let menuoptions = [
                    {
                        value: "Send the Config	Message",
                        description: `(Re) Send the auto-responding Support Message (with MENU)`,
                        emoji: "👍",
                    },
                    {
                        value: "Add AutoSup Option",
                        description: `Add up to 25 different auto-responding Support Options`,
                        emoji: "📤",
                    },
                    {
                        value: "Edit AutoSup Option",
                        description: `Edit one of the auto-responding Support Options`,
                        emoji: "✒️",
                    },
                    {
                        value: "Remove AutoSup Option",
                        description: `Remove auto-responding Support Options`,
                        emoji: "🗑",
                    },
                ];
                //define the selection
                let Selection = new MessageSelectMenu()
                    .setCustomId("MenuSelection")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Click me to setup the Auto-Support System!")
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
                        "Auto Support Setup",
                        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/question-mark_2753.png",
                        "https://discord.gg/milrato"
                    )
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]));
                //send the menu msg
                let menumsg = await message.reply({
                    embeds: [MenuEmbed],
                    components: [new MessageActionRow().addComponents(Selection)],
                });
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                    time: 90000,
                    errors: ["time"],
                });
                //Menu Collections
                collector.on("collect", menu => {
                    if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0]);
                        if (menu?.values[0] == "Cancel")
                            return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]));
                        menu?.deferUpdate();
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
                        content: `${allEmojis.msg.SUCCESS} **Selected: \`${collected && collected.first() && collected.first().values.length > 0 ? collected.first().values[0] : "Nothing"}\`**`,
                    });
                });
            }
            async function handle_the_picks(optionhandletype, menuoptiondata) {
                switch (optionhandletype) {
                    case "Send the Config	Message":
                        {
                            let data = theDB.get(message.guild.id, pre + ".data");
                            let settings = theDB.get(message.guild.id, pre);
                            if (!data || data.length < 1) {
                                return message.reply(
                                    "<:no:833101993668771842> **You need to add at least 1 Auto-Support-Option**"
                                );
                            }
                            let tempmsg = await message.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(es.color)
                                        .setTitle("What should be the Text to display in the Embed?")
                                        .setDescription(
                                            `For Example:\n> \`\`\`To get general Help for our Server and our Topics, make sure to select the right option!\`\`\``
                                        ),
                                ],
                            });

                            let collected = await tempmsg.channel.awaitMessages({
                                filter: m => m.author.id == cmduser.id,
                                max: 1,
                                time: 90000,
                                errors: ["time"],
                            });
                            if (collected && collected.first().content) {
                                let tempmsg = await message.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(es.color)
                                            .setTitle("In where should I send the Auto-Support Message?")
                                            .setDescription(
                                                `Please Ping the Channel now!\n> Just type: \`#channel\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Before it was: <#${settings.channelId}>` : settings.channelId ? `| Before it was: ${settings.channelId} (Channel got deleted)` : ""}\n\nYou can edit the Title etc. afterwards by using the \`${prefix}editembed\` Command`
                                            ),
                                    ],
                                });

                                let collected2 = await tempmsg.channel.awaitMessages({
                                    filter: m => m.author.id == cmduser.id,
                                    max: 1,
                                    time: 90000,
                                    errors: ["time"],
                                });
                                if (collected2 && collected2.first().mentions.channels.size > 0) {
                                    let data = theDB.get(message.guild.id, pre + ".data");
                                    let channel = collected2.first().mentions.channels.first();
                                    let msgContent = collected.first().content;
                                    let embed = new MessageEmbed()
                                        .setColor(es.color)
                                        .setThumbnail(
                                            es.thumb
                                                ? es.footericon &&
                                                  (es.footericon.includes("http://") || es.footericon.includes("https://"))
                                                    ? es.footericon
                                                    : client.user.displayAvatarURL()
                                                : null
                                        )
                                        .setFooter(client.getFooter(es))
                                        .setDescription(msgContent)
                                        .setTitle(":question: Auto Support");
                                    //define the selection
                                    let Selection = new MessageSelectMenu()
                                        .setCustomId("MenuSelection")
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                        .setPlaceholder("Click me to Access the Auto-Support System!")
                                        .addOptions(
                                            data.map((option, index) => {
                                                let Obj = {
                                                    label: option.value.substring(0, 50),
                                                    value: option.value.substring(0, 50),
                                                    description: option.description.substring(0, 50),
                                                    emoji: isEmoji(client, message, option.emoji)
                                                        ? option.emoji
                                                        : NumberEmojiIds[index + 1],
                                                };
                                                return Obj;
                                            })
                                        );
                                    channel
                                        .send({
                                            embeds: [embed],
                                            components: [new MessageActionRow().addComponents([Selection])],
                                        })
                                        .catch(() => {
                                            let Selection = new MessageSelectMenu()
                                                .setCustomId("MenuSelection")
                                                .setMaxValues(1)
                                                .setMinValues(1)
                                                .setPlaceholder("Click me to Access the Auto-Support System!")
                                                .addOptions(
                                                    data.map((option, index) => {
                                                        let Obj = {
                                                            label: option.value.substring(0, 50),
                                                            value: option.value.substring(0, 50),
                                                            description: option.description.substring(0, 50),
                                                            emoji: NumberEmojiIds[index + 1],
                                                        };
                                                        return Obj;
                                                    })
                                                );
                                            channel
                                                .send({
                                                    embeds: [embed],
                                                    components: [new MessageActionRow().addComponents([Selection])],
                                                })
                                                .catch(() => {})
                                                .then(msg => {
                                                    theDB.set(message.guild.id, msg.id, pre + ".messageId");
                                                    theDB.set(message.guild.id, channel.id, pre + ".channelId");
                                                    message.reply(
                                                        `Successfully Setupped the Auto-Support-System in <#${channel.id}>`
                                                    );
                                                });
                                        })
                                        .then(msg => {
                                            theDB.set(message.guild.id, msg.id, pre + ".messageId");
                                            theDB.set(message.guild.id, channel.id, pre + ".channelId");
                                            message.reply(
                                                `Successfully Setupped the Auto-Support-System in <#${channel.id}>`
                                            );
                                        });
                                } else {
                                    return message.reply("<:no:833101993668771842> **You did not ping a valid Channel!**");
                                }
                            } else {
                                return message.reply(
                                    "<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**"
                                );
                            }
                        }
                        break;
                    case "Add AutoSup Option":
                        {
                            let data = theDB.get(message.guild.id, pre + ".data");
                            if (data.length >= 25) {
                                return message.reply(
                                    "<:no:833101993668771842> **You reached the limit of 25 different Options!** Remove another Option first!"
                                );
                            }
                            //ask for value and description
                            let tempmsg = await message.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(es.color)
                                        .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                                        .setDescription(
                                            `**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`Where to get Help++To Get Help visit #ticket-support!\`\`\``
                                        ),
                                ],
                            });
                            let collected = await tempmsg.channel.awaitMessages({
                                filter: m => m.author.id == cmduser.id,
                                max: 1,
                                time: 90000,
                                errors: ["time"],
                            });
                            if (collected && collected.first().content) {
                                if (!collected.first().content.includes("++"))
                                    return message.reply(
                                        "<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**"
                                    );
                                let value = collected.first().content.split("++")[0].trim().substring(0, 25);
                                let index2 = data.findIndex(v => v.value == value);
                                if (index2 >= 0 && index != index2) {
                                    return message.reply(
                                        "<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!"
                                    );
                                }
                                let description = collected.first().content.split("++")[1].trim().substring(0, 50);
                                let tempmsg = await message.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(es.color)
                                            .setTitle("Should the Response be inside of an Embed?"),
                                    ],
                                    components: [
                                        new MessageActionRow().addComponents([
                                            new MessageButton()
                                                .setStyle("SUCCESS")
                                                .setLabel("In an Embed")
                                                .setEmoji("✅")
                                                .setCustomId("yes"),
                                            new MessageButton()
                                                .setStyle("DANGER")
                                                .setLabel("Not in an Embed")
                                                .setEmoji("❌")
                                                .setCustomId("no"),
                                        ]),
                                    ],
                                });
                                //Create the collector
                                const collector = tempmsg.createMessageComponentCollector({
                                    filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                                    time: 90000,
                                    errors: ["time"],
                                });
                                //button Collections
                                collector.on("collect", async button => {
                                    if (button?.user.id === cmduser.id) {
                                        collector.stop();
                                        var sendEmbed = true;
                                        if (button?.customId != "yes") {
                                            sendEmbed = false;
                                        }

                                        let tempmsg = await message.reply({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(es.color)
                                                    .setTitle(
                                                        "What should be the Reply Message Content when someone Selects an Auto-Support-Option?"
                                                    )
                                                    .setDescription(
                                                        `For Example:\n> \`\`\`{user} Make sure to check out #ticket-support Channel to open a Ticket!\`\`\``
                                                    ),
                                            ],
                                        });
                                        let collected3 = await tempmsg.channel.awaitMessages({
                                            filter: m => m.author.id == cmduser.id,
                                            max: 1,
                                            time: 90000,
                                            errors: ["time"],
                                        });
                                        if (collected3 && collected3.first().content) {
                                            let replyMsg = collected3.first().content;

                                            var rermbed = new MessageEmbed()
                                                .setColor(es.color)
                                                .setTitle("What should be the EMOJI to be displayed?")
                                                .setDescription(
                                                    `React to __THIS MESSAGE__ with the Emoji you want!\n> Either click on the default Emoji or add a CUSTOM ONE/Standard`
                                                );

                                            var emoji;
                                            message.reply({ embeds: [rermbed] }).then(async msg => {
                                                await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                                                msg.awaitReactions({
                                                    filter: (reaction, user) => user.id == cmduser.id,
                                                    max: 1,
                                                    time: 180e3,
                                                })
                                                    .then(async collected => {
                                                        await msg.reactions.removeAll().catch(console.warn);
                                                        if (
                                                            collected.first().emoji?.id &&
                                                            collected.first().emoji?.id.length > 2
                                                        ) {
                                                            emoji = collected.first().emoji?.id;
                                                            if (collected.first().emoji?.animated)
                                                                emojiMsg =
                                                                    "<" +
                                                                    "a:" +
                                                                    collected.first().emoji?.name +
                                                                    ":" +
                                                                    collected.first().emoji?.id +
                                                                    ">";
                                                            else
                                                                emojiMsg =
                                                                    "<" +
                                                                    ":" +
                                                                    collected.first().emoji?.name +
                                                                    ":" +
                                                                    collected.first().emoji?.id +
                                                                    ">";
                                                        } else if (collected.first().emoji?.name) {
                                                            emoji = collected.first().emoji?.name;
                                                            emojiMsg = collected.first().emoji?.name;
                                                        } else {
                                                            message.reply(
                                                                `${allEmojis.msg.ERROR} **No valid emoji added, using default EMOJI**`
                                                            );
                                                            emoji = null;
                                                            emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                        }

                                                        try {
                                                            await msg.react(emoji);
                                                            if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                                                                emoji = null;
                                                                emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                            }
                                                        } catch (e) {
                                                            console.log(e);
                                                            message.reply(
                                                                `${allEmojis.msg.ERROR} **Could not use the CUSTOM EMOJI you added, as I can't access it / use it as a reaction/emoji for the menu**\nUsing default emoji!`
                                                            );
                                                            emoji = null;
                                                            emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                        }
                                                        finished();
                                                    })
                                                    .catch(() => {
                                                        message.reply(`${allEmojis.msg.ERROR} **No valid emoji added, using default EMOJI**`);
                                                        emoji = null;
                                                        emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                        finished();
                                                    });
                                            });
                                            function finished() {
                                                theDB.push(
                                                    message.guild.id,
                                                    {
                                                        value,
                                                        description,
                                                        sendEmbed,
                                                        replyMsg,
                                                        emoji,
                                                    },
                                                    pre + ".data"
                                                );
                                                message.reply({
                                                    embeds: [
                                                        new MessageEmbed()
                                                            .setColor(es.color)
                                                            .setTitle("Successfully added the New Data to the List!")
                                                            .setDescription(
                                                                `Make sure to re-send the Message, so that it's also updating it!\n> \`${prefix}setup-autosupport\` --> Send Config Message`
                                                            ),
                                                    ],
                                                });
                                            }
                                        } else {
                                            return message.reply(
                                                "<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**"
                                            );
                                        }
                                    }
                                });
                                //Once the Collections ended edit the menu message
                                collector.on("end", collected => {
                                    tempmsg.edit({
                                        embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
                                        components: [],
                                        content: `${allEmojis.msg.SUCCESS} **Selected: \`${collected ? collected.customId : "Nothing | CANCELLED"}\`**`,
                                    });
                                });
                            } else {
                                return message.reply(
                                    "<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**"
                                );
                            }
                        }
                        break;
                    case "Edit AutoSup Option":
                        {
                            let data = theDB.get(message.guild.id, pre + ".data");
                            if (!data || data.length < 1) {
                                return message.reply(
                                    "<:no:833101993668771842> **There are no Open-Ticket-Options to edit**"
                                );
                            }
                            let embed = new MessageEmbed()
                                .setColor(es.color)
                                .setThumbnail(
                                    es.thumb
                                        ? es.footericon &&
                                          (es.footericon.includes("http://") || es.footericon.includes("https://"))
                                            ? es.footericon
                                            : client.user.displayAvatarURL()
                                        : null
                                )
                                .setFooter(client.getFooter(es))
                                .setDescription("Just pick the Options you want to edit!")
                                .setTitle("Which Option do you want to edit?");
                            //define the selection
                            let Selection = new MessageSelectMenu()
                                .setCustomId("MenuSelection")
                                .setMaxValues(1)
                                .setMinValues(1)
                                .setPlaceholder("Click me to setup the Auto-Support System!")
                                .addOptions(
                                    data.map((option, index) => {
                                        let Obj = {
                                            label: option.value.substring(0, 50),
                                            value: option.value.substring(0, 50),
                                            description: option.description.substring(0, 50),
                                            emoji: isEmoji(client, message, option.emoji)
                                                ? option.emoji
                                                : NumberEmojiIds[index + 1],
                                        };
                                        return Obj;
                                    })
                                );
                            //send the menu msg
                            let menumsg;
                            menumsg = await message
                                .reply({
                                    embeds: [embed],
                                    components: [new MessageActionRow().addComponents([Selection])],
                                })
                                .catch(async () => {
                                    let Selection = new MessageSelectMenu()
                                        .setCustomId("MenuSelection")
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                        .setPlaceholder("Click me to setup the Auto-Support System!")
                                        .addOptions(
                                            data.map((option, index) => {
                                                let Obj = {
                                                    label: option.value.substring(0, 50),
                                                    value: option.value.substring(0, 50),
                                                    description: option.description.substring(0, 50),
                                                    emoji: NumberEmojiIds[index + 1],
                                                };
                                                return Obj;
                                            })
                                        );
                                    menumsg = await message.reply({
                                        embeds: [embed],
                                        components: [new MessageActionRow().addComponents([Selection])],
                                    });
                                });
                            //Create the collector
                            const collector = menumsg.createMessageComponentCollector({
                                filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                                time: 90000,
                                errors: ["time"],
                            });
                            //Menu Collections
                            collector.on("collect", async menu => {
                                if (menu?.user.id === cmduser.id) {
                                    collector.stop();
                                    let index = data.findIndex(v => v.value == menu?.values[0]);

                                    //ask for value and description
                                    let tempmsg = await message.reply({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(es.color)
                                                .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                                                .setDescription(
                                                    `**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`Where to get Help++To Get Help visit #ticket-support!\`\`\``
                                                ),
                                        ],
                                    });
                                    let collected = await tempmsg.channel.awaitMessages({
                                        filter: m => m.author.id == cmduser.id,
                                        max: 1,
                                        time: 90000,
                                        errors: ["time"],
                                    });
                                    if (collected && collected.first().content) {
                                        if (!collected.first().content.includes("++"))
                                            return message.reply(
                                                "<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**"
                                            );
                                        let value = collected.first().content.split("++")[0].trim().substring(0, 25);
                                        let index2 = data.findIndex(v => v.value == value);
                                        if (index2 >= 0 && index != index2) {
                                            return message.reply(
                                                "<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!"
                                            );
                                        }
                                        let description = collected.first().content.split("++")[1].trim().substring(0, 50);
                                        let tempmsg = await message.reply({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(es.color)
                                                    .setTitle("Should the Response be inside of an Embed?"),
                                            ],
                                            components: [
                                                new MessageActionRow().addComponents([
                                                    new MessageButton()
                                                        .setStyle("SUCCESS")
                                                        .setLabel("In an Embed")
                                                        .setEmoji("✅")
                                                        .setCustomId("yes"),
                                                    new MessageButton()
                                                        .setStyle("DANGER")
                                                        .setLabel("Not in an Embed")
                                                        .setEmoji("❌")
                                                        .setCustomId("no"),
                                                ]),
                                            ],
                                        });
                                        //Create the collector
                                        const collector = tempmsg.createMessageComponentCollector({
                                            filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                                            time: 90000,
                                            errors: ["time"],
                                        });
                                        //button Collections
                                        collector.on("collect", async button => {
                                            if (button?.user.id === cmduser.id) {
                                                collector.stop();
                                                var sendEmbed = true;
                                                if (button?.customId != "yes") {
                                                    sendEmbed = false;
                                                }

                                                let tempmsg = await message.reply({
                                                    embeds: [
                                                        new MessageEmbed()
                                                            .setColor(es.color)
                                                            .setTitle(
                                                                "What should be the Reply Message Content when someone Selects an Auto-Support-Option?"
                                                            )
                                                            .setDescription(
                                                                `For Example:\n> \`\`\`{user} Make sure to check out #ticket-support Channel to open a Ticket!\`\`\``
                                                            ),
                                                    ],
                                                });
                                                let collected3 = await tempmsg.channel.awaitMessages({
                                                    filter: m => m.author.id == cmduser.id,
                                                    max: 1,
                                                    time: 90000,
                                                    errors: ["time"],
                                                });
                                                if (collected3 && collected3.first().content) {
                                                    let replyMsg = collected3.first().content;

                                                    var rermbed = new MessageEmbed()
                                                        .setColor(es.color)
                                                        .setTitle("What should be the EMOJI to be displayed?")
                                                        .setDescription(
                                                            `React to __THIS MESSAGE__ with the Emoji you want!\n> Either click on the default Emoji or add a CUSTOM ONE/Standard`
                                                        );

                                                    var emoji;
                                                    message.reply({ embeds: [rermbed] }).then(async msg => {
                                                        await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                                                        msg.awaitReactions({
                                                            filter: (reaction, user) => user.id == cmduser.id,
                                                            max: 1,
                                                            time: 180e3,
                                                        })
                                                            .then(async collected => {
                                                                await msg.reactions.removeAll().catch(console.warn);
                                                                if (
                                                                    collected.first().emoji?.id &&
                                                                    collected.first().emoji?.id.length > 2
                                                                ) {
                                                                    emoji = collected.first().emoji?.id;
                                                                    if (collected.first().emoji?.animated)
                                                                        emojiMsg =
                                                                            "<" +
                                                                            "a:" +
                                                                            collected.first().emoji?.name +
                                                                            ":" +
                                                                            collected.first().emoji?.id +
                                                                            ">";
                                                                    else
                                                                        emojiMsg =
                                                                            "<" +
                                                                            ":" +
                                                                            collected.first().emoji?.name +
                                                                            ":" +
                                                                            collected.first().emoji?.id +
                                                                            ">";
                                                                } else if (collected.first().emoji?.name) {
                                                                    emoji = collected.first().emoji?.name;
                                                                    emojiMsg = collected.first().emoji?.name;
                                                                } else {
                                                                    message.reply(
                                                                        `${allEmojis.msg.ERROR} **No valid emoji added, using default EMOJI**`
                                                                    );
                                                                    emoji = null;
                                                                    emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                                }

                                                                try {
                                                                    await msg.react(emoji);
                                                                    if (
                                                                        NumberEmojiIds.includes(collected.first().emoji?.id)
                                                                    ) {
                                                                        emoji = null;
                                                                        emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                                    }
                                                                } catch (e) {
                                                                    console.log(e);
                                                                    message.reply(
                                                                        `${allEmojis.msg.ERROR} **Could not use the CUSTOM EMOJI you added, as I can't access it / use it as a reaction/emoji for the menu**\nUsing default emoji!`
                                                                    );
                                                                    emoji = null;
                                                                    emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                                }
                                                                finished();
                                                            })
                                                            .catch(() => {
                                                                message.reply(
                                                                    `${allEmojis.msg.ERROR} **No valid emoji added, using default EMOJI**`
                                                                );
                                                                emoji = null;
                                                                emojiMsg = NumberEmojis[data.length] || defaultEmoji;
                                                                finished();
                                                            });
                                                    });
                                                    function finished() {
                                                        data[index] = {
                                                            value,
                                                            description,
                                                            sendEmbed,
                                                            replyMsg,
                                                            emoji,
                                                        };
                                                        theDB.set(message.guild.id, data, pre + ".data");
                                                        message.reply(
                                                            `**Successfully edited:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Auto Support Config-Message!`
                                                        );
                                                    }
                                                } else {
                                                    return message.reply(
                                                        "<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**"
                                                    );
                                                }
                                            }
                                        });
                                        //Once the Collections ended edit the menu message
                                        collector.on("end", collected => {
                                            tempmsg.edit({
                                                embeds: [
                                                    tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`),
                                                ],
                                                components: [],
                                                content: `${allEmojis.msg.SUCCESS} **Selected: \`${collected ? collected.customId : "Nothing | CANCELLED"}\`**`,
                                            });
                                        });
                                    } else {
                                        return message.reply(
                                            "<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**"
                                        );
                                    }
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
                                    content: `${allEmojis.msg.SUCCESS} **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**`,
                                });
                            });
                        }
                        break;
                    case "Remove AutoSup Option":
                        {
                            let data = theDB.get(message.guild.id, pre + ".data");
                            if (!data || data.length < 1) {
                                return message.reply(
                                    "<:no:833101993668771842> **There are no Auto-Responding-Support-Options to remove**"
                                );
                            }
                            let embed = new MessageEmbed()
                                .setColor(es.color)
                                .setThumbnail(
                                    es.thumb
                                        ? es.footericon &&
                                          (es.footericon.includes("http://") || es.footericon.includes("https://"))
                                            ? es.footericon
                                            : client.user.displayAvatarURL()
                                        : null
                                )
                                .setFooter(client.getFooter(es))
                                .setDescription("Just pick the Options you want to remove!")
                                .setTitle("Which Option Do you want to remove?");
                            //define the selection
                            let Selection = new MessageSelectMenu()
                                .setCustomId("MenuSelection")
                                .setMaxValues(data.length)
                                .setMinValues(1)
                                .setPlaceholder("Click me to setup the Auto-Support System!")
                                .addOptions(
                                    data.map((option, index) => {
                                        let Obj = {
                                            label: option.value.substring(0, 50),
                                            value: option.value.substring(0, 50),
                                            description: option.description.substring(0, 50),
                                            emoji: isEmoji(client, message, option.emoji)
                                                ? option.emoji
                                                : NumberEmojiIds[index + 1],
                                        };
                                        return Obj;
                                    })
                                );
                            //send the menu msg
                            let menumsg;
                            menumsg = await message
                                .reply({
                                    embeds: [embed],
                                    components: [new MessageActionRow().addComponents([Selection])],
                                })
                                .catch(async () => {
                                    let Selection = new MessageSelectMenu()
                                        .setCustomId("MenuSelection")
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                        .setPlaceholder("Click me to setup the Auto-Support System!")
                                        .addOptions(
                                            data.map((option, index) => {
                                                let Obj = {
                                                    label: option.value.substring(0, 50),
                                                    value: option.value.substring(0, 50),
                                                    description: option.description.substring(0, 50),
                                                    emoji: NumberEmojiIds[index + 1],
                                                };
                                                return Obj;
                                            })
                                        );
                                    menumsg = await message.reply({
                                        embeds: [embed],
                                        components: [new MessageActionRow().addComponents([Selection])],
                                    });
                                });
                            //Create the collector
                            const collector = menumsg.createMessageComponentCollector({
                                filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                                time: 90000,
                                errors: ["time"],
                            });
                            //Menu Collections
                            collector.on("collect", async menu => {
                                if (menu?.user.id === cmduser.id) {
                                    collector.stop();
                                    for (const value of menu?.values) {
                                        let index = data.findIndex(v => v.value == value);
                                        data.splice(index, 1);
                                    }
                                    theDB.set(message.guild.id, data, pre + ".data");
                                    message.reply(
                                        `**Successfully removed:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Auto Support Config-Message!`
                                    );
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
                                    content: `${allEmojis.msg.SUCCESS} **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**`,
                                });
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
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"])),
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
