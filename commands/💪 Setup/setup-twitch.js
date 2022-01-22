var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-twitch",
  category: "💪 Setup",
  aliases: ["setuptwitch", "twitch-setup", "twitchsetup"],
  cooldown: 5,
  usage: "setup-twitch  -->  Follow Steps",
  description: "Manage the Twitch logger, temp role, ping role, adduser, removeuser, etc.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    let TextEmojis = getNumberEmojis();
    let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Remove Channel",
            description: `Remove one of the added Twitch Channels`,
            emoji: "840260133753061408"
          },
          {
            value: "New Channel",
            description: `Add a New Twitch Channel`,
            emoji: "👍"
          },
          {
            value: "Discord Channel",
            description: `Set a Discord Channel for Posting Messages`,
            emoji: "895066899619119105"
          },
          {
            value: "Active Live Role",
            description: `Set a Role to add for current live Streamers`,
            emoji: "895066900105674822"
          },
          {
            value: "Ghost Ping Role",
            description: `Set a Ghost Ping Role.`,
            emoji: "👻"
          },
          {
            value: "View Twitch-Channels",
            description: `View / Show all setupped Twitch Channels`,
            emoji: "📃"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Twitch-Logger-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Twitch-Logger') 
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
          .setAuthor('Twitch-Logger', 'https://cdn.discordapp.com/emojis/720391959746969710.gif?size=160', 'https://discord.gg/milrato')
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
          case "View Twitch-Channels": {
            if(client.social_log.get(message.guild.id, "twitch.channels").length <= 0) 
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`There are no Twitch Channels Setupped yet!`)
                .setColor(es.wrongcolor)
                .setDescription(`Add some others first...`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            let channels = client.social_log.get(message.guild.id, "twitch.channels");
            let menuoptions = channels.map((data, index) => {
              let Obj = {}
              Obj.emoji = NumberEmojiIds[index + 1];
              Obj.value = `${data.ChannelName}`.substr(0, 25)
              Obj.description = `https://twitch.tv/${data.ChannelName}`.substr(0, 50);
              return Obj;
            })
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`All [${channels.length}] Twitch-Channels`)
              .setColor(es.wrongcolor)
              .setDescription(`${channels.map((data, index) => `> ${TextEmojis[index + 1]} [${data.ChannelName}](https://twitch.tv/${data.ChannelName})`).join("\n\n")}`.substr(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          } break;
          case "Remove Channel":
          {
            if(client.social_log.get(message.guild.id, "twitch.channels").length <= 0) 
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`There are no Twitch Channels Setupped yet!`)
              .setColor(es.wrongcolor)
              .setDescription(`Add some others first...`.substr(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          let channels = client.social_log.get(message.guild.id, "twitch.channels");
          let menuoptions = channels.map((data, index) => {
            let Obj = {}
            Obj.emoji = NumberEmojiIds[index + 1];
            Obj.value = `${data.ChannelName}`.substr(0, 25)
            Obj.description = `https://twitch.tv/${data.ChannelName}`.substr(0, 50);
            return Obj;
          })
          //define the selection
          let Selection = new MessageSelectMenu()
            .setCustomId('MenuSelection') 
            .setMaxValues(menuoptions.length) //OPTIONAL, this is how many values you can have at each selection
            .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
            .setPlaceholder('Click me to remove Account(s)') 
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
            .setAuthor('Twitch-Poster', 'https://cdn.discordapp.com/emojis/720391959746969710.gif?size=160', 'https://discord.gg/milrato')
            .setDescription("Select all Twitch Channels you want to remove!")
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
              for(const value of menu?.values) {
                let menuoptiondataIndex = menuoptions.findIndex(v=> v.value == value)
                client.social_log.remove(message.guild.id, d=> d.ChannelName == channels[menuoptiondataIndex].ChannelName, "twitch.channels")
              }
              menu?.reply(`✅ **Successfully removed ${menu?.values.length} Twitch Accounts!**`)
            }
            else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
          });
          //Once the Collections ended edit the menu message
          collector.on('end', collected => {
            menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
          });
          } break;
          case "New Channel":
          {
            if(client.social_log.get(message.guild.id, "twitch.channels").length > 10) return message.reply(":x: **You can't have more then 10 Twitch Channels**");
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable6"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var msg = collected.first().content;
                if(msg && msg.toLowerCase().includes("https")){
                  
                  var channelname = msg.split("/")
                  channelname = channelname[channelname.length - 1]
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable8"]))
                    .setFooter(client.getFooter(es))
                  ]})
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(async collected => {
                      var msg = collected.first().mentions.users.first();
                      if(msg){
                        var discorduser = msg.id;
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable9"]))
                          .setColor(es.color)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable10"]))
                          .setFooter(client.getFooter(es))
                        ]})
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 90000,
                            errors: ["time"]
                          })
                          .then(async collected => {
                            var msg = collected.first().content;
                            if(msg){
                              var themsg = msg;
                              client.social_log.push(message.guild.id,
                                {
                                  ChannelName: channelname,
                                  DISCORD_USER_ID: discorduser,
                                  twitch_stream_id: "",
                                  message: themsg
                                }, "twitch.channels")
                              
                              return message.reply({embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable11"]))
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable12"]))
                                .setColor(es.color)
                                .setFooter(client.getFooter(es))
                              ]});
                            }
                            else{
                              return message.reply("YOU DID NOT SEND A VALID MESSAGE")
                            }
                          })
                          .catch(e => {
                            console.log(e)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable15"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      }
                      else{
                        return message.reply("YOU DID PING A VALID MEMBER")
                      }
                    })
                    .catch(e => {
                      console.log(e)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable15"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]});
                    })
                }
                else{
                  return message.reply("YOU DID NOT SEND A VALID LINK")
                }
              })
              .catch(e => {
                console.log(e)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable15"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          } break;
          case "Discord Channel":
          {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable17"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable18"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message.content.toLowerCase() == "no") {
                client.social_log.set(message.guild.id, "", "twitch.channelId")
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable19"]))
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
              if (channel) {
                try {
                  client.social_log.set(message.guild.id, channel.id, "twitch.channelId")
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable20"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]});
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable22"]))
                    .setFooter(client.getFooter(es))
                  ]});
                }
              } else {
                throw "you didn't ping a valid Channel"
              }
            })
            .catch(e => {
              console.log(e)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable23"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            })
          } break;
          case "Active Live Role":
          {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable24"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable25"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                if (message.content.toLowerCase() == "no") {
                  client.social_log.set(message.guild.id, "", "twitch.roleID_GIVE")
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable26"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]});
                }
                var channel = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                if (channel) {
                  try {
                    client.social_log.set(message.guild.id, channel.id, "twitch.roleID_GIVE")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable27"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable28"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable29"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  throw "you didn't ping a valid Channel"
                }
              })
              .catch(e => {
                console.log(e)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable30"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          } break;
          case "Ghost Ping Role":
          {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable31"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable32"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message.content.toLowerCase() == "no") {
                client.social_log.set(message.guild.id, "", "twitch.roleID_PING")
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable33"]))
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              var channel = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
              if (channel) {
                try {
                  client.social_log.set(message.guild.id, channel.id, "twitch.roleID_PING")
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable34"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]});
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable35"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable36"]))
                    .setFooter(client.getFooter(es))
                  ]});
                }
              } else {
                throw "you didn't ping a valid Channel"
              }
            })
            .catch(e => {
              console.log(e)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable37"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            })
          } break;
          
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitch"]["variable39"]))
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

 function getNumberEmojis() {
  return [
    "<:Number_0:843943149915078696>",
    "<:Number_1:843943149902626846>",
    "<:Number_2:843943149868023808>",
    "<:Number_3:843943149914554388>",
    "<:Number_4:843943149919535154>",
    "<:Number_5:843943149759889439>",
    "<:Number_6:843943150468857876>",
    "<:Number_7:843943150179713024>",
    "<:Number_8:843943150360068137>",
    "<:Number_9:843943150443036672>",
    "<:Number_10:843943150594031626>",
    "<:Number_11:893173642022748230>",
    "<:Number_12:893173642165383218>",
    "<:Number_13:893173642274410496>",
    "<:Number_14:893173642198921296>",
    "<:Number_15:893173642182139914>",
    "<:Number_16:893173642530271342>",
    "<:Number_17:893173642538647612>",
    "<:Number_18:893173642307977258>",
    "<:Number_19:893173642588991488>",
    "<:Number_20:893173642307977266>",
    "<:Number_21:893173642274430977>",
    "<:Number_22:893173642702250045>",
    "<:Number_23:893173642454773782>",
    "<:Number_24:893173642744201226>",
    "<:Number_25:893173642727424020>"
  ]
}