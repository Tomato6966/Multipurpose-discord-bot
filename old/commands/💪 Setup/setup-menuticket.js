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
  name: "setup-menuticket",
  category: "💪 Setup",
  aliases: ["setupmenuticket", "menuticket-setup", "menuticketsetup", "menuticketsystem"],
  cooldown: 5,
  usage: "setup-menuticket --> Follow Steps",
  description: "Manage up to 25 different Ticket Systems in a form of a DISCORD-MENU",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      var theDB = client.menuticket;
      var pre;

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      let NumberEmojis = getNumberEmojis();
      first_layer()
      async function first_layer() {

        let menuoptions = []
        for (let i = 1; i <= 100; i++) {
          menuoptions.push({
            value: `${i}. Menu Ticket`,
            description: `Manage/Edit the ${i}. Menu Ticket Setup`,
            emoji: NumberEmojiIds[i]
          })
        }

        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Menu Ticket System!')
          .addOptions(
            menuoptions.slice(0, 25).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Menu Ticket System!')
          .addOptions(
            menuoptions.slice(25, 50).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Menu Ticket System!')
          .addOptions(
            menuoptions.slice(50, 75).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Menu Ticket System!')
          .addOptions(
            menuoptions.slice(75, 100).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Menu Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/milrato'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [row1, row2, row3, row4, new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://youtu.be/QGESDc31d4U").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(".")[0];
            pre = `menuticket${SetupNumber}`;
            theDB = client.menuticket; //change to the right database
            second_layer(SetupNumber)
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
            content: `<a:yes:833101995723194437> **Selected: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`
          }).catch(() => { });
        });
      }
      async function second_layer(SetupNumber) {
        //setup-menuticket
        theDB.ensure(message.guild.id, {
          messageId: "",
          channelId: "",
          claim: {
            enabled: false,
            messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
            messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
          },
          access: [],
          data: [
            /*
              {
                value: "",
                description: "",
                category: null,
                replyMsg: "{user} Welcome to the Support!",
              }
            */
          ]
        }, pre);
        let menuoptions = [{
          value: "Send the Config	Message",
          description: `(Re) Send the Open a Ticket Message (with MENU)`,
          emoji: "👍"
        },
        {
          value: "Add Ticket Option",
          description: `Add up to 25 different open-Ticket-Option`,
          emoji: "📤"
        },
        {
          value: "Edit Ticket Option",
          description: `Edit one of your Ticket Options Data`,
          emoji: "✒️"
        },
        {
          value: "Manage General Access",
          description: `Add/Remove Users/Roles`,
          emoji: "👍"
        },
        {
          value: "Remove Ticket Option",
          description: `Remove a open-Ticket-Option`,
          emoji: "🗑"
        },
        {
          value: "Closed Ticket Category",
          description: `When Closing a Ticket, it will be moved to there`,
          emoji: "✂️"
        },
        {
          value: "Ticket Claim System",
          description: `Manage the Claim System for this Ticket System.`,
          emoji: "✅"
        },
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Click me to setup the Menu-Ticket System!')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          //.setAuthor('Menu Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/milrato')
          .setAuthor({ name: "Menu Ticket Setup", iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png", url: "https://discord.gg/milrato" })
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://youtu.be/QGESDc31d4U").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata, SetupNumber)
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
            content: `<a:yes:833101995723194437> **Selected: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`
          })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata, SetupNumber) {
        switch (optionhandletype) {
          case "Ticket Claim System": {
            /*
              claim: {
                enabled: false,
                messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
              }
            */
            let claimData = theDB.get(message.guild.id, `${pre}.claim`);
            third_layer(SetupNumber)
            async function third_layer(SetupNumber) {
              let menuoptions = [{
                value: `${claimData.enabled ? "Disable Claim System" : "Enable Claim System"}`,
                description: `${claimData.enabled ? "No need to claim the Tickets anymore" : "Make it so that Staff needs to claim the Ticket"}`,
                emoji: `${claimData.enabled ? "❌" : "✅"}`
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
                      label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
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
                handle_the_picks2(menu?.values[0], SetupNumber)
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
                  content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}`
                })
              });
            }
            async function handle_the_picks2(optionhandletype) {

              switch (optionhandletype) {
                case `${claimData.enabled ? "Disable Claim System" : "Enable Claim System"}`: {
                  theDB.set(message.guild.id, !claimData.enabled, `${pre}.claim.enabled`);
                  claimData = theDB.get(message.guild.id, `${pre}.claim`);
                  return message.reply({
                    embeds: [
                      new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(`${claimData.enabled ? "Enabled the Claim System" : "Disabled the Claim System"}`)
                        .setDescription(`${claimData.enabled ? "When a User opens a Ticket, a Staff Member needs to claim it, before he can send something in there!\n> This is useful for Professionality and Information!\n> **NOTE:** Admins can always chat..." : "You now don't need to claim a Ticket anymore"}`)
                    ]
                  });
                } break;
                case "Edit Open Message": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a User opens a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n\n**Current Message:**\n>>> " + claimData.messageOpen.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      theDB.set(message.guild.id, collected.first().content, `${pre}.claim.messageOpen`);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
                case "Edit Claim Message": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a Staff claims a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n{claimer} will be replaced with a PING for WHO CLAIMED IT\n\n**Current Message:**\n>>> " + claimData.messageClaim.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      theDB.set(message.guild.id, collected.first().content, `${pre}.claim.messageClaim`);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
              }
            }
          } break;
          case "Send the Config	Message": {
            await message.guild.emojis.fetch().catch(() => { });
            let data = theDB.get(message.guild.id, pre + ".data");
            let settings = theDB.get(message.guild.id, pre);
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **You need to add at least 1 Open-Ticket-Option**")
            }
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("What should be the Text to display in the Embed?")
                  .setDescription(`For Example:\n> \`\`\`To Open a Ticket, select the Topic you need in the Selection down below!\`\`\``)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("In where should I send the Open a New Ticket Message?")
                    .setDescription(`Please Ping the Channel now!\n> Just type: \`#channel\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Before it was: <#${settings.channelId}>` : settings.channelId ? `| Before it was: ${settings.channelId} (Channel got deleted)` : ""}\n\nYou can edit the Title etc. afterwards by using the \`${prefix}editembed\` Command`)
                ]
              });

              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && (collected2.first().mentions.channels.size > 0 || message.guild.channels.cache.get(collected2.first().content?.trim()))) {
                let data = theDB.get(message.guild.id, pre + ".data");
                let channel = collected2.first().mentions.channels.first() || message.guild.channels.cache.get(collected2.first().content?.trim());
                let msgContent = collected.first().content;
                let embed = new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setDescription(msgContent)
                  .setTitle("📨 Open a Ticket")
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder('Click me to Access the Menu-Ticket System!')
                  .addOptions(
                    data.map((option, index) => {
                      let Obj = {
                        label: option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                        emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                      }
                      return Obj;
                    }))
                channel.send({
                  embeds: [embed],
                  components: [new MessageActionRow().addComponents([Selection])]
                }).catch((err) => {
                  console.log(err)
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Click me to Access the Menu-Ticket System!')
                    .addOptions(
                      data.map((option, index) => {
                        let Obj = {
                          label: option.value.substring(0, 50),
                          value: option.value.substring(0, 50),
                          description: option.description.substring(0, 50),
                          emoji: NumberEmojiIds[index + 1]
                        }
                        return Obj;
                      }))
                  channel.send({
                    embeds: [embed],
                    components: [new MessageActionRow().addComponents([Selection])]
                  }).catch((e) => {
                    console.warn(e)
                  }).then(msg => {
                    theDB.set(message.guild.id, msg.id, pre + ".messageId");
                    theDB.set(message.guild.id, channel.id, pre + ".channelId");
                    message.reply(`Successfully Setupped the Menu-Ticket in <#${channel.id}>`)
                  });
                }).then(msg => {
                  theDB.set(message.guild.id, msg.id, pre + ".messageId");
                  theDB.set(message.guild.id, channel.id, pre + ".channelId");
                  message.reply(`Successfully Setupped the Menu-Ticket in <#${channel.id}>`)
                });
              } else {
                return message.reply("<:no:833101993668771842> **You did not ping a valid Channel!**")
              }
            } else {
              return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
            break;
          case "Add Ticket Option": {
            let data = theDB.get(message.guild.id, pre + ".data");
            if (data.length >= 25) {
              return message.reply("<:no:833101993668771842> **You reached the limit of 25 different Options!** Remove another Option first!")
            }
            //ask for value and description
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                  .setDescription(`**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`General Support++Get Help for anything you want!\`\`\``)
              ]
            });
            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              if (!collected.first().content.includes("++")) return message.reply("<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**")
              let value = collected.first().content.split("++")[0].trim().substring(0, 25);
              let index = data.findIndex(v => v.value == value);
              if (index >= 0) {
                return message.reply("<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
              }
              let description = collected.first().content.split("++")[1].trim().substring(0, 50);
              //ask for category
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("In Which Category should the new Tickets of this Option open?")
                    .setDescription(`**This is suggested to fill it in, because there are settings for SYNCING to that Category!**\nJust send the ID of it, send \`no\` for no category!\nFor Example:\n> \`840332704494518292\``)
                ]
              });
              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().content) {
                let categoryId = collected2.first().content;
                let category = message.guild.channels.cache.get(categoryId) || null;
                if (category && category.id) category = category.id;
                else category = null;
                //ask for reply message
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("What should be the Reply Message when someone Opens a Ticket?")
                      .setDescription(`For Example:\n> \`\`\`{user} Welcome to the Support! Tell us what you need help with!\`\`\``)
                  ]
                });
                let collected3 = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected3 && collected3.first().content) {
                  let replyMsg = collected3.first().content;
                  let defaultname = "🎫・{count}・{member}";
                  let tempmsg = await message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("What should be the new Default Ticket Name?")
                        .setDescription(`Currently/Suggested it's: \`${defaultname}\` aka it will turn into: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... will get replaced with the ticket opening username\n> \`{count}\` ... Will get replaced with the TICKET ID (COUNT)\n**Send the Message now!**`)
                    ]
                  });
                  let collected4 = await tempmsg.channel.awaitMessages({
                    filter: (m) => m.author.id == cmduser.id,
                    max: 1,
                    time: 90000, errors: ["time"]
                  });
                  if (collected4 && collected4.first().content) {
                    if (!collected4.first().content || !collected4.first().content.includes("{member}")) {
                      message.reply("You need to have {member} somewhere, using the SUGGESTION DEFAULTNAME (you change it via edit)");
                    } else if (!collected4.first().content || collected4.first().content.length > 32) {
                      message.reply("A Channelname can't be longer then 32 Characters, using the SUGGESTION DEFAULTNAME (you change it via edit)");
                    } else {
                      defaultname = collected4.first().content
                    }


                    var rermbed = new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("What should be the EMOJI to be displayed?")
                      .setDescription(`React to __THIS MESSAGE__ with the Emoji you want!\n> Either click on the default Emoji or add a CUSTOM ONE/Standard`)

                    var emoji, emojiMsg;
                    message.reply({ embeds: [rermbed] }).then(async msg => {
                      await msg.react(NumberEmojiIds[data.length + 1]).catch(console.warn);
                      msg.awaitReactions({
                        filter: (reaction, user) => user.id == cmduser.id,
                        max: 1,
                        time: 180e3
                      }).then(async collected => {
                        await msg.reactions.removeAll().catch(console.warn);
                        if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                          emoji = collected.first().emoji?.id;
                          if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                          else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                        } else if (collected.first().emoji?.name) {
                          emoji = collected.first().emoji?.name;
                          emojiMsg = collected.first().emoji?.name;
                        } else {
                          message.reply(":x: **No valid emoji added, using default EMOJI**");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }

                        try {
                          await msg.react(emoji);
                          if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                            emoji = null;
                            emojiMsg = NumberEmojis[data.length];
                          }
                        } catch (e) {
                          console.log(e)
                          message.reply(":x: **Could not use the CUSTOM EMOJI you added, as I can't access it / use it as a reaction/emoji for the menu**\nUsing default emoji!");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }
                        finished();

                      }).catch(() => {
                        message.reply(":x: **No valid emoji added, using default EMOJI**");
                        emoji = null;
                        emojiMsg = NumberEmojis[data.length];
                        finished();
                      });
                    })
                    function finished() {
                      theDB.push(message.guild.id, {
                        value,
                        description,
                        category,
                        defaultname,
                        replyMsg,
                        emoji
                      }, pre + ".data");
                      message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Successfully added the New Data to the List!")
                            .setDescription(`Make sure to re-send the Message, so that it's also updating it!\n> \`${prefix}setup-menuticket\` --> Send Config Message`)
                            .addField("Value:", `> ${value}`.substring(0, 1024), true)
                            .addField("Description:", `> ${description}`.substring(0, 1024), true)
                            .addField("Category:", `> <#${category}> (${category})`.substring(0, 1024), true)
                            .addField("Defaultname:", `> \`${defaultname}\` --> \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``.substring(0, 1024), true)
                            .addField("ReplyMsg:", `> ${replyMsg}`.substring(0, 1024), true)
                            .addField("Emoji:", `> ${emojiMsg}`.substring(0, 1024), true)
                        ]
                      });
                    }



                  } else {
                    return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                  }
                } else {
                  return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                }
              } else {
                return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
              }
            } else {
              return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
            break;
          case "Edit Ticket Option": {


            let data = theDB.get(message.guild.id, pre + ".data");
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **There are no Open-Ticket-Options to remove**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription("Just pick the Options you want to edit!")
              .setTitle("Which Option do you want to edit?")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Menu-Ticket System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                    emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            let menumsg;

            //send the menu msg
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async (err) => {
              console.log(err)
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Click me to Access the Menu-Ticket System!')
                .addOptions(
                  data.map((option, index) => {
                    let Obj = {
                      label: option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                      emoji: NumberEmojiIds[index + 1]
                    }
                    return Obj;
                  }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              }).catch((e) => {
                console.warn(e)
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              max: 1,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                let index = data.findIndex(v => v.value == menu?.values[0]);




                let menuoptions = [{
                  value: "Change Value&Description".substring(0, 25),
                  description: `Change the Value, etc. of the display-Option`,
                  emoji: "✒️"
                },
                {
                  value: "Change Open Category",
                  description: `When Opening a Ticket, it will be moved to there`,
                  emoji: "✂️"
                },
                {
                  value: "Change Default-Name",
                  description: `Change the Default Ticket Name`,
                  emoji: "🎫"
                },
                {
                  value: "Change Emoji",
                  description: `Change the Default Emoji`,
                  emoji: "👍"
                },
                {
                  value: "Change Reply Message",
                  description: `Change the Message when he opened the Ticket`,
                  emoji: "✅"
                },
                ]
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder(`Click me to edit the ${index}. Option!`)
                  .addOptions(
                    menuoptions.map(option => {
                      let Obj = {
                        label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                      }
                      if (option.emoji) Obj.emoji = option.emoji;
                      return Obj;
                    }))
                //define the embed
                let MenuEmbed = new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setAuthor(client.getAuthor('Menu Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/milrato'))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

                //send the menu msg
                let menumsg = await message.reply({
                  embeds: [MenuEmbed],
                  components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://youtu.be/QGESDc31d4U").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
                })
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                  filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                  time: 90000, errors: ["time"]
                })
                //Menu Collections
                collector.on('collect', menu => {
                  if (menu?.user.id === cmduser.id) {
                    collector.stop();
                    let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                    if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                    menu?.deferUpdate();
                    handle_the_picks3(menu?.values[0], menuoptiondata, SetupNumber)
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
                    content: `<a:yes:833101995723194437> **Selected: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`
                  })
                });

                async function handle_the_picks3(optionhandletype) {

                  switch (optionhandletype) {
                    case `Change Value&Description`.substring(0, 25): {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                            .setDescription(`**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`General Support++Get Help for anything you want!\`\`\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (collected && collected.first().content) {
                        if (!collected.first().content.includes("++")) return message.reply("<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**")
                        let value = collected.first().content.split("++")[0].trim().substring(0, 25);
                        let index2 = data.findIndex(v => v.value == value);
                        if (index2 >= 0 && index != index2) {
                          return message.reply("<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
                        }
                        let description = collected.first().content.split("++")[1].trim().substring(0, 50);
                        data[index].value = value;
                        data[index].description = description;
                        return finished();
                      } else {
                        return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                      }
                    } break;
                    case `Change Open Category`: {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("In Which Category should the new Tickets of this Option open?")
                            .setDescription(`**This is suggested to fill it in, because there are settings for SYNCING to that Category!**\n\nJust send the ID of it, send \`no\` for no category!\nFor Example:\n> \`840332704494518292\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      let categoryId = collected ? collected2.first().content : "";
                      let category = message.guild.channels.cache.get(categoryId) || null;
                      if (category && category.id) {
                        data[index].category = category.id;
                        return finished();
                      }
                      return message.reply("<:no:833101993668771842> **Invalid Category-ID added**")
                    } break;
                    case `Change Default-Name`: {
                      let defaultname = "🎫・{count}・{member}";
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("What should be the new Default Ticket Name?")
                            .setDescription(`Currently/Suggested it's: \`${defaultname}\` aka it will turn into: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... will get replaced with the ticket opening username\n> \`{count}\` ... Will get replaced with the TICKET ID (COUNT)\n**Send the Message now!**`)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (!collected4.first().content || !collected4.first().content.includes("{member}")) {
                        return message.reply("You need to have {member} somewhere, using the SUGGESTION DEFAULTNAME (you change it via edit)");
                      } else if (!collected4.first().content || collected4.first().content.length > 32) {
                        return message.reply("A Channelname can't be longer then 32 Characters, using the SUGGESTION DEFAULTNAME (you change it via edit)");
                      } else {
                        data[index].defaultname = collected4.first().content
                        return finished();
                      }
                    } break;
                    case `Change Emoji`: {
                      var rermbed = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("What should be the EMOJI to be displayed?")
                        .setDescription(`React to __THIS MESSAGE__ with the Emoji you want!\n> Either click on the default Emoji or add a CUSTOM ONE/Standard`)

                      var emoji, emojiMsg;
                      message.reply({ embeds: [rermbed] }).then(async msg => {
                        await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                        msg.awaitReactions({
                          filter: (reaction, user) => user.id == cmduser.id,
                          max: 1,
                          time: 180e3
                        }).then(async collected => {
                          await msg.reactions.removeAll().catch(console.warn);
                          if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                            emoji = collected.first().emoji?.id;
                            if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                            else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                          } else if (collected.first().emoji?.name) {
                            emoji = collected.first().emoji?.name;
                            emojiMsg = collected.first().emoji?.name;
                          } else {
                            message.reply(":x: **No valid emoji added, using default EMOJI**");
                            data[index].emoji = null;
                            data[index].emojiMsg = NumberEmojis[data.length];
                          }

                          try {
                            await msg.react(emoji);
                            if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                              data[index].emoji = null;
                              data[index].emojiMsg = NumberEmojis[data.length];
                            } else {
                              data[index].emoji = emoji;
                              data[index].emojiMsg = emojiMsg;
                            }
                          } catch (e) {
                            console.log(e)
                            message.reply(":x: **Could not use the CUSTOM EMOJI you added, as I can't access it / use it as a reaction/emoji for the menu**\nUsing default emoji!");
                            data[index].emoji = null;
                            data[index].emojiMsg = NumberEmojis[data.length];
                          }
                          finished();
                        }).catch((e) => {
                          console.log(e)
                          message.reply(":x: **No valid emoji added, using default EMOJI**");
                          data[index].emoji = null;
                          data[index].emojiMsg = NumberEmojis[data.length];
                          finished();
                        });
                      })
                    } break;
                    case `Change Reply Message`: {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("What should be the Reply Message when someone Opens a Ticket?")
                            .setDescription(`For Example:\n> \`\`\`{user} Welcome to the Support! Tell us what you need help with!\`\`\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (collected && collected.first().content) {
                        data[index].replyMsg = collected3.first().content;
                        return finished();
                      } else {
                        return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                      }
                    } break;
                  }
                }
                function finished() {
                  theDB.set(message.guild.id, data, pre + ".data");
                  let {
                    value,
                    description,
                    defaultname,
                    category,
                    replyMsg,
                    emojiMsg, emoji
                  } = data[index];
                  emojiMsg = emojiMsg ? emojiMsg : client.emojis.cache.has(emoji) ? client.emojis.cache.get(emoji).toString() : emoji;
                  message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("**Successfully edited:**")
                        .setDescription(`>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Ticket Config-Message!`)
                        .addField("Value:", `> ${value}`.substring(0, 1024), true)
                        .addField("Description:", `> ${description}`.substring(0, 1024), true)
                        .addField("Category:", `> <#${category}> (${category})`.substring(0, 1024), true)
                        .addField("Defaultname:", `> \`${defaultname}\` --> \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``.substring(0, 1024), true)
                        .addField("ReplyMsg:", `> ${replyMsg}`.substring(0, 1024), true)
                        .addField("Emoji:", `> ${emojiMsg}`.substring(0, 1024), true)

                    ]
                  });
                }



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
                content: `<a:yes:833101995723194437> **Selected: \`${collected.size > 0 ? collected.first().values[0] : "NOTHING"}\`**`
              })
            });
          }
            break;
          case "Remove Ticket Option": {
            let data = theDB.get(message.guild.id, pre + ".data");
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **There are no Open-Ticket-Options to remove**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription("Just pick the Options you want to remove!")
              .setTitle("Which Option Do you want to remove?")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(data.length)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Menu-Ticket System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                    emoji: NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            //send the menu msg
            let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async (err) => {
              console.log(err)
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Click me to Access the Menu-Ticket System!')
                .addOptions(
                  data.map((option, index) => {
                    let Obj = {
                      label: option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                      emoji: NumberEmojiIds[index + 1]
                    }
                    return Obj;
                  }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              }).catch((e) => {
                console.warn(e)
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                for (const value of menu?.values) {
                  let index = data.findIndex(v => v.value == value);
                  data.splice(index, 1)
                }
                theDB.set(message.guild.id, data, pre + ".data");
                message.reply(`**Successfully removed:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Ticket Config-Message!`)
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
                content: `<a:yes:833101995723194437> **Selected: \`${collected.first().values[0]}\`**`
              })
            });
          }
            break;
          case "Closed Ticket Category": {
            let parentId = theDB.get(message.guild.id, `${pre}.closedParent`);
            let parent = parentId ? message.guild.channels.cache.get(parentId) : null;
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("What should be the new Closed Ticket Category?")
              .setDescription(`Currently it's: \`${parentId ? "Not Setupped yet" : parent ? parent.name : `Channel not Found: ${parentId}`}\`!\nWhen closing a Ticket, it will be moved to there until it get's deleted!\n> **Send the new __PARENT ID__ now!**`)
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
                if (!content || content.length > 19 || content.length < 17) {
                  return message.reply("An Id is between 17 and 19 characters big")
                }
                parent = message.guild.channels.cache.get(content);
                if (!parent) {
                  return message.reply(`There is no parent i can access in this Guild which has the ID ${content}`);
                }
                if (parent.type !== "GUILD_CATEGORY") {
                  return message.reply(`<#${parent.id}> is not a CATEGORY/PARENT`);
                }
                theDB.set(message.guild.id, parent.id, `${pre}.closedParent`);
                message.reply(`I will now move closed Tickets to ${parent.name} (${parent.id})`);
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          } break;

          case "Manage General Access": {
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("What User(s) or Role(s) do you want to add/remove?")
                  .setDescription(`Just ping them! If they are already added, they will get removed!`)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && (collected.first().mentions.roles.size > 0 || collected.first().mentions.users.size > 0)) {
              let { users, roles } = collected.first().mentions;
              let settings = theDB.get(message.guild.id, pre);
              let toadd = [];
              let toremove = [];
              for (const role of roles.map(r => r.id)) {
                if ([...settings.access].includes(role)) {
                  toremove.push(role)
                } else {
                  toadd.push(role)
                }
              }
              for (const user of users.map(r => r.id)) {
                if ([...settings.access].includes(user)) {
                  toremove.push(user)
                } else {
                  toadd.push(user)
                }
              }
              for (const add of toadd) {
                theDB.push(message.guild.id, add, pre + ".access");
              }
              for (const remove of toremove) {
                theDB.remove(message.guild.id, remove, pre + ".access");
              }
              message.reply(`👍 Successfully added \`${toadd.length} Users/Roles\` and removed \`${toremove.length} Users/Roles\`\n> They are now always able to see, write and manage stuff in the TICKETS ment for them!`)
            } else {
              message.reply(":x: **You did not ping valid user(s)**")
            }
          } break;
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
    function isEmoji(emoji) {
      if (!emoji) return false;
      const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
      let unicode = regexExp.test(String(emoji));
      if (unicode) {
        return true
      } else {
        let dcemoji = client.emojis.cache.has(emoji) || message.guild.emojis.cache.has(emoji);
        if (dcemoji) return true;
        else return false;
      }
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
