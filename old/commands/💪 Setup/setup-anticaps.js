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
  name: "setup-anticaps",
  category: "💪 Setup",
  aliases: ["setupanticaps", "setup-caps", "setupcaps", "anticaps-setup", "anticapssetup"],
  cooldown: 5,
  usage: "setup-anticaps  -->  Follow the Steps",
  description: "Enable + Change the maximum Percent of UPPERCASE (caps) inside of a Message",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Enabled`" : "`❌ Disabled`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `Enable & Set Anti Caps %`,
            description: "Enable to set an allowed % for CAPS in a Msg",
            emoji: "833101995723194437"
          },
          {
            value: `Disable Anti Spam`,
            description: "Don't delete Messages with CAPS",
            emoji: "833101993668771842"
          },
          {
            value: "Settings",
            description: `Show the Current Settings of the Anti-Caps System`,
            emoji: "📑"
          },
          {
            value: "Add Whitelist-CHANNEL",
            description: `Allow Channels where it is allowed`,
            emoji: "💯"
          },
          {
            value: "Remove Whitelist-CHANNEL",
            description: `Remove allowed Channels`,
            emoji: "💢"
          },
          {
            value: "Change Max-Mute Amount",
            description: `Change the max allow Time to do it before mute!`,
            emoji: "🕛"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Anti-Caps-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Click me to setup the Anti Caps System!').setCustomId('MenuSelection') 
          .setMaxValues(1).setMinValues(1) 
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
           }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor("Anti-Caps System Setup", 
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/a-button-blood-type_1f170-fe0f.png",
          "https://discord.gg/milrato")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable1"]))
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
            let menuoptiondataIndex = menuoptions.findIndex(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menuoptiondataIndex, SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }

      //THE FUNCTION TO HANDLE THE SELECTION PICS
      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch(menuoptionindex){
          case 0: {
              let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable3"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable4"]))
                .setFooter(client.getFooter(es))]
              });
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                }) .then(collected => {
                  var message = collected.first();
                  if (message.content) {
                    var userpercent = Number(message.content.trim().replace("%", "").split(" ")[0]);
                    if(userpercent > 100 || userpercent < 0) 
                      return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable5"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable6"]))
                          .setFooter(client.getFooter(es))]
                        }); 
                    try {
                      client.settings.set(message.guild.id, userpercent, "anticaps.percent");
                      client.settings.set(message.guild.id, true, "anticaps.enabled");
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable7"]))
                        .setColor(es.color)
                        .setDescription(`If a non Admin User types a message with more then ${userpercent}% amount of CAPS his message will be deleted + he will be "warned" (no warn system warn but yeah)\n\nIf he continues to do that, he will get Muted`.substring(0, 2048))
                        .setFooter(client.getFooter(es))]
                      });
                    } catch (e) {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable8"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable9"]))
                        .setFooter(client.getFooter(es))]
                      });
                    }
                  } else {
                    message.reply( "you didn't ping a valid Channel")
                  }
                }) .catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable10"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
                })

          }break;
          case 1: {
            client.settings.set(message.guild.id, false, "anticaps.enabled");
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable11"]))
              .setColor(es.color)
              .setDescription(`To enabled it type \`${prefix}setup-anticaps\``.substring(0, 2048))
              .setFooter(client.getFooter(es))]
            });
          }break;
          case 2: {
            let thesettings = client.settings.get(message.guild.id, `anticaps`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable12"]))
              .setColor(es.color)
              .setDescription(`**Enabled:** ${thesettings.enabled ? "<a:yes:833101995723194437>" : "<:no:833101993668771842>"}\n\n**Percentage, of Message allowed to be in caps:** \`${thesettings.percent} %\``.substring(0, 2048))
              .setFooter(client.getFooter(es))]}
            );
          }
          case 3: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable6"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
              if (channel) {
                let antisettings = client.settings.get(message.guild.id, "anticaps.whitelistedchannels")
                if (antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable7"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.push(message.guild.id, channel.id, "anticaps.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` is now got added to the Whitelisted Channels of this System`)
                    .setColor(es.color)
                    .setDescription(`Every single Channel:\n<#${client.settings.get(message.guild.id, "anticaps.whitelistedchannels").join(">\n<#")}>\nis not checked by the System`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable10"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("you didn't ping a valid Channel")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
          case 4: {

            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable12"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable13"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
              if (channel) {
                let antisettings = client.settings.get(message.guild.id, "anticaps.whitelistedchannels")
                if (!antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable14"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.remove(message.guild.id, channel.id, "anticaps.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` is now removed out of the Whitelisted Channels of this System`)
                    .setColor(es.color)
                    .setDescription(`Every single Channel:\n> <#${client.settings.get(message.guild.id, "anticaps.whitelistedchannels").join(">\n> <#")}>\nis not checked by the System`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable17"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("you didn't ping a valid Channel")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable18"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
          case 5: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("How often should someone be allowed to do it within 15 Seconds?")
              .setColor(es.color)
              .setDescription(`Currently it is at: \`${client.settings.get(message.guild.id, "anticaps.mute_amount")}\`\n\nPlease just send the Number! (0 means after the first time he/she will get muted)`)
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message.content) {
                let number = message.content;
                if(isNaN(number)) return message.reply(":x: **Not a valid Number**");
                if(Number(number) < 0 || Number(number) > 15) return message.reply(":x: **The Number must be between `0` and `15`**");
                
                try {
                  client.settings.set(message.guild.id, Number(number), "anticaps.mute_amount");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Successfully set the New Maximum Allowed Amounts to " + number + " Times")
                    .setColor(es.color)
                    .setDescription(`**If someone does it over __${number} times__ he/she/they will get muted for 10 Minutes!**`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable17"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("You didn't add a valid message content")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable18"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
        }

      }

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable13"]))]
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
