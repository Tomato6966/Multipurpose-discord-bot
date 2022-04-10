var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, duration, dbEnsure
} = require(`../../handlers/functions`);
const ms = require("ms");
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-antiselfbot",
  category: "💪 Setup",
  aliases: ["setupantiselfbot", "antiselfbot-setup", "antiselfbotsetup", "setup-newaccount"],
  cooldown: 5,
  usage: "setup-antiselfbot  -->  Follow the Steps",
  description: "Setup a System which Blocks Self Bots",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try {
      await dbEnsure(client.settings, message.guild.id, {
        antiselfbot: {
            enabled: true,
            action: "mute", // mute, kick, ban
            mute_amount: 1
        },
      });


      const settings = await client.settings.get(message.guild.id+ ".antiselfbot")
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: !settings.enabled ? "Enable Anti Self Bot" : "Disable Anti Self Bot",
            description: !settings.enabled ? "Detect Self Bots and kick / Ban them" : "Don't Detect Self Bots",
            emoji: !settings.enabled ? "✅" : "❌",
          },
          {
            value: "Select the Action",
            description: `Select the right Action kick/ban`,
            emoji: "🔨"
          },
          {
            value: "Change Max-Action Amount",
            description: `Change the max allow Time to do it before action!`,
            emoji: "🕛"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Anti-Self-Bot`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Anti-Self-Bot-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Anti-Self-Bot') 
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
          .setAuthor('Anti-Self-Bot', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/hammer_1f528.png', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async (menu) => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
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
          case !settings.enabled ? "Enable Anti Self Bot" : "Disable Anti Self Bot":
          {
              await client.settings.set(message.guild.id+ `.antiselfbot.enabled`, !settings.enabled)
              let thesettings = await client.settings.get(message.guild.id+ `.antiselfbot`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`${thesettings ? `Enabled Self Bot Detection` : `Disabled Self Bot Detection`}`)
                .setColor(es.color)
                .setDescription(`${thesettings ? `I will now kick Self Bots!` : `I will now no longer kick Self Bots!`}`.substr(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
          }
          break;
          case "Show Settings":
            {
              let thesettings = await client.settings.get(message.guild.id+ `.antiselfbot`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Settings of the Self Bot Detection Setup`)
                .setColor(es.color)
                .setDescription(`**Enabled:**\n> ${thesettings.enabled ? "✅" : "❌"}\n\n**Action after X Times:**\n> ${thesettings.mute_amount}\n\n**Action:**\n> ${thesettings.action}`.substr(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
            }
          break;
        
          case "Select the Action": {
            let menuoptions = [
              {
                value: "Mute",
                description: `Mute Self Bots`,
                emoji: "🕛"
              },
              {
                value: "Kick",
                description: `Kick Self Bots`,
                emoji: "✅"
              },
              {
                value: "Ban",
                description: `Ban Self Bots`,
                emoji: "🔨"
              },
              {
                value: "Cancel",
                description: `Cancel and stop the Anti-Self-Bot-Setup!`,
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
              .setAuthor('Anti-Self-Bot', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/hammer_1f528.png', 'https://discord.gg/milrato')
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
            //send the menu msg
            let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({ 
              filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
              time: 90000
            })
            //Menu Collections
            collector.on('collect', async (menu) => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                client.disableComponentMessage(menu);                
                await client.settings.set(message.guild.id+`antiselfbot.action`, String(menu?.values[0]).toLowerCase())
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Successfully set the new Action to: ${menu?.values[0]}`)
                  .setColor(es.color)
                  .setDescription(`I will now ${menu?.values[0]} Self Bots, if they send a suspicious Self Bot Message!`.substr(0, 2048))
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
          case "Change Max-Action Amount": {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("How often should someone be allowed to do it within 15 Seconds?")
              .setColor(es.color)
              .setDescription(`Currently it is at: \`${await client.settings.get(message.guild.id+ ".antiselfbot.mute_amount")}\`\n\nPlease just send the Number! (0 means after the first time he/she will get muted)`)
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(async (collected) => {
              var message = collected.first();
              if (message.content) {
                let number = message.content;
                if(isNaN(number)) return message.reply(":x: **Not a valid Number**");
                if(Number(number) < 0 || Number(number) > 15) return message.reply(":x: **The Number must be between `0` and `15`**");
                
                try {
                  await client.settings.set(message.guild.id+ ".antiselfbot.mute_amount", Number(number));
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Successfully set the New Maximum Allowed Amounts to " + number + " Times")
                    .setColor(es.color)
                    .setDescription(`**If someone does it over __${number} times__ he/she/they will get punished**\nIf the Action is set to "MUTE" then the Mute-Duration will be for 10 Seconds`.substr(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antiselfbot"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antiselfbot"]["variable17"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("You didn't add a valid message content")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antiselfbot"]["variable18"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
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