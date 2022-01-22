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
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-suggestion",
  category: "💪 Setup",
  aliases: ["setupsuggestion", "suggestionsetup", "suggestsetup", "suggestion-setup", "suggest-setup", "setup-suggest", "setupsuggest"],
  cooldown: 5,
  usage: "setup-suggestion  -->  Follow the Steps",
  description: "Manage the Suggestions System, messages, emojis and Enable/Disable",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {


      first_layer()
      async function first_layer() {
        let menuoptions = [{
            value: "Enable Suggestion System",
            description: `Define the Suggestion System Channel`,
            emoji: "✅"
          },
          {
            value: "Disable Suggestion System",
            description: `Disable the Suggestion System`,
            emoji: "❌"
          },
          {
            value: "Approve Text",
            description: `Define the Approve Text`,
            emoji: "1️⃣"
          },
          {
            value: "Deny Text",
            description: `Define the Deny Text`,
            emoji: "2️⃣"
          },
          {
            value: "Maybe Text",
            description: `Define the Maybe Text`,
            emoji: "3️⃣"
          },
          {
            value: "Status Text",
            description: `Define the Status Text`,
            emoji: "4️⃣"
          },
          {
            value: "Soon Text",
            description: `Define the Soon Text`,
            emoji: "5️⃣"
          },
          {
            value: "Footer Text",
            description: `Define the Footer Text`,
            emoji: "6️⃣"
          },
          {
            value: "Upvote Emoji",
            description: `Define the Upvote Emoji`,
            emoji: "👍"
          },
          {
            value: "Downvote Emoji",
            description: `Define the Downvote Emoji`,
            emoji: "👎"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Suggestion System!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu().setCustomId('MenuSelection').setMaxValues(1).setMinValues(1).setPlaceholder('Click me to setup the Suggestion System')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))

        //define the embed
        let MenuEmbed = new MessageEmbed().setColor(es.color).setAuthor('Suggestion System', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/light-bulb_1f4a1.png', 'https://discord.gg/milrato').setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
          } else menu?.reply({
            content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`
          })
        });
      }
      /*
      client.settings.ensure(message.guild.id, {
        suggest: {
          channel: "",
          approvemsg: `<a:yes:833101995723194437> Accepted Idea! Expect this soon.`,
          denymsg: `<:no:833101993668771842> Thank you for the feedback, but we are not interested in this idea at this time.`,
          maybemsg: `💡 We are thinking about this idea!`,
          duplicatemsg: `💢 This is a duplicated Suggestion`,
          soonmsg: `👌 Expect this Feature Soon!`,
          statustext: `<a:Loading:833101350623117342> Waiting for Community Feedback, please vote!`,
          footertext: `Want to suggest / Feedback something? Simply type in this channel!`,
          approveemoji: `833101995723194437`,
          denyemoji: `833101993668771842`,
        }
    });
      */
      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {
          case "Enable Suggestion System": {

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable4"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable5"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                var channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  try {
                    client.settings.set(message.guild.id, channel.id, `suggest.channel`);
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable6"]))
                        .setColor(es.color)
                        .setDescription(`Start writing in there, to write a Suggestion, to accept/deny them use the: \`${prefix}suggest <approve/deny/maybe> <MESSAGEID> [REASON]\` command`.substr(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable7"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable8"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  message.reply("you didn't ping a valid Channel")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
          }
          break;
        case "Disable Suggestion System": {
          client.settings.set(message.guild.id, "", `suggest.channel`);
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle("Successfully disabled the Suggestion System")
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]
          });
        }
        break;
        case "Approve Text": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable10"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable11"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message) {
                try {
                  client.settings.set(message.guild.id, message.content, "suggest.approvemsg");
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable12"]))
                      .setColor(es.color)
                      .setDescription(`${message.content}`.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable13"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable14"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't Send a valid Text")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Deny Text": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable16"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable17"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message) {
                try {
                  client.settings.set(message.guild.id, message.content, "suggest.denymsg");
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable18"]))
                      .setColor(es.color)
                      .setDescription(`${message.content}`.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable19"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable20"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't Send a valid Text")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Maybe Text": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable22"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable23"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message) {
                try {
                  client.settings.set(message.guild.id, message.content, "suggest.maybemsg");
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable24"]))
                      .setColor(es.color)
                      .setDescription(`${message.content}`.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable25"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable26"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't Send a valid Text")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Status Text": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable28"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable29"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message) {
                try {
                  client.settings.set(message.guild.id, message.content, "suggest.statustext");
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable30"]))
                      .setColor(es.color)
                      .setDescription(`${message.content}`.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable31"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable32"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't Send a valid Text")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Soon Text": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle("What should be the new SOON Message?")
              .setColor(es.color)
              .setDescription("Please send it now!")
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message) {
                try {
                  client.settings.set(message.guild.id, message.content, "suggest.soonmsg");
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle("Successfully set the new SOON MESSAGE to:")
                      .setColor(es.color)
                      .setDescription(`${message.content}`.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable37"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable38"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't Send a valid Text")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Footer Text": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable34"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable35"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message) {
                try {
                  client.settings.set(message.guild.id, message.content, "suggest.footertext");
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable36"]))
                      .setColor(es.color)
                      .setDescription(`${message.content}`.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable37"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable38"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't Send a valid Text")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Upvote Emoji": {
          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable40"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable41"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.awaitReactions({
              filter: (reaction, user) => user.id == message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              if (reaction) {
                try {
                  if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                    client.settings.set(message.guild.id, collected.first().emoji?.id, "suggest.approveemoji");
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable42"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } else if (collected.first().emoji?.name) {
                    client.settings.set(message.guild.id, collected.first().emoji?.name, "suggest.approveemoji");
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable44"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable46"]))
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable48"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable49"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't reacted with a valid Emoji")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable50"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case "Downvote Emoji": {
          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable51"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable52"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.awaitReactions({
              filter: (reaction, user) => user.id == message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              if (reaction) {
                try {
                  if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                    client.settings.set(message.guild.id, collected.first().emoji?.id, "suggest.denyemoji");
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable53"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } else if (collected.first().emoji?.name) {
                    client.settings.set(message.guild.id, collected.first().emoji?.name, "suggest.denyemoji");
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable55"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable57"]))
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable59"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable60"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                message.reply("you didn't reacted with a valid Emoji")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable61"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-suggestion"]["variable63"]))
        ]
      });
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
