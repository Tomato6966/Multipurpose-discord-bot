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
  name: "setup-antiscamlinks",
  category: "💪 Setup",
  aliases: ["setupantiscamlinks", "antiscamlinkss-setup", "antiscamlinks-setup", "antiscamlinkssetup", "setup-antiscamlinkss"],
  cooldown: 5,
  usage: "setup-antiscamlinks  -->  Follow the Steps",
  description: "Enable/Disable anti Link system",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      let tempmsg;
      if (!GuildSettings.antidiscordscam) {
        await dbEnsure(client.settings, message.guild.id, {
            antidiscordscam: {
                enabled: true,
                action: "kick", // "mute" / "ban"
            },
        });
        
      }; 
      GuildSettings.antidiscordscam = await client.settings.get(`${message.guild.id}.antidiscordscam`);
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `${GuildSettings?.antidiscordscam?.enabled ? "Disable" : "Enable"} Anti Scam Links`,
            description: `${GuildSettings?.antidiscordscam?.enabled ? "Don't delete other Scam Links" : "Delete other Scam Links"}`,
            emoji: `${GuildSettings?.antidiscordscam?.enabled ? "833101993668771842" : "833101995723194437"}`
          },
          {
            value: "Settings",
            description: `Show the current Settings of the Anti-Link System`,
            emoji: "📑"
          },
          {
            value: "Choose Action",
            description: `Change the Action from ${GuildSettings?.antidiscordscam?.action || "kick"} to ban/timeout/kick`,
            emoji: "💯"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ticket-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Click me to setup the Anti-Scam-Links System!').setCustomId('MenuSelection') 
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
          .setAuthor(client.getAuthor("Anti-Scam-Links System Setup", 
          "https://cdn.discordapp.com/emojis/858405056238714930.gif?v=1",
          "https://discord.gg/milrato"))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable1"]))
        let used1 = false;
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
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable2"])})
            client.disableComponentMessage(menu); used1 = true;
            handle_the_picks(menuoptionindex, menuoptiondata)
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
            const predata = await client.settings.get(`${message.guild.id}.antidiscordscam.enabled`) || false;
            await client.settings.set(`${message.guild.id}.antidiscordscam.enabled`, !predata)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`${!predata ? `Successfully enabled the AntiDiscordScam Link System` : `Successfully disabled the AntiDiscordScam Link System`}`)
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]});
          }break
          case 1: {
           let thesettings = await client.settings.get(`${message.guild.id}.antidiscordscam`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`Settings of the AntiDiscordScam Link System`)
              .setColor(es.color)
              .setDescription(`**Enabled:** ${thesettings.enabled ? "<a:yes:833101995723194437>" : "<:no:833101993668771842>"}`.substring(0, 2048))
              .addField("**Action**", `\`\`\`${thesettings.action}\`\`\``)
              .setFooter(client.getFooter(es))
            ]});
          }break
          case 2: {
            let menuoptions = [
              {
                value: `Kick`,
                description: `Kick Users who sent a Scam Link`,
              },
              {
                value: `Ban`,
                description: `Ban Users who sent a Scam Link`,
              },
              {
                value: `Timeout`,
                description: `Timeout Users who sent a Scam Link`,
              },
              {
                value: "Cancel",
                description: `Cancel and stop the Ticket-Setup!`,
                emoji: "862306766338523166"
              }
            ]
            let Selection = new MessageSelectMenu()
              .setPlaceholder('Click me to setup the Anti-Scam-Links System!').setCustomId('MenuSelection') 
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
              .setAuthor(client.getAuthor("Anti-Scam-Links System Setup", 
              "https://cdn.discordapp.com/emojis/858405056238714930.gif?v=1",
              "https://discord.gg/milrato"))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable1"]))
            let used1 = false;
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
                let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
                if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable2"])})
                client.disableComponentMessage(menu); used1 = true;
                let action = menu?.values[0].toLowerCase() 
                if(action == "timeout") action = "mute";
                await client.settings.set(`${message.guild.id}.antidiscordscam.action`, action);
                await message.reply(`I will now ${menu.values[0]} Members when they send scam link(s).`)
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
            });
          } break;
        }
      }

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////s
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable19"]))]}
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
