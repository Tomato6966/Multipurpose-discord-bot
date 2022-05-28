var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, dbRemove
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-warn",
  category: "💪 Setup",
  aliases: ["setupwarn", "warn-setup", "warnsetup", "warnsystem"],
  cooldown: 5,
  usage: "setup-warn --> Follow Steps",
  description: "Adjust the Settings for the warn system, like add a Role per specific warn amount or ban/kick on a specific amount of warn",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

    let warnsettings = GuildSettings.warnsettings
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Kick Amount",
            description: `${warnsettings.kick ? `A User will be kicked if he has ${warnsettings.kick} Warns,change it` : `Define a amount some1 need to have to get kicked`}`,
            emoji: "🔨"
          },
          {
            value: "Ban Amount",
            description: `${warnsettings.kick ? `A User will be banned if he has ${warnsettings.ban} Warns,change it` : `Define a amount some1 need to have to get kicked`}`,
            emoji: "📤"
          },
          {
            value: "Add Role on Warn",
            description: `Define a Role to give, if he has X Warns`,
            emoji: "📌"
          },
          {
            value: "Remove Role on Warn",
            description: `Remove a X Warn Defined Role`,
            emoji: "💢"
          },
          {
            value: "Show Settings",
            description: `Show the Current Settings`,
            emoji: "📑"
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
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Warn System!') 
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
          .setAuthor(client.getAuthor('Warn Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab.png', 'https://discord.gg/milrato'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable3"]))
            client.disableComponentMessage(menu);
            used1 = true;
            handle_the_picks(menuoptionindex, menuoptiondata)
          }
          else menu?.reply({content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected && collected.first().values[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }

      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch (menuoptionindex) {
          case 0:  
              var msg6 = new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable4"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable5"]))
                .setFooter(client.getFooter(es))
                .setColor(es.color)
              message.reply({embeds: [msg6]}).then(async (msg) => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(async collected => {
                  amount = collected.first().content;
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable6"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(amount.toLowerCase() == "no"){
                    await client.settings.set(message.guild.id+".warnsettings.kick", false)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable7"]))
                      .setColor(es.wrongcolor)
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  if(isNaN(amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable8"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable9"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  await client.settings.set(message.guild.id+".warnsettings.kick", amount)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable10"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                }).catch(error => {
                  console.log(error)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
              })
            break;
          case 1:
              var msg7 = new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable12"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable13"]))
                .setFooter(client.getFooter(es))
                .setColor(es.color)
              message.reply({embeds: [msg7]}).then(async (msg) => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(async collected => {
                  amount = collected.first().content;
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable14"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(amount.toLowerCase() == "no"){
                    await client.settings.set(message.guild.id+".warnsettings.ban", false)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable15"]))
                      .setColor(es.wrongcolor)
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  if(isNaN(amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable16"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable17"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  await client.settings.set(message.guild.id+".warnsettings.ban", amount)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable18"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                }).catch(error => {
                  console.log(error)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable19"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
              })
            break;
          case 2:
              var msg8 = new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable20"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable21"]))
                .setFooter(client.getFooter(es))
                .setColor(es.color)
              message.reply({embeds: [msg8]}).then(async (msg) => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(async collected => {
                  let colargs = collected.first().content?.trim().split(" ")
                  let amount = colargs[0]
                  let role = collected.first().mentions.roles.filter(r=>r.guild.id == message.guild.id).first();
                  if(!role || !role.id)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable22"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable23"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(isNaN(amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable24"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable25"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});

                  if(warnsettings.roles.some(r => r?.warncount == amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable26"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You can't add 2 Roles at the Same time`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  await client.settings.push(message.guild.id+".warnsettings.roles", { warncount: Number(amount), roleid: role.id })
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable27"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                }).catch(error => {
                  console.log(error)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable28"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
              })
          break;
          case 3:
              var msg8 = new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable29"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable30"]))
                .setFooter(client.getFooter(es))
                .setColor(es.color)
              message.reply({embeds: [msg8]}).then(async (msg) => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(async collected => {
                  let colargs = collected.first().content?.trim().split(" ")
                  let amount = colargs[0]
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable31"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(isNaN(amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable32"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable33"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});

                  if(!warnsettings.roles.some(r => r?.warncount == amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable34"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You can't remove a Setting which does not exist`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  let yeee = warnsettings.roles.filter(r => r?.warncount == amount)[0]
                  await client.settings.remove(message.guild.id+".warnsettings.roles", v => v?.warncount == yeee.warncount)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable35"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                }).catch(error => {
                  console.log(error)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable36"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
              })
            break;
          case 4:
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable37"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable38"]))
              message.reply({embeds: [rembed]}).catch(error => {
                console.log(error)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable39"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
            break;
          default:
            message.reply(String("SORRY, that Number does not exists :(\n Your Input:\n> " + collected.first().content).substring(0, 1999))
          break;
        }
      }
     
     
  

    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable40"]))
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
