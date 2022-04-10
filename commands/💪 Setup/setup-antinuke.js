var {
  MessageEmbed, Permissions, MessageButton, MessageActionRow, MessageSelectMenu
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, delay, dbRemove, dbKeys, dbEnsure
} = require(`../../handlers/functions`);
module.exports = {
  name: "setup-antinuke",
  category: "💪 Setup",
  aliases: ["setupantinuke", "antinuke-setup", "antinukesetup", "antinukesystem"],
  cooldown: 5,
  usage: "setup-antinuke --> Follow Steps",
  description: "Manage the Anti Nuke System",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    ;
    //only allow the Server owner, (&Tomato) to execute this Command, (Tomato just because if he needs to help for Shop Bots)
    if(message.author?.id != message.guild.ownerId){
      if(message.author?.id != "442355791412854784")
        return message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable1"])})
    }
    
    try {
      await dbEnsure(await client.Anti_Nuke_System, message.guild.id, {
        all: {
            enabled: false,
            logger: "no",
            whitelisted: {
                roles: [],
                users: []
            },
            showwhitelistlog: true,
            quarantine: false,
        },
        antibot: {
            enabled: true,
            whitelisted: {
                roles: [],
                users: []
            },
            punishment: {
                bot: {
                    kick: true,
                    ban: false,
                },
                member: {
                    removeroles: {
                        neededdaycount: 1, //he is allowed to add 1 Bot / Day
                        neededweekcount: 4, //he is allowed to add 4 Bots / Week
                        neededmonthcount: 10, //he is allowed to add 10 Bot / Month
                        noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                        enabled: true
                    },
                    kick: {
                        neededdaycount: 2, //he is allowed to add 2 Bot / Day
                        neededweekcount: 7, //he is allowed to add 5 Bots / Week
                        neededmonthcount: 20, //he is allowed to add 11 Bot / Month
                        noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                        enabled: true
                    },
                    ban: {
                        neededdaycount: 4, //he is allowed to add 3 Bot / Day
                        neededweekcount: 10, //he is allowed to add 6 Bots / Week
                        neededmonthcount: 25, //he is allowed to add 12 Bot / Month
                        noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                        enabled: true
                    },
                }
            },
        },
        //Anti Kick & Ban
        antideleteuser: {
            enabled: true,
            whitelisted: {
                roles: [],
                users: []
            },
            punishment: {
                member: {
                    removeroles: {
                        neededdaycount: 1, //he is allowed to do it 1 / Day
                        neededweekcount: 4, //he is allowed to do it 4 / Week
                        neededmonthcount: 10, //he is allowed to do it 10 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    kick: {
                        neededdaycount: 2, //he is allowed to to do it 2 / Day
                        neededweekcount: 7, //he is allowed to to do it 5 / Week
                        neededmonthcount: 20, //he is allowed to to do it 11 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    ban: {
                        neededdaycount: 4, //he is allowed to to do it 3 / Day
                       neededweekcount: 10, //he is allowed to to do it 6 / Week
                        neededmonthcount: 25, //he is allowed to to do it 12 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                }
            },
        },
        //ANTI CREATE ROLE
        anticreaterole: {
            enabled: true,
            whitelisted: {
                roles: [],
                users: []
            },
            punishment: {
                removeaddedrole: true,
                member: {
                    removeroles: {
                        neededdaycount: 1, //he is allowed to do it 1 / Day
                        neededweekcount: 4, //he is allowed to do it 4 / Week
                        neededmonthcount: 10, //he is allowed to do it 10 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    kick: {
                        neededdaycount: 2, //he is allowed to to do it 2 / Day
                        neededweekcount: 7, //he is allowed to to do it 5 / Week
                        neededmonthcount: 20, //he is allowed to to do it 11 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    ban: {
                        neededdaycount: 4, //he is allowed to to do it 3 / Day
                       neededweekcount: 10, //he is allowed to to do it 6 / Week
                        neededmonthcount: 25, //he is allowed to to do it 12 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                }
            },
        },
        //Anti DELETE Role
        antideleterole: {
            enabled: true,
            whitelisted: {
                roles: [],
                users: []
            },
            punishment: {
                readdrole: true,
                member: {
                    removeroles: {
                        neededdaycount: 1, //he is allowed to do it 1 / Day
                        neededweekcount: 4, //he is allowed to do it 4 / Week
                        neededmonthcount: 10, //he is allowed to do it 10 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    kick: {
                        neededdaycount: 2, //he is allowed to to do it 2 / Day
                        neededweekcount: 7, //he is allowed to to do it 5 / Week
                        neededmonthcount: 20, //he is allowed to to do it 11 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    ban: {
                        neededdaycount: 4, //he is allowed to to do it 3 / Day
                       neededweekcount: 10, //he is allowed to to do it 6 / Week
                        neededmonthcount: 25, //he is allowed to to do it 12 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                }
            },
        },
        //ANTI DELETE CHANNEL
        antichanneldelete: {
            enabled: true,
            whitelisted: {
                roles: [],
                users: []
            },
            punishment: {
                member: {
                    removeroles: {
                        neededdaycount: 1, //he is allowed to do it 1 / Day
                        neededweekcount: 4, //he is allowed to do it 4 / Week
                        neededmonthcount: 10, //he is allowed to do it 10 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    kick: {
                        neededdaycount: 2, //he is allowed to to do it 2 / Day
                        neededweekcount: 7, //he is allowed to to do it 5 / Week
                        neededmonthcount: 20, //he is allowed to to do it 11 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    ban: {
                        neededdaycount: 4, //he is allowed to to do it 3 / Day
                        neededweekcount: 10, //he is allowed to to do it 6 / Week
                        neededmonthcount: 25, //he is allowed to to do it 12 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                }
            },
        },
        //ANTI CREATE CHANNEL
        antichannelcreate: {
            enabled: true,
            whitelisted: {
                roles: [],
                users: []
            },
            punishment: {
                deletecreatedchannel: true,
                member: {
                    removeroles: {
                        neededdaycount: 1, //he is allowed to do it 1 / Day
                        neededweekcount: 4, //he is allowed to do it 4 / Week
                        neededmonthcount: 10, //he is allowed to do it 10 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    kick: {
                        neededdaycount: 2, //he is allowed to to do it 2 / Day
                        neededweekcount: 7, //he is allowed to to do it 5 / Week
                        neededmonthcount: 20, //he is allowed to to do it 11 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                    ban: {
                        neededdaycount: 4, //he is allowed to to do it 3 / Day
                       neededweekcount: 10, //he is allowed to to do it 6 / Week
                        neededmonthcount: 25, //he is allowed to to do it 12 / Month
                        noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                        enabled: true
                    },
                }
            },
        },
      })
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Information",
            description: `Show Information about the Anti Nuke System`,
            emoji: "869468766529003560"
          },
          {
            value: "Manage Whitelist",
            description: `Allow/Deny Roles/Users who should not get affected`,
            emoji: "857334024087011378"
          },
          {
            value: "Manage Settings",
            description: `Enable/Disable & Change the Anti Nuke Settings`,
            emoji: "866089513654419466"
          },
          {
            value: "Suggested Settings",
            description: `Use our suggested Settings!`,
            emoji: "866089515993792522"
          },
          {
            value: "Sync Quarantine Role",
            description: `Add Perm !VIEW_CH. to all Chans.for the Qu. Role`,
            emoji: "🔒"
          },
          
          {
            value: "Cancel",
            description: `Cancel and stop the Anti-Nuke-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Anti Nuke System!') 
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
           }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor('Anti Nuke Setup', 'https://cdn.discordapp.com/attachments/820695790170275871/869657327941324860/PS7lwz7HwAAAABJRU5ErkJggg.png', 'https://discord.gg/milrato')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable3"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        async function menuselection(menu) {
          if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable4"])})
          used1 = true;
          if(menu?.values[0] == "Information"){
            
            await message.reply({ content: "<a:yes:833101995723194437> **The Current Anti-Nuke Settings**", embeds: [new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle(`${await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "<a:yes:833101995723194437> __**The Anti Nuke is enabled!**__": "<:no:833101993668771842> __**The Anti Nuke is disabled!**__"}`)
              .addField(`__**Anti Add Bot | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Kick/Ban | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Kicks / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Kicks / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Delete Role | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Delete Channel | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Create Role | ${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Create Channel | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_12"]), eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable12"]))
              .setDescription(`${await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "> <a:yes:833101995723194437> **I will show it when a Whitelisted User/Role makes an Action**\n> *But I won't do anything to him/her, cause he/she is whitelisted!*": "> <:no:833101993668771842> **I won't show it when a whitelisted User is doing something!**\n> This doesn't affect your security! (He is whitelisted, from the YOU)"}${await client.Anti_Nuke_System.get(message.guild.id+ ".all.quarantine")?.length > 0 ? `\n\n> **I will add him/her the Quarantine Role: <@&${await client.Anti_Nuke_System.get(message.guild.id+ ".all.quarantine")}> Role when removing the Roles!**` : "*NO Quarantine Role set, I will just remove his/her Roles / KICK / BAN..!*"}`)]
            });
            return menu?.reply({embeds: [new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable14"]))
            .addField("**Other Security Systems:**", `\`${prefix}setup-antidiscord\` *... Enable/Disable & Adjust anti Discord Invite Links*\n\`${prefix}setup-antilink\` *... Enable/Disable & Adjust anti Links*\n\`${prefix}setup-anticaps\` *... Enable/Disable & Adjust anti Caps spamming*\n\`${prefix}setup-blacklist\` *... to add/remove Bad (blacklsited) Words*`)]
          });
          } 
          else if(menu?.values[0] == "Manage Whitelist"){
            client.disableComponentMessage(menu);
            menuoptions = [
              {
                value: "General Users/Roles",
                description: `Add/Remove General Users/Roles`,
                emoji: "866089515993792522"
              },
              {
                value: "Anti Bot Add Users/Roles",
                description: `Add/Remove Anti-Bot-Add Users/Roles`,
                emoji: "843943149902626846"
              },
              {
                value: "Anti Kick/Ban Users/Roles",
                description: `Add/Remove Anti-Kick/Ban Users/Roles`,
                emoji: "843943149868023808"
              },
              {
                value: "Anti Create Role Users/Roles",
                description: `Add/Remove Anti-Create-Role Users/Roles`,
                emoji: "843943149914554388"
              },
              {
                value: "Anti Delete Role Users/Roles",
                description: `Add/Remove Anti-Delete-Role Users/Roles`,
                emoji: "843943149919535154"
              },
              {
                value: "Anti Create Channel Users/Roles",
                description: `Add/Remove Anti-Create-Channel Users/Roles`,
                emoji: "843943149759889439"
              },
              {
                value: "Anti Delete Channel Users/Roles",
                description: `Add/Remove Anti-Delete-Channel Users/Roles`,
                emoji: "843943150468857876"
              },
              {
                value: "Cancel",
                description: `Cancel and stop the Anti-Nuke-Setup!`,
                emoji: "862306766338523166"
              }
            ]
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Click me to setup the Anti Nuke Settings!') 
              .addOptions(
                menuoptions.map(option => {
                  let Obj = {
                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                  }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
               }))
            
            //define the embed
            let MenuEmbed = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor('Anti Nuke Settings', 'https://cdn.discordapp.com/attachments/820695790170275871/869657327941324860/PS7lwz7HwAAAABJRU5ErkJggg.png', 'https://discord.gg/milrato')
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable16"]))
            //send the menu msg
            let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
            //function to handle the menuselection
            async function menuselection2(menu) {
              if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable17"])})
              used1 = true;
              let index = menuoptions.findIndex(v=>v.value == menu?.values[0])
              //Toggle
              if(String(index) == "0"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable18"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable19"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+".all.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".all.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".all.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".all.whitelisted.roles", r)
                    }
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable20"]))
                      .setColor(es.color)
                      .setDescription(`**Removed [${removedroles.length}] Roles and [${removedusers.length}] Users from the __general__ Whitelist!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_21"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_22"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable23"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else if(String(index) == "1"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable24"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable25"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+".antibot.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".antibot.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antibot.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antibot.whitelisted.roles", r)
                    }
                  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable26"]))
                      .setColor(es.color)
                      .setDescription(`<:leaves:866356598356049930> **Removed \`[${removedroles.length}] Roles\` and \`[${removedusers.length}] Users\` from the __Anti Bot add__ Whitelist (module)!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_27"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_28"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable29"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else if(String(index) == "2"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable30"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable31"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+".antideleteuser.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".antideleteuser.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antideleteuser.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antideleteuser.whitelisted.roles", r)
                    }
                  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable32"]))
                      .setColor(es.color)
                      .setDescription(`<:leaves:866356598356049930> **Removed \`[${removedroles.length}] Roles\` and \`[${removedusers.length}] Users\` from the __Anti Kick/Ban__ Whitelist (module)!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_33"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_34"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable35"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else if(String(index) == "3"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable36"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable37"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+".anticreaterole.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".anticreaterole.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".anticreaterole.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".anticreaterole.whitelisted.roles", r)
                    }
                  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable38"]))
                      .setColor(es.color)
                      .setDescription(`<:leaves:866356598356049930> **Removed \`[${removedroles.length}] Roles\` and \`[${removedusers.length}] Users\` from the __Anti Create Role__ Whitelist (module)!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_39"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_40"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable41"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else if(String(index) == "4"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable42"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable43"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+".antideleterole.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".antideleterole.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antideleterole.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antideleterole.whitelisted.roles", r)
                    }
                  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable44"]))
                      .setColor(es.color)
                      .setDescription(`<:leaves:866356598356049930> **Removed \`[${removedroles.length}] Roles\` and \`[${removedusers.length}] Users\` from the __Anti Delete Role__ Whitelist (module)!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_45"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_46"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable47"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else if(String(index) == "5"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable48"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable49"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+"antichanneldelete.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".antichanneldelete.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+ ".antichanneldelete.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antichanneldelete.whitelisted.roles", r)
                    }
                  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable50"]))
                      .setColor(es.color)
                      .setDescription(`<:leaves:866356598356049930> **Removed \`[${removedroles.length}] Roles\` and \`[${removedusers.length}] Users\` from the __Anti Channel Create__ Whitelist (module)!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_51"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_52"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable53"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else if(String(index) == "6"){
                client.disableComponentMessage(menu);
                let timeouterror = false;
                let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable54"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable55"])).setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) throw "NO MESSAGE SENT";
                    let users = message.mentions.members.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let roles = message.mentions.roles.filter(r=>r.guild.id == message.guild.id).map(r=>r.id);
                    let addedusers = [];
                    let addedroles = [];
                    let removedusers = [];
                    let removedroles = [];
                    let current = await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted");
                    for await (const u of users){
                      if(current.users.includes(u)){
                        removedusers.push(u)
                      }else {
                        addedusers.push(u)
                      }
                    }
                    for await (const r of roles){
                      if(current.roles.includes(r)){
                        removedroles.push(r)
                      }else {
                        addedroles.push(r)
                      }
                    }
                    for await (const u of addedusers){
                      await client.Anti_Nuke_System.push(message.guild.id+".antichannelcreate.whitelisted.users", u)
                    }
                    for await (const r of addedroles){
                      await client.Anti_Nuke_System.push(message.guild.id+".antichannelcreate.whitelisted.roles", r)
                    }
                    for await (const u of removedusers){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antichannelcreate.whitelisted.users", u)
                    }
                    for await (const r of removedroles){
                      await dbRemove(client.Anti_Nuke_System, message.guild.id+".antichannelcreate.whitelisted.roles", r)
                    }
                  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable56"]))
                      .setColor(es.color)
                      .setDescription(`<:leaves:866356598356049930> **Removed \`[${removedroles.length}] Roles\` and \`[${removedusers.length}] Users\` from the __Anti Channel Delete__ Whitelist (module)!**`.substring(0, 2048))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_57"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.users").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.users").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.users").slice(0, 15).map(x=>`<@${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.users").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.users").map(x=>`<@${x}>`).join("︲")}`)
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_58"]), `>>> ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.roles").length == 0 ? "**No One**" : await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.roles").length > 15 ? await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.roles").slice(0, 15).map(x=>`<@&${x}>`).join("︲") + ` ***and ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.roles").length - 15} more...***`: await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted.roles").map(x=>`<@&${x}>`).join("︲")}`)
                      .setFooter(client.getFooter(es))]
                    });
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable59"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
              } else {
                return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable60"])});
              }
            }
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({ 
              filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
              time: 90000
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                menuselection2(menu);
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
            });
          
        
          } 
          else if(menu?.values[0] == "Manage Settings"){
              client.disableComponentMessage(menu);
              menuoptions = [
                {
                  value: await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "Disable complete AntiNuke": "Enable complete Anti Nuke",
                  description: await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "I will not work anymore": "I will be enabled",
                  emoji: await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "833101993668771842": "833101995723194437"
                },
                {
                  value: "Set Logger",
                  description: `Define a (new) Logger Channel`,
                  emoji: "866089515993792522"
                },
                {
                  value: await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "Disable Whitelisted Log": "Enable Whitelisted Log",
                  description: await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "I will not show when a whitelisted User makes smt": "I will show when a whitelisted User makes smt (I won't do smt tho)",
                  emoji: await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "833101993668771842": "833101995723194437"
                },
                {
                  value: "Modify Quarantine Role",
                  description: "Remove/add the Qurantine Role",
                  emoji: "865686493016096809"
                },
                {
                  value: "Anti Bot Add",
                  description: `Adjust the Settings of the Anti Bot Add System`,
                  emoji: "843943149902626846"
                },
                {
                  value: "Anti Kick/Ban",
                  description: `Adjust the Settings of the Anti Kick/Ban System`,
                  emoji: "843943149868023808"
                },
                {
                  value: "Anti Create Role",
                  description: `Adjust the Settings of the Anti Create Role System`,
                  emoji: "843943149914554388"
                },
                {
                  value: "Anti Delete Role",
                  description: `Adjust the Settings of the Anti Delete Role System`,
                  emoji: "843943149919535154"
                },
                {
                  value: "Anti Create Channel",
                  description: `Adjust the Settings of the Anti Create Channel System`,
                  emoji: "843943149759889439"
                },
                {
                  value: "Anti Delete Channel",
                  description: `Adjust the Settings of the Anti Delete Channel System`,
                  emoji: "843943150468857876"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Anti-Nuke-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Anti Nuke Settings!') 
                .addOptions(
                  menuoptions.map(option => {
                    let Obj = {
                      label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                    }
                  if(option.emoji) Obj.emoji = option.emoji;
                  return Obj;
                 }))
              
              //define the embed
              let MenuEmbed = new Discord.MessageEmbed()
              .setColor(es.color)
              .setAuthor( 'Anti Nuke Settings',  'https://cdn.discordapp.com/attachments/820695790170275871/869657327941324860/PS7lwz7HwAAAABJRU5ErkJggg.png',  'https://discord.gg/milrato')
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable62"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //function to handle the menuselection
              async function menuselection3(menu) {
                if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable63"])})
                used1 = true;
                let index = menuoptions.findIndex(v=>v.value == menu?.values[0])
                //Toggle
                if(String(index) == "0"){
                  await client.Anti_Nuke_System.set(message.guild.id+ ".all.enabled", !await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled"))
                  return menu?.reply({embeds: [new MessageEmbed()
                  .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTitle(`**Successfully __${await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "Enabled" : "Disabled"}__ the Anti-Nuke System**`)
                  .setDescription(`**I will now${await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "" : " not"} the Anti-Nuke System!**\n> But please mind the Settings of each Module!`)
                  .addField("\u200b", eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable66"]))
                ]});
                } else if(String(index) == "1"){
                  client.disableComponentMessage(menu);
                  let timeouterror = false;
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable67"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable68"])).setFooter(client.getFooter(es))
                  ]})
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(async collected => {
                      var message = collected.first();
                      if(!message) throw "NO MESSAGE SENT";
                      if(message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first()){
                        try{
                          message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().send({embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable69"]))
                            .setColor(es.color)
                            .setDescription(`**Here are some Infos:**\n>>> In the **FOOTER** (bottom), will be Informations (ID & AVATAR) of the EXECUTOR\nIn the **AUTHOR** (top), will be information about the **METHOD**\n\nIf there is a **Thumbnail**, it will be the **TARGET INFORMATION**\n\nEvery Embed, which is **GREEN**, is a security action from **ME**\nEvery Embed in **YELLOW** is a **WARN**\nEvery Embed in **ORANGE** is a **KICK**\nEvery Embed in **RED** is a **BAN**\nEvery Embed in **BLURPLE** is a **Remove Role**`.substring(0, 2048))
                            .setFooter(client.getFooter(es))]
                          })
                        }catch (e){
                          console.error(e)
                        }
                        try{
                          message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable70"]))
                            .setColor(es.color)
                            .setDescription(`**Here are some Infos:**\n>>> In the **FOOTER** (bottom), will be Informations (ID & AVATAR) of the EXECUTOR\nIn the **AUTHOR** (top), will be information about the **METHOD**\n\nIf there is a **Thumbnail**, it will be the **TARGET INFORMATION**\n\nEvery Embed, which is **GREEN**, is a security action from **ME**\nEvery Embed in **YELLOW** is a **WARN**\nEvery Embed in **ORANGE** is a **KICK**\nEvery Embed in **RED** is a **BAN**\nEvery Embed in **BLURPLE** is a **Remove Role**`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]})
                        }catch (e){
                          console.error(e)
                        }
                        await client.Anti_Nuke_System.set(message.guild.id+`.all.logger`, message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().id)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable71"]))
                          .setColor(es.color)
                          .setDescription(`If some Anti-Nuke actions are needed to be executed, i will log them there!`.substring(0, 2048))
                          .setFooter(client.getFooter(es))]
                        });
                      }
                      else{
                        throw "NO CHANNEL PINGED";
                      }
                    })
                    .catch(e => {
                      timeouterror = e;
                    })
                  if (timeouterror)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable72"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))]
                    });
                } else if(String(index) == "2"){
                  await client.Anti_Nuke_System.set(message.guild.id+".all.showwhitelistlog", !await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog"))
                  return menu?.reply({embeds: [new MessageEmbed()
                  .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTitle(`**Successfully __${await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "Enabled" : "Disabled"}__ the Whitelisted Log**`)
                  .setDescription(`**I will now${await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "" : " not"} show it, when a Whitelisted User / Role makes something**\n> But please mind the Settings of each Module!${await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "\n\n> Tho this is enabled it does **not** mean i will punish the Whitelisted User, this is **just the Logging** for it!\n> ***So that you know, when what happens!***" : ""}`)
                  .addField("\u200b", eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable75"]))
                ]});
                } else if(String(index) == "3"){
                  client.disableComponentMessage(menu);
                  let timeouterror = false;
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable76"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable77"])).setFooter(client.getFooter(es))
                  ]})
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(async collected => {
                      var message = collected.first();
                      if(!message || !message.content) throw "NO MESSAGE SENT";
                      if(message.content.toLowerCase() == "no"){
                        await client.Anti_Nuke_System.set(message.guild.id+`.all.quarantine`, false)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable78"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                      }
                      if(message.mentions.roles.filter(r=>r.guild.id==message.guild.id).first()){
                        await client.Anti_Nuke_System.set(message.guild.id+`.all.quarantine`, message.mentions.roles.filter(r=>r.guild.id==message.guild.id).first().id)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable79"]))
                          .setColor(es.color)
                          .setDescription(`This Role will be added, if the User gets the roles removed!\n> You can also ran a command in the \`${prefix}setup-antinuke\` to set all channels to not visible when having this Role!`.substring(0, 2048))
                          .setFooter(client.getFooter(es))]
                        });
                      }
                      else{
                        throw "NO CHANNEL PINGED";
                      }
                    })
                    .catch(e => {
                      timeouterror = e;
                    })
                  if (timeouterror)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable80"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))]
                    });
                } else {
                  let keys = {
                    "4": "antibot",
                    "5": "antideleteuser",
                    "6": "anticreaterole",
                    "7": "antideleterole",
                    "8": "antichannelcreate",
                    "9": "antichanneldelete",
                  }
                  let thenames = {
                    "antibot" : "Anti Bot Add",
                    "antideleteuser": "Anti Kick/Ban",
                    "anticreaterole": "Anti Create Role",
                    "antideleterole": "Anti Delete Role",
                    "antichannelcreate": "Anti Create Channel",
                    "antichanneldelete": "Anti Delete Channel",
                  }
                  let thekey = keys[`${String(index)}`];
                  let thename = thenames[`${thekey}`];
                  /**
                   
                    [Remove Roles] Actions / Day: 1
                    [Remove Roles] Actions / Week: 4
                    [Remove Roles] Actions / Month: 10

                    [Kick] Actions / Day: 2
                    [Kick] Actions / Week: 7
                    [Kick] Actions / Month: 20

                    [Ban] Actions / Day: 4
                    [Ban] Actions / Week: 10
                    [Ban] Actions / Month: 25
                   */
                    first_layer()
                    async function first_layer(){
                      menuoptions = [
                        {
                          value: await client.Anti_Nuke_System.get(message.guild.id, `${thekey}.enabled`) ? `Disable ${thename}`: `Enable ${thename}`,
                          description: await client.Anti_Nuke_System.get(message.guild.id, `${thekey}.enabled`) ? `${thename} will stop working`: `${thename} will be working`,
                          emoji: await client.Anti_Nuke_System.get(message.guild.id, `${thekey}.enabled`) ? "833101993668771842": "833101995723194437"
                        },
                        {
                          value: "Remove Roles / Day",
                          description: `Amount of Actions / Day to remove the Roles`,
                          emoji: "895066900105674822"
                        },
                        {
                          value: "Remove Roles / Week",
                          description: `Amount of Actions / Week to remove the Roles`,
                          emoji: "895066900105674822"
                        },
                        {
                          value: "Remove Roles / Month",
                          description: `Amount of Actions / Month to remove the Roles`,
                          emoji: "895066900105674822"
                        },
                        {
                          value: "Kick / Day",
                          description: `Amount of Actions / Day to Kick him`,
                          emoji: "⛔"
                        },
                        {
                          value: "Kick / Week",
                          description: `Amount of Actions / Week to Kick him`,
                          emoji: "⛔"
                        },
                        {
                          value: "Kick / Month",
                          description: `Amount of Actions / Month to Kick him`,
                          emoji: "⛔"
                        },
                        {
                          value: "Ban / Day",
                          description: `Amount of Actions / Day to Ban him`,
                          emoji: "🔨"
                        },
                        {
                          value: "Ban / Week",
                          description: `Amount of Actions / Week to Ban him`,
                          emoji: "🔨"
                        },
                        {
                          value: "Ban / Month",
                          description: `Amount of Actions / Month to Ban him`,
                          emoji: "🔨"
                        },
                        
                        {
                          value: "Cancel",
                          description: `Cancel and stop the Ticket-Setup!`,
                          emoji: "862306766338523166"
                        }
                      ]
                      //define the selection
                      let Selection = new MessageSelectMenu()
                        .setCustomId('MenuSelection') 
                        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder('Click me to setup the Anti Nuke Settings!') 
                        .addOptions(
                        menuoptions.map(option => {
                          let Obj = {
                            label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                            value: option.value.substring(0, 50),
                            description: option.description.substring(0, 50),
                          }
                        if(option.emoji) Obj.emoji = option.emoji;
                        return Obj;
                       }))
                      
                      //define the embed
                      let MenuEmbed = new Discord.MessageEmbed()
                        .setColor(es.color)
                        .setAuthor('Antinuke Setup', 'https://media.discordapp.net/attachments/820695790170275871/869657327941324860/PS7lwz7HwAAAABJRU5ErkJggg.png', 'https://discord.gg/milrato')
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable2"]))
                      let used33 = false;
                      //send the menu msg
                      let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
                      //function to handle the menuselection

                      //Event
                      client.on('interactionCreate', async (menu) => {
                        if (menu?.message.id === menumsg.id) {
                          if (menu?.user.id === cmduser.id) {
                            if(used33) return menu?.reply({content: `<:no:833101993668771842> You already selected something, this Selection is now disabled!`, ephemeral: true})
                            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
                            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable3"]))
                            client.disableComponentMessage(menu);
                            used33 = true;
                            const dd = await client.Anti_Nuke_System.get(message.guild.id, `${thekey}.enabled`);
                            if(menu?.values[0] == dd ? `Disable ${thename}`: `Enable ${thename}`) {
                              await client.Anti_Nuke_System.set(message.guild.id+`.${thekey}.enabled`, !dd)
                              return message.reply(`${!dd ? `Enabled: ${thename}`: `Disabled: ${thename}`}`)
                            } else {
                              handle_the_picks_X(menuoptionindex - 1, menuoptiondata)
                            }
                          }
                          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
                        }
                      });
                    }
              
                    async function handle_the_picks_X(menuoptionindex, menuoptiondata) {
                      let keys2 = {
                        "0" : "punishment.member.removeroles.neededdaycount",
                        "1" : "punishment.member.removeroles.neededweekcount",
                        "2" : "punishment.member.removeroles.neededmonthcount",
                        "3" : "punishment.member.kick.neededdaycount",
                        "4" : "punishment.member.kick.neededweekcount",
                        "5" : "punishment.member.kick.neededmonthcount",
                        "6" : "punishment.member.ban.neededdaycount",
                        "7" : "punishment.member.ban.neededweekcount",
                        "8" : "punishment.member.ban.neededmonthcount",
                      }
                      let thesecondkey = keys2[`${String(menuoptionindex)}`];
                      let finalkey = `${thekey}.${thesecondkey}`;

                      tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle("Enter the Amount now!")
                        .setColor(es.color)
                        .setDescription(`Please Enter the Needed Amount until the Punishment: \`${finalkey}\`\n\n\`0\` ... means no action`)
                        .setFooter(client.getFooter(es))]
                      })
                      await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                          max: 1,
                          time: 90000,
                          errors: ["time"]
                        })
                        .then(async collected => {
                          var message = collected.first();
                          let thenumber = message.content;
                          if(isNaN(thenumber)){
                            return message.reply(`:x: **Your Input is not a real Number**\n> \`${String(thenumber).substring(0, 50)}\``)
                          }
                          thenumber = Number(thenumber)
                          await client.Anti_Nuke_System.set(message.guild.id+`.finalkey`, thenumber);
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`\`${finalkey}\` Is now limited to **\`${thenumber} Actions\`**`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        })
                      .catch(e => {
                        console.error(e)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]});
                      })
                    }
                }
              }
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', async menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  menuselection3(menu);
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            
          } 
          else if(menu?.values[0] == "Suggested Settings"){
            await client.Anti_Nuke_System.set(message.guild.id, {
              all: {
                  enabled: true,
                  logger: await client.Anti_Nuke_System.get(message.guild.id+ ".all.logger"),
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".all.whitelisted"),
              },
              antibot: {
                  enabled: true,
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.whitelisted"),
                  punishment: {
                      bot: {
                          kick: true,
                          ban: false,
                      },
                      member: {
                          removeroles: {
                              neededdaycount: 1, //he is allowed to add 1 Bot / Day
                              neededweekcount: 4, //he is allowed to add 4 Bots / Week
                              neededmonthcount: 10, //he is allowed to add 10 Bot / Month
                              noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                              enabled: true
                          },
                          kick: {
                              neededdaycount: 2, //he is allowed to add 2 Bot / Day
                              neededweekcount: 7, //he is allowed to add 5 Bots / Week
                              neededmonthcount: 20, //he is allowed to add 11 Bot / Month
                              noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                              enabled: true
                          },
                          ban: {
                              neededdaycount: 4, //he is allowed to add 3 Bot / Day
                              neededweekcount: 10, //he is allowed to add 6 Bots / Week
                              neededmonthcount: 25, //he is allowed to add 12 Bot / Month
                              noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                              enabled: true
                          },
                      }
                  },
              },
              //Anti Kick & Ban
              antideleteuser: {
                  enabled: true,
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.whitelisted"),
                  punishment: {
                      member: {
                          removeroles: {
                              neededdaycount: 1, //he is allowed to do it 1 / Day
                              neededweekcount: 4, //he is allowed to do it 4 / Week
                              neededmonthcount: 10, //he is allowed to do it 10 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          kick: {
                              neededdaycount: 2, //he is allowed to to do it 2 / Day
                              neededweekcount: 7, //he is allowed to to do it 5 / Week
                              neededmonthcount: 20, //he is allowed to to do it 11 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          ban: {
                              neededdaycount: 4, //he is allowed to to do it 3 / Day
                             neededweekcount: 10, //he is allowed to to do it 6 / Week
                              neededmonthcount: 25, //he is allowed to to do it 12 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                      }
                  },
              },
              //ANTI CREATE ROLE
              anticreaterole: {
                  enabled: true,
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.whitelisted"),
                  punishment: {
                      removeaddedrole: true,
                      member: {
                          removeroles: {
                              neededdaycount: 1, //he is allowed to do it 1 / Day
                              neededweekcount: 4, //he is allowed to do it 4 / Week
                              neededmonthcount: 10, //he is allowed to do it 10 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          kick: {
                              neededdaycount: 2, //he is allowed to to do it 2 / Day
                              neededweekcount: 7, //he is allowed to to do it 5 / Week
                              neededmonthcount: 20, //he is allowed to to do it 11 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          ban: {
                              neededdaycount: 4, //he is allowed to to do it 3 / Day
                             neededweekcount: 10, //he is allowed to to do it 6 / Week
                              neededmonthcount: 25, //he is allowed to to do it 12 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                      }
                  },
              },
              //Anti DELETE Role
              antideleterole: {
                  enabled: true,
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.whitelisted"),
                  punishment: {
                      readdrole: true,
                      member: {
                          removeroles: {
                              neededdaycount: 1, //he is allowed to do it 1 / Day
                              neededweekcount: 4, //he is allowed to do it 4 / Week
                              neededmonthcount: 10, //he is allowed to do it 10 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          kick: {
                              neededdaycount: 2, //he is allowed to to do it 2 / Day
                              neededweekcount: 7, //he is allowed to to do it 5 / Week
                              neededmonthcount: 20, //he is allowed to to do it 11 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          ban: {
                              neededdaycount: 4, //he is allowed to to do it 3 / Day
                             neededweekcount: 10, //he is allowed to to do it 6 / Week
                              neededmonthcount: 25, //he is allowed to to do it 12 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                      }
                  },
              },
              //ANTI DELETE CHANNEL
              antichanneldelete: {
                  enabled: true,
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.whitelisted"),
                  punishment: {
                      member: {
                          removeroles: {
                              neededdaycount: 1, //he is allowed to do it 1 / Day
                              neededweekcount: 4, //he is allowed to do it 4 / Week
                              neededmonthcount: 10, //he is allowed to do it 10 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          kick: {
                              neededdaycount: 2, //he is allowed to to do it 2 / Day
                              neededweekcount: 7, //he is allowed to to do it 5 / Week
                              neededmonthcount: 20, //he is allowed to to do it 11 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          ban: {
                              neededdaycount: 4, //he is allowed to to do it 3 / Day
                              neededweekcount: 10, //he is allowed to to do it 6 / Week
                              neededmonthcount: 25, //he is allowed to to do it 12 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                      }
                  },
              },
              //ANTI CREATE CHANNEL
              antichannelcreate: {
                  enabled: true,
                  whitelisted: await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.whitelisted"),
                  punishment: {
                      deletecreatedchannel: true,
                      member: {
                          removeroles: {
                              neededdaycount: 1, //he is allowed to do it 1 / Day
                              neededweekcount: 4, //he is allowed to do it 4 / Week
                              neededmonthcount: 10, //he is allowed to do it 10 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          kick: {
                              neededdaycount: 2, //he is allowed to to do it 2 / Day
                              neededweekcount: 7, //he is allowed to to do it 5 / Week
                              neededmonthcount: 20, //he is allowed to to do it 11 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                          ban: {
                              neededdaycount: 4, //he is allowed to to do it 3 / Day
                             neededweekcount: 10, //he is allowed to to do it 6 / Week
                              neededmonthcount: 25, //he is allowed to to do it 12 / Month
                              noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                              enabled: true
                          },
                      }
                  },
              },
            })
            return menu?.reply({content: "<a:yes:833101995723194437> **Now using the Suggested Settings!**", embeds: [new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle(`${await client.Anti_Nuke_System.get(message.guild.id+ ".all.enabled") ? "<a:yes:833101995723194437> __**The Anti Nuke is enabled!**__": "<:no:833101993668771842> __**The Anti Nuke is disabled!**__"}`)
              .addField(`__**Anti Add Bot | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antibot.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Kick/Ban | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Kicks / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Kicks / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleteuser.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Delete Role | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antideleterole.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Delete Channel | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichanneldelete.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Create Role | ${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".anticreaterole.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(`__**Anti Create Channel | ${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.enabled") ? "<a:yes:833101995723194437> Enabled ": "<:no:833101993668771842> Disabled"}**__`, `>>> [Remove Roles] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.removeroles.neededdaycount")}\`**\n[Remove Roles] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.removeroles.neededweekcount")}\`\n**[Remove Roles] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.removeroles.neededmonthcount")}\`**\n\n[Kick] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.kick.neededdaycount")}\`**\n[Kick] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.kick.neededweekcount")}\`\n**[Kick] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.kick.neededmonthcount")}\`**\n\n[Ban] **Actions / Day: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.ban.neededdaycount")}\`**\n[Ban] **Actions / Week: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.ban.neededweekcount")}\`\n**[Ban] **Actions / Month: \`${await client.Anti_Nuke_System.get(message.guild.id+ ".antichannelcreate.punishment.member.ban.neededmonthcount")}\`**`)
              .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_89"]), eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable89"]))
              .addField(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variablex_90"]), eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable90"]))
              .setDescription(`${await client.Anti_Nuke_System.get(message.guild.id+ ".all.showwhitelistlog") ? "> <a:yes:833101995723194437> **I will show it when a Whitelisted User/Role makes an Action**\n> *But I won't do anything to him/her, cause he/she is whitelisted!*": "> <:no:833101993668771842> **I won't show it when a whitelisted User is doing something!**\n> This doesn't affect your security! (He is whitelisted, from the YOU)"}${await client.Anti_Nuke_System.get(message.guild.id+ ".all.quarantine")?.length > 0 ? `\n\n> **I will add him/her the Quarantine Role: <@&${await client.Anti_Nuke_System.get(message.guild.id+ ".all.quarantine")}> Role when removing the Roles!**` : "*NO Quarantine Role set, I will just remove his/her Roles / KICK / BAN..!*"}`)]
            });
          } 
          else if(menu?.values[0] == "Sync Quarantine Role"){
            let role = await client.Anti_Nuke_System.get(message.guild.id+ ".all.quarantine");
            if(!role || role.length <= 5){
              return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable92"])})
            }
            let channels = message.guild.channels.cache.filter(c => !c.permissionOverwrites.cache.has(role) || (c.permissionOverwrites.cache.has(role) && !c.permissionOverwrites.cache.get(role).deny.toArray().includes("VIEW_CHANNEL")));
            if(!channels || channels.size == 0){
              return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable93"])})
            }
            menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable94"])})
            for await (const ch of channels.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966)){
              try {
                if(ch) {
                  if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                    ch.permissionOverwrites.edit(role, {
                      VIEW_CHANNEL: false,
                      SEND_MESSAGES: false,
                      ADD_REACTIONS: false,
                      CONNECT: false,
                      SPEAK: false
                    });
                    await delay(1500);
                  }
                }
              } catch (e) {
                console.log(String(e.stack).grey.red);
              }
            }
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable95"])});
          } else {
            client.disableComponentMessage(menu);
          }
        }
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            menuselection(menu);
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antinuke"]["variable96"]))
      ]});
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
