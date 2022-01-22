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
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-antinewaccount",
  category: "💪 Setup",
  aliases: ["setupnewaccount", "newaccount-setup", "newaccountsetup", "setupantinewaccount", "antinewaccount-setup", "antinewaccountsetup", "setup-newaccount"],
  cooldown: 5,
  usage: "setup-antinewaccount  -->  Follow the Steps",
  description: "Setup a System which Blocks too new Accounts!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id, {
        antinewaccount: {
          enabled: false,
          delay: ms("2 days"),
          action: "kick", // kick / ban
          extra_message: "Please do not join back, unless you meet the requirements!"
        } 
      });


      const settings = client.settings.get(message.guild.id, "antinewaccount")
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: !settings.enabled ? "Enable Anti New Account" : "Disable Anti New Account",
            description: !settings.enabled ? "Detect New Accounts and kick / Ban them" : "Don't Detect New Accounts",
            emoji: !settings.enabled ? "✅" : "❌",
          },
          {
            value: "Set Extra Message",
            description: `Define an extra Message, sent to their DM`,
            emoji: "💬"
          },
          {
            value: "Select the Action",
            description: `Select the right Action kick/ban`,
            emoji: "🔨"
          },
          {
            value: "Set the Duration",
            description: `Define the Minimum Account Age`,
            emoji: "🕒"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Anti-New-Account`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Anti-New-Account-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Anti-New-Account') 
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
          .setAuthor('Anti-New-Account', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/hammer_1f528.png', 'https://discord.gg/milrato')
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
          case !settings.enabled ? "Enable Anti New Account" : "Disable Anti New Account":
          {
              client.settings.set(message.guild.id, !settings.enabled, `antinewaccount.enabled`)
              let thesettings = client.settings.get(message.guild.id, `antinewaccount`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`${thesettings ? `Enabled New Account Detection` : `Disabled New Account Detection`}`)
                .setColor(es.color)
                .setDescription(`${thesettings ? `I will now kick New Accounts if they were created before ${duration(thesettings.delay).map(i => `\`${i}\``).join(", ")} ago!` : `I will now no longer kick new Accounts!`}`.substr(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
          }
          break;
          case "Set Extra Message":
            {
              let extramessage = settings.extra_message;
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`What should be the new Extra Message?`)
                .setColor(es.color)
                .addField(`**Current Extra-Message:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No Extra Message provided"}`.substr(0, 1024))
                .setDescription(`Send it now!`).setFooter(client.getFooter(es))]
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
                    extramessage = message.content.slice(0, 1024);
                    client.settings.set(message.guild.id, extramessage, `antinewaccount.extra_message`)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`Defined the New Extra Message!`)
                      .setColor(es.color)
                      .addField(`**New Extra-Message:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No Extra Message provided"}`.substr(0, 1024))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else{
                    return message.reply("No Message Content Added");
                  }
                })
                .catch(e => {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Something went wrong`)
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
            }
          break;
          case "Show Settings":
            {
              let thesettings = client.settings.get(message.guild.id, `antinewaccount`)
              const extramessage = thesettings.extra_message;
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Settings of the New Account Detection Setup`)
                .setColor(es.color)
                .setDescription(`**Enabled:**\n> ${thesettings.enabled ? "✅" : "❌"}\n\n**Minimum Account Age:**\n> ${duration(thesettings.delay).map(i => `\`${i}\``).join(", ")}\n\n**Action:**\n> ${thesettings.action}`.substr(0, 2048))
                .addField(`**Current Extra-Message:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No Extra Message provided"}`.substr(0, 1024))
                .setFooter(client.getFooter(es))
              ]});
            }
          break;
        
          case "Select the Action": {
            let menuoptions = [
              {
                value: "Kick",
                description: `Kick new Members`,
                emoji: "✅"
              },
              {
                value: "Ban",
                description: `Ban new Members`,
                emoji: "🔨"
              },
              {
                value: "Cancel",
                description: `Cancel and stop the Anti-New-Account-Setup!`,
                emoji: "862306766338523166"
              }
            ]
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Click me to select the Action Type') 
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
              .setAuthor('Anti-New-Account', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/hammer_1f528.png', 'https://discord.gg/milrato')
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
                client.settings.set(message.guild.id, menu?.values[0], `antinewaccount.action`)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Successfully set the new Action to: ${menu?.values[0]}`)
                  .setColor(es.color)
                  .setDescription(`I will now ${menu?.values[0]} new Members, which Account are too young!`.substr(0, 2048))
                  .setFooter(client.getFooter(es))
                ]});
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
            });
          }break;
          case "Set the Duration": {
            let extramessage = settings.extra_message;
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`What should be the new Minimum Account Age?`)
                .setColor(es.color)
                .addField(`**Current Minimum Account Age:**`, `${duration(settings.delay).map(i => `\`${i}\``).join(", ")}`.substr(0, 1024))
                .setDescription(`Send it now!\nExample: \`2 Days\`, \`6 hours + 2 Days\``).setFooter(client.getFooter(es))]
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
                    let gargs = message.content.split("+");
                    let time = 0;
                    for(const a of gargs){
                      time += ms(a.split(" ").join(""))
                    }
                    if(!time || isNaN(time)) return message.reply("You added a not valid Time!");
                    
                    client.settings.set(message.guild.id, time, `antinewaccount.delay`)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`Defined the New Minimum Account Duration!`)
                      .setColor(es.color)
                      .addField(`**New Minimum Account Age:**`, `${duration(time).map(i => `\`${i}\``).join(", ")}`.substr(0, 1024))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else {
                    return message.reply("No Message Content and so no Time Added");
                  }
                })
                .catch(e => {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Something went wrong`)
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
          }
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
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