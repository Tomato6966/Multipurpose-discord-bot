var {
  MessageEmbed, MessageMentions
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing,
  edit_msg,
  send_roster,
  duration
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-joinvc",
  category: "💪 Setup",
  aliases: ["setupjoinvc", "joinvc-setup"],
  cooldown: 5,
  usage: "setup-joinvc  --> Follow the Steps",
  description: "Define a Channel where every message is replaced with an EMBED or disable this feature",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {//ensure the database
      client.joinvc.ensure(message.guild.id, {
        vcmessages: [
          /*
           {
            channelId: "",
            textChannelId: "",
            message: "",
           }
          */
        ],
        vcroles: [
          /*
            {
              channelId: "",
              roleId: "",
            }
          */
        ],
      })
      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Send Message in a Channel",
            description: `Send a Message on Join, and edit it on leave`,
            emoji: "895066899619119105"
          },
          {
            value: "Add / Remove Role",
            description: `Add a Role on Join, Remove it on Leave.`,
            emoji: "895066900105674822"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Join VC System') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
              value: option.value.substr(0, 50),
              description: option.description.substr(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Join VC System', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
          .addField("Send Message in a Channel", `If a User joins a specific Channel, it will send a define able Message (e.g. Ping for Role(s)) in a defined Channel.\nThis is useful if you have a Waitingroomchannel, and it's needed to check if a user joins it or not with pings!\n*After leaving the Channel, the sent message get's edited and removes the ping*`)
          .addField("Add / Remove Role", `If a User joins a VC he/she will get a specific Role, this Role will get removed again, if he/she leaves the vc again!`)        
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){
          case "Send Message in a Channel":{
            second_layer()
            async function second_layer(){
              let menuoptions = [{
                  value: "Add a VC",
                  description: `Add a Vc Channel and Message to send.`,
                  emoji: "✅"
                },
                {
                  value: "Remove a VC",
                  description: `Remove an already added VC-Channel.`,
                  emoji: "❌"
                },
                {
                  value: "Show all VCS",
                  description: `Show all setup Channels!`,
                  emoji: "📑"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Join VC System') 
                .addOptions(
                menuoptions.map(option => {
                  let Obj = {
                    label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                    value: option.value.substr(0, 50),
                    description: option.description.substr(0, 50),
                  }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
               }))
              
              //define the embed
              let MenuEmbed = new Discord.MessageEmbed()
                .setColor(es.color)
                .setAuthor('Join VC System', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://discord.gg/milrato')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  menu?.deferUpdate();
                  handle_the_picks2(menu?.values[0], menuoptiondata)
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks2(optionhandletype, menuoptiondata) {
              switch (optionhandletype){
                case "Add a VC": {
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`**Which Channel do you wanna add?**`)
                    .setColor(es.color)
                    .setDescription(`Please Ping the **VOICE CHANNEL** now! / Send the **ID** the **Talk**!\nAnd add the **LOG_CHANNEL** in VIA ID / PING afterwards!\nAnd then add the Message at the end!\n\n**Examples:**\n> \`#VoiceChannel #TextChannel @Voice-Support Someone joined the Voice Support, check the Embed!\`\n> \`901905221851156552 901904924709908540 @Voice-Support Someone joined the Voice Support, check the Embed!\``)
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      let ChannelRegex = message.content.match(MessageMentions.CHANNELS_PATTERN)?.map(r => message.guild.channels.cache.get(r.replace(/[<@&#>]/igu, "")))
                      var Voicechannel = ChannelRegex && ChannelRegex.length >= 1 ? ChannelRegex[0] : message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      var Textchannel = ChannelRegex && ChannelRegex.length >= 2 ? ChannelRegex[1] : message.guild.channels.cache.get(message.content.trim().split(" ")[1]);
                      if(!Voicechannel || !Textchannel || Voicechannel.type != "GUILD_VOICE" || Textchannel.type != "GUILD_TEXT") return message.reply(":x: **Check the example in the Embed, wrong input type!**")
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcmessages")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcmessages")
                          }
                          if(!message.guild.channels.cache.get(vc.textChannelId)){
                            client.joinvc.remove(message.guild.id, d => d.textChannelId == vc.textChannelId, "vcmessages")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcmessages")
                        if(a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`<:no:833101993668771842> This Channel is already Setupped!`)
                            .setDescription(`Remove it first with \`${prefix}setup-joinvc\` --> Then Pick VC Messages --> Then Pick Remove!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        var args = message.content.split(" ").slice(2);
                       
                        client.joinvc.push(message.guild.id, { channelId: Voicechannel.id, textChannelId: Textchannel.id, message: args.join(" ") }, "vcmessages")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`<a:yes:833101995723194437> I will now send Messages after someone joins the VC \`${Voicechannel.name}\` in the TextChannel **${Textchannel.name}**`)
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } catch (e) {
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable10"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable11"]))
                          .setFooter(client.getFooter(es))
                        ]});
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]});
                    })
                    
          
                }break;
                case "Remove a VC": {
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable13"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable14"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      var Voicechannel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id && ch.type == "GUILD_VOICE").first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if(!Voicechannel || Voicechannel.type != "GUILD_VOICE") return message.reply(":x: **Check the example in the Embed, wrong input type!**")
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcmessages")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcmessages")
                          }
                          if(!message.guild.channels.cache.get(vc.textChannelId)){
                            client.joinvc.remove(message.guild.id, d => d.textChannelId == vc.textChannelId, "vcmessages")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcmessages")
                        if(!a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`<:no:833101993668771842> This Channel has not been Setup yet!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        client.joinvc.remove(message.guild.id, d => d.channelId == Voicechannel.id, "vcmessages")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`<a:yes:833101995723194437> Successfully removed **${Voicechannel.name}** out of the Setup!`)
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } catch (e) {
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable18"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable19"]))
                          .setFooter(client.getFooter(es))
                        ]});
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]});
                    })
                }break;
                case "Show all VCS": {
                  let a = client.joinvc.get(message.guild.id, "vcmessages")
                  //remove invalid ids
                  for(const vc of a){
                    if(!message.guild.channels.cache.get(vc.channelId)){
                      client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcmessages")
                    }
                    if(!message.guild.channels.cache.get(vc.textChannelId)){
                      client.joinvc.remove(message.guild.id, d => d.textChannelId == vc.textChannelId, "vcmessages")
                    }
                  }
                  a = client.joinvc.get(message.guild.id, "vcmessages")

                  message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`📑 Settings of the Join Vc-Messages System`)
                    .setColor(es.color)
                    .setDescription(`**VCS Where a Message is sent:**\n${a.map(d => `<#${d.channelId}> [Send in: <#${d.textChannelId}>]`).join("\n")}`.substr(0, 2000))
                    .setFooter(client.getFooter(es))]
                  })
                }break;
              }
            }
          }break;
          case "Add / Remove Role":{
            second_layer()
            async function second_layer(){
              let menuoptions = [{
                  value: "Add a VC",
                  description: `Add a Vc Channel and Role to add/remove.`,
                  emoji: "✅"
                },
                {
                  value: "Remove a VC",
                  description: `Remove an already added VC-Channel.`,
                  emoji: "❌"
                },
                {
                  value: "Show all VCS",
                  description: `Show all setup Channels!`,
                  emoji: "📑"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Join VC System') 
                .addOptions(
                menuoptions.map(option => {
                  let Obj = {
                    label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                    value: option.value.substr(0, 50),
                    description: option.description.substr(0, 50),
                  }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
               }))
              
              //define the embed
              let MenuEmbed = new Discord.MessageEmbed()
                .setColor(es.color)
                .setAuthor('Join VC System', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://discord.gg/milrato')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  menu?.deferUpdate();
                  handle_the_picks2(menu?.values[0], menuoptiondata)
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks2(optionhandletype, menuoptiondata) {
              switch (optionhandletype){
                case "Add a VC": {
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`**Which Channel do you wanna add?**`)
                    .setColor(es.color)
                    .setDescription(`Please Ping the **VOICE CHANNEL** now! / Send the **ID** the **Talk**!\nAnd add the **RIKE** in VIA ID / PING afterwards!\n\n**Examples:**\n> \`#VoiceChannel @Role-For-VoiceChannel\``)
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      var Voicechannel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id && ch.type == "GUILD_VOICE").first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      var Role = message.mentions.roles.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.roles.cache.get(message.content.trim().split(" ")[1]);
                      if(!Voicechannel || !Role) return message.reply(":x: **Check the example in the Embed, wrong input type!**")
                      
                      if (message.guild.me.roles.highest.rawPosition <= Role.rawPosition)
                        return message.reply({embeds: [new MessageEmbed()
                          .setColor(es.wrongcolor)
                          .setFooter(client.getFooter(es))
                          .setTitle("I can't give/remove this Role, because it's higher/equal to my highest Role")
                        ]});
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcroles")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcroles")
                          }
                          if(!message.guild.roles.cache.get(vc.roleId)){
                            client.joinvc.remove(message.guild.id, d => d.roleId == vc.roleId, "vcroles")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcroles")
                        if(a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`<:no:833101993668771842> This Channel is already Setupped!`)
                            .setDescription(`Remove it first with \`${prefix}setup-joinvc\` --> Then Pick VC ROLES --> Then Pick Remove!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        client.joinvc.push(message.guild.id, { channelId: Voicechannel.id, roleId: Role.id }, "vcroles")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`<a:yes:833101995723194437> I will now Add the Role \`${Role.name}\` when someone joins the VC **${Discord.VoiceChannel.name}**`)
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } catch (e) {
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable10"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable11"]))
                          .setFooter(client.getFooter(es))
                        ]});
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]});
                    })
                    
          
                }break;
                case "Remove a VC": {
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable13"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable14"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      var Voicechannel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id && ch.type == "GUILD_VOICE").first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if(!Voicechannel || Voicechannel.type != "GUILD_VOICE") return message.reply(":x: **Check the example in the Embed, wrong input type!**")
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcroles")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcroles")
                          }
                          if(!message.guild.roles.cache.get(vc.roleId)){
                            client.joinvc.remove(message.guild.id, d => d.roleId == vc.roleId, "vcroles")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcroles")
                        if(!a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`<:no:833101993668771842> This Channel has not been Setup yet!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        client.joinvc.remove(message.guild.id, d => d.channelId == Voicechannel.id, "vcroles")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`<a:yes:833101995723194437> Successfully removed **${Voicechannel.name}** out of the Setup!`)
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } catch (e) {
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable18"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable19"]))
                          .setFooter(client.getFooter(es))
                        ]});
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]});
                    })
                }break;
                case "Show all VCS": {
                  let a = client.joinvc.get(message.guild.id, "vcroles")
                  //remove invalid ids
                  for(const vc of a){
                    if(!message.guild.channels.cache.get(vc.channelId)){
                      client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcroles")
                    }
                    if(!message.guild.roles.cache.get(vc.roleId)){
                      client.joinvc.remove(message.guild.id, d => d.roleId == vc.roleId, "vcroles")
                    }
                  }
                  a = client.joinvc.get(message.guild.id, "vcroles")

                  message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`📑 Settings of the Join Vc-Role System`)
                    .setColor(es.color)
                    .setDescription(`**VCS Where I add a Role:**\n${a.map(d => `<#${d.channelId}> [Role: <@&${d.roleId}>]`).join("\n")}`.substr(0, 2000))
                    .setFooter(client.getFooter(es))]
                  })
                }break;
              }
            }
          }break;
        }
      }
      

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable26"]))
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
