var {
  MessageEmbed
} = require("discord.js");
var Discord = require("discord.js");
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emojis = require("../../botconfig/emojis.json");
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-apply",
  category: "💪 Setup",
  aliases: ["setupapply", "apply-setup", "applysetup", "setup-application", "setupapplication"],
  cooldown: 5,
  usage: "setup-apply --> follow Steps",
  description: "Manage 25 different Application Systems",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let theemoji = "📜";
    let MilratoGuild = client.guilds.cache.get("773668217163218944");
    if (MilratoGuild) theemoji = "877653386747605032";
    let allbuttons = [new MessageActionRow().addComponents([new MessageButton().setStyle('SUCCESS').setEmoji(theemoji).setCustomId("User_Apply").setLabel("Apply")])]
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    let apply_for_here = client.apply;
    let temptype = 0;
    let errored = false;
    let timeouterror = false;
    const filter = (reaction, user) => {
      return user.id == cmduser.id
    };
    let guildid = message.guild.id;
    let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
    first_layer()
    async function first_layer() {
      try {
        let menuoptions = [{
            value: "1 Apply System",
            description: `Manage/Edit the 1 Apply Setup`,
            emoji: NumberEmojiIds[1]
          },
          {
            value: "2 Apply System",
            description: `Manage/Edit the 2 Apply Setup`,
            emoji: NumberEmojiIds[2]
          },
          {
            value: "3 Apply System",
            description: `Manage/Edit the 3 Apply Setup`,
            emoji: NumberEmojiIds[3]
          },
          {
            value: "4 Apply System",
            description: `Manage/Edit the 4 Apply Setup`,
            emoji: NumberEmojiIds[4]
          },
          {
            value: "5 Apply System",
            description: `Manage/Edit the 5 Apply Setup`,
            emoji: NumberEmojiIds[5]
          }
        ]
        require("fs").readdirSync("./handlers/applies").forEach((file, index) => {
          menuoptions.push({
            value: `${index + 5 + 1} Apply System`,
            description: `Manage/Edit the ${index + 5 + 1} Apply Setup`,
            emoji: NumberEmojiIds[index + 5 + 1]
          })
        })
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Application System(s)!')
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
          .setAuthor('Application Setup', 'https://cdn.discordapp.com/emojis/877653386747605032.png?size=96', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
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
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            if (Number(SetupNumber) > 1) {
              apply_for_here = client[`apply${SetupNumber}`]
            }
            used1 = true;
            temptype = SetupNumber;
            second_layer(SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor).setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable223"]))
          ]
        });
      }
    }
    async function second_layer(SetupNumber, menuoptiondata) {
      try {
        //ensure the database
        apply_for_here.ensure(guildid, {
          "channel_id": "",
          "message_id": "",
          "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

          "QUESTIONS": [{
            "1": "DEFAULT"
          }],

          "TEMP_ROLE": "0",

          "accept": "You've got accepted!",
          "accept_role": "0",

          "deny": "You've got denied!",

          "ticket": "Hey {user}! We have some Questions!",

          "one": {
            "role": "0",
            "message": "Hey you've got accepted for Team 1",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "two": {
            "role": "0",
            "message": "Hey you've got accepted for Team 2",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "three": {
            "role": "0",
            "message": "Hey you've got accepted for Team 3",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "four": {
            "role": "0",
            "message": "Hey you've got accepted for Team 4",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "five": {
            "role": "0",
            "message": "Hey you've got accepted for Team 5",
            "image": {
              "enabled": false,
              "url": ""
            }
          }
        });
        let menuoptions = [{
            value: "Create Apply-System",
            description: `Create/Overwrite the ${SetupNumber} Apply System`,
            emoji: "⚙️"
          },
          {
            value: "Edit Accept Message",
            description: `Message when a Apply gets accepted`,
            emoji: "🛠"
          },
          {
            value: "Edit Deny Message",
            description: `Message when a Apply gets denied`,
            emoji: "🛠"
          },
          {
            value: "Edit Ticket Message",
            description: `Message when a Apply gets redirected to a Ticket`,
            emoji: "🛠"
          },
          {
            value: "Define Accept Role",
            description: `Role to add when a User get's accepted`,
            emoji: "🔘"
          },
          {
            value: "Define Temp Role",
            description: `Role to add when a User applies`,
            emoji: "🔘"
          },
          {
            value: "Manage Emoji 1",
            description: `Manage the Emoji Settings for that Emoji`,
            emoji: "1️⃣"
          },
          {
            value: "Manage Emoji 2",
            description: `Manage the Emoji Settings for that Emoji`,
            emoji: "2️⃣"
          },
          {
            value: "Manage Emoji 3",
            description: `Manage the Emoji Settings for that Emoji`,
            emoji: "3️⃣"
          },
          {
            value: "Manage Emoji 4",
            description: `Manage the Emoji Settings for that Emoji`,
            emoji: "4️⃣"
          },
          {
            value: "Manage Emoji 5",
            description: `Manage the Emoji Settings for that Emoji`,
            emoji: "5️⃣"
          },

          {
            value: "Edit a Question",
            description: `Edit one of the Questions`,
            emoji: "🔴"
          },
          {
            value: "Add a Question",
            description: `Add a Question to the Questions`,
            emoji: "🟣"
          },
          {
            value: "Remove a Question",
            description: `Remove a Question from the Questions`,
            emoji: "🟡"
          },
          {
            value: "Set new Apply-Channel",
            description: `Channel/Message where the Application starts`,
            emoji: "🟢"
          },
          {
            value: "Set new Log-Channel",
            description: `Channel where the applies are listed`,
            emoji: "🔵"
          },
          {
            value: apply_for_here.get(message.guild.id, "last_verify") ? "Enable Last Verify" : "Disable Last Verify",
            description: apply_for_here.get(message.guild.id, "last_verify") ? "Enabled Last Verification Message for the User" : "Disabled Last Verification Message for the User",
            emoji: "✋"
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
          .setPlaceholder(`Click me to manage the ${SetupNumber} Apply System!\n\n**You've picked:**\n> ${menuoptiondata.value}`)
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
          .setAuthor(SetupNumber + " Apply Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://discord.gg/milrato")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
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
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
            menu?.deferUpdate();
            used2 = true;
            handle_the_picks(menu?.values[0], SetupNumber)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor).setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable223"]))
          ]
        });
      }
    }

    async function handle_the_picks(optionhandletype) {

      try {

        if (optionhandletype == "Create Apply-System") args = "create"
        if (optionhandletype == "Edit Accept Message") args = "acceptmsg"
        if (optionhandletype == "Edit Deny Message") args = "denymsg"
        if (optionhandletype == "Edit Ticket Message") args = "ticketmsg"
        if (optionhandletype == "Define Accept Role") args = "acceptrole"
        if (optionhandletype == "Define Temp Role") args = "temprole"
        if (optionhandletype == "Manage Emoji 1") args = "emojione"
        if (optionhandletype == "Manage Emoji 2") args = "emojitwo"
        if (optionhandletype == "Manage Emoji 3") args = "emojithree"
        if (optionhandletype == "Manage Emoji 4") args = "emojifour"
        if (optionhandletype == "Manage Emoji 5") args = "emojifive"
        if (optionhandletype == "Edit a Question") args = "editquestion"
        if (optionhandletype == "Add a Question") args = "addquestion"
        if (optionhandletype == "Remove a Question") args = "removequestion"
        if (optionhandletype == "Set new Apply-Channel") args = "applychannel"
        if (optionhandletype == "Set new Log-Channel") args = "finishedapplychannel"
        if (optionhandletype == "Enable Last Verify" || optionhandletype == "Disable Last Verify") args = "last_verify"
        switch (args) {
          case "create": {

            var color = "GREEN";
            var desc;
            var userid = cmduser.id;
            let row = new MessageActionRow().addComponents([
              new MessageButton().setStyle("SECONDARY").setCustomId("1").setEmoji("1️⃣"),
              new MessageButton().setStyle("SECONDARY").setCustomId("2").setEmoji("2️⃣")
            ])
            var pickmsg = await message.reply({
              components: [row],
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable6"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable6_1"]))
                .setFooter(client.getFooter(es))
              ]
            })
            var collector = pickmsg.createMessageComponentCollector({filter: (interaction) => interaction?.isButton() && interaction?.message.author.id == client.user.id && interaction?.user.id == cmduser.id,
                max: 1,
                time: 180000,
                erros: ["time"]
            })
            collector.on("collect", interaction => {
                try { interaction?.deferUpdate() } catch (e){ }
                if (interaction?.customId == "1") setup_with_channel_creation()
                if (interaction?.customId == "2") setup_without_channel_creation()
            })
            async function setup_with_channel_creation() {
              var applychannel;
              var f_applychannel;
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                  .setAuthor('Setting up...', 'https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif')
                  .setFooter(client.getFooter(es))
                ]
              })
              message.guild.channels.create("📋 | Applications", {
                type: "GUILD_CATEGORY",
              }).then(ch => {
                ch.guild.channels.create("✔️|finished-applies", {
                  type: "GUILD_TEXT",
                  topic: "React to the Embed, to start the application process",
                  parent: ch.id,
                  permissionOverwrites: [{
                    id: ch.guild.id,
                    deny: ["VIEW_CHANNEL"]
                  }]
                }).then(ch => {
                  f_applychannel = ch.id
                  apply_for_here.set(ch.guild.id, ch.id, "f_channel_id")
                })
                ch.guild.channels.create("✅|apply-here", {
                  type: "GUILD_TEXT",
                  topic: "React to the Embed, to start the application process",
                  parent: ch.id,
                  permissionOverwrites: [{
                      id: ch.guild.id,
                      allow: ["VIEW_CHANNEL"],
                      deny: ["SEND_MESSAGES"]
                    },
                    {
                      id: client.user.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    }
                  ]
                }).then(ch => {
                  var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  message.reply({
                    embeds: [embed
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable9"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable9_1"]))
                    ]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                        filter: m => m.author.id === userid,
                        max: 1,
                        time: 180000,
                        errors: ["TIME"]
                      }).then(collected => {
                        var content = collected.first().content;
                        if (!content.startsWith("#") && content.length !== 7) {
                          message.reply({
                            content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable10"])
                          })
                        } else {
                          if (isValidColor(content)) {
                            console.log(content)
                            color = content;
                          } else {
                            message.reply({
                              content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable11"])
                            })
                          }
                        }

                        function isValidColor(str) {
                          return str.match(/^#[a-f0-9]{6}$/i) !== null;
                        }
                      }).catch(error => {

                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable12"]))
                            .setColor(es.wrongcolor)
                            .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      })
                      .then(something => {
                        message.reply({
                          embeds: [embed
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable13"]))
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable13_1"]))
                          ]
                        }).then(msg => {
                          msg.channel.awaitMessages({
                            filter: m => m.author.id === userid,
                            max: 1,
                            time: 180000,
                            errors: ["TIME"]
                          }).then(collected => {
                            desc = collected.first().content;
                            var setupembed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                              .setColor(color)
                              .setDescription(desc)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable14"]))
                              .setFooter(client.getFooter(es))
                            ch.send({
                              embeds: [setupembed],
                              components: allbuttons
                            }).then(msg => {
                              apply_for_here.set(msg.guild.id, msg.id, "message_id")
                              apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
                              applychannel = msg.channel.id;
                            });
                            var counter = 0;
                            apply_for_here.set(msg.guild.id, [{
                              "1": "DEFAULT"
                            }], "QUESTIONS")
                            ask_which_qu();

                            function ask_which_qu() {
                              counter++;
                              if (counter === 25) {
                                message.reply({
                                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED")
                                    .setAuthor('You reached the maximum amount of Questions!', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png')
                                  ]
                                })
                                return ask_addrole();
                              }
                              message.reply({
                                embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable16"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable17"]))]
                              }).then(msg => {
                                msg.channel.awaitMessages({
                                  filter: m => m.author.id === userid,
                                  max: 1,
                                  time: 180000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  if (collected.first().content.toLowerCase() === "finish") {
                                    return ask_addrole();
                                  }
                                  switch (counter) {
                                    case 1: {
                                      apply_for_here.set(msg.guild.id, [], "QUESTIONS");
                                      apply_for_here.push(msg.guild.id, {
                                        "1": collected.first().content
                                      }, "QUESTIONS");
                                    }
                                    break;
                                  case 2:
                                    apply_for_here.push(msg.guild.id, {
                                      "2": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 3:
                                    apply_for_here.push(msg.guild.id, {
                                      "3": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 4:
                                    apply_for_here.push(msg.guild.id, {
                                      "4": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 5:
                                    apply_for_here.push(msg.guild.id, {
                                      "5": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 6:
                                    apply_for_here.push(msg.guild.id, {
                                      "6": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 7:
                                    apply_for_here.push(msg.guild.id, {
                                      "7": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 8:
                                    apply_for_here.push(msg.guild.id, {
                                      "8": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 9:
                                    apply_for_here.push(msg.guild.id, {
                                      "9": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 10:
                                    apply_for_here.push(msg.guild.id, {
                                      "10": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 11:
                                    apply_for_here.push(msg.guild.id, {
                                      "11": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 12:
                                    apply_for_here.push(msg.guild.id, {
                                      "12": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 13:
                                    apply_for_here.push(msg.guild.id, {
                                      "13": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 14:
                                    apply_for_here.push(msg.guild.id, {
                                      "14": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 15:
                                    apply_for_here.push(msg.guild.id, {
                                      "15": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 16:
                                    apply_for_here.push(msg.guild.id, {
                                      "16": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 17:
                                    apply_for_here.push(msg.guild.id, {
                                      "17": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 18:
                                    apply_for_here.push(msg.guild.id, {
                                      "18": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 19:
                                    apply_for_here.push(msg.guild.id, {
                                      "19": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 20:
                                    apply_for_here.push(msg.guild.id, {
                                      "20": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 21:
                                    apply_for_here.push(msg.guild.id, {
                                      "21": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 22:
                                    apply_for_here.push(msg.guild.id, {
                                      "22": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 23:
                                    apply_for_here.push(msg.guild.id, {
                                      "23": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 24:
                                    apply_for_here.push(msg.guild.id, {
                                      "24": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  }
                                  ask_which_qu();
                                }).catch(error => {

                                  return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable18"]))
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  });
                                })
                              })
                            }

                            function ask_addrole() {
                              message.reply({
                                embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable19"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable20"]))]
                              }).then(msg => {
                                msg.channel.awaitMessages({
                                  filter: m => m.author.id === userid,
                                  max: 1,
                                  time: 180000,
                                  errors: ["TIME"]
                                }).then(async collected => {
                                  if (collected.first().content.toLowerCase() === "no") {
                                    return message.reply({
                                      embeds: [new Discord.MessageEmbed()
                                        .setFooter(client.getFooter(es))
                                        .setColor(es.color)
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable21"]))
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable22"]))
                                      ]
                                    });
                                  } else {
                                    var role = collected.first().mentions.roles.first();
                                    if (!role) return message.reply({
                                      embeds: [new Discord.MessageEmbed()
                                        .setFooter(client.getFooter(es))
                                        .setColor(es.color)
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable23"]))
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable24"]))
                                      ]
                                    });
                                    var guildrole = message.guild.roles.cache.get(role.id)

                                    if (!message.guild.me.roles) return message.reply({
                                      embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable25"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                        dynamic: true
                                      }))]
                                    })

                                    var botrole = message.guild.me.roles.highest
                                    if (guildrole.rawPosition >= botrole.rawPosition) {
                                      message.reply({
                                        content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable26"])
                                      })
                                      return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                          .setFooter(client.getFooter(es))
                                          .setColor(es.color)
                                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable27"]))
                                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable28"]))
                                        ]
                                      });
                                    }
                                    apply_for_here.set(message.guild.id, role.id, "TEMP_ROLE")
                                    return message.reply({
                                      embeds: [new Discord.MessageEmbed()
                                        .setFooter(client.getFooter(es))
                                        .setColor(es.color)
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable29"]))
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable30"]))
                                      ]
                                    });
                                  }
                                }).catch(error => {
                                  console.log(error)
                                  return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable31"]))
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  });
                                })
                              })
                            }
                          }).catch(error => {
                            console.log(error)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable32"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })
                        })
                      })
                  })
                })
              })

            }

            async function setup_without_channel_creation() {

              var applychannel;
              var f_applychannel;




              pickmsg = await message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable33"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable33_1"]))
                  .setFooter(client.getFooter(es))
                ]
              })
              await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  erros: ["time"]
                }).then(collected => {
                  var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                  if (channel) {
                    applychannel = channel.id;
                  } else {
                    message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable34"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable35"]))
                      ]
                    }).then(msg => msg.delete({
                      timeout: 7500
                    }))
                    throw "<:no:833101993668771842> ERROR";
                  }
                })
                .catch(e => {
                  errored = e
                })
              if (errored)
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setColor("RED").setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable36"]))
                    .setDescription(`\`\`\`${errored.message}\`\`\``)
                  ]
                }).then(msg => msg.delete({
                  timeout: 7500
                }))




              pickmsg = await message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es))
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable37"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable37_1"]))
                  .setFooter(client.getFooter(es))
                ]
              })
              await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  erros: ["time"]
                }).then(collected => {
                  var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                  if (channel) {
                    f_applychannel = channel.id;
                  } else {
                    message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable38"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable39"]))
                      ]
                    }).then(msg => msg.delete({
                      timeout: 7500
                    }))
                    throw "<:no:833101993668771842> ERROR";
                  }
                })
                .catch(e => {
                  errored = e
                })
              if (errored)
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setColor("RED").setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable40"]))
                    .setDescription(`\`\`\`${errored.message}\`\`\``)
                  ]
                }).then(msg => msg.delete({
                  timeout: 7500
                }))




              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                  .setAuthor('Setting up...', 'https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif')
                  .setFooter(client.getFooter(es))
                ]
              })




              var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                .setColor(es.color)
                .setFooter(client.getFooter(es))


              var msg = await message.reply({
                embeds: [embed
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable42"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable42_1"]))
                ]
              })

              await msg.channel.awaitMessages({
                filter: m => m.author.id === userid,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var content = collected.first().content;
                if (!content.startsWith("#") && content.length !== 7) {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable43"])
                  })
                } else {
                  if (isValidColor(content)) {
                    color = content;
                  } else {
                    message.reply({
                      content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable44"])
                    })
                  }
                }

                function isValidColor(str) {
                  return str.match(/^#[a-f0-9]{6}$/i) !== null;
                }
              }).catch(e => {
                errored = e
              })
              if (errored)
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setColor("RED")
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable45"]))
                    .setDescription(`\`\`\`${errored.message}\`\`\``)
                  ]
                }).then(msg => msg.delete({
                  timeout: 7500
                }))

              await message.reply({
                embeds: [embed
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable46"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable46_1"]))
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === userid,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  desc = collected.first().content;
                  var setupembed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                    .setColor(color)
                    .setDescription(desc)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable47"]))
                    .setFooter(client.getFooter(es))
                  message.guild.channels.cache.get(applychannel).send({
                    embeds: [setupembed],
                    components: allbuttons
                  }).then(msg => {
                    apply_for_here.set(msg.guild.id, msg.id, "message_id")
                    apply_for_here.set(message.guild.id, f_applychannel, "f_channel_id")
                    apply_for_here.set(msg.guild.id, applychannel, "channel_id")
                  });
                  var counter = 0;
                  apply_for_here.set(msg.guild.id, [{
                    "1": "DEFAULT"
                  }], "QUESTIONS")
                  ask_which_qu();

                  function ask_which_qu() {
                    counter++;
                    if (counter === 25) {
                      message.reply({
                        embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED")
                          .setAuthor('You reached the maximum amount of Questions!', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png')
                        ]
                      })

                      return ask_addrole();
                    }
                    message.reply({
                      embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable49"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable50"]))]
                    }).then(msg => {
                      msg.channel.awaitMessages({
                        filter: m => m.author.id === userid,
                        max: 1,
                        time: 180000,
                        errors: ["TIME"]
                      }).then(collected => {
                        if (collected.first().content.toLowerCase() === "finish") {
                          return ask_addrole();
                        }
                        switch (counter) {
                          case 1: {
                            apply_for_here.set(msg.guild.id, [], "QUESTIONS");
                            apply_for_here.push(msg.guild.id, {
                              "1": collected.first().content
                            }, "QUESTIONS");
                          }
                          break;
                        case 2:
                          apply_for_here.push(msg.guild.id, {
                            "2": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 3:
                          apply_for_here.push(msg.guild.id, {
                            "3": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 4:
                          apply_for_here.push(msg.guild.id, {
                            "4": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 5:
                          apply_for_here.push(msg.guild.id, {
                            "5": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 6:
                          apply_for_here.push(msg.guild.id, {
                            "6": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 7:
                          apply_for_here.push(msg.guild.id, {
                            "7": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 8:
                          apply_for_here.push(msg.guild.id, {
                            "8": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 9:
                          apply_for_here.push(msg.guild.id, {
                            "9": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 10:
                          apply_for_here.push(msg.guild.id, {
                            "10": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 11:
                          apply_for_here.push(msg.guild.id, {
                            "11": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 12:
                          apply_for_here.push(msg.guild.id, {
                            "12": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 13:
                          apply_for_here.push(msg.guild.id, {
                            "13": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 14:
                          apply_for_here.push(msg.guild.id, {
                            "14": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 15:
                          apply_for_here.push(msg.guild.id, {
                            "15": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 16:
                          apply_for_here.push(msg.guild.id, {
                            "16": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 17:
                          apply_for_here.push(msg.guild.id, {
                            "17": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 18:
                          apply_for_here.push(msg.guild.id, {
                            "18": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 19:
                          apply_for_here.push(msg.guild.id, {
                            "19": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 20:
                          apply_for_here.push(msg.guild.id, {
                            "20": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 21:
                          apply_for_here.push(msg.guild.id, {
                            "21": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 22:
                          apply_for_here.push(msg.guild.id, {
                            "22": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 23:
                          apply_for_here.push(msg.guild.id, {
                            "23": collected.first().content
                          }, "QUESTIONS");
                          break;
                        case 24:
                          apply_for_here.push(msg.guild.id, {
                            "24": collected.first().content
                          }, "QUESTIONS");
                          break;
                        }
                        ask_which_qu();
                      }).catch(e => {
                        errored = e
                      })
                      if (errored)
                        return message.reply({
                          embeds: [new Discord.MessageEmbed().setColor("RED")
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable51"]))
                            .setDescription(`\`\`\`${errored.message}\`\`\``)
                          ]
                        }).then(msg => msg.delete({
                          timeout: 7500
                        }))

                    })
                  }

                  function ask_addrole() {
                    message.reply({
                      embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable52"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable53"]))]
                    }).then(msg => {
                      msg.channel.awaitMessages({
                        filter: m => m.author.id === userid,
                        max: 1,
                        time: 180000,
                        errors: ["TIME"]
                      }).then(async collected => {
                        if (collected.first().content.toLowerCase() === "no") {
                          return message.reply({
                            embeds: [new Discord.MessageEmbed()
                              .setFooter(client.getFooter(es))
                              .setColor(es.color)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable54"]))
                              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable55"]))
                            ]
                          });
                        } else {
                          var role = collected.first().mentions.roles.first();
                          if (!role) return message.reply({
                            embeds: [new Discord.MessageEmbed()
                              .setFooter(client.getFooter(es))
                              .setColor(es.color)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable56"]))
                              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable57"]))

                            ]
                          });
                          var guildrole = message.guild.roles.cache.get(role.id)

                          if (!message.guild.me.roles) return message.reply({
                            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable58"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                              dynamic: true
                            }))]
                          })

                          var botrole = message.guild.me.roles.highest
                          if (guildrole.rawPosition >= botrole.rawPosition) {
                            message.reply({
                              content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable59"])
                            })
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setFooter(client.getFooter(es))
                                .setColor(es.color)
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable60"]))
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable61"]))

                              ]
                            });
                          }
                          apply_for_here.set(message.guild.id, role.id, "TEMP_ROLE")
                          return message.reply({
                            embeds: [new Discord.MessageEmbed()
                              .setFooter(client.getFooter(es))
                              .setColor(es.color)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable62"]))
                              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable63"]))

                            ]
                          });
                        }
                      }).catch(e => {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        errored = e
                      })
                      if (errored)
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setColor("RED")
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable64"]))
                            .setDescription(`\`\`\`${errored.message}\`\`\``)
                          ]
                        }).then(msg => msg.delete({
                          timeout: 7500
                        }))
                    })
                  }
                }).catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  errored = e
                })
                if (errored)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setColor("RED")
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable65"]))
                      .setDescription(`\`\`\`${errored.message}\`\`\``)
                    ]
                  }).then(msg => msg.delete({
                    timeout: 7500
                  }))
              })
            }
          }
          break;
        case "acceptmsg": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept message?", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              apply_for_here.set(message.guild.id, collected.first().content, "accept")
              return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable68"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "acceptrole": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept Role, which will be granted when the User got accepted?", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var role = collected.first().mentions.roles.first();
              if (!role) return message.reply({
                content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable69"])
              })
              var guildrole = message.guild.roles.cache.get(role.id)

              if (!message.guild.me.roles) return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable70"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })

              var botrole = message.guild.me.roles.highest

              if (guildrole.rawPosition <= botrole.rawPosition) {
                apply_for_here.set(message.guild.id, role.id, "accept_role")
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              } else {
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable71"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable72"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "denymsg": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new deny message?", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              apply_for_here.set(message.guild.id, collected.first().content, "deny")
              return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the DENY MESSAGE!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable73"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "ticketmsg": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new Ticket message? | {user} pings the User", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              apply_for_here.set(message.guild.id, collected.first().content, "ticket")
              return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the TICKET MESSAGE!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable74"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "emojione": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable75"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable76"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable77"]))
                .setColor("RED")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable111"]).substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
              filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "You reacted with a wrong emoji"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable78"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept message for emoji one?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, "one.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji one!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable79"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji one?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable80"])
                })
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable81"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, "one.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable82"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable83"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", "one.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, "one.image.enabled")
            apply_for_here.set(message.guild.id, "", "one.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable84"]))
              ]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable85"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable86"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, "one.image.enabled")
                      apply_for_here.set(message.guild.id, url, "one.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable87"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable88"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, "one.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, "one.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable89"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable90"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable91"]))
                  .setColor("RED")
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable130"]))
                  .setFooter(client.getFooter(es))
                ]
              });
            }


          }

          }
        }
        break;
        case "emojitwo": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable93"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable94"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable95"]))
                .setColor("RED")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable151"]).substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
              filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "You reacted with a wrong emoji"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable96"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept message for emoji two?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, "two.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji two!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable97"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji two?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable98"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable99"]))
                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable100"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, "two.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable101"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable102"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", "two.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, "two.image.enabled")
            apply_for_here.set(message.guild.id, "", "two.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable103"]))
              ]
            })
          }
          break;
          case "setimage": {

            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable104"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable105"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, "two.image.enabled")
                      apply_for_here.set(message.guild.id, url, "two.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable106"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable107"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, "two.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, "two.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable108"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable109"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable110"]))
                  .setColor("RED")
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable171"]))
                  .setFooter(client.getFooter(es))
                ]
              });
            }

          }
          break;
          }
        }
        break;
        case "emojithree": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable112"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable113"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable114"]))
                .setColor("RED")
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
              filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "You reacted with a wrong emoji"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable115"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept message for emoji three?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, "three.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji three!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable116"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji three?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable117"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable118"]))

                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable119"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, "three.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable120"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable121"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", "three.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, "three.image.enabled")
            apply_for_here.set(message.guild.id, "", "three.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable122"]))
              ]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable123"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable124"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, "three.image.enabled")
                      apply_for_here.set(message.guild.id, url, "three.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable125"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable126"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, "three.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, "three.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable127"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable128"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable129"]))
                  .setColor("RED")
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
                  .setFooter(client.getFooter(es))
                ]
              });
            }

          }

          default:
            return message.reply({
              embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable131"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable132"]))]
            })
            break;
          }
        }
        break;
        case "emojifour": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable133"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable134"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable135"]))
                .setColor("RED")
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
            filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "You reacted with a wrong emoji"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable136"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept message for emoji four?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, "four.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji four!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable137"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji four?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable138"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable139"]))
                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable140"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, "four.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable141"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable142"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", "four.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, "four.image.enabled")
            apply_for_here.set(message.guild.id, "", "four.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable143"]))
              ]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable144"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable145"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, "four.image.enabled")
                      apply_for_here.set(message.guild.id, url, "four.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable146"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable147"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, "four.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, "four.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable148"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable149"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable150"]))
                  .setColor("RED")
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
                  .setFooter(client.getFooter(es))
                ]
              });
            }
          }

          default:
            return message.reply({
              embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable152"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable153"]))]
            })
            break;
          }
        }

        break;
        case "emojifive": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable154"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable155"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable156"]))
                .setColor("RED")
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
            filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "You reacted with a wrong emoji"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable157"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept message for emoji five?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, "five.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji five!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable158"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji five?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable159"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable160"]))

                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable161"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, "five.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable162"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable163"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", "five.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, "five.image.enabled")
            apply_for_here.set(message.guild.id, "", "five.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable164"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable165"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, "five.image.enabled")
                      apply_for_here.set(message.guild.id, url, "five.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))

                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable166"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable167"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, "five.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, "five.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))

                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable168"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable169"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable170"]))
                  .setColor("RED")
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
                  .setFooter(client.getFooter(es))
                ]
              });
            }

          }

          default:
            return message.reply({
              embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable172"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable173"]))]
            })
            break;
          }
        }
        break;
        case "editquestion": {
          var Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
          var embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))

            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable174"])) //Tomato#6966
            .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({
              dynamic: true
            }))
            .setTimestamp()

          for (var i = 0; i < Questions.length; i++) {
            try {
              embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          }

          message.reply({
            embeds: [embed, new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable175"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable176"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var arr = apply_for_here.get(message.guild.id, "QUESTIONS");
              var quindex = collected.first().content
              if (arr.length >= Number(quindex)) {
                message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("What should be the new Question?", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                }).then(msg => {
                  msg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 180000,
                    errors: ["TIME"]
                  }).then(collected => {
                    var index = Number(quindex);
                    var obj;
                    switch (Number(index)) {
                      case 1:
                        obj = {
                          "1": collected.first().content
                        };
                        break;
                      case 2:
                        obj = {
                          "2": collected.first().content
                        };
                        break;
                      case 3:
                        obj = {
                          "3": collected.first().content
                        };
                        break;
                      case 4:
                        obj = {
                          "4": collected.first().content
                        };
                        break;
                      case 5:
                        obj = {
                          "5": collected.first().content
                        };
                        break;
                      case 6:
                        obj = {
                          "6": collected.first().content
                        };
                        break;
                      case 7:
                        obj = {
                          "7": collected.first().content
                        };
                        break;
                      case 8:
                        obj = {
                          "8": collected.first().content
                        };
                        break;
                      case 9:
                        obj = {
                          "9": collected.first().content
                        };
                        break;
                      case 10:
                        obj = {
                          "10": collected.first().content
                        };
                        break;
                      case 11:
                        obj = {
                          "11": collected.first().content
                        };
                        break;
                      case 12:
                        obj = {
                          "12": collected.first().content
                        };
                        break;
                      case 13:
                        obj = {
                          "13": collected.first().content
                        };
                        break;
                      case 14:
                        obj = {
                          "14": collected.first().content
                        };
                        break;
                      case 15:
                        obj = {
                          "15": collected.first().content
                        };
                        break;
                      case 16:
                        obj = {
                          "16": collected.first().content
                        };
                        break;
                      case 17:
                        obj = {
                          "17": collected.first().content
                        };
                        break;
                      case 18:
                        obj = {
                          "18": collected.first().content
                        };
                        break;
                      case 19:
                        obj = {
                          "19": collected.first().content
                        };
                        break;
                      case 20:
                        obj = {
                          "20": collected.first().content
                        };
                        break;
                      case 21:
                        obj = {
                          "21": collected.first().content
                        };
                        break;
                      case 22:
                        obj = {
                          "22": collected.first().content
                        };
                        break;
                      case 23:
                        obj = {
                          "23": collected.first().content
                        };
                        break;
                      case 24:
                        obj = {
                          "24": collected.first().content
                        };
                        break;
                    }
                    arr[index] = obj;
                    apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                    Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                    var new_embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                      .setColor(es.color)
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable177"])) //Tomato#6966
                      .setFooter(message.guild.name, message.guild.iconURL({
                        dynamic: true
                      }))
                      .setTimestamp()
                    for (var i = 0; i < Questions.length; i++) {
                      try {
                        new_embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                      } catch {}
                    }
                    message.reply({
                      embeds: [new_embed]
                    });
                  }).catch(error => {

                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable178"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  })
                })
              } else {
                message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
                return message.reply({
                  embeds: [embed]
                });
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable179"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })



        }
        break;
        case "temprole":
          message.reply({
            embeds: [new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable180"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable181"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var role = collected.first().mentions.roles.first();
              if (!role) return message.reply({
                content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable182"])
              })
              var guildrole = message.guild.roles.cache.get(role.id)

              if (!message.guild.me.roles) return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable183"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })

              var botrole = message.guild.me.roles.highest

              if (guildrole.rawPosition <= botrole.rawPosition) {
                apply_for_here.set(message.guild.id, role.id, "TEMP_ROLE")
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the TEMP ROLE!", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              } else {
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable184"])).setAuthor("<:no:833101993668771842> ERROR | Could not Access the Role", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable185"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
          break;
        case "addquestion": {
          message.reply({
            embeds: [new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable186"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable187"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var Questions = apply_for_here.get(message.guild.id, "QUESTIONS")
              var obj;
              switch (Questions.length + 1) {
                case 1:
                  obj = {
                    "1": collected.first().content
                  };
                  break;
                case 2:
                  obj = {
                    "2": collected.first().content
                  };
                  break;
                case 3:
                  obj = {
                    "3": collected.first().content
                  };
                  break;
                case 4:
                  obj = {
                    "4": collected.first().content
                  };
                  break;
                case 5:
                  obj = {
                    "5": collected.first().content
                  };
                  break;
                case 6:
                  obj = {
                    "6": collected.first().content
                  };
                  break;
                case 7:
                  obj = {
                    "7": collected.first().content
                  };
                  break;
                case 8:
                  obj = {
                    "8": collected.first().content
                  };
                  break;
                case 9:
                  obj = {
                    "9": collected.first().content
                  };
                  break;
                case 10:
                  obj = {
                    "10": collected.first().content
                  };
                  break;
                case 11:
                  obj = {
                    "11": collected.first().content
                  };
                  break;
                case 12:
                  obj = {
                    "12": collected.first().content
                  };
                  break;
                case 13:
                  obj = {
                    "13": collected.first().content
                  };
                  break;
                case 14:
                  obj = {
                    "14": collected.first().content
                  };
                  break;
                case 15:
                  obj = {
                    "15": collected.first().content
                  };
                  break;
                case 16:
                  obj = {
                    "16": collected.first().content
                  };
                  break;
                case 17:
                  obj = {
                    "17": collected.first().content
                  };
                  break;
                case 18:
                  obj = {
                    "18": collected.first().content
                  };
                  break;
                case 19:
                  obj = {
                    "19": collected.first().content
                  };
                  break;
                case 20:
                  obj = {
                    "20": collected.first().content
                  };
                  break;
                case 21:
                  obj = {
                    "21": collected.first().content
                  };
                  break;
                case 22:
                  obj = {
                    "22": collected.first().content
                  };
                  break;
                case 23:
                  obj = {
                    "23": collected.first().content
                  };
                  break;
                case 24:
                  obj = {
                    "24": collected.first().content
                  };
                  break;
              }
              apply_for_here.push(message.guild.id, obj, "QUESTIONS")
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully added your Question!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
              Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
              var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable188"])) //Tomato#6966
                .setFooter(message.guild.name, message.guild.iconURL({
                  dynamic: true
                }))
                .setTimestamp()

              for (var i = 0; i < Questions.length; i++) {
                try {
                  embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                }
              }
              message.reply({
                embeds: [embed]
              });
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable189"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "removequestion": {
          var Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
          var embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))

            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable190"])) //Tomato#6966
            .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({
              dynamic: true
            }))
            .setTimestamp()

          for (var i = 0; i < Questions.length; i++) {
            try {
              embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          }

          message.reply({
            embeds: [embed, new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))

              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable191"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable192"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var arr = apply_for_here.get(message.guild.id, "QUESTIONS");
              var quindex = collected.first().content
              if (arr.length >= Number(quindex)) {

                var index = Number(quindex);
                var counter = 0;
                for (var item of arr) {
                  // console.log(Object.keys(item))
                  if (Object.keys(item) == index) {
                    arr.splice(counter, 1);
                  }
                  counter++;
                }
                counter = 0;
                for (var item of arr) {
                  if (Object.keys(item) != counter + 1) {
                    var key = String(Object.keys(item));
                    item[key] = item[key] //replace the item
                    delete item[key] //delete the old one
                    arr[counter] === item; //update it
                  }
                  counter++;
                }
                apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                var new_embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable193"])) //Tomato#6966
                  .setFooter(message.guild.name, message.guild.iconURL({
                    dynamic: true
                  }))
                  .setTimestamp()
                for (var i = 0; i < Questions.length; i++) {
                  try {
                    new_embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                  } catch {}
                }
                message.reply({
                  embeds: [new_embed]
                });

              } else {
                message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
                return message.reply({
                  embeds: [embed]
                });
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable194"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })


        }
        break;
        case "applychannel":
          try {
            var applychannel;
            var f_applychannel;
            
            var userid = cmduser.id;
            pickmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))

                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable195"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable196"]))
              ]
            })

            await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                erros: ["time"]
              }).then(collected => {
                var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                if (channel) {
                  applychannel = channel.id;
                } else {
                  message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor("RED")
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable197"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable198"]))
                    ]
                  }).then(msg => msg.delete({
                    timeout: 7500
                  }))
                  throw "<:no:833101993668771842> ERROR";
                }
              })
              .catch(e => {
                errored = e
              })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed().setColor("RED")
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable199"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))

            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                .setAuthor('Setting up...', 'https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif')
                .setFooter(client.getFooter(es))
              ]
            })
            var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            var msg = await message.reply({
              embeds: [embed
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable201"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable201_1"]))
              ]
            })
            await msg.channel.awaitMessages({
              filter: m => m.author.id === userid,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var content = collected.first().content;
              if (!content.startsWith("#") && content.length !== 7) {
                message.reply({
                  content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable202"])
                })
              } else {
                if (isValidColor(content)) {
                  color = content;
                  if (color.toLowerCase() === "#ffffff")
                    color = "#fffff9"
                } else {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable203"])
                  })
                }
              }

              function isValidColor(str) {
                return str.match(/^#[a-f0-9]{6}$/i) !== null;
              }
            }).catch(e => {
              errored = e
            })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor("RED")
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable204"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))

            await message.reply({
              embeds: [embed
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable205"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable205_1"]))
              ]
            })
            await msg.channel.awaitMessages({
              filter: m => m.author.id === userid,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              desc = collected.first().content;
              var setupembed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                .setColor(color)
                .setDescription(desc)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable206"]))
                .setFooter(client.getFooter(es))

              message.guild.channels.cache.get(applychannel).send({
                embeds: [setupembed],
                components: allbuttons
              }).then(msg => {
                apply_for_here.set(msg.guild.id, msg.id, "message_id")
                apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
              }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setFooter(client.getFooter(es))
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable207"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable208"]))

                ]
              });

            }).catch(e => {
              errored = e
            })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor("RED").setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable209"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor("RED")
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable210"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable211"]))
              ]
            }).then(msg => msg.delete({
              timeout: 7500
            }))
          }
          break;
        case "finishedapplychannel":
          try {
            var applychannel;
            var f_applychannel;

            var userid = cmduser.id;
            pickmsg = await message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable212"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable212_1"]))
                .setFooter(client.getFooter(es))
              ]
            })

            await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                erros: ["time"]
              }).then(collected => {
                var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                if (channel) {
                  f_applychannel = channel.id;
                } else {
                  message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor("RED")
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable213"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable214"]))
                    ]
                  }).then(msg => msg.delete({
                    timeout: 7500
                  }))
                  throw "<:no:833101993668771842> ERROR";
                }
              })
              .catch(e => {
                errored = e
              })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor("RED")
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable215"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))
            apply_for_here.set(message.guild.id, f_applychannel, "f_channel_id")
            return message.reply({
              content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable216"])
            });

          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor("RED")
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable217"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable218"]))
              ]
            }).then(msg => msg.delete({
              timeout: 7500
            }))
          }
          break;
        case "last_verify": {
          apply_for_here.set(message.guild.id, !apply_for_here.get(message.guild.id, "last_verify"), "last_verify")
          var embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable219"])) //Tomato#6966
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable220"])) //Tomato#6966
            .setTimestamp()
          message.reply({
            embeds: [embed]
          });
        }
        break;
        }
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor).setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable223"]))
          ]
        });
      }
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
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
