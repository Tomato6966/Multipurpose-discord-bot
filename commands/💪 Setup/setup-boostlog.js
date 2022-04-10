var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-boostlog",
  category: "💪 Setup",
  aliases: ["setupboostlog", "boostlogsetup"],
  cooldown: 5,
  usage: "setup-boostlog <#Channel/disable>",
  description: "Log the Server Boosts",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      await dbEnsure(client.settings, message.guild.id, {
        boost: {
          enabled: false,
          message: "",
          log: false,
          stopBoost: "<a:Server_Boosts:867777823468027924> {member} **stopped Boosting us..** <:Cat_Sad:867722685949804565>",
          startBoost: "<a:Server_Boosts:867777823468027924> {member} **has boosted us!** <a:Light_Saber_Dancce:867721861462229013>",
          againBoost: "<a:Server_Boosts:867777823468027924> {member} **has boosted us again!** <:Tada_WON:867724032207224833>",
        }
      })

      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Enable Boost-Log",
            description: `Enable Boost-Log and define the Channel`,
            emoji: "✅"
          },
          {
            value: "Disable Boost-Log",
            description: `Disable the Boost-Log`,
            emoji: "❌"
          },
          {
            value: "Start Boost Message",
            description: `Define the Started Boosting Message`,
            emoji: "867777823468027924"
          },
          {
            value: "Stop Boost Message",
            description: `Define the Stopped Boosting Message`,
            emoji: "867777823468027924"
          },
          {
            value: "Again Boost Message",
            description: `Define the Again Boosting Message`,
            emoji: "867777823468027924"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ai-Chat-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Boost-Log') 
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
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Boost-Log', 'https://cdn.discordapp.com/emojis/833402717950836806.gif?size=128&quality=lossless', 'https://discord.gg/milrato'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
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
          case "Enable Boost-Log":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable6"])).setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO MESSAGE SENT");
                let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if(channel){
                  await client.settings.set(message.guild.id+".boost.log", channel.id)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Enabled the Boost Log!")
                    .setColor(es.color)
                    .setDescription(`When someone starts/stops boosting i will send a log information in: <#${channel.id}>`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }
                else{
                  return message.reply( "NO CHANNEL PINGED");
                }
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }
          break;
          case "Start Boost Message":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("What should be the message when, someone starts Boosting?")
                .setColor(es.color)
                .setDescription(`\`{member}\` will be replaced with a ping of the boosting member!\n**Current Message:**\n> ${client.settings.get(message.guild.id, "boost.startBoost")}`.substring(0, 2048)).setFooter(client.getFooter(es))]
              })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO MESSAGE SENT");
                await client.settings.set(message.guild.id+".boost.startBoost", message)
                const log = await client.settings.get(message.guild.id+".boost.log");
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Changed the Start Boosting Log Message!")
                  .setColor(es.color)
                  .setDescription(`${log ? `When someone starts boosting i will send it in: <#${log}>`: `When someone starts boosting i will send it, as soon as you enabled this log!`}`.substring(0, 2048))
                  .setFooter(client.getFooter(es))
                ]});
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }
          break;
          case "Stop Boost Message":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("What should be the message when, someone stops Boosting?")
                .setColor(es.color)
                .setDescription(`\`{member}\` will be replaced with a ping of the boosting member!\n**Current Message:**\n> ${client.settings.get(message.guild.id, "boost.stopBoost")}`.substring(0, 2048)).setFooter(client.getFooter(es))]
              })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO MESSAGE SENT");
                await client.settings.set(message.guild.id+".boost.stopBoost", message)
                const log = await client.settings.get(message.guild.id+".boost.log");
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Changed the Stop Boosting Log Message!")
                  .setColor(es.color)
                  .setDescription(`${log ? `When someone stops boosting i will send it in: <#${log}>`: `When someone stops boosting i will send it, as soon as you enabled this log!`}`.substring(0, 2048))
                  .setFooter(client.getFooter(es))
                ]});
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }
          break;
          case "Again Boost Message":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("What should be the message when, someone boosts again?")
                .setColor(es.color)
                .setDescription(`\`{member}\` will be replaced with a ping of the boosting member!\n**Current Message:**\n> ${client.settings.get(message.guild.id, "boost.againBoost")}`.substring(0, 2048)).setFooter(client.getFooter(es))]
              })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO MESSAGE SENT");
                await client.settings.set(message.guild.id+".boost.againBoost", message)
                const log = await client.settings.get(message.guild.id+".boost.log");
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Changed the Again Boosting Log Message!")
                  .setColor(es.color)
                  .setDescription(`${log ? `When someone boosts again i will send it in: <#${log}>`: `When someone boosts again i will send it, as soon as you enabled this log!`}`.substring(0, 2048))
                  .setFooter(client.getFooter(es))
                ]});
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }
          break;
          case "Disable Boost-Log":
            {
              await client.settings.set(message.guild.id+".boost.log", false)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Disabled the Boost Log!")
                .setColor(es.color)
                .setDescription(`I will no longer Show the Boost Log`.substring(0, 2048))
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
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
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