const {
  MessageEmbed, DiscordAPIError, Message, Permissions
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: "poll",
  category: "🚫 Administration",
  aliases: ["abstimmung", "umfrage", "poll"],
  cooldown: 2,
  usage: "poll --> Follow Steps / poll <TEXT> ... to create it instantly",
  description: "Creates a Poll",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.poll || [];
      var cmdrole = []
        if(cmdroles.length > 0){
          for await (const r of cmdroles){
            if(message.guild.roles.cache.get(r)){
              cmdrole.push(` | <@&${r}>`)
            }
            else if(message.guild.members.cache.get(r)){
              cmdrole.push(` | <@${r}>`)
            }
            else {
              const File = `poll`;
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
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable2"]))
        ]});
      if (!args[0])
      {
        message.reply({embeds:  [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable4"]))
        ]}).then(msg=>{
          msg.channel.awaitMessages({filter: m=>m.author.id === cmduser.id, max: 1, time: 30000, errors: ["time"]}).then(async collected => {
            let channel = collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first();
              if(!channel) return message.reply({embeds :[new MessageEmbed().setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable5"]))]})

              message.channel.send({embeds :[new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable6"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable7"]))
              ]}).then(msg=>{
                  msg.react("1️⃣")
                  msg.react("2️⃣")
                  msg.react("3️⃣")
                  msg.awaitReactions({filter: (reaction, user) => user.id === message.author?.id,max: 1, time: 30000, errors: ["time"]}).then(async collected => {
                    let reaction = collected.first();
                    if(reaction.emoji?.name == "1️⃣"){
                      message.reply({embeds :[new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable8"]))
                      .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable9"]))
                      ]}).then(msg=>{
                        msg.channel.awaitMessages({filter: m=>m.author.id === cmduser.id, max: 1, time: 30000, errors: ["time"]}).then(async collected => {
                          channel.send({embeds :[new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setAuthor(`${message.guild.name} | POLL`, "https://images-ext-2.discordapp.net/external/QlX0Eh3_sIiPWIz9Xg_dgN4cwpvne8_ipgDGS43jDGc/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/clipboard_1f4cb.png", "https://discord.gg/fA8VGa4V")
                            .setFooter(client.getFooter(`by: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true})))
                            .setDescription(collected.first().content)
                          ]}).then(msg=>{
                            msg.react("✅")
                            msg.react("❌")
                          })
                        })
                      })
                    }
                    else if(reaction.emoji?.name == "2️⃣"){
                      message.reply({embeds :[new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable10"]))
                      .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable11"]))
                      ]}).then(msg=>{
                        msg.channel.awaitMessages({filter: m=>m.author.id === cmduser.id, max: 1, time: 30000, errors: ["time"]}).then(async collected => {
                          channel.send({embeds : [new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setAuthor(`${message.guild.name} | POLL`, "https://images-ext-2.discordapp.net/external/QlX0Eh3_sIiPWIz9Xg_dgN4cwpvne8_ipgDGS43jDGc/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/clipboard_1f4cb.png", "https://discord.gg/fA8VGa4V")
                            .setFooter(client.getFooter(`by: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true})))
                            .setDescription(collected.first().content)
                          ]}).then(msg=>{
                            msg.react("👍")
                            msg.react("👎")
                          })
                        })
                      })
                    }
                    else if(reaction.emoji?.name == "3️⃣"){
                      var emojicounter = 0;
                      var emojicontent = [];
                      const emojis = [
                        "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟",
                      ]
                      ask_emoji();
                      function ask_emoji(){
                        if(emojicounter == 11) send_poll();
                        message.reply({embeds :[new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable12"]))
                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable13"]))
                        ]}).then(msg=>{ 
                          msg.channel.awaitMessages({filter: m=>m.author.id === cmduser.id, max: 1, time: 30000, errors: ["time"]}).then(async collected => {
                            if(String(collected.first().content).toLowerCase() == "finish") send_poll();
                            else{
                              emojicounter++;
                              emojicontent.push(String(collected.first().content).substring(0, 1024))
                              ask_emoji();
                            }
                          })
                        }).catch(e=>{
                          send_poll();
                        })
                      }
                      function send_poll(){
                        message.reply({embeds :[new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable14"]))
                      .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable15"]))]}).then(msg=>{
                        msg.channel.awaitMessages({filter: m=>m.author.id === cmduser.id, max: 1, time: 30000, errors: ["time"]}).then(async collected => {
                          const embed = new MessageEmbed()
                          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                          .setAuthor(`${message.guild.name} | POLL`, "https://images-ext-2.discordapp.net/external/QlX0Eh3_sIiPWIz9Xg_dgN4cwpvne8_ipgDGS43jDGc/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/clipboard_1f4cb.png", "https://discord.gg/fA8VGa4V")
                          .setFooter(client.getFooter(`by: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true})))
                          if(collected.first().content.toLowerCase() != "no") embed.setDescription(collected.first().content)
                          
                          for (let i = 0; i< emojicontent.length; i++){
                            embed.addField(emojis[i] +" :", emojicontent[i])
                          }
                          channel.send({embeds: [embed]}).then(msg=>{
                            for (let i = 0; i < emojicounter; i++){
                              msg.react(emojis[i])
                            }
                          })
                        })
                      }).catch(e=>{
                        const embed = new MessageEmbed()
                          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                          .setAuthor(`${message.guild.name} | POLL`, "https://images-ext-2.discordapp.net/external/QlX0Eh3_sIiPWIz9Xg_dgN4cwpvne8_ipgDGS43jDGc/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/clipboard_1f4cb.png", "https://discord.gg/fA8VGa4V")
                          .setFooter(client.getFooter(`by: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true})))
                          for (let i = 0; i< emojicontent.length; i++){
                            embed.addField(emojis[i] +" :", emojicontent[i])
                          }
                          channel.send({embeds: [embed]}).then(msg=>{
                            for (let i = 0; i < emojicounter; i++){
                              msg.react(emojis[i])
                            }
                          })
                      })
                      }
                    }
                    else {
                      return message.reply({embeds : [new MessageEmbed().setColor(es.wrongcolor)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable16"]))]})
                    }
                      
                    })
                })
            })
        })
      }
      else{
        message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
        message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setAuthor(`${message.guild.name} | POLL`, "https://images-ext-2.discordapp.net/external/QlX0Eh3_sIiPWIz9Xg_dgN4cwpvne8_ipgDGS43jDGc/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/clipboard_1f4cb.png", "https://discord.gg/fA8VGa4V")
          .setFooter(client.getFooter(`by: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true})))
          .setDescription(args.join(" "))
        ]}).then(msg=>{
          msg.react("👍")
          msg.react("👎")
        })
      }
      
      
      if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
        try{
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds :[new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable17"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.error(e)
        }
      } 
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["poll"]["variable20"]))
      ]});
    }
  }
}

