var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-leave",
  category: "💪 Setup",
  aliases: ["setupleave"],
  cooldown: 5,
  usage: "setup-leave --> and follow the steps",
  description: "Manage the Leave Message System",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var timeouterror;
      var tempmsg;
      var url = "";
      var filter = (reaction, user) => {
        return user.id === cmduser.id;
      };
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Channel Leave Messages",
            description: `Manage Leave Messages in 1 CHANNEL`,
            emoji: "895066899619119105" //
          },
          {
            value: "Direct Leave Messages",
            description: `Manage Leave Messages on DMS`,
            emoji: "😬"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Leave-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Leave-System') 
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
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://discord.gg/milrato')
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
          case "Channel Leave Messages":{
            
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${client.settings.get(message.guild.id, "leave.channel") == "nochannel" ? "Set Channel": "Overwrite Channel"}`,
                  description: `${client.settings.get(message.guild.id, "leave.channel") == "nochannel" ? "Set a Channel where the Leave Messages should be": "Overwrite the current Channel with a new one"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Disable Leave",
                  description: `Disable the Leave Messages`,
                  emoji: "❌"
                },
                {
                  value: "Manage the Image",
                  description: `Manage the Leave Image for the Message`,
                  emoji: "🖼️"
                },
                {
                  value: "Edit the Message",
                  description: `Edit the Leave Message ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${client.settings.get(message.guild.id, "leave.invite") ? "Disable InviteInformation": "Enable Invite Information"}`,
                  description: `${client.settings.get(message.guild.id, "leave.invite") ? "No longer show Information who invited him/her": "Show Information about who invited him/her"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Leave-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Leave-System') 
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://discord.gg/milrato')
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
                case `${client.settings.get(message.guild.id, "leave.channel") == "nochannel" ? "Set Channel": "Overwrite Channel"}`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable8"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if (channel) {
                        client.settings.set(message.guild.id, channel.id, "leave.channel")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable9"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "Not defined yet"}!\nEdit the message with: \`${prefix}setup-leave  --> Pick 1️⃣ --> Pick 4️⃣\``.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } else {
                        return message.reply( "you didn't ping a valid channel")
                      }
                    })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `Disable Leave`:{
                  client.settings.set(reaction.message.guild.id, "nochannel", "leave.channel")
                  return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable13"]))
                    .setColor(es.color)
                    .setDescription(`If Someone joins this Server, no message will be sent into a Channel!\nSet a Channel with: \`${prefix}setup-leave\` --> Pick 1️⃣ --> Pick 1️⃣`.substr(0, 2048))
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
                        value: `${client.settings.get(message.guild.id, "leave.frame") ? "Disable" : "Enable"} Frame`,
                        description: `${client.settings.get(message.guild.id, "leave.frame") ? "I won't show the Frame anymore" : "Let me display a colored Frame for highlighting"}`,
                        emoji: "✏️" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.discriminator") ? "Disable" : "Enable"} User-Tag`,
                        description: `${client.settings.get(message.guild.id, "leave.discriminator") ? "I won't show the User-Tag anymore" : "Let me display a colored User-Tag (#1234)"}`,
                        emoji: "🔢" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.membercount") ? "Disable" : "Enable"} Member Count`,
                        description: `${client.settings.get(message.guild.id, "leave.membercount") ? "I won't show the Member Count anymore" : "Let me display a colored MemberCount of the Server"}`,
                        emoji: "📈" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.servername") ? "Disable" : "Enable"} Server Name`,
                        description: `${client.settings.get(message.guild.id, "leave.servername") ? "I won't show the ServerName anymore" : "Let me display a colored ServerName"}`,
                        emoji: "🗒" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.pb") ? "Disable" : "Enable"} User-Avatar`,
                        description: `${client.settings.get(message.guild.id, "leave.pb") ? "I won't show the User-Avatar anymore" : "Let me display the User-Avatar"}`,
                        emoji: "💯" 
                      },
                      {
                        value: "Frame Color",
                        description: `Change the Frame Color`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancel and stop the Leave-Setup!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection') 
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Click me to setup the Leave-System') 
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
                    let MenuEmbed = new MessageEmbed()
                      .setColor(es.color)
                      .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://discord.gg/milrato')
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
                        client.settings.set(message.guild.id, false, "leave.image")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable18"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with__out__ an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Enable auto Image`:{
                        client.settings.set(message.guild.id, true, "leave.image")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable21"]))
                          .setColor(es.color)
                          .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Set Image Background`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable24"]))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable25"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, "no", "leave.custom")
                                client.settings.set(message.guild.id, url, "leave.background")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable26"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable27"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, "no", "leave.custom")
                                client.settings.set(message.guild.id, url, "leave.background")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable28"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable29"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable30"]))
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
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `Del Image Background`:{
                        client.settings.set(message.guild.id, true, "leave.image")
                        client.settings.get(message.guild.id, "transparent", "leave.background")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable32"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Custom Image`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable35"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, url, "leave.custom")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable36"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable37"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, url, "leave.custom")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable38"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable39"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable40"]))
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
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.frame") ? "Disable" : "Enable"} Frame`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.frame"), "leave.frame")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable42"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.discriminator") ? "Disable" : "Enable"} User-Tag`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.discriminator"), "leave.discriminator")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable45"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.membercount") ? "Disable" : "Enable"} Member Count`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.membercount"), "leave.membercount")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable48"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.servername") ? "Disable" : "Enable"} Server Name`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.servername"), "leave.servername")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable51"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.pb") ? "Disable" : "Enable"} User-Avatar`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.pb"), "leave.pb")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable54"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
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
                          filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          message.reply({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `<a:yes:833101995723194437> **Selected the \`${collected.first().customId}\` Color**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            client.settings.set(message.guild.id, color, "leave.framecolor")
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable59"]))
                              .setColor(color)
                              .setDescription(`If Someone leaves this Server, a message **with an automated image** will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL DEFINED YET"}`.substr(0, 2048))
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
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable64"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable65"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                        client.settings.set(message.guild.id, message.content, "leave.msg")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable66"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, this message will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO CHANNEL YET"}!\n\n${message.content.replace("{user}", message.author)}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                    })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `${client.settings.get(message.guild.id, "leave.invite") ? "Disable InviteInformation": "Enable Invite Information"}`:{
                  client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.invite"), "leave.invite")
                  return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable70"]))
                    .setColor(es.color)
                    .setDescription(`If Someone joins this Server, a message with Invite Information will be sent into ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "Not defined yet"}!\nEdit the message with: \`${prefix}setup-leave  --> Pick 1️⃣ --> Pick 4️⃣\``.substr(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
              }
            }
          }break;       
          case "Direct Leave Messages":{
          
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${!client.settings.get(message.guild.id, "leave.dm") ? "Enable Dm Messages": "Disable Dm Messages"}`,
                  description: `${!client.settings.get(message.guild.id, "leave.dm") ? "Send Dm Messages if the user leaves": "Don't send any dms when he leaves"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Manage the Image",
                  description: `Manage the Leave Image for the Message`,
                  emoji: "🖼️"
                },
                {
                  value: "Edit the Message",
                  description: `Edit the Leave Message ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${client.settings.get(message.guild.id, "leave.invitedm") ? "Disable InviteInformation": "Enable Invite Information"}`,
                  description: `${client.settings.get(message.guild.id, "leave.invitedm") ? "No longer show Information who invited him/her": "Show Information about who invited him/her"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancel and stop the Leave-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to setup the Leave-System') 
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://discord.gg/milrato')
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
                case `${!client.settings.get(message.guild.id, "leave.dm") ? "Enable Dm Messages": "Disable Dm Messages"}`:{
                  if(client.settings.get(message.guild.id, "leave.dm")){
                    client.settings.set(message.guild.id, false, "leave.dm")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable79"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else {
                    client.settings.set(message.guild.id, true, "leave.dm")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable76"]))
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
                        value: `${client.settings.get(message.guild.id, "leave.framedm") ? "Disable" : "Enable"} Frame`,
                        description: `${client.settings.get(message.guild.id, "leave.framedm") ? "I won't show the Frame anymore" : "Let me display a colored Frame for highlighting"}`,
                        emoji: "✏️" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.discriminatordm") ? "Disable" : "Enable"} User-Tag`,
                        description: `${client.settings.get(message.guild.id, "leave.discriminatordm") ? "I won't show the User-Tag anymore" : "Let me display a colored User-Tag (#1234)"}`,
                        emoji: "🔢" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.membercountdm") ? "Disable" : "Enable"} Member Count`,
                        description: `${client.settings.get(message.guild.id, "leave.membercountdm") ? "I won't show the Member Count anymore" : "Let me display a colored MemberCount of the Server"}`,
                        emoji: "📈" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.servernamedm") ? "Disable" : "Enable"} Server Name`,
                        description: `${client.settings.get(message.guild.id, "leave.servernamedm") ? "I won't show the ServerName anymore" : "Let me display a colored ServerName"}`,
                        emoji: "🗒" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.pbdm") ? "Disable" : "Enable"} User-Avatar`,
                        description: `${client.settings.get(message.guild.id, "leave.pbdm") ? "I won't show the User-Avatar anymore" : "Let me display the User-Avatar"}`,
                        emoji: "💯" 
                      },
                      {
                        value: "Frame Color",
                        description: `Change the Frame Color`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancel and stop the Leave-Setup!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection') 
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Click me to setup the Leave-System') 
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
                    let MenuEmbed = new MessageEmbed()
                      .setColor(es.color)
                      .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://discord.gg/milrato')
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
                        client.settings.set(message.guild.id, false, "leave.imagedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable18"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with__out__ an image** will be sent into There Dms`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Enable auto Image`:{
                        client.settings.set(message.guild.id, true, "leave.imagedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable21"]))
                          .setColor(es.color)
                          .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into DMS`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Set Image Background`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable24"]))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable25"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, "no", "leave.customdm")
                                client.settings.set(message.guild.id, url, "leave.backgrounddm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable26"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into DMS`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable27"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, "no", "leave.customdm")
                                client.settings.set(message.guild.id, url, "leave.backgrounddm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable28"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into DMS`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable29"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable30"]))
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
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `Del Image Background`:{
                        client.settings.set(message.guild.id, true, "leave.imagedm")
                        client.settings.get(message.guild.id, "transparent", "leave.backgrounddm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable32"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an image** will be sent into DMS`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Custom Image`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable35"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, url, "leave.customdm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable36"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into DMS`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable37"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, url, "leave.customdm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable38"]))
                                  .setColor(es.color)
                                  .setDescription(`I will be using ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "an Auto generated Image with User Data": "Your defined, custom Image" }\n\nIf Someone joins this Server, a message **with an image** will be sent into DMS`.substr(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable39"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable40"]))
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
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.framedm") ? "Disable" : "Enable"} Frame`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.framedm"), "leave.framedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable42"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into DMS`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.discriminatordm") ? "Disable" : "Enable"} User-Tag`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.discriminatordm"), "leave.discriminatordm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable45"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into DMS`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.membercountdm") ? "Disable" : "Enable"} Member Count`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.membercountdm"), "leave.membercountdm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable48"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into DMS`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.servernamedm") ? "Disable" : "Enable"} Server Name`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.servernamedm"), "leave.servernamedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable51"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into DMS`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.pbdm") ? "Disable" : "Enable"} User-Avatar`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.pbdm"), "leave.pbdm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable54"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, a message **with an automated image** will be sent into DMS`.substr(0, 2048))
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
                          filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          message.reply({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `<a:yes:833101995723194437> **Selected the \`${collected.first().customId}\` Color**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            client.settings.set(message.guild.id, color, "leave.framecolordm")
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable59"]))
                              .setColor(color)
                              .setDescription(`If Someone leaves this Server, a message **with an automated image** will be sent into DMS`.substr(0, 2048))
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
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable64"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable65"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                        client.settings.set(message.guild.id, message.content, "leave.msgdm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable66"]))
                          .setColor(es.color)
                          .setDescription(`If Someone joins this Server, this message will be sent into DMS!\n\n${message.content.replace("{user}", message.author)}`.substr(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                    })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `${client.settings.get(message.guild.id, "leave.invitedm") ? "Disable InviteInformation": "Enable Invite Information"}`:{
                  client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.invitedm"), "leave.invitedm")
                  return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable70"]))
                    .setColor(es.color)
                    .setDescription(`If Someone joins this Server, a message with Invite Information will be sent into DMS!\nEdit the message with: \`${prefix}setup-leave  --> Pick 1️⃣ --> Pick 4️⃣\``.substr(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
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
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
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
