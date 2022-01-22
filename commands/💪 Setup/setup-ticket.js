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
  name: "setup-ticket",
  category: "💪 Setup",
  aliases: ["setupticket", "ticket-setup", "ticketsetup", "ticketsystem"],
  cooldown: 5,
  usage: "setup-ticket --> Follow Steps",
  description: "Manage 25 different Ticket Systems, Ticket-Roles, messages, create/disable",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      let temptype = 0;
      let errored = false;
      let guildid = message.guild.id;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer() {

        let menuoptions = [{
            value: "1 Ticket System",
            description: `Manage/Edit the 1 Ticket Setup`,
            emoji: NumberEmojiIds[1]
          },
          {
            value: "2 Ticket System",
            description: `Manage/Edit the 2 Ticket Setup`,
            emoji: NumberEmojiIds[2]
          },
          {
            value: "3 Ticket System",
            description: `Manage/Edit the 3 Ticket Setup`,
            emoji: NumberEmojiIds[3]
          },
          {
            value: "4 Ticket System",
            description: `Manage/Edit the 4 Ticket Setup`,
            emoji: NumberEmojiIds[4]
          },
          {
            value: "5 Ticket System",
            description: `Manage/Edit the 5 Ticket Setup`,
            emoji: NumberEmojiIds[5]
          }
        ]
        require("fs").readdirSync("./handlers/tickets").forEach((file, index) => {
          menuoptions.push({
            value: `${index + 5 + 1} Ticket System`,
            description: `Manage/Edit the ${index + 5 + 1} Ticket Setup`,
            emoji: NumberEmojiIds[index + 5 + 1]
          })
        })
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Ticket System!')
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
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(" ")[0]
          used1 = true;
          second_layer(SetupNumber, menuoptiondata)
        }
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
            menuselection(menu)
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
      async function second_layer(SetupNumber, menuoptiondata) {
        let menuoptions = [{
            value: "Create Ticket-System",
            description: `Create/Overwrite the ${SetupNumber} Ticket System`,
            emoji: "⚙️"
          },
          {
            value: "Edit Message",
            description: `Edit the Message when a Ticket opens`,
            emoji: "🛠"
          },
          {
            value: "Add Ticket Role",
            description: `Add a Ticket Role for managing the Tickets`,
            emoji: "😎"
          },
          {
            value: "Remove Ticket Role",
            description: `Remove a Ticket Role from managing the Tickets`,
            emoji: "💩"
          },
          {
            value: "Ticket Category",
            description: `Define the Category where the Tickets are located`,
            emoji: "🔘"
          },
          {
            value: "Ticket Claim System",
            description: `Manage the Claim System for this Ticket System.`,
            emoji: "✅"
          },
          {
            value: "Log Channel",
            description: `Define a Channel for Ticket Logs!`,
            emoji: "📃"
          },
          {
            value: "Set Default Ticket Name",
            description: `Define a Default Ticket Channel Name!`,
            emoji: "💬"
          },
          {
            value: "Delete & Reset",
            description: `Delete current setup, which allows you to resetup`,
            emoji: "🗑"
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
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder(`Click me to manage the ${SetupNumber} Ticket System!\n\n**You've picked:**\n> ${menuoptiondata.value}`)
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
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(SetupNumber + " Ticket Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://discord.gg/milrato")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
          menu?.deferUpdate();
          var ticket = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}`);
          handle_the_picks(menu?.values[0], SetupNumber, ticket)
        }
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
            menuselection(menu)
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

      async function handle_the_picks(optionhandletype, SetupNumber, ticket) {

        switch (optionhandletype) {
          case "Set Default Ticket Name": {
            let defaultname = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.defaultname`);
            var rembed = new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle("What should be the new Default Ticket Name?")
            .setDescription(`Currently it's: \`${defaultname}\` aka it will turn into: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... will get replaced with the ticket opening username\n> \`{count}\` ... Will get replaced with the TICKET ID (COUNT)\n**Send the Message now!**`)
          message.reply({
            embeds: [rembed]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 30000,
              errors: ['time']
            }).then(collected => {
              let content = collected.first().content;
              if(!content || !content.includes("{member}")) {
                return message.reply("You need to have {member} somewhere")
              }
              if(!content || content.length > 32) {
                return message.reply("A Channelname can't be longer then 32 Characters")
              }
              defaultname = content;
              client.setups.set(message.guild.id, defaultname, `ticketsystem${SetupNumber}.defaultname`);
              message.reply(`Set the Default Ticket Name to: \`${defaultname}\` aka it will turn into: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``)
            }).catch(error => {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
          }break;
          case "Create Ticket-System":

            var msg11 = new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable6"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable7"]))
              .setFooter(client.getFooter(es))
              .setColor(es.color)
            message.reply({
              embeds: [msg11]
            }).then(mm => {
              mm.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser,
                max: 1,
                time: 180000,
                errors: ['time'],
              }).then(collected => {
                let channel = collected.first().mentions.channels?.filter(ch => ch.guild.id == mm.guild.id)?.first()
                if (!channel) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
                var msg6 = new MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable9"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable10"]))
                  .setFooter(client.getFooter(es))
                  .setColor(es.color)
                message.reply({
                  embeds: [msg6]
                }).then(msg => {
                  msg.channel.awaitMessages({
                    filter: m => m.author.id == cmduser,
                    max: 1,
                    time: 180000,
                    errors: ['time'],
                  }).then(collected => {
                    //parent id in db
                    if (channel.parent && channel.parent.id) client.setups.set(message.guild.id, channel.parent.id, `ticketsystem${SetupNumber}.parentid`);

                    ticketmsg = collected.first().content;

                    //channel id in db
                    client.setups.set(message.guild.id, channel.id, `ticketsystem${SetupNumber}.channelid`);

                    let button_open = new MessageActionRow().addComponents([new MessageButton().setStyle('SUCCESS').setCustomId('create_a_ticket').setLabel('Create a Ticket').setEmoji("📨")])

                    channel.send({
                      embeds: [new MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable11"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable12"]))
                        .setFooter(client.getFooter(es))
                        .setColor(es.color)
                      ],
                      components: [button_open]
                    }).then(msg => {
                      //message id in db
                      client.setups.set(message.guild.id, msg.id, `ticketsystem${SetupNumber}.messageid`);
                      client.setups.set(message.guild.id, true, `ticketsystem${SetupNumber}.enabled`);
                      //msg.react(emoji2react)
                      var themebd = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable13"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable14"]))
                        .setFooter(client.getFooter(es))

                      message.reply({
                        embeds: [themebd]
                      })

                    })
                  }).catch(error => {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable15"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  })
                })
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })




            break;
          case "Delete & Reset":
            try {
              var channel = message.guild.channels.cache.get(ticket.channelid)
              channel.delete();
            } catch {}
            try {
              var parent = message.guild.channels.cache.get(ticket.parentid)
              parent.delete();
            } catch {}
            message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable17"]))
            client.setups.set(message.guild.id, {
              enabled: true,
              guildid: message.guild.id,
              messageid: "",
              channelid: "",
              parentid: "",
              claim: {
                enabled: false,
                messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
              },
              message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
              adminroles: []
            }, `ticketsystem${SetupNumber}`);
            break;
          case "Edit Message":
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable18"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable19"]))
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable20"]))
                client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.message`);
                
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Add Ticket Role":
            var rrembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter("Pick the INDEX NUMBER", es.footericon))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable22"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable23"]))
            message.reply({
              embeds: [rrembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                var role = collected.first().mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (!role) message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable24"]))

                message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable25"]));
                client.setups.push(message.guild.id, role.id, `ticketsystem${SetupNumber}.adminroles`);

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable26"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Remove Ticket Role":
            var rrrembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter("Pick the INDEX NUMBER", es.footericon))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable27"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable28"]))
            message.reply({
              embeds: [rrrembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                var role = collected.first().mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (!role) message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable29"]))
                try {
                  client.setups.remove(message.guild.id, role.id, `ticketsystem${SetupNumber}.adminroles`);
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable30"]));
                } catch {
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable31"]))
                  client.setups.set(message.guild.id, [], `ticketsystem${SetupNumber}.adminroles`);
                }
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable32"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Ticket Category":
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable33"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable34"]))
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                if (collected.first().content.length == 18) {
                  try {
                    var cat = message.guild.channels.cache.get(collected.first().content)
                    message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable35"]))
                    client.setups.set(message.guild.id, cat.id, `ticketsystem${SetupNumber}.parentid`);
                  } catch {
                    message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable36"]))
                  }
                } else {
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable37"]))
                }

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable38"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Ticket Claim System":{
            /*
            claim: {
              enabled: false,
              messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
              messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
            },
            */
            let claimData = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.claim`);
            third_layer(SetupNumber)
            async function third_layer(SetupNumber) {
              let menuoptions = [{
                  value: `${claimData.enabled ? "Disable Claim System": "Enable Claim System"}`,
                  description: `${claimData.enabled ? "No need to claim the Tickets anymore": "Make it so that Staff needs to claim the Ticket"}`,
                  emoji: `${claimData.enabled ? "❌": "✅"}`
                },
                {
                  value: "Edit Open Message",
                  description: `Edit the Claim-Info-Message when a Ticket opens`,
                  emoji: "🛠"
                },
                {
                  value: "Edit Claim Message",
                  description: `Edit the Claim-Message when a Staff claims it!`,
                  emoji: "😎"
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
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder(`Click me to manage the ${SetupNumber} Ticket System!\n\n**You've picked:**\n> Ticket Claim System`)
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
              let MenuEmbed = new Discord.MessageEmbed()
                .setColor(es.color)
                .setAuthor(SetupNumber + " Ticket Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://discord.gg/milrato")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
              //send the menu msg
              let menumsg = await message.reply({
                embeds: [MenuEmbed],
                components: [new MessageActionRow().addComponents(Selection)]
              })
              //function to handle the menuselection
              function menuselection(menu) {
                let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
                menu?.deferUpdate();
                var ticket = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}`);
                handle_the_picks2(menu?.values[0], SetupNumber, ticket)
              }
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
                  menuselection(menu)
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
            async function handle_the_picks2(optionhandletype, SetupNumber) {

              switch (optionhandletype) {
                case `${claimData.enabled ? "Disable Claim System": "Enable Claim System"}`:{
                  client.setups.set(message.guild.id, !claimData.enabled, `ticketsystem${SetupNumber}.claim.enabled`);
                  claimData = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.claim`);
                  return message.reply({embeds: [
                    new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`${claimData.enabled ? "Enabled the Claim System": "Disabled the Claim System"}`)
                    .setDescription(`${claimData.enabled ? "When a User opens a Ticket, a Staff Member needs to claim it, before he can send something in there!\n> This is useful for Professionality and Information!\n> **NOTE:** Admins can always chat...": "You now don't need to claim a Ticket anymore"}`)
                  ]});
                }break;
                case "Edit Open Message":{
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a User opens a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n\n**Current Message:**\n>>> " + claimData.messageOpen.substr(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.claim.messageOpen`);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                }break;
                case "Edit Claim Message":{
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a Staff claims a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n{claimer} will be replaced with a PING for WHO CLAIMED IT\n\n**Current Message:**\n>>> " + claimData.messageClaim.substr(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.claim.messageClaim`);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                }break;
              }
            }
          }break;
          case "Log Channel":
            //ticketlogid
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("In What Channel do you want to send Logs of this Ticket-System (When a Ticket gets DELETED)")
              .setDescription(`Ping the Channel / send \`no\` for disabeling Logs!\n\n*The Log will only be sent if the ticket gets __DELETED__ via the BUTTON (not the closing)*`)
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                let channel = collected.first().mentions.channels.first();
                if (channel) {
                  client.setups.set(message.guild.id, channel.id, `ticketsystem${SetupNumber}.ticketlogid`);
                  message.reply(`Successfully set the <#${channel.id}> as the TICKET-LOG for ${SetupNumber ? SetupNumber : 1}. Ticketsystem`);
                } else {
                  client.setups.set(message.guild.id, "", `ticketsystem${SetupNumber}.ticketlogid`);
                  message.reply(":x: Disabled the Log, because you did not send a valid channel")
                }
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable38"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          
          default:
            message.reply(String("SORRY, that Number does not exists :(\n Your Input:\n> " + collected.first().content).substr(0, 1999))
            break;
        }
      }




    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"]))
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