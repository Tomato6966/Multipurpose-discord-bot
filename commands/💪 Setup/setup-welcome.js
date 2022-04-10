var {
  MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure,
  isValidURL, dbRemove
} = require(`../../handlers/functions`);
//Import npm modules
const Canvas = require("canvas");
const canvacord = require("canvacord");
const Fonts = "Genta, UbuntuMono, `DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
const wideFonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
module.exports = {
  name: "setup-welcome",
  category: "💪 Setup",
  aliases: ["setupwelcome"],
  cooldown: 5,
  usage: "setup-welcome --> Follow Steps",
  description: "Manage the Welcome System (Message, Invite Tracker, Image-Design, Captcha System, Roles, etc.)",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      var tempmsg;
      var url = "";
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Channel Welcome Messages",
            description: `Manage Welcome Messages in 1 CHANNEL`,
            emoji: "895066899619119105" //
          },
          {
            value: "Channel Welcome Message 2",
            description: `Set a normal msg for a 2nd Channel (without Embed)`,
            emoji: "895066899619119105" //
          },
          {
            value: "Direct Welcome Messages",
            description: `Manage Welcome Messages on DMS`,
            emoji: "😬"
          },
          {
            value: "Welcome Roles (On Join)",
            description: `Manage the Welcome Roles. Add/remove/list them!`,
            emoji: "895066900105674822"
          },
          {
            value: "Captcha System (Security)",
            description: `${GuildSettings?.welcome?.captcha ? "❌ Disable the Captcha-Security-System":"✅ Enable the Captcha-Security-System" }`,
            emoji: "866089515993792522"
          },
          {
            value: `Test Welcome`,
            description: `Test the current welcome Message`,
            emoji: `💪`
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Welcome-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Welcome-System') 
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
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {          
          case "Channel Welcome Messages":{
            
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${GuildSettings?.welcome?.channel == "nochannel" ? "Set Channel": "Overwrite Channel"}`,
                  description: `${GuildSettings?.welcome?.channel == "nochannel" ? "Set a Channel where the Welcome Messages should be": "Overwrite the current Channel with a new one"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Disable Welcome",
                  description: `Disable the Welcome Messages`,
                  emoji: "❌"
                },
                {
                  value: "Manage the Image",
                  description: `Manage the Welcome Image for the Message`,
                  emoji: "🖼️"
                },
                {
                  value: "Edit the Message",
                  description: `Edit the Welcome Message ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${GuildSettings?.welcome?.invite ? "Disable InviteInformation": "Enable Invite Information"}`,
                  description: `${GuildSettings?.welcome?.invite ? "No longer show Information who invited him/her": "Show Information about who invited him/her"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Welcome-System') 
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', async menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  client.disableComponentMessage(menu);
                  let SetupNumber = menu?.values[0].split(" ")[0]
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata){
              switch (optionhandletype) {
                case `${GuildSettings?.welcome?.channel == "nochannel" ? "Set Channel": "Overwrite Channel"}`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable8"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                    if (channel) {
                        await client.settings.set(`${message.guild.id}.welcome.channel`, channel.id)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable9"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message will be sent into ${channel}!\nEdit the message with: \`${prefix}setup-welcome\``.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                    } else {
                      return message.reply("you didn't ping a valid channel")
                    }
                  })
                  .catch(e => {
                    console.error(e)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `Disable Welcome`:{
                  await client.settings.set(`${message.guild.id}.welcome.channel`, "nochannel")
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable13"]))
                    .setColor(es.color)
                    .setDescription(`If Someone joins this Server, no message will be sent into a Channel!\nSet a Channel with: \`${prefix}setup-welcome\` --> Pick 1️⃣ --> Pick 1️⃣`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
                case `Manage the Image`:{
                  third_layer()
                  async function third_layer(){
                    let menuoptions = [
                      {
                        value: "Disable the Image",
                        description: `I won't attach any Images anymore`,
                        emoji: "❌"
                      },
                      {
                        value: "Enable auto Image",
                        description: `I will generate an Image with the Userdata`,
                        emoji: "865962151649869834"
                      },
                      {
                        value: "Set Image Background",
                        description: `Define the Background of the AUTO IMAGE`,
                        emoji: "👍"
                      },
                      {
                        value: "Del Image Background",
                        description: `Reset the AUTO IMAGE Background to the default one`,
                        emoji: "🗑"
                      },
                      {
                        value: "Custom Image",
                        description: `Use a custom Image instead of the Background Image`,
                        emoji: "🖼"
                      },
                      {
                        value: `${GuildSettings?.welcome?.frame ? "Disable" : "Enable"} Frame`,
                        description: `${GuildSettings?.welcome?.frame ? "I won't show the Frame anymore" : "Let me display a colored Frame for highlighting"}`,
                        emoji: "✏️" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.discriminator ? "Disable" : "Enable"} User-Tag`,
                        description: `${GuildSettings?.welcome?.discriminator ? "I won't show the User-Tag anymore" : "Let me display a colored User-Tag (#1234)"}`,
                        emoji: "🔢" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.membercount ? "Disable" : "Enable"} Member Count`,
                        description: `${GuildSettings?.welcome?.membercount ? "I won't show the Member Count anymore" : "Let me display a colored MemberCount of the Server"}`,
                        emoji: "📈" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.servername ? "Disable" : "Enable"} Server Name`,
                        description: `${GuildSettings?.welcome?.servername ? "I won't show the ServerName anymore" : "Let me display a colored ServerName"}`,
                        emoji: "🗒" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.pb ? "Disable" : "Enable"} User-Avatar`,
                        description: `${GuildSettings?.welcome?.pb ? "I won't show the User-Avatar anymore" : "Let me display the User-Avatar"}`,
                        emoji: "💯" 
                      },
                      {
                        value: "Frame Color",
                        description: `Change the Frame Color`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancel and stop the Welcome-Setup!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection') 
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Click me to setup the Welcome-System') 
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
                    let MenuEmbed = new MessageEmbed()
                      .setColor(es.color)
                      .setAuthor(client.getAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato'))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
                    //send the menu msg
                    let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
                    //Create the collector
                    const collector = menumsg.createMessageComponentCollector({ 
                      filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                      time: 90000
                    })
                    //Menu Collections
                    collector.on('collect', async menu => {
                      if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                        if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                        client.disableComponentMessage(menu);
                        let SetupNumber = menu?.values[0].split(" ")[0]
                        handle_the_picks_3(menu?.values[0], SetupNumber, menuoptiondata)
                      }
                      else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
                    });
                    //Once the Collections ended edit the menu message
                    collector.on('end', collected => {
                      menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                    });
                  }
                  async function handle_the_picks_3(optionhandletype, SetupNumber, menuoptiondata){
                    switch (optionhandletype) {
                      case `Disable the Image`:{
                        await client.settings.set(`${message.guild.id}.welcome.image`, false)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable18"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with__out__ an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Enable auto Image`:{
                        await client.settings.set(`${message.guild.id}.welcome.image`, true)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable21"]))
                          .setColor(es.color)
                          .setDescription(`I will be using ${GuildSettings?.welcome?.custom === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Set Image Background`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable24"]))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable25"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(async collected => {
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                                await client.settings.set(`${message.guild.id}.welcome.background`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable26"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.custom === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable27"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                                await client.settings.set(`${message.guild.id}.welcome.background`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable28"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.custom === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable29"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable30"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `Del Image Background`:{
                        await client.settings.set(`${message.guild.id}.welcome.image`, true)
                        await client.settings.set(`${message.guild.id}.welcome.background`, "transparent")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable32"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Custom Image`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable35"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(async collected => {
      
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                await client.settings.set(`${message.guild.id}.welcome.custom`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable36"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.custom === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable37"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                await client.settings.set(`${message.guild.id}.welcome.custom`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable38"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.custom === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable39"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable40"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `${GuildSettings?.welcome?.frame ? "Disable" : "Enable"} Frame`:{
                        await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.frame`, !GuildSettings?.welcome?.frame)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable42"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.discriminator ? "Disable" : "Enable"} User-Tag`:{
                        await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.discriminator`, !GuildSettings?.welcome?.discriminator)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable45"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.membercount ? "Disable" : "Enable"} Member Count`:{
                        await client.settings.set(message.guild.id, "no", +".welcome.custom")
                        await client.settings.set(`${message.guild.id}.welcome.membercount`, !GuildSettings?.welcome?.membercount)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable48"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.servername ? "Disable" : "Enable"} Server Name`:{
                        await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.servername`, !GuildSettings?.welcome?.servername)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable51"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.pb ? "Disable" : "Enable"} User-Avatar`:{
                        await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.pb`, !GuildSettings?.welcome?.pb)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable54"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Frame Color`:{

                        let row1 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FFFFF9").setEmoji("⬜").setLabel("#FFFFF9"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FAFA25").setEmoji("🟨").setLabel("#FAFA25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA9E25").setEmoji("🟧").setLabel("#FA9E25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA2525").setEmoji("🟥").setLabel("#FA2525"),
                        ])
                        let row2 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#25FA6C").setEmoji("🟩").setLabel("#25FA6C"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#3A98F0").setEmoji("🟦").setLabel("#3A98F0"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#8525FA").setEmoji("🟪").setLabel("#8525FA"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#030303").setEmoji("⬛").setLabel("#030303"),
                        ])
                        
                        tempmsg = await message.reply({
                          components: [row1, row2],
                          embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable57"]))
                          .setColor(es.color)
                          .setDescription(`*React to the Color you want the Frame/Text to be like ;)*`)
                          .setFooter(client.getFooter(es))
                        ]})
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({ 
                          filter: i => i?.isButton() && i?.message.author?.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          tempmsg.edit({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `<a:yes:833101995723194437> **Selected the \`${collected.first().customId}\` Color**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            await client.settings.set(`${message.guild.id}.welcome.framecolor`, color)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable59"]))
                              .setColor(color)
                              .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                              .setFooter(client.getFooter(es))
                            ]});  
                          } else {
                            button?.reply(":x: **Only the Command Executor is allowed to react!**")
                          }
                        })
                      } break;
                    }
                  }

                }break;
                case `Edit the Message`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable64"]))
                    .setColor(es.color)
                    .setDescription(`\`{user}\` ... will be replaced with the Userping (e.g: ${cmduser})\n\`{username}\` ... will be replaced with the Username (e.g: ${cmduser.user.username})\n\`{usertag}\` ... will be replaced with the Usertag (e.g: ${cmduser.user.tag})\n\n**Enter your Message now!**`)
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    await client.settings.set(`${message.guild.id}.welcome.msg`, message.content)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable66"]))
                      .setColor(es.color)
                      .setDescription(`If Someone joins this Server, this message will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL YET"}!\n\n${message.content.replace("{user}", `${cmduser.user}`).replace("{username}", `${cmduser.user.username}`).replace("{usertag}", `${cmduser.user.tag}`)}`.substring(0, 2048))
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
                }break;
                case `${GuildSettings?.welcome?.invite ? "Disable InviteInformation": "Enable Invite Information"}`:{
                  await client.settings.set(`${message.guild.id}.welcome.invite`, !GuildSettings?.welcome?.invite)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable70"]))
                    .setColor(es.color)
                    .setDescription(`If Someone joins this Server, a message with Invite Information will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "Not defined yet"}!\nEdit the message with: \`${prefix}setup-welcome\``.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
              }
            }
          }break;
          case "Channel Welcome Message 2": {
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${GuildSettings?.welcome?.secondchannel == "nochannel" ? "Set Channel": "Overwrite Channel"}`,
                  description: `${GuildSettings?.welcome?.secondchannel == "nochannel" ? "Set a Channel where the Welcome Messages should be": "Overwrite the current Channel with a new one"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Disable Welcome 2",
                  description: `Disable the second Welcome Message`,
                  emoji: "❌"
                },
                {
                  value: "Edit the Message",
                  description: `Edit the second Welcome Message ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Welcome-System') 
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor(client.getAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato'))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', async menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  client.disableComponentMessage(menu);
                  let SetupNumber = menu?.values[0].split(" ")[0]
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata){
              switch (optionhandletype) {
                case `${GuildSettings?.welcome?.secondchannel == "nochannel" ? "Set Channel": "Overwrite Channel"}`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable8"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                    if (channel) {
                        await client.settings.set(`${message.guild.id}.welcome.secondchannel`, channel.id)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable9"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message will be sent into ${channel}!\nEdit the message with: \`${prefix}setup-welcome\``.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                    } else {
                      return message.reply("you didn't ping a valid channel")
                    }
                  })
                  .catch(e => {
                    console.error(e)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `Disable Welcome 2`:{
                  await client.settings.set(`${message.guild.id}.welcome.secondchannel`, "nochannel")
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable13"]))
                    .setColor(es.color)
                    .setDescription(`If Someone joins this Server, no message will be sent into a Channel!\nSet a Channel with: \`${prefix}setup-welcome\` --> Pick 1️⃣ --> Pick 1️⃣`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
                case `Edit the Message`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable64"]))
                    .setColor(es.color)
                    .setDescription(`\`{user}\` ... will be replaced with the Userping (e.g: ${cmduser})\n\`{username}\` ... will be replaced with the Username (e.g: ${cmduser.user.username})\n\`{usertag}\` ... will be replaced with the Usertag (e.g: ${cmduser.user.tag})\n\n**Enter your Message now!**`)
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    await client.settings.set(`${message.guild.id}.welcome.secondmsg`, message.content)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable66"]))
                      .setColor(es.color)
                      .setDescription(`If Someone joins this Server, this message will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.secondchannel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.secondchannel) : "NO CHANNEL YET"}!\n\n${message.content.replace("{user}", `${cmduser.user}`).replace("{username}", `${cmduser.user.username}`).replace("{usertag}", `${cmduser.user.tag}`)}`.substring(0, 2048))
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
                }break;
                }
            }
          }break;
          case "Direct Welcome Messages":{
            
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${!GuildSettings?.welcome?.dm ? "ENABLE DM WELCOME": "DISABLE DM WELCOME"}`,
                  description: `${!GuildSettings?.welcome?.dm ? "Send Welcome Messages Directly to Users": "Don't send Welcome Messages Directly to Users"}`,
                  emoji: "✅" //
                },
                {
                  value: "Manage the Image",
                  description: `Manage the Welcome Image for the Message`,
                  emoji: "🖼️"
                },
                {
                  value: "Edit the Message",
                  description: `Edit the Welcome Message ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${GuildSettings?.welcome?.invite ? "Disable InviteInformation": "Enable Invite Information"}`,
                  description: `${GuildSettings?.welcome?.invite ? "No longer show Information who invited him/her": "Show Information about who invited him/her"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Welcome-System') 
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor(client.getAuthor('DM - Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato'))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', async menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  client.disableComponentMessage(menu);
                  let SetupNumber = menu?.values[0].split(" ")[0]
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata){
              switch (optionhandletype) {
                case `${!GuildSettings?.welcome?.dm ? "ENABLE DM WELCOME": "DISABLE DM WELCOME"}`:{
                  await client.settings.set(`${message.guild.id}.welcome.dm`, !GuildSettings.welcome?.dm)
                  if(!!GuildSettings.welcome?.dm){
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable79"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable76"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                }break;
                case `Manage the Image`:{
                  third_layer()
                  async function third_layer(){
                    let menuoptions = [
                      {
                        value: "Disable the Image",
                        description: `I won't attach any Images anymore`,
                        emoji: "❌"
                      },
                      {
                        value: "Enable auto Image",
                        description: `I will generate an Image with the Userdata`,
                        emoji: "865962151649869834"
                      },
                      {
                        value: "Set Image Background",
                        description: `Define the Background of the AUTO IMAGE`,
                        emoji: "👍"
                      },
                      {
                        value: "Del Image Background",
                        description: `Reset the AUTO IMAGE Background to the default one`,
                        emoji: "🗑"
                      },
                      {
                        value: "Custom Image",
                        description: `Use a custom Image instead of the Background Image`,
                        emoji: "🖼"
                      },
                      {
                        value: `${GuildSettings?.welcome?.framedm ? "Disable" : "Enable"} Frame`,
                        description: `${GuildSettings?.welcome?.framedm ? "I won't show the Frame anymore" : "Let me display a colored Frame for highlighting"}`,
                        emoji: "✏️" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.discriminatordm ? "Disable" : "Enable"} User-Tag`,
                        description: `${GuildSettings?.welcome?.discriminatordm ? "I won't show the User-Tag anymore" : "Let me display a colored User-Tag (#1234)"}`,
                        emoji: "🔢" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.membercountdm ? "Disable" : "Enable"} Member Count`,
                        description: `${GuildSettings?.welcome?.membercountdm ? "I won't show the Member Count anymore" : "Let me display a colored MemberCount of the Server"}`,
                        emoji: "📈" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.servernamedm ? "Disable" : "Enable"} Server Name`,
                        description: `${GuildSettings?.welcome?.servernamedm ? "I won't show the ServerName anymore" : "Let me display a colored ServerName"}`,
                        emoji: "🗒" 
                      },
                      {
                        value: `${GuildSettings?.welcome?.pbdm ? "Disable" : "Enable"} User-Avatar`,
                        description: `${GuildSettings?.welcome?.pbdm ? "I won't show the User-Avatar anymore" : "Let me display the User-Avatar"}`,
                        emoji: "💯" 
                      },
                      {
                        value: "Frame Color",
                        description: `Change the Frame Color`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancel and stop the Welcome-Setup!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection') 
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Click me to setup the Welcome-System') 
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
                    let MenuEmbed = new MessageEmbed()
                      .setColor(es.color)
                      .setAuthor(client.getAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato'))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
                    //send the menu msg
                    let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
                    //Create the collector
                    const collector = menumsg.createMessageComponentCollector({ 
                      filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                      time: 90000
                    })
                    //Menu Collections
                    collector.on('collect', async menu => {
                      if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                        if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                        client.disableComponentMessage(menu);
                        let SetupNumber = menu?.values[0].split(" ")[0]
                        handle_the_picks_3(menu?.values[0], SetupNumber, menuoptiondata)
                      }
                      else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
                    });
                    //Once the Collections ended edit the menu message
                    collector.on('end', collected => {
                      menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                    });
                  }
                  async function handle_the_picks_3(optionhandletype, SetupNumber, menuoptiondata){
                    switch (optionhandletype) {
                      case `Disable the Image`:{
                        await client.settings.set(`${message.guild.id}.welcome.imagedm`, false)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable84"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Enable auto Image`:{
                        await client.settings.set(`${message.guild.id}.welcome.imagedm`, true)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable87"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Set Image Background`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable90"]))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable91"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(async collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                await client.settings.set(`${message.guild.id}.welcome.customdm`, "no")
                                await client.settings.set(`${message.guild.id}.welcome.backgrounddm`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable92"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.customdm === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable93"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                await client.settings.set(`${message.guild.id}.welcome.customdm`, "no")
                                await client.settings.set(`${message.guild.id}.welcome.backgrounddm`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable94"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.customdm === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable95"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable96"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `Del Image Background`:{
                        await client.settings.set(`${message.guild.id}.welcome.imagedm`, true)
                        await client.settings.set(`${message.guild.id}.welcome.backgrounddm`, "transparent")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable98"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Custom Image`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable101"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(async collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                await client.settings.set(`${message.guild.id}.welcome.customdm`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable102"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.customdm === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable103"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                await client.settings.set(`${message.guild.id}.welcome.customdm`, url)
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable104"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${GuildSettings?.welcome?.customdm === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable105"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable106"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `${GuildSettings?.welcome?.framedm ? "Disable" : "Enable"} Frame`:{
                        await client.settings.set(`${message.guild.id}.welcome.customdm`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.framedm`, !GuildSettings?.welcome?.framedm)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable108"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.discriminatordm ? "Disable" : "Enable"} User-Tag`:{
                        await client.settings.set(`${message.guild.id}.welcome.customdm`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.discriminatordm`, !GuildSettings?.welcome?.discriminatordm)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable111"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.membercountdm ? "Disable" : "Enable"} Member Count`:{
                        await client.settings.set(`${message.guild.id}.welcome.customdm`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.membercountdm`, !GuildSettings?.welcome?.membercountdm)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable114"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.servernamedm ? "Disable" : "Enable"} Server Name`:{
                        await client.settings.set(`${message.guild.id}.welcome.customdm`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.servernamedm`, !GuildSettings?.welcome?.servernamedm)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable117"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${GuildSettings?.welcome?.pbdm ? "Disable" : "Enable"} User-Avatar`:{
                        await client.settings.set(`${message.guild.id}.welcome.custom`, "no")
                        await client.settings.set(`${message.guild.id}.welcome.pbdm`, !GuildSettings?.welcome?.pbdm)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable120"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Frame Color`:{

                        let row1 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FFFFF9").setEmoji("⬜").setLabel("#FFFFF9"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FAFA25").setEmoji("🟨").setLabel("#FAFA25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA9E25").setEmoji("🟧").setLabel("#FA9E25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA2525").setEmoji("🟥").setLabel("#FA2525"),
                        ])
                        let row2 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#25FA6C").setEmoji("🟩").setLabel("#25FA6C"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#3A98F0").setEmoji("🟦").setLabel("#3A98F0"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#8525FA").setEmoji("🟪").setLabel("#8525FA"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#030303").setEmoji("⬛").setLabel("#030303"),
                        ])
                        
                        tempmsg = await message.reply({
                          components: [row1, row2],
                          embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable57"]))
                          .setColor(es.color)
                          .setDescription(`*React to the Color you want the Frame/Text to be like ;)*`)
                          .setFooter(client.getFooter(es))
                        ]})
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({ 
                          filter: i => i?.isButton() && i?.message.author?.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          tempmsg.edit({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `<a:yes:833101995723194437> **Selected the \`${collected.first().customId}\` Color**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            await client.settings.set(`${message.guild.id}.welcome.framecolordm`, color)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable125"]))
                              .setColor(color)
                              .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(GuildSettings?.welcome?.channel) ? message.guild.channels.cache.get(GuildSettings?.welcome?.channel) : "NO CHANNEL DEFINED YET"}`.substring(0, 2048))
                              .setFooter(client.getFooter(es))
                            ]});
                          } else {
                            button?.reply(":x: **Only the Command Executor is allowed to react!**")
                          }
                        })
                      } break;
                    }
                  }

                }break;
                case `Edit the Message`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable130"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable131"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(async collected => {
                      var message = collected.first();
                      await client.settings.set(`${message.guild.id}.welcome.dm_msg`, message.content)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable132"]))
                        .setColor(es.color)
                        .setDescription(`${message.content.replace("{user}", `${cmduser.user}`).replace("{username}", `${cmduser.user.username}`).replace("{usertag}", `${cmduser.user.tag}`)}`.substring(0, 2048))
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
                }break;
                case `${GuildSettings?.welcome?.invite ? "Disable InviteInformation": "Enable Invite Information"}`:{
                  await client.settings.set(`${message.guild.id}.welcome.invite`, !GuildSettings?.welcome?.invitedm)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable136"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
              }
            }
          }break;
          case "Welcome Roles (On Join)":{

            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: "Add Role",
                  description: `Add a Welcome Role`,
                  emoji: "✅"
                },
                {
                  value: "Remove Role",
                  description: `Remove a Welcome Role`,
                  emoji: "🗑️"
                },
                {
                  value: "Show Roles",
                  description: `Show all Welcome Roles`,
                  emoji: "📑"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Welcome-System') 
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor(client.getAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b.png', 'https://discord.gg/milrato'))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({ 
                filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', async menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  client.disableComponentMessage(menu);
                  let SetupNumber = menu?.values[0].split(" ")[0]
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata){
              switch (optionhandletype) {
                case `Add Role`:{
                  var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable142"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable143"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    var role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                    if (role) {
                      var welcomeroles = GuildSettings?.welcome?.roles || [];
                      if (welcomeroles.includes(role.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable144"]))
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                      ]});
                      welcomeroles.push(role.id);
                      await client.settings.set(`${message.guild.id}.welcome.roles`, welcomeroles);
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable145"]))
                        .setColor(es.color)
                        .setDescription(`Everyone who joins will get those Roles now:\n<@&${GuildSettings?.welcome?.roles.join(">\n<@&")}>`.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]});
                    } else {
                      return message.reply("you didn't ping a valid Role")
                    }
                  })
                  .catch(e => {
                    console.error(e)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable146"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]});
                  })
                }break;
                case `Remove Role`:{
                  var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable147"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable148"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === cmduser.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(async collected => {
                      var message = collected.first();
                      var role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                      if (role) {
                        var welcomeroles = GuildSettings?.welcome?.roles || []
                        if (!welcomeroles.includes(role.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable149"]))
                          .setColor(es.wrongcolor)
                          .setFooter(client.getFooter(es))
                        ]});
                        await dbRemove(client.settings, `${message.guild.id}.welcome.roles`, role.id);
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable150"]))
                          .setColor(es.color)
                          .setDescription(`Everyone who joins will get those Roles now:\n<@&${GuildSettings?.welcome?.roles.join(">\n<@&")}>`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } else {
                        return message.reply("you didn't ping a valid Role")
                      }
                    })
                    .catch(e => {
                      console.error(e)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable151"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]});
                    })
                }break;
                case `Show Roles`:{
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable152"]))
                    .setColor(es.color)
                    .setDescription(`<@&${GuildSettings?.welcome?.roles.join(">\n<@&")}>`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
              }
            }
          }break;
          case "Captcha System (Security)":{
            await client.settings.set(`${message.guild.id}.welcome.captcha`, !GuildSettings?.welcome?.captcha)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable154"]))
              .setColor(es.color)
              .setDescription(`${GuildSettings?.welcome?.captcha ? "I will ask new Members to verify themself, then send welcome messages / add them the roles if they succeed, + I will kick them if they failed!..." : "I will not ask new Members to verify themself!"}`.substring(0, 2048))
              .setFooter(client.getFooter(es))
            ]});
          }break;
          case `Test Welcome`:{
            var { member } = message;
            let welcome = GuildSettings.welcome;
            let invitemessage = `Invited by ${member.user.tag ? `**${member.user.tag}**` : `<@${member.user.id}>`}\n<:Like:857334024087011378> **X Invites**\n[<:joines:866356465299488809> X Joins | <:leaves:866356598356049930> X Leaves | <:no:833101993668771842> X Fakes]`
            if(welcome){
              let themessage = String(welcome.secondmsg);
              if(!themessage || themessage.length == 0) themessage = ":wave: {user} **Welcome to our Server!** :v:";
              themessage = themessage.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`)
              if(message.channel.permissionsFor(message.channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                message.channel.send({content: `**CHANNEL 2 MESSAGE in ${welcome.secondchannel != "nochannel" ? `<#${welcome.secondchannel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n${themessage}`.substring(0, 2000)}).catch(() => null);
              }
            }
      
            if (welcome) {
              if (welcome.image) {
                if (welcome.dm) {
                  if (welcome.customdm === "no") dm_msg_autoimg(member);
                  else dm_msg_withimg(member);
                }
                if (welcome.custom === "no") msg_autoimg(member);
                else msg_withimg(member);
              } else {
                if (welcome.dm) {
                  dm_msg_withoutimg(member);
                } 
                msg_withoutimg(member)
              }
            }
      
      
            async function msg_withoutimg(member) {
              let { channel } = message;
      
              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable7"]))
                .setDescription(GuildSettings?.welcome?.msg.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                .addField(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variablex_8"]), eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable8"]))
              
                //send the welcome embed to there
                if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                  if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)){
                    channel.send({
                      content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>`,
                      embeds: [welcomeembed]
                    }).catch(() => null);
                  } else {
                    channel.send({
                      content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                    }).catch(() => null);
                  }
                }
              
            }
            async function dm_msg_withoutimg(member) {
              let { channel } = message;
              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable9"]))
                .setDescription(GuildSettings?.welcome?.dm_msg.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                if(GuildSettings?.welcome?.invitedm) welcomeembed.addField("\u200b", `${invitemessage}`)
                //send the welcome embed to there
              channel.send({
                content: `**DIRECT MESSAGE WELCOME:**\n\n<@${member.user.id}>`,
                embeds: [welcomeembed]
              }).catch(() => null);
            }
      
      
            async function dm_msg_withimg(member) {
              let { channel } = message;
              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable10"]))
                .setDescription(GuildSettings?.welcome?.dm_msg.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                .setImage(GuildSettings?.welcome?.customdm)
                if(GuildSettings?.welcome?.invitedm) welcomeembed.addField("\u200b", `${invitemessage}`)
                //send the welcome embed to there
              channel.send({
                content: `**DIRECT MESSAGE WELCOME:**\n\n<@${member.user.id}>`,
                embeds: [welcomeembed]
              }).catch(() => null);
            }
            async function msg_withimg(member) {
              let { channel } = message;
      
              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable11"]))
                .setDescription(GuildSettings?.welcome?.msg.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                .setImage(GuildSettings?.welcome?.custom)
                if(GuildSettings?.welcome?.invite) welcomeembed.addField("\u200b", `${invitemessage}`)
                //send the welcome embed to there
              if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)){
                  channel.send({
                    content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>`,
                    embeds: [welcomeembed]
                  }).catch(() => null);
                } else {
                  channel.send({
                    content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                  }).catch(() => null);
                }
              }
            }
      
            async function dm_msg_autoimg(member) {
              let { channel } = message;
              try {
                //define the welcome embed
                const welcomeembed = new Discord.MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTimestamp()
                  .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                    dynamic: true
                  }))
                  .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable12"]))
                  .setDescription(GuildSettings?.welcome?.dm_msg.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                if(GuildSettings?.welcome?.invitedm) welcomeembed.addField("\u200b", `${invitemessage}`)
              //member roles add on welcome every single role
                const canvas = Canvas.createCanvas(1772, 633);
                //make it "2D"
                const ctx = canvas.getContext(`2d`);
      
                if (GuildSettings?.welcome?.backgrounddm !== "transparent") {
                  try {
                    const bgimg = await Canvas.loadImage(GuildSettings?.welcome?.backgrounddm);
                    ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
                  } catch {}
                } else {
                  try {
                    if (!member.guild.iconURL() || member.guild.iconURL() == null || member.guild.iconURL() == undefined) return;
                    const img = await Canvas.loadImage(member.guild.iconURL({
                      format: "png"
                    }));
                    ctx.globalAlpha = 0.3;
                    //draw the guildicon
                    ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                    ctx.globalAlpha = 1;
                  } catch {}
                }
      
                if (GuildSettings?.welcome?.framedm) {
                  let background;
                  var framecolor = GuildSettings?.welcome?.framecolordm.toUpperCase();
                  if (framecolor == "WHITE") framecolor = "#FFFFF9";
                  if (GuildSettings?.welcome?.discriminatordm && GuildSettings?.welcome?.servernamedm)
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);
      
                  else if (GuildSettings?.welcome?.discriminatordm)
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);
      
                  else if (GuildSettings?.welcome?.servernamedm)
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);
      
                  else
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);
      
                  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                  if (GuildSettings?.welcome?.pbdm) {
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                  }
                }
      
                var fillcolors = GuildSettings?.welcome?.framecolordm.toUpperCase();
                if (fillcolors == "WHITE") framecolor = "#FFFFF9";
                ctx.fillStyle = fillcolors.toLowerCase();
      
                //set the first text string 
                var textString3 = `${member.user.username}`;
                //if the text is too big then smaller the text
                if (textString3.length >= 14) {
                  ctx.font = `100px ${Fonts}`;         
                  await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
                }
                //else dont do it
                else {
                  ctx.font = `150px ${Fonts}`;
                  await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
                }
      
      
      
                ctx.font = `bold 50px ${wideFonts}`;
                //define the Discriminator Tag
                if (GuildSettings?.welcome?.discriminatordm) {
                  await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
                }
                //define the Member count
                if (GuildSettings?.welcome?.membercountdm) {
                  await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
                }
                //get the Guild Name
                if (GuildSettings?.welcome?.servernamedm) {
                  await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
                }
      
                if (GuildSettings?.welcome?.pbdm) {
                  //create a circular "mask"
                  ctx.beginPath();
                  ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
                  ctx.closePath();
                  ctx.clip();
                  //define the user avatar
                  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
                    format: `png`
                  }));
                  //draw the avatar
                  ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
                }
      
                //get it as a discord attachment
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-image.png`);
                //send the welcome embed to there
                channel.send({
                  content: `**DIRECT MESSAGE WELCOME:**\n\n<@${member.user.id}>`,
                  embeds: [welcomeembed.setImage(`attachment://welcome-image.png`) ],
                  files: [attachment]
                }).catch(() => null);
                //member roles add on welcome every single role
              } catch {}
            }
            async function msg_autoimg(member) {
              let { channel } = message;
              try {
                //define the welcome embed
                const welcomeembed = new Discord.MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTimestamp()
                  .setFooter(client.getFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                  
                  .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable13"]))
                  .setDescription(GuildSettings?.welcome?.msg.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                  if(GuildSettings?.welcome?.invite) welcomeembed.addField("\u200b", `${invitemessage}`)
                  try {
                  //member roles add on welcome every single role
                  const canvas = Canvas.createCanvas(1772, 633);
                  //make it "2D"
                  const ctx = canvas.getContext(`2d`);
      
                  if (GuildSettings?.welcome?.background !== "transparent") {
                    try {
                      const bgimg = await Canvas.loadImage(GuildSettings?.welcome?.background);
                      ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
                    } catch {}
                  } else {
                    try {
                      if (!member.guild.iconURL() || member.guild.iconURL() == null || member.guild.iconURL() == undefined) return;
                      const img = await Canvas.loadImage(member.guild.iconURL({
                        format: "png"
                      }));
                      ctx.globalAlpha = 0.3;
                      //draw the guildicon
                      ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                      ctx.globalAlpha = 1;
                    } catch {}
                  }
      
      
                  if (GuildSettings?.welcome?.frame) {
                    let background;
                    var framecolor = GuildSettings?.welcome?.framecolor.toUpperCase();
                    if (framecolor == "WHITE") framecolor = "#FFFFF9";
                    if (GuildSettings?.welcome?.discriminator && GuildSettings?.welcome?.servername)
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);
      
                    else if (GuildSettings?.welcome?.discriminator)
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);
      
                    else if (GuildSettings?.welcome?.servername)
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);
      
                    else
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);
      
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
                    if (GuildSettings?.welcome?.pb) {
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
                      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                    }
                  }
      
                  var fillcolor = GuildSettings?.welcome?.framecolor.toUpperCase();
                  if (fillcolor == "WHITE") framecolor = "#FFFFF9";
                  ctx.fillStyle = fillcolor.toLowerCase();
      
                  //set the first text string 
                  var textString3 = `${member.user.username}`;
                  //if the text is too big then smaller the text
                  if (textString3.length >= 14) {
                    ctx.font = `100px ${Fonts}`;
                    await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
                  }
                  //else dont do it
                  else {
                    ctx.font = `150px ${Fonts}`;
                    await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
                  }
      
                  ctx.font = `bold 50px ${wideFonts}`;
                  //define the Discriminator Tag
                  if (GuildSettings?.welcome?.discriminator) {
                    await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
                  }
                  //define the Member count
                  if (GuildSettings?.welcome?.membercount) {
                    await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
                  }
                  //get the Guild Name
                  if (GuildSettings?.welcome?.servername) {
                    await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
                  }
      
      
                  if (GuildSettings?.welcome?.pb) {
                    //create a circular "mask"
                    ctx.beginPath();
                    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
                    ctx.closePath();
                    ctx.clip();
                    //define the user avatar
                    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
                      format: `png`
                    }));
                    //draw the avatar
                    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
                  }
                  //get it as a discord attachment
                  const attachment = new Discord.MessageAttachment(await canvas.toBuffer(), `welcome-image.png`);
                  //send the welcome embed to there
                  if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                    if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS) && channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.ATTACH_FILES)){
                      channel.send({
                        content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>`,
                        embeds: [welcomeembed.setImage(`attachment://welcome-image.png`)],
                        files: [attachment]
                      }).catch(() => null);
                    } else if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.ATTACH_FILES)){
                      channel.send({
                        content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                        files: [attachment]
                      }).catch(() => null);
                    } else {
                      channel.send({
                        content: `**CHANNEL WELCOME in ${welcome.channel!= "nochannel" ? `<#${welcome.channel}>` : ` \`NO CHANNEL - SETUPPED\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                        files: [attachment]
                      }).catch(() => null);
                    }
                  }
                } catch (e) {
                  console.error(e);
                }
              } catch (e) {
                console.error(e)
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
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
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
