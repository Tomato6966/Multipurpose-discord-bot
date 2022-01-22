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
  name: "setup-ghost-ping-detector",
  category: "💪 Setup",
  aliases: ["setupghost-ping-detector", "ghost-ping-detector-setup", "ghost-ping-detectorsetup", "setup-ghost-ping", "setup-ghostping"],
  cooldown: 5,
  usage: "setup-ghost-ping-detector  -->  Follow Steps",
  description: "Enable/Disable the ghost-ping-detector / Ghost-Ping-Detector - Logger",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Enable Detector-Log",
            description: `Define the Ghost-Ping-Detector-Log Channel`,
            emoji: "✅"
          },
          {
            value: "Disable Detector-Log",
            description: `Disable the Ghost-Ping-Detector-Log`,
            emoji: "❌"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Ghost-Ping-Detector-Log`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Detector-Log-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Detector-Command-Log') 
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
          .setAuthor('Ghost-Ping-Detector Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/bookmark_1f516.png', 'https://discord.gg/milrato')
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
          case "Enable Detector-Log":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable5"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable6"]) + `\n\nIf you want to change the maxmimum Time, until a Ping is detected as a ghost ping, then do something like this: \`#channel 30\` ... send logs in #channel, detect ghost-pings of deletions in under 30 Seconds`)
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
                    try {
                      client.settings.set(message.guild.id, channel.id, "ghost_ping_detector");
                      let maxtime = message.content.split(">")[1];
                      let isnan = false;
                      if(maxtime && maxtime.length > 0){
                        maxtime = maxtime.trim();
                        if(isNaN(maxtime)){
                          isnan = true;
                          maxtime = 10000;
                        } else {
                          maxtime = Number(maxtime) * 1000;
                        }
                      } else {
                        maxtime = 10000;
                      }
                      client.settings.set(message.guild.id, maxtime, "ghost_ping_detector_max_time");
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`<a:yes:833101995723194437> I will now send all detected Ghost Pings in \`${channel.name}\``)
                        .setColor(es.color)
                        .setDescription(`${!isnan ? `And set the Ghost-Ping-Detected-Deletion Message Maximum Time to \`${maxtime / 1000} Seconds\``: "You added an invalid time, so i set the Ghost-Ping-Detection Maximum Time to `10 Seconds`"}`)
                        .setFooter(client.getFooter(es))]}
                      );
                    } catch (e) {
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable8"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable9"]))
                        .setFooter(client.getFooter(es))]}
                      );
                    }
                  } else {
                    return message.reply("you didn't ping a valid Channel")
                  }
                })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable7"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }
          break;
          case "Disable Detector-Log":
            {
              client.settings.set(message.guild.id, false, "ghost_ping_detector");
              client.settings.set(message.guild.id, 10000, "ghost_ping_detector_max_time");
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Successfully disabled the Ghost-Ping-Detector System & Log`)
                .setColor(es.color)
                .setFooter(client.getFooter(es))]}
              );
            }
          break;
          case "Show Settings":
            {
              let ghost_ping_detector = client.settings.get(message.guild.id, `ghost_ping_detector`)
              let ghost_ping_detector_max_time = client.settings.get(message.guild.id, `ghost_ping_detector_max_time`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Settings of the Ghost-Ping-Detector-Log")
                .setColor(es.color)
                .setDescription(`**Channel:** ${ghost_ping_detector == false ? "Not Setupped" : `<#${ghost_ping_detector}> | \`${ghost_ping_detector}\``}\n\n**Max-Time-For-Detection:** \`${Math.floor(ghost_ping_detector_max_time / 1000)} Seconds\``.substr(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
            }
          break;
        }
      }
      
  
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable15"]))]}
      );
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
