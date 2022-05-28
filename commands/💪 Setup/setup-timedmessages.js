var {
    MessageEmbed
  } = require(`discord.js`);
  var Discord = require(`discord.js`);
  var config = require(`${process.cwd()}/botconfig/config.json`);
  var ee = require(`${process.cwd()}/botconfig/embed.json`);
  var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  var {
    databasing, duration
  } = require(`${process.cwd()}/handlers/functions`);
  const ms = require("ms");
  const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { dbEnsure } = require("../../handlers/functions");
  module.exports = {
    name: "setup-timedmessage",
    category: "💪 Setup",
    aliases: ["setuptimedmessages", "timedmessages-setup", "timedmessagessetup", "setuptimedmessage", "timedmessage-setup", "timedmessagesetup", "setup-timedmessages"],
    cooldown: 5,
    usage: "setup-timedmessage  -->  Follow the Steps",
    description: "Setup Messages to send in a specific Time!",
    memberpermissions: ["ADMINISTRATOR"],
    type: "fun",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
      
      try {
        let TextEmojis = getNumberEmojis();
        let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
        await dbEnsure(client.settings, message.guild.id, {
          timedmessages: [
              /*
              {
                  content: "Text",
                  embed: true,
                  minute: 50,
                  channel: "",
                  hour: 12,
                  days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
              }
              */
          ]
        })
        const timedmessages = await client.settings.get(message.guild.id+".timedmessages")
        first_layer()
        async function first_layer(){
          let menuoptions = [
            {
              value: "Add Timed Message",
              description: `Add up to 25 different Timed Messages`,
              emoji: "✅"
            },
            {
              value: "Remove Timed Message",
              description: `Remove / Delete Timed Message(s)`,
              emoji: "❌"
            },
            {
              value: "Show Timed Messages",
              description: `Show all of the Timed Messages`,
              emoji: "📑"
            },
            {
              value: "Cancel",
              description: `Cancel and stop the Timed-Messages-Setup!`,
              emoji: "862306766338523166"
            }
          ]
          //define the selection
          let Selection = new MessageSelectMenu()
            .setCustomId('MenuSelection') 
            .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
            .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
            .setPlaceholder('Click me to setup the Timed Messages') 
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
            .setAuthor(client.getAuthor('Timed-Messages', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/three-oclock_1f552.png', 'https://discord.gg/milrato'))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
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
              let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
              if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
              menu?.deferUpdate();
              let SetupNumber = menu?.values[0].split(" ")[0]
              handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
            }
            else menu?.reply({content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
          });
          //Once the Collections ended edit the menu message
          collector.on('end', collected => {
            menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected && collected?.first()?.values?.[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
          });
        }
  
        async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
          switch (optionhandletype) {
            case "Add Timed Message":
              {
                if(timedmessages.length >= 25) 
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`There are 25 Timed Messages`)
                    .setColor(es.wrongcolor)
                    .setDescription(`You can't have more`.substr(0, 2000))
                    .setFooter(es.footertext, es.footericon)
                  ]});
                var currentMinute = new Date().getMinutes();
                if(currentMinute < 10) currentMinute = `0${currentMinute}`;
                var currentHour = new Date().getHours();
                if(currentHour < 10) currentHour = `0${currentHour}`;
                var Days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
                var currentDay = Days[new Date().getDay()];
                var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`When should I send it?`)
                  .setColor(es.color)
                  .setDescription(`Send the Time now! Just the \`HOURS:MINUTES\`\nExample: \`8:00\`, \`18:34\`\n**It must be written like that!**\n Current Time, as a reference for your Time Zone: \`${currentHour}:${currentMinute}\``).setFooter(es.footertext, es.footericon)]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var message = collected.first();
                    if(!message) return message.reply("NO MESSAGE SENT");
                    if(message.content){
                      var hour = message.content.split(":")[0];
                      var minute = message.content.split(":")[1];
                      if(isNaN(hour) || hour < 0 || hour > 23) return message.reply(`Invalid Hour Added (${hour}), it must be between \`0\` and \`23\`!`.substr(0, 2000))
                      if(isNaN(minute) || minute < 0 || minute > 59) return message.reply(`Invalid Hour Added (${minute}), it must be between \`0\` and \`59\`!`.substr(0, 2000))
                      let menuoptions = Days.map((d) => {
                          return {
                            value: d,
                            description: `Send the Message just on ${d}`,
                          }
                        })
                      //define the selection
                      let Selection = new MessageSelectMenu()
                        .setCustomId('MenuSelection') 
                        .setMinValues(1) //OPTIONAL, this is how many values you can have at each selection
                        .setMaxValues(menuoptions.length) //OPTIONAL , this is how many values you need to have at each selection
                        .setPlaceholder('Click me to setup the Timed Messages') 
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
                      //send the menu msg
                      let menumsg = await message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`When should I send it? Select All Days / Week you want to send this Message`)
                        .setColor(es.color)
                        .setDescription(`Select All Days / Week you want to send this Message\n\n Current Day, as a reference for your Time Zone: \`${currentDay}\``).setFooter(es.footertext, es.footericon)], components: [new MessageActionRow().addComponents(Selection)]})
                      //Create the collector
                      const collector = menumsg.createMessageComponentCollector({ 
                        filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                        time: 90000
                      })
                      //Menu Collections
                      collector.on('collect', async menu => {
                        if (menu?.user.id === cmduser.id) {
                          collector.stop();
                          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                          menu?.deferUpdate();
                          var days = menu.values;
  
  
                          var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`In which Channel shall I send the Message?`)
                            .setColor(es.color)
                            .setDescription(`Please **ping** the Channel with #Channel`).setFooter(es.footertext, es.footericon)]
                          })
                          await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                              max: 1,
                              time: 90000,
                              errors: ["time"]
                            })
                            .then(async collected => {
                              var message = collected.first();
                              if(!message) return message.reply("NO MESSAGE SENT");
                              let channel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first();
                              if(channel){
                                var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(`What Message shall I send?`)
                                  .setColor(es.color)
                                  .setDescription(`Just type the MESSAGE CONTENT! If it should be in an Embed or not will be asked afterwards!`).setFooter(es.footertext, es.footericon)]
                                })
                                await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                                    max: 1,
                                    time: 90000,
                                    errors: ["time"]
                                  })
                                  .then(async collected => {
                                    var message = collected.first();
                                    if(!message) return message.reply("NO MESSAGE SENT");
                                    if(message.content){
                                      var content = message.content;
                                      var embed = false;
                                      /**
                                       * ASK IF IT SHOULD BE AN EMBED OR NOT
                                       */
                                      var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                                        .setTitle(`Should the Message be inside of an Embed?`)
                                        .setColor(es.color)], components: [new MessageActionRow().addComponents([
                                          new MessageButton().setStyle("SUCCESS").setLabel("Yes").setCustomId("embed_yes"),
                                          new MessageButton().setStyle("DANGER").setLabel("No, just a normal Message").setCustomId("embed_no"),
                                        ])]
                                      })
                                      const collector = tempmsg.createMessageComponentCollector({ 
                                        filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                                        time: 90000
                                      })
                                      //Menu Collections
                                      collector.on('collect', async button => {
                                        if(button.customId === "embed_yes"){
                                          embed = true;
                                        }
                                        button.deferUpdate();
                                        collector.stop();   
                                        var timedmessage = {
                                          content: content,
                                          embed: embed,
                                          minute: minute,
                                          channel: channel.id,
                                          hour: hour,
                                          days: days
                                        }
                                        await client.settings.push(message.guild.id+".timedmessages", timedmessage);
                                        message.reply(`**Successfully Created a TIMED MESSAGE!**\nWould send it every \`${timedmessage.hour}:${timedmessage.minute}\` on: \`${timedmessage.days.join(" & ")}\` in <#${timedmessage.channel}>`)
                                        if(timedmessage.embed){
                                            message.reply({embeds : [
                                                new Discord.MessageEmbed()
                                                .setColor(es.color)
                                                .setFooter(es.footertext, es.footericon)
                                                .setThumbnail(es.thumb ? es.footericon : null)
                                                .setDescription(timedmessage.content.substr(0, 2000))
                                            ]}).catch(() => {})
                                        } else {
                                          message.reply({content : timedmessage.content.substr(0, 2000)}).catch(() => {})
                                        }
                                      })
                                    } else{
                                        return message.reply("No Message Content Added");
                                    }
                                  }).catch(e => {
                                    console.log(e);
                                    return message.reply({embeds: [new Discord.MessageEmbed()
                                      .setTitle(`Something went wrong`)
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                                      .setFooter(es.footertext, es.footericon)
                                    ]});
                                  })
                              } else{
                                  return message.reply("No Message Content Added");
                              }
                            }).catch(e => {
                              console.log(e);
                              return message.reply({embeds: [new Discord.MessageEmbed()
                                .setTitle(`Something went wrong`)
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                                .setFooter(es.footertext, es.footericon)
                              ]});
                            })
  
  
                        }
                        else menu?.reply({content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
                      });
                      //Once the Collections ended edit the menu message
                      collector.on('end', collected => {
                        menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected && collected?.first()?.values?.[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                      });
                    }
                    else{
                      return message.reply("No Message Content Added");
                    }
                  })
                  .catch(e => {
                    console.log(e);
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`Something went wrong`)
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                      .setFooter(es.footertext, es.footericon)
                    ]});
                  })
              }
            break;
            case "Remove Timed Message":{
              if(timedmessages.length <= 0) 
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`There are 0 Timed Messages Setup`)
                  .setColor(es.wrongcolor)
                  .setDescription(`Add some others first...`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                ]});
              let menuoptions = timedmessages.map((data, index) => {
                let Obj = {}
                Obj.emoji = NumberEmojiIds[index + 1];
                Obj.value = `${index +1}. ${data.hour}:${data.minute} ${data.days.map(d => d.slice(0, 2).toUpperCase()).join(" & ")}`.substr(0, 25)
                Obj.description = `${data.content}`.substr(0, 50);
                return Obj;
              })
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(menuoptions.length) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to remove a Timed Message') 
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
                .setAuthor('Timed-Messages', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/three-oclock_1f552.png', 'https://discord.gg/milrato')
                .setDescription("Select all Timed Messages you want to remove!")
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
  
                  for(const value of menu?.values) {
                    let index = Number(value.split(".")[0]) - 1;
                    if(index > -1) timedmessages.splice(index, 1)
                  }
                  await client.settings.set(message.guild.id+".timedmessages", timedmessages)
  
                  menu?.reply(`✅ **Successfully removed ${menu?.values.length} Timed Messages!**`)
                }
                else menu?.reply({content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected && collected?.first()?.values?.[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            } break;
            case "Show Timed Messages":{
              if(timedmessages.length <= 0) 
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`There are 0 Timed Messages Setup`)
                  .setColor(es.wrongcolor)
                  .setDescription(`Add some others first...`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                ]});
              let menuoptions = timedmessages.map((data, index) => {
                let Obj = {}
                Obj.emoji = NumberEmojiIds[index + 1];
                Obj.value = `${index +1}. ${data.hour}:${data.minute} ${data.days.map(d => d.slice(0, 2).toUpperCase()).join(" & ")}`.substr(0, 25)
                Obj.description = `${data.content}`.substr(0, 50);
                return Obj;
              })
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Click me to show a Timed Message') 
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
                .setAuthor('Timed-Messages', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/three-oclock_1f552.png', 'https://discord.gg/milrato')
                .setDescription("Select the Timed Message you want to show!")
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
                  let index = Number(menu.values[0].split(".")[0]) - 1;
                  var msg = timedmessages[index];
                  if(msg.embed){
                      message.reply({embeds : [
                          new Discord.MessageEmbed()
                          .setColor(es.color)
                          .setFooter(es.footertext, es.footericon)
                          .setThumbnail(es.thumb ? es.footericon : null)
                          .setDescription(msg.content.substr(0, 2000))
                      ]}).catch(() => {})
                  } else {
                    message.reply({content : msg.content.substr(0, 2000)}).catch(() => {})
                  }
                  message.reply(`Would send it every \`${msg.hour}:${msg.minute}\` on: \`${msg.days.join(" & ")}\` in <#${msg.channel}>`)
                }
                else menu?.reply({content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected && collected?.first()?.values?.[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            } break;
          }
        }
      } catch (e) {
        console.error(e)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
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