const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`../../botconfig/config.json`)
const ms = require("ms");
const {
    databasing, swap_pages
} = require(`../../handlers/functions`);
module.exports = {
    name: "giveaway",
    aliases: ["g"],
    category: "🚫 Administration",
    description: "Giveaway manager",
    usage: "giveaway <start/end/reroll/edit/delete/list>",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
        
        let adminroles = GuildSettings?.adminroles || [];
        let cmdroles = GuildSettings?.cmdadminroles?.giveaway || [];
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    const File = `giveaway`;
                    let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
                    if(index > -1) {
                      GuildSettings.cmdadminroles[File].splice(index, 1);
                      client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
                    }
                }
            }
        }
        if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable1"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable2"]))
            ]});
        if (!args[0]) return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable3"]))
            .setDescription(`> \`${prefix}giveaway start\` ... to start a new giveaway

> \`${prefix}giveaway end <G-Id>\` ... to end a specific giveaway

> \`${prefix}giveaway reroll <G-Id> [winneramount]\` ... to reroll a specific giveaway

> \`${prefix}giveaway pause <G-Id>\` ... to pause a specific giveaway

> \`${prefix}giveaway resume <G-Id>\` ... to resume a specific giveaway

> \`${prefix}giveaway edit <G-Id>\` ... to edit a specific giveaway

> \`${prefix}giveaway delete <G-Id>\` ... to delete a specific giveaway

> \`${prefix}giveaway list [server/all]\` ... to list giveaways in here / globally

:warning: **SOMETIMES GIVEAWAY DON'T END** :warning:
> Here is something you can do:
> \`${prefix}giveaway winner <G-Id>\`
> This will send the winner(s) of the Giveaway, received from the Database`)
        ]})
        var originalowner = message.author?.id
        if (args[0].toLowerCase() === "start") {
            try{
                let giveawayChannel;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable5"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable6"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                var channel = collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(collected.first().content);
                if(!channel) throw { message: "You did not mentioned a valid Channel, where the Giveaway should start!" }
                giveawayChannel = channel;


                let giveawayDuration;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable11"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable12"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                gargs = collected.first().content.split("+");
                giveawayDuration = 0;
                for await (const a of gargs){
                    giveawayDuration += ms(a.split(" ").join(""))
                }
                if(!giveawayDuration || isNaN(giveawayDuration)) throw { message: "You added a not valid Time!" };


                let giveawayNumberWinners;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable17"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable18"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                giveawayNumberWinners = collected.first().content;
                if(!giveawayNumberWinners || isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) throw { message: "You added an invalid amount of Winners" };

            
                let giveawayPrize;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable23"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable24"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                giveawayPrize = collected.first().content;
                
                giveawayNumberWinners = parseInt(giveawayNumberWinners);
                if(giveawayNumberWinners <= 0) giveawayNumberWinners = 1;
                let options = {
                    time: giveawayDuration,
                    duration: giveawayDuration,
                    prize: `:package: ${giveawayPrize} :package:`,
                    winnerCount: giveawayNumberWinners,
                    hostedBy: message.author,
                    thumbnail: es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null,
                    botsCanWin: false,
                    embedColor: require("discord.js").Util.resolveColor(es.color) ? require("discord.js").Util.resolveColor(es.color) : 3932049,
                    embedColorEnd: require("discord.js").Util.resolveColor(es.wrongcolor) ? require("discord.js").Util.resolveColor(es.wrongcolor) : 16731451,
                    reaction: '950481226765066311',
                    lastChance: {
                        enabled: true,
                        content: '⚠️ **LAST CHANCE TO ENTER!** ⚠️',
                        threshold: 60000,
                        embedColor: '#FEE75C'
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: '⏸️ **THIS GIVEAWAY IS PAUSED!** ⏸️',
                        unPauseAfter: null,
                        embedColor: '#582812'
                    },
                    bonusEntries: [],
                    messages: {
                        inviteToParticipate: "***React with <a:Tada_Yellow:950481226765066311> to participate!***\n",
                        drawing: "> Ends: {timestamp}\n",
                        hostedBy: "**Hosted by:** {this.hostedBy}",
                        dropMessage: "Be the first to react with <a:Tada_Yellow:950481226765066311>",
                        noWinner: "\n**Giveaway cancelled!**\n> No valid participations. :cry:",
                        endedAt: "Ends at", 
                        giveaway: '<a:Tada_Yellow:950481226765066311> **GIVEAWAY STARTED** <a:Tada_Yellow:950481226765066311>',
                        giveawayEnded: '<a:Tada_Green:867721862858539048> **GIVEAWAY ENDED** <a:Tada_Green:867721862858539048>',
                        winMessage: '**Congrats** {winners}!\n> You won **{this.prize}**!\n> **Jump:** {this.messageURL}\nHosted by: {this.hostedBy}',
                        embedFooter: '{this.winnerCount} Winner{this.winnerCount > 1 ? "s" : ""}'
                    },
                }





                let bonusentriesdata;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`Do you want to add Bonus Entry Roles?`)
                    .setDescription(`Type: \`no\` or \`0\` Bonus Entries, if you don't want to have any!\n\nTo add Bonus Entries, **Ping a Role and afterwards type the amount of Entries!**\n\n**Example:**\n> \`@ROLE 3\`\n\n> *If you want to add Multiple Bonus Entries do something like this:*\nExample:\n> \`@Role 2, @Role 2, @Role5\``)
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                bonusentriesdata = collected.first();
                if(bonusentriesdata.mentions.roles.size > 0){
                    let args = bonusentriesdata.content.split(",").map(i => i?.trim());
                    if(bonusentriesdata.mentions.roles.size > 1){
                        if(!args[0]) return message.reply(":x: Invalid Input of Multiple Bonus Roles, check the EXAMPLE!")
                        options.messages.giveaway += "\n\n**BONUS ENTRY ROLES:**\n";
                        options.messages.giveawayEnded += "\n\n**BONUS ENTRY ROLES:**\n";
                        [ ...bonusentriesdata.mentions.roles.values() ].forEach((role, index) => {
                            let curData = args[index].split(" ");
                            let Amount = Math.floor(Number(curData[1]) || null) || null
                            var roleid = role.id;
                            options.bonusEntries.push({
                                // Members who have the "Nitro Boost" role get 2 bonus entries
                                bonus: new Function('member', `return member && member.roles && member.roles.cache.size > 1 && member.roles.cache.some((r) => r.id === \'${roleid}\') ? \'${Amount}\' ? \'${Amount}\' : 1 : null`),
                                cumulative: true
                            })
                            options.messages.giveaway += `> <@&${role.id}> | \`${Amount ? Amount : 1} Points\`\n`
                            options.messages.giveawayEnded += `> <@&${role.id}> | \`${Amount ? Amount : 1} Points\`\n`
                        })
                    }
                    //One Bonus entrie
                    else {
                        options.bonusEntries.push({
                            // Members who have the "Nitro Boost" role get 2 bonus entries
                            bonus: new Function('member', `return member && member.roles && member.roles.cache.size > 1 && member.roles.cache.some((r) => r.id === \'${bonusentriesdata.mentions.roles.first().id}\') ? Math.floor(Number(\'${bonusentriesdata.content.split(" ")[1]}\')) ? Math.floor(Number(\'${bonusentriesdata.content.split(" ")[1]}\')) : 1 : null`),
                            cumulative: true
                        })
                        options.messages.giveaway += `\n\n**BONUS ENTRY ROLE:**\n> <@&${bonusentriesdata.mentions.roles.first().id}> | \`${Math.floor(Number(bonusentriesdata.content.split(" ")[1])) ? Math.floor(Number(bonusentriesdata.content.split(" ")[1])) : 1} Points\`\n`
                        options.messages.giveawayEnded += `\n\n**BONUS ENTRY ROLE:**\n> <@&${bonusentriesdata.mentions.roles.first().id}> | \`${Math.floor(Number(bonusentriesdata.content.split(" ")[1])) ? Math.floor(Number(bonusentriesdata.content.split(" ")[1])) : 1} Points\`\n`
                    }
                }



                let requiredroles;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`Do you want a Required Role?`)
                    .setDescription(`Type: \`no\` or \`0\` Required Roles, if you don't want to have any!\n\nTo add Required Roles, **Ping all Roles** which should be **required (the Users just need at least one of them)**\n\n**Example:**\n> \`@ROLE1 @Role2\` (1 Role is also enough)\n\n**NOTE:**\n> *Users without the Role, can react, but __won't be drawn__!*`)
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                requiredroles = collected.first();
                if(requiredroles.mentions.roles.size >= 1){
                    let theRoles = [...requiredroles.mentions.roles.values()];
                    options.messages.giveaway += `\n\n**REQUIRED ROLES:**\n${[...theRoles].map(r=>`> <@&${r.id}>`).join("\n")}`;
                    options.messages.giveawayEnded += `\n\n**REQUIRED ROLES:**\n${[...theRoles].map(r=>`> <@&${r.id}>`).join("\n")}`;
                    theRoles = theRoles.map(r => r.id);
                    options.exemptMembers = new Function('member', `return !member || !member.roles ||!member.roles.cache.some((r) => \'${theRoles}\'.includes(r.id))`)
                }
                options.messages.giveaway = options.messages.giveaway.substring(0, 2000)
                options.messages.giveawayEnded = options.messages.giveawayEnded.substring(0, 2000)
                //role requirements
                client.giveawaysManager.start(giveawayChannel, options);

                message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable27"])});
            } catch (error){ 
                console.log(error)
                return message.reply({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable25"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable26"]))
                ]})
            }
            // And the giveaway has started!
        } else if (args[0].toLowerCase() === "end") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable28"])});
            }
            let giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);

            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable29"])});
            }

            client.giveawaysManager.edit(giveaway.messageId, {
                    setEndTimestamp: Date.now()
                })
                .then(async () => {
                    message.reply({content : "Giveaway will end in less then 10 Seconds!"});
                })
                .catch((e) => {
                    if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is already ended.`)) {
                        message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable31"])});
                    } else {
                        console.error(e);
                        message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable32"])});
                    }
                });
        } else if (args[0].toLowerCase() === "reroll") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable33"])});
            }
            let rerollamount = parseInt(args[1]);
            let giveaway =
                client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);
            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable34"])});
            }
            client.giveawaysManager.reroll(giveaway.messageId, { winnerCount: !isNaN(args[1]) ? Number(args[1]) : 1})
                .then(async () => {
                    message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable35"]) + "Tipp!\nAdd the amount of reroll winners to the end!"});
                })
                .catch((e) => {
                    if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is not ended.`)) {
                        message.reply(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable36"]));
                    } else {
                        console.error(e);
                        message.reply({content : ':x: **An error occured...**```' + String(e.message).substring(0, 1900) + "```"});
                    }
                });


        } else if (args[0].toLowerCase() === "pause") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable33"])});
            }
            let giveaway = client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);
            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable34"])});
            }
            client.giveawaysManager.pause(giveaway.messageId)
                .then(async () => {
                    message.reply( { content : "Successfully! Paused the Giveaway" } );
                })
                .catch((e) => {
                    if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is not ended.`)) {
                        message.reply(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable36"]));
                    } else {
                        console.error(e);
                        message.reply({content : ':x: **An error occured...**```' + String(e.message).substring(0, 1900) + "```"});
                    }
                });
        } else if (args[0].toLowerCase() === "unpause" || args[0].toLowerCase() === "resume") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable33"])});
            }
            let giveaway =
                client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);
            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable34"])});
            }
            client.giveawaysManager.unpause(giveaway.messageId)
                .then(async () => {
                    message.reply( { content : "Successfully! Unpaused the Giveaway!" } );
                })
                .catch((e) => {
                    if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is not ended.`)) {
                        message.reply(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable36"]));
                    } else {
                        console.error(e);
                        message.reply({content : ':x: **An error occured...**```' + String(e.message).substring(0, 1900) + "```"});
                    }
                });
        } else if (args[0].toLowerCase() === "edit") {
            args.shift();
            let messageId = args[0];
            if (!messageId) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable37"])});
            }
            let giveawayPrize = args.slice(1).join(' ');
            if (!giveawayPrize) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable38"])});
            }
            client.giveawaysManager.edit(messageId, {
                newWinnerCount: 3,
                newPrize: giveawayPrize,
                addTime: 5000
            }).then(async () => {
                // here, we can calculate the time after which we are sure that the lib will update the giveaway
                const numberOfSecondsMax = client.giveawaysManager.options.updateCountdownEvery / 1000;
                message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable39"])});
            }).catch((err) => {
                message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable40"])});
            });
        } else if (args[0].toLowerCase() === "delete") {
            args.shift();
            let messageId = args[0];
            if (!messageId) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable41"])});
            }
            client.giveawaysManager.delete(messageId).then(async () => {
                    message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable42"])});
                })
                .catch((err) => {
                    message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable43"])});
                });
        } else if (args[0].toLowerCase() === "list") {
            args.shift();
            if (args[0] && args[0].toLowerCase() === "server") {
                let allGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildId === message.guild.id && !g.ended); // [ {Giveaway}, {Giveaway} ]
                buffer = [];
                for (let i = 0; i < allGiveaways.length; i++) {
                    try{
                    buffer.push(`> Prize: ${allGiveaways[i].prize}\n> Duration: \`${ms(new Date() - allGiveaways[i].startAt)}\` | [\`JUMP TO IT\`](https://discord.com/channels/${allGiveaways[i].guildId}/${allGiveaways[i].channelId}/${allGiveaways[i].messageId})\n`)
                }catch{}
                }
                if(buffer.length < 1) return message.reply("No Giveaways available!")
                return swap_pages(client, message, buffer, eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable45"]));
            } else {
                let allGiveaways = client.giveawaysManager.giveaways.filter((g) => !g.ended); // [ {Giveaway}, {Giveaway} ]
                buffer = [];
                for (let i = 0; i < allGiveaways.length; i++) {
                    try{
                    let invite = client.guilds.cache.get(allGiveaways[i].guildId).invites.cache.size > 0 ? client.guilds.cache.get(allGiveaways[i].guildId).invites.cache.map(invite => invite.url)[0] : client.guilds.cache.get(allGiveaways[i].guildId).channels.cache.first().permissionsFor(message.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE) ? await client.guilds.cache.get(allGiveaways[i].guildId).channels.cache.first().createInvite() : "";
                    buffer.push(`> Guild: [\`${client.guilds.cache.get(allGiveaways[i].guildId).name}\`](${invite})\n> Prize: ${allGiveaways[i].prize}\n> Duration: \`${ms(new Date() - allGiveaways[i].startAt)}\` | [\`JUMP TO IT\`](https://discord.com/channels/${allGiveaways[i].guildId}/${allGiveaways[i].channelId}/${allGiveaways[i].messageId})\n`)
                }catch{}
                }
                if(buffer.length < 1) return message.reply("No Giveaways available!")
                return swap_pages(client, message, buffer, eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable46"]));
            }

        } else if (args[0].toLowerCase() === "winner"){
            args.shift();
            if (!args[0]) {
                return message.reply({content : `:x: The right usage of this Command is: \`${prefix}giveaway winner <GiveawayId>\` ... note that GiveawayId is the MessageId of the (Embed) Giveaway-Message`});
            }
            let giveaway = client.giveawayDB.all().then(d => d.find((g) => g.data.messageId === args[0])?.data);

            if (!giveaway) {
                return message.reply({content : ":x: Could not find Data of this Giveaway"});
            }
            if(giveaway.messages && giveaway.messages.winMessage && giveaway.messages.winMessage.includes("{winners}")){
                return message.reply({content: `${giveaway.messages.winMessage.replace("{winners}", giveaway.winnerIds.map(d => `<@${d}>`).join(", ")).replace("{this.prize}", giveaway.prize).replace("{this.messageURL}", `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`).replace("{this.hostedBy}", giveaway.hostedBy).substring(0, 2000)}`})
            }
            return message.reply({content: `The Winner of https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId} ${giveaway.winnerIds.length == 1 ? "is" : "are"} ${giveaway.winnerIds.map(d => `<@${d}>`).join(", ")}`.substring(0, 2000)})

        } else {
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable47"]))
                .setDescription(`> \`${prefix}giveaway start\` ... to start a new giveaway

> \`${prefix}giveaway end <G-Id>\` ... to end a specific giveaway

> \`${prefix}giveaway reroll <G-Id> [winneramount]\` ... to reroll a specific giveaway

> \`${prefix}giveaway pause <G-Id>\` ... to pause a specific giveaway

> \`${prefix}giveaway resume <G-Id>\` ... to resume a specific giveaway

> \`${prefix}giveaway edit <G-Id>\` ... to edit a specific giveaway

> \`${prefix}giveaway delete <G-Id>\` ... to delete a specific giveaway

> \`${prefix}giveaway list [server/all]\` ... to list giveaways in here / globally

:warning: **SOMETIMES GIVEAWAY DON'T END** :warning:
> Here is something you can do:
> \`${prefix}giveaway winner <G-Id>\`
> This will send the winner(s) of the Giveaway, received from the Database`)
            ]})
        }

        if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
            try{
              var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
              if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
              channel.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable49"]))
                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
               .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
              ]})
            }catch (e){
              console.error(e)
            }
          } 
    }
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}