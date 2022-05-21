var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, dbRemove
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-tiktok",
  category: "💪 Setup",
  aliases: ["setuptiktok", "tiktok-setup", "tiktoksetup"],
  cooldown: 5,
  usage: "setup-tiktok  -->  Follow Steps",
  description: "Manage the tiktok logger, addstreamer, editstreamer, removestreamer, etc.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
  
    return message.reply(`**This got disabled, since it's currently not working!**`);
    try {
      var adminroles = GuildSettings.adminroles ? GuildSettings.adminroles : []


      var timeouterror = false;
      var filter = (reaction, user) => {
        return user.id === message.author?.id;
      };
      var temptype = ""
      var tempmsg;
      tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable1"]))
        .setColor(es.color)
        .setDescription(`1️⃣ **== Set** Discord **Channel** for Posting new Vids
        
2️⃣ **== Add** tiktok Channel
        
3️⃣ **== Remove** tiktok Channel

4️⃣ **== Edit** tiktok Channel



*React with the Right Emoji according to the Right action*`).setFooter(client.getFooter(es))
      ]})
      try {
        tempmsg.react("1️⃣")
        tempmsg.react("2️⃣")
        tempmsg.react("3️⃣")
        tempmsg.react("4️⃣")
      } catch (e) {
        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable2"]))
          .setColor(es.wrongcolor)
          .setDescription(`\`\`\` ${e.message ? e.message : e.stack ? String(e.stack).grey.substring(0, 2000) : String(e).grey.substring(0, 2000)}\`\`\``.substring(0, 2000))
          .setFooter(client.getFooter(es))
        ]});
      }
      await tempmsg.awaitReactions({filter, 
          max: 1,
          time: 90000,
          errors: ["time"]
        })
        .then(async collected => {
          var reaction = collected.first()
          reaction.users.remove(message.author?.id)
          if (reaction.emoji?.name === "1️⃣") temptype = "set"
          else if (reaction.emoji?.name === "2️⃣") temptype = "add"
          else if (reaction.emoji?.name === "3️⃣") temptype = "remove"
          else if (reaction.emoji?.name === "4️⃣") temptype = "edit"
          else throw "You reacted with a wrong emoji"
        })
        .catch(e => {
          timeouterror = e;
        })
      if (timeouterror)
        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable3"]))
          .setColor(es.wrongcolor)
          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
          .setFooter(client.getFooter(es))
        ]});
      if (temptype == "set") {

        tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable4"]))
          .setColor(es.color)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable5"]))
          .setFooter(client.getFooter(es))]
        })
        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var msg = collected.first();
            if(msg && msg.mentions.channels.filter(ch=>ch.guild.id==msg.guild.id).first()){
              client.social_log.set(message.guild.id, msg.mentions.channels.filter(ch=>ch.guild.id==msg.guild.id).first().id, "tiktok.dc_channel")
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable6"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable7"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            }
            else{
              throw {
                message: "YOU DID NOT PING A VALID CHANNEL"
              }
            }
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable8"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelled the Operation!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});

      } else if (temptype == "add") {
        if(client.social_log.get(message.guild.id, "tiktok.channels").length >= 3) 
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable9"]))
            .setColor(es.wrongcolor)
            .setDescription(`Remove some others first...`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
        tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable10"]))
          .setColor(es.color)
          .setDescription(`Example:
          
https://www.tiktok.com/@milratodev`)
          .setFooter(client.getFooter(es))]
        })
        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var msg = collected.first();
            if(msg && msg.content ){
              if((msg.content.length > 0 && msg.content.length < 50) &&!msg.content.toLowerCase().includes("tiktok") && !msg.content.toLowerCase().includes("@"))
              throw {
                message: "YOU DID NOT SEND A VALID CHANNEL LINK"
              }
              var Channel = msg.content.split("@")[1]
              if(Channel.includes("video")) Channel = Channel.split("/")[0]
              if(client.social_log.get(message.guild.id, "tiktok.channels").includes(Channel))
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable11"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                ]});
                client.social_log.push(message.guild.id, Channel, "tiktok.channels")

              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable12"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable13"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            }
            else{
              throw {
                message: "YOU DID NOT SEND A VALID CHANNEL"
              }
            }
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable14"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelled the Operation!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
      } else if (temptype == "remove") {
        if(client.social_log.get(message.guild.id, "tiktok.channels").length <= 0) 
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable15"]))
            .setColor(es.wrongcolor)
            .setDescription(`Add some others first...`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
          var buffer = "";
          var emojis = ["0️⃣", "5️⃣"]
          for (let i = 0; i< client.social_log.get(message.guild.id, "tiktok.channels").length; i++){
            buffer += `${emojis[i]} ${client.social_log.get(message.guild.id, "tiktok.channels")[i]}`
          }
          tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable16"]))
            .setColor(es.color)
            .setDescription(buffer+ "\n\n\n*React with the emoji regarding to the Channel you wanna remove*")
            .setFooter(client.getFooter(es))]
          })
          for await (const emoji of emojis){
            tempmsg.react(emoji).catch(e=>console.error(e))
          }
        await tempmsg.awaitReactions({ filter: (reaction, user) => user.id == message.author?.id && emojis.includes(reaction.emoji?.name), 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var channel = client.social_log.get(message.guild.id, "tiktok.channels")[emojis.findIndex(emoji => emoji == collected.first().emoji?.name)]
            
            client.social_log.remove(message.guild.id, channel, "tiktok.channels")

            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable17"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]});
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable18"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelled the Operation!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
      } else if (temptype == "edit") {
        if(client.social_log.get(message.guild.id, "tiktok.channels").length <= 0) 
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable19"]))
            .setColor(es.wrongcolor)
            .setDescription(`Add some others first...`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
          var buffer = "";
          var emojis = ["0️⃣", "5️⃣"]
          for (let i = 0; i< client.social_log.get(message.guild.id, "tiktok.channels").length; i++){
            buffer += `${emojis[i]} ${client.social_log.get(message.guild.id, "tiktok.channels")[i]}`
          }
          tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable20"]))
            .setColor(es.color)
            .setDescription(buffer+ "\n\n\n*React with the emoji regarding to the Channel you wanna edit*")
            .setFooter(client.getFooter(es))]
          })
          for await (const emoji of emojis){
            tempmsg.react(emoji).catch(e=>console.error(e))
          }
        await tempmsg.awaitReactions({ filter: (reaction, user) => user.id == message.author?.id && emojis.includes(reaction.emoji?.name), 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var channel = client.social_log.get(message.guild.id, "tiktok.channels")[emojis.findIndex(emoji => emoji == collected.first().emoji?.name)]
                        
            client.tiktok.ensure(channel, {
              oldvid: "",
              message: "**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}"
            })
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable21"]))
              .setColor(es.color)
              .setDescription(`
**CURRENT MESSAGE:**
> ${client.tiktok.get(channel, "message")}`.substring(0, 2048))
.addField("**VARIABLES**",`
> \`{url}\` ... will be replaced with the video **LINK**
> \`{author}\` ... will be replaced with the video's **Author**
> \`{title}\` ... will be replaced with the video's **title**`)
              .setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(async collected => {
              var msg = collected.first();
              if(msg && msg.content ){
                client.tiktok.set(channel, msg.content, "message")  
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable22"]))
                  .setDescription("New Message:\n" + msg.content)
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              else{
                throw {
                  message: "YOU DID NOT SEND A VALID CHANNEL"
                }
              }
            })
            .catch(e => {
              console.error(e)
              timeouterror = e;
            })
          if (timeouterror)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable23"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substring(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          })
          .catch(e => {
            console.error(e)
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable24"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelled the Operation!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
      }  else {
        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable25"]))
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
        ]});
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable26"]))
      ]});
    }
  },
};

