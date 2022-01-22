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
  name: "setup-youtube",
  category: "💪 Setup",
  aliases: ["setupyoutube", "youtube-setup", "youtubesetup"],
  cooldown: 5,
  usage: "setup-youtube  -->  Follow Steps",
  description: "Manage the youtube logger, addstreamer, editstreamer, removestreamer, etc.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      
      let TextEmojis = getNumberEmojis();
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Set Discord Channel",
            description: `Define Poster Channel, where Uploads will be`,
            emoji: "895066899619119105"
          },
          {
            value: "Add Youtube Channel",
            description: `Add up to 5 Youtube Accounts`,
            emoji: "✅"
          },
          {
            value: "Remove Youtube Channel",
            description: `Remove one of the added Youtube Accounts`,
            emoji: "❌"
          },
          {
            value: "Edit Youtube Channel",
            description: `Edit one of the added Youtube Accounts`,
            emoji: "877653386747605032"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Ai-Chat`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ai-Chat-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Youtube System') 
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
          .setAuthor('Youtube-Poster', 'https://cdn.discordapp.com/emojis/840260133686870036.png?size=128', 'https://discord.gg/milrato')
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
          case "Set Discord Channel":{

            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable4"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable5"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var msg = collected.first();
                if(msg && msg.mentions.channels.filter(ch=>ch.guild.id==msg.guild.id).first()){
                  client.social_log.set(message.guild.id, msg.mentions.channels.filter(ch=>ch.guild.id==msg.guild.id).first().id, "youtube.dc_channel")
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable6"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable7"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]});
                }
                else{
                  return message.reply("YOU DID NOT PING A VALID CHANNEL")
                }
              })
              .catch(e => {
                console.log(e)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          } break;
          case "Add Youtube Channel":{
            if(client.social_log.get(message.guild.id, "youtube.channels").length >= 5) 
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable9"]))
              .setColor(es.wrongcolor)
              .setDescription(`Remove some others first...`.substr(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable10"]))
            .setColor(es.color)
            .setDescription(`Example:\nhttps://www.youtube.com/channel/UC1AgotpFHNhzolUtAjPgZqQ`)
            .setFooter(client.getFooter(es))]
          })
          await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(async collected => {
              var msg = collected.first();
              if(msg && msg.content ){
                if((msg.content.length > 0 && msg.content.length < 50) &&!msg.content.toLowerCase().includes("youtube") && (!msg.content.toLowerCase().includes("channel") || !msg.content.toLowerCase().includes("c")))
                  return message.reply("YOU DID NOT SEND A VALID YOUTUBE CHANNEL\nNote, such links doesn't work: `https://youtube.com/Tomato6966` / `https://youtube.com/c/Tomato6966`\nIt must be something like this: `https://www.youtube.com/channel/UC1AgotpFHNhzolUtAjPgZqQ`")
                if(client.social_log.get(message.guild.id, "youtube.channels").includes(msg.content))
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                client.social_log.push(message.guild.id, msg.content, "youtube.channels")
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable12"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable13"]))
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              else {
                return message.reply("YOU DID NOT SEND A VALID CHANNEL")
              }
            })
            .catch(e => {
              console.log(e)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable14"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            })
          } break;
          case "Remove Youtube Channel":{
            if(client.social_log.get(message.guild.id, "youtube.channels").length <= 0) 
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable15"]))
                .setColor(es.wrongcolor)
                .setDescription(`Add some others first...`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            let channels = client.social_log.get(message.guild.id, "youtube.channels");
            let menuoptions = channels.map((data, index) => {
              let Obj = {}
              Obj.emoji = NumberEmojiIds[index + 1];
              Obj.value = `${data.split("/")[data.split("/").length - 1]}`.substr(0, 25)
              Obj.description = `${data.replace("https://", "").replace("http://", "").replace("www.", "")}`.substr(0, 50);
              return Obj;
            })
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(menuoptions.length) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Click me to remove an Account') 
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
              .setAuthor('Youtube-Poster', 'https://cdn.discordapp.com/emojis/840260133686870036.png?size=128', 'https://discord.gg/milrato')
              .setDescription("Select all Youtube Channels you want to remove!")
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
                  let menuoptiondataIndex = menuoptions.findIndex(v=>v.value == value)
                  client.social_log.remove(message.guild.id, channels[menuoptiondataIndex], "youtube.channels")
                }
                menu?.reply(`✅ **Successfully removed ${menu?.values.length} Youtube Accounts!**`)
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
            });
          } break;
          case "Edit Youtube Channel":{
            if(client.social_log.get(message.guild.id, "youtube.channels").length <= 0) 
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable19"]))
                .setColor(es.wrongcolor)
                .setDescription(`Add some others first...`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            let channels = client.social_log.get(message.guild.id, "youtube.channels");
            let menuoptions = channels.map((data, index) => {
              let Obj = {}
              Obj.emoji = NumberEmojiIds[index + 1];
              Obj.value = `${data.split("/")[data.split("/").length - 1]}`.substr(0, 25)
              Obj.description = `${data.replace("https://", "").replace("http://", "").replace("www.", "")}`.substr(0, 50);
              return Obj;
            })
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Click me to remove an Account') 
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
              .setAuthor('Youtube-Poster', 'https://cdn.discordapp.com/emojis/840260133686870036.png?size=128', 'https://discord.gg/milrato')
              .setDescription("Select the Youtube Channel you want to edit!")
            //send the menu msg
            let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({ 
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              time: 90000
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                let menuoptiondataIndex = menuoptions.findIndex(v=>v.value == menu?.values[0])
                if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                let channel = channels[menuoptiondataIndex];
                        
                client.youtube_log.ensure(channel, {
                  oldvid: "",
                  message: "**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}"
                })
                tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable21"]))
                  .setColor(es.color)
                  .setDescription(`**CURRENT MESSAGE:**\n> ${client.youtube_log.get(channel, "message")}`.substr(0, 2048))
                  .addField("**VARIABLES**",`> \`{url}\` ... will be replaced with the video **LINK**\n> \`{author}\` ... will be replaced with the video's **Author**\n> \`{title}\` ... will be replaced with the video's **title**\n> \`{date}\` ... will be replaced with the video's **date**`)
                  .setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var msg = collected.first();
                  if(msg && msg.content ){
                    client.youtube_log.set(channel, msg.content, "message")  
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable22"]))
                      .setDescription("New Message:\n" + msg.content)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                  ]} );
                  }
                  else{
                    throw {
                      message: "YOU DID NOT SEND A VALID CHANNEL"
                    }
                  }
                })
                .catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable23"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
            });
          } break;
          case "Show Settings":{
            let channels = client.social_log.get(message.guild.id, "youtube.channels");
            message.reply({embeds: [
              new Discord.MessageEmbed()
                .setTitle(`Settings of the Youtube Poster`)
                .setColor(es.wrongcolor)
                .setDescription(`**Discord Poster Channel:** <#${client.social_log.get(message.guild.id, "youtube.dc_channel")}>\n**[${channels.length}] Channels:**${channels.length == 0 ? "\n> \`NONE\`" : channels.map(d => `\n> [${d.split("/")[d.split("/").length - 1]}](${d})`).join("\n")}`.substr(0, 2000))
                .setFooter(client.getFooter(es))
            ]})
          } break;
        }
      }



    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-youtube"]["variable26"]))
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