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
  name: "setup-warn",
  category: "💪 Setup",
  aliases: ["setupwarn", "warn-setup", "warnsetup", "warnsystem"],
  cooldown: 5,
  usage: "setup-warn --> Follow Steps",
  description: "Adjust the Settings for the warn system, like add a Role per specific warn amount or ban/kick on a specific amount of warn",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    let warnsettings = client.settings.get(message.guild.id, "warnsettings")
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
              label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
              value: option.value.substr(0, 50),
              description: option.description.substr(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Warn Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab?.png', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable3"]))
          menu?.deferUpdate();
          used1 = true;
          handle_the_picks(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('interactionCreate',  (menu) => {
          if (menu?.message.id === menumsg.id) {
            if (menu?.user.id === cmduser.id) {
              if(used1) return menu?.reply({content: `<:no:833101993668771842> You already selected something, this Selection is now disabled!`, ephemeral: true})
              menuselection(menu);
            }
            else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
          }
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
              message.reply({embeds: [msg6]}).then(msg => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(collected => {
                  amount = collected.first().content;
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable6"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(amount.toLowerCase() == "no"){
                    client.settings.set(message.guild.id, false, "warnsettings.kick")
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
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable9"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  client.settings.set(message.guild.id, amount, "warnsettings.kick")
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
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
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
              message.reply({embeds: [msg7]}).then(msg => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(collected => {
                  amount = collected.first().content;
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable14"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(amount.toLowerCase() == "no"){
                  client.settings.set(message.guild.id, false, "warnsettings.ban")
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
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable17"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  client.settings.set(message.guild.id, amount, "warnsettings.ban")
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
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
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
              message.reply({embeds: [msg8]}).then(msg => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(collected => {
                  let colargs = collected.first().content?.trim().split(" ")
                  let amount = colargs[0]
                  let role = collected.first().mentions.roles.filter(r=>r.guild.id == message.guild.id).first();
                  if(!role || !role.id)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable22"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable23"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(isNaN(amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable24"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable25"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});

                  if(warnsettings.roles.some(r => r?.warncount == amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable26"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You can't add 2 Roles at the Same time`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  client.settings.push(message.guild.id, { warncount: Number(amount), roleid: role.id }, "warnsettings.roles")
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
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
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
              message.reply({embeds: [msg8]}).then(msg => {
                msg.channel.awaitMessages({filter: m => m.author.id == cmduser,
                  max: 1,
                  time: 180000,
                  errors: ['time'],
                }).then(collected => {
                  let colargs = collected.first().content?.trim().split(" ")
                  let amount = colargs[0]
                  if(!amount)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable31"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(isNaN(amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable32"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  if(Number(amount) <= 0)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable33"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You entered: \`${amount}\``.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});

                  if(!warnsettings.roles.some(r => r?.warncount == amount))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable34"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`You can't remove a Setting which does not exist`.substr(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  let yeee = warnsettings.roles.filter(r => r?.warncount == amount)[0]
                  client.settings.remove(message.guild.id, v => v?.warncount == yeee.warncount , "warnsettings.roles")
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
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
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
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
            break;
          default:
            message.reply(String("SORRY, that Number does not exists :(\n Your Input:\n> " + collected.first().content).substr(0, 1999))
          break;
        }
      }
     
     
  

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
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
