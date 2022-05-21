var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-embed",
  category: "💪 Setup",
  aliases: ["setupembed", "embed-setup", "embedsetup"],
  cooldown: 5,
  usage: "setup-embed  -->  Follow Steps",
  description: "Change the Look of your Embeds (Color, Image, Thumbnail, ...)",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, Tes, Tls, GuildSettings) => {
    let es = Tes;
    let ls = Tls;
        
    try {
        var timeouterror = false;
        let row = new MessageActionRow()
        .addComponents(
          new MessageButton().setStyle("SECONDARY").setCustomId("1").setEmoji("1️⃣"),
          new MessageButton().setStyle("SECONDARY").setCustomId("2").setEmoji("2️⃣"),
          new MessageButton().setStyle("SECONDARY").setCustomId("3").setEmoji("3️⃣"),
          new MessageButton().setStyle("SECONDARY").setCustomId("4").setEmoji("4️⃣"),
        )
        var tempmsg = await message.reply({components: [row], embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable1"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable2"])).setFooter(client.getFooter(es))
        ]})
        //Create the collector
        const collector = tempmsg.createMessageComponentCollector({ 
          filter: i => i?.isButton() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async button => {
          if (button?.user.id === cmduser.id) {
            collector.stop();
            button?.deferUpdate();
            if (button?.customId == "1") {
              let discordsupportedcolors = [
                'DEFAULT',            'WHITE',
                'AQUA',               'GREEN',
                'BLUE',               'YELLOW',
                'PURPLE',             'LUMINOUS_VIVID_PINK',
                'FUCHSIA',            'GOLD',
                'ORANGE',             'RED',
                'GREY',               'NAVY',
                'DARK_AQUA',          'DARK_GREEN',
                'DARK_BLUE',          'DARK_PURPLE',
                'DARK_VIVID_PINK',    'DARK_GOLD',
                'DARK_ORANGE',        'DARK_RED',
                'DARK_GREY',          'DARKER_GREY',
                'LIGHT_GREY',         'DARK_NAVY',
                'BLURPLE',            'GREYPLE',
                'DARK_BUT_NOT_BLACK', 'NOT_QUITE_BLACK',
                'RANDOM'
              ]
              
              tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable5"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .addField(`**Supported Colors:**`, `>>> **HTML/Hex-Colors** (\`#ffff00\`)\n\nColor-Names/Discord-Colors (\`FUCHSIA\`)\n\nHex-Notation Colors (\`0xffffff\`)`)
                .addField(`**Discord Supported Colors:**`, `>>> ${discordsupportedcolors.map(c => `\`${c}\``).join("︲")}`)
                .addField(`**Current Color:**`, `>>> \`${es.color}\``)
                .setFooter(client.getFooter(es))]
              })
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var color = collected.first().content;
                  if (!color) return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable7"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable8"]))
                    .setFooter(client.getFooter(es))
                  ]});
                  try {
                    const { Util: { resolveColor } } = require("discord.js");
                    try {
                      color = color.toUpperCase(); //convert it to uppercase, (cleaner)
                      let newcolor = false;
                      newcolor = resolveColor(color);
                      if(!newcolor) throw { message: "Invalid Color Added, make sure to stick to the Example-Rules" };
                    }catch (e){
                      return message.reply({embeds: [new MessageEmbed().setColor("RED").setTitle(":x: INVALID COLOR ADDED").setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)]})
                    }
                    await client.settings.set(message.guild.id+".embed.color", color)
                    es = await client.settings.get(message.guild.id+".embed")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable11"]))
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable13"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                })
                .catch(e => {
                  timeouterror = e;
                })
              if (timeouterror)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable14"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
      
            } else if (button?.customId == "2") {
              tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable15"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable16"]))
                .setFooter(client.getFooter(es))]
              })
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var url = collected.first().content;
                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;
                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                    }

                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      try {
                        await client.settings.set(message.guild.id+".embed.footericon", url)
                        es = await client.settings.get(message.guild.id+".embed")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable17"]))
                          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                          .setFooter(client.getFooter(es))
                        ]});
                      } catch (e) {
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable18"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable19"]))
                          .setFooter(client.getFooter(es))
                        ]});
                      }
                    } else {
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable20"]))
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                      ]});
                    }
                    } else if (!url.includes("http") || !(url.toLowerCase().includes("png")||url.toLowerCase().includes("gif")||url.toLowerCase().includes("jpg"))){
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable21"]))
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                      ]});
                    } else {
                      try {
                        await client.settings.set(message.guild.id+".embed.footericon", url)
                        es = await client.settings.get(message.guild.id+".embed")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable22"]))
                          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                          .setFooter(client.getFooter(es))
                        ]});
                      } catch (e) {
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable23"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable24"]))
                          .setFooter(client.getFooter(es))
                        ]});
                      }
                    }
                })
                .catch(e => {
                  timeouterror = e;
                })
              if (timeouterror)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable25"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
            } else if (button?.customId == "3") {
              tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable26"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable27"]))
                .setFooter(client.getFooter(es))]
              })
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var text = collected.first().content;
                  try {
                    await client.settings.set(message.guild.id+".embed.footertext", text)
                    es = await client.settings.get(message.guild.id+".embed")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`:white_check_mark: The new Embed Footer Text is:`.substring(0, 256))
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setDescription(es.footertext)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable28"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable29"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                })
                .catch(e => {
                  timeouterror = e;
                })
              if (timeouterror)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable30"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
            } else if (button?.customId == "4") {
              try {
                await client.settings.set(message.guild.id+".embed.thumb", !es?.thumb)
                es = await client.settings.get(message.guild.id+".embed")
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable31"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable32"]))
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                ]});
              } catch (e) {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable33"]))
                  .setColor(es.wrongcolor)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable34"]))
                  .setFooter(client.getFooter(es))
                ]});
              }
            } 
          }
          else button?.reply({content: `:x: You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          tempmsg.edit({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `:white_check_mark: **Selected the \`${collected.first().customId}\`. Button**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
  
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-embed"]["variable36"]))
      ]});
    }
  },
};

