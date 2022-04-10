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
  name: "setup-mute",
  category: "💪 Setup",
  aliases: ["setupmute", "mute-setup", "mutesetup"],
  cooldown: 5,
  usage: "setup-mute  -->  Follow the Steps",
  description: "Setup the Mute system Role/Timeout and the defaulttime if no time added",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try {


      /*
        mute: {
          style: "timeout",
          roleId: "",
          defaultTime: 60000,  
        },
      */
      const menusettings = await client.settings.get(message.guild.id+".mute");
      first_layer()
      async function first_layer(){
        await dbEnsure(client.settings, message.guild.id, {
          style: "timeout",
          roleId: "",
          defaultTime: 60000, // in ms  
        })
        let menuoptions = [
          {
            value: "Toggle Style",
            description: `Toggle the style from ${menusettings.style} to ${menusettings.style === "timeout" ? "role" : "timeout"}`,
            emoji: "✅"
          },
          {
            value: "Set Mute-Role",
            description: `Define the Mute-Role`,
            emoji: "895066900105674822"
          },
          {
            value: "Set Defaulttime",
            description: `Change the default mute time`,
            emoji: "⏲️"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Mute System`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Mute System-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Mute System') 
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
          .setAuthor('Mute System', 'https://cdn.discordapp.com/emojis/771804364582420532.gif?size=96', 'https://discord.gg/milrato')
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
          case "Toggle Style": {
            const newStyle = menusettings.style == "timeout" ? "role" : "timeout";
            await client.settings.set(message.guild.id+".mute.style", newStyle);
            return message.reply(`Successfully changed the Style from ${menusettings.style} to ${newStyle}`);
          }break;
          case "Set Mute-Role": {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Which Role should I add when someone gets muted and the mute style == \"role\"")
              .setColor(es.color)
              .setDescription("Ping the Role now, or send the id of it!").setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO MESSAGE SENT");
                let role = message.mentions.roles.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.roles.cache.get(message.content.trim().split(" ")[0]);
                if(role){
                  await client.settings.set(message.guild.id+`.mute.roleId`, role.id)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Set the MUTE ROLE")
                    .setColor(es.color)
                    .setDescription(`I will now use the Role <@&${role.id}> if the mute style is set the "role"`.substring(0, 2048))
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
          }break;
          case "Set Defaulttime":
            {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("What should be the new default mute time, when no time is added?")
              .setColor(es.color)
              .setDescription("Recommneded is: `10min`, but you can send anything you want, as long as it's less than `1Week`!\nTo send multiple do this: `1hour+5min`").setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO MESSAGE SENT");
                const ms = require("ms");

                let time = 0;
                if(message.includes("+")) {
                  for await (const m of message.split("+")){
                    try {
                      time+= ms(m)
                    }catch{
                      time = null;
                    }
                  }
                } else {
                  try {
                    time = ms(message)
                  }catch{
                    time = null;
                  }
                }
                if(!time || time < 0 || time > ms("1 Week")) {
                  return message.reply("Invalid time added! Must be more than 0 and less than 1 week")
                }
                await client.settings.set(message.guild.id+`.mute.defaultTime`, time)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Set the new DEFAULT MUTE TIME")
                  .setColor(es.color)
                  .setDescription(`When someone get's muted and no time get's added this will be used!`.substring(0, 2048))
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
        }
      }


      

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
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