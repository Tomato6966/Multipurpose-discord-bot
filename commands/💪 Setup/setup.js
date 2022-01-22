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
  name: "setup",
  category: "💪 Setup",
  aliases: [""],
  cooldown: 5,
  usage: "setup  -->  Follow the Steps",
  description: "Shows all setup commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language");
    try {
      first_layer()
        async function first_layer(){
          let menuoptions = [
            {
              value: "setup-admin",
              description: `Setup Roles/Users for all/specific Admin Cmds`,
              emoji: "🔨"
            },
            {
              value: "setup-admincmdlog",
              description: `Setup a Logger for Admin Commands to a Channel`,
              emoji: "📑"
            },
            {
              value: "setup-aichat",
              description: `Setup a fun AI-Chat System to chat with me`,
              emoji: "💬"
            },
            {
              value: "setup-anticaps",
              description: `Setup a Anit-CAPS System to prevent CAPS-only msgs`,
              emoji: "🅰️"
            },
            {
              value: "setup-antidiscord",
              description: `Setup a Anit-DISCORD System to prevent DC-LINKS`,
              emoji: "787321652345438228"
            },
            {
              value: "setup-antilink",
              description: `Setup a Anit-LINK System to prevent LINKS`,
              emoji: "🔗"
            },
            {
              value: "setup-antinuke",
              description: `Setup a Anit-NUKE System to prevent NUKES`,
              emoji: "866089515993792522"
            },
            {
              value: "setup-apply",
              description: `Setup up to 25 different Apply Systems`,
              emoji: "📋"
            },
            {
              value: "setup-autodelete",
              description: `Setup auto deletion Channels`,
              emoji: "🗑️"
            },
            {
              value: "setup-autoembed",
              description: `Define Channel(s) to replace messages with EMBEDS`,
              emoji: "📰"
            },
            {
              value: "setup-automeme",
              description: `Define a Channel to post MEMES every Minute`,
              emoji: "862749865460498524"
            },
            {
              value: "setup-autonsfw",
              description: `Define a Channel to post NSFW every Minute`,
              emoji: "🔞"
            },
            {
              value: "setup-blacklist",
              description: `Manage the Word(s)-Blacklist`,
              emoji: "🔠"
            },
            {
              value: "setup-commands",
              description: `Enable/Disable specific Commands`,
              emoji: "⚙️"
            },
            {
              value: "setup-counter",
              description: `Setup a fun Number-Counter Channel`,
              emoji: "#️⃣"
            },
            {
              value: "setup-customcommand",
              description: `Setup up to 25 different Custom-Commands`,
              emoji: "⌨️"
            },
            {
              value: "setup-dailyfact",
              description: `Setup a Channel to post daily Facts`,
              emoji: "🗓"
            },
            {
              value: "setup-embed",
              description: `Setup the Look of the Embeded Messages`,
              emoji: "📕"
            },
            {
              value: "setup-jtc",
              description: `Setup the Join-To-Create Channel(s)`,
              emoji: "🔈"
            },
            {
              value: "setup-keyword",
              description: `Setup up to 25 different Keyword-Messages`,
              emoji: "📖"
            },
            {
              value: "setup-language",
              description: `Manage the Bot's Language`,
              emoji: "🇬🇧"
            },
            {
              value: "setup-leave",
              description: `Manage the Leave Messages`,
              emoji: "📤"
            },
            {
              value: "setup-logger",
              description: `Setup the Audit-Log`,
              emoji: "🛠"
            },
            {
              value: "setup-membercount",
              description: `Setup up to 25 different Member-Counters`,
              emoji: "📈"
            },
            {
              value: "setup-radio",
              description: `Setup the Radio/Waitingroom System`,
              emoji: "📻"
            },
            {
              value: "setup-rank",
              description: `Setup the Ranking System`,
              emoji: "📊"
            },
            {
              value: "setup-reactionrole",
              description: `Setup Infinite Reaction Roles`,
              emoji: "📌"
            },
            {
              value: "setup-reportlog",
              description: `Setup the Report System & Channel`,
              emoji: "🗃"
            },
            {
              value: "setup-roster",
              description: `Setup the Roster System`,
              emoji: "📜"
            },
            {
              value: "setup-serverstats",
              description: `Setup up to 25 different Member-Counters`,
              emoji: "📈"
            },
            {
              value: "setup-suggestion",
              description: `Setup the Suggestion System`,
              emoji: "💡"
            },
            {
              value: "setup-ticket",
              description: `Setup up to 25 different Ticket-Systems`,
              emoji: "📨"
            },
            {
              value: "setup-tiktok",
              description: `Setup up to 3 different TikTok Logger Channels`,
              emoji: "840503976315060225"
            },
            {
              value: "setup-twitch",
              description: `Setup up to 5 different Twitch Logger Channels`,
              emoji: "840260133753061408"
            },
            {
              value: "setup-twitter",
              description: `Setup up to 2 different Twitter Logger Channels`,
              emoji: "840255600851812393"
            },
            {
              value: "setup-validcode",
              description: `Setup the Valid-Code System`,
              emoji: "858405056238714930"
            },
            {
              value: "setup-warn",
              description: `Setup the Warn System Settings`,
              emoji: "🚫"
            },
            {
              value: "setup-welcome",
              description: `Setup the Welcome System/Messages`,
              emoji: "📥"
            },
            {
              value: "setup-youtube",
              description: `Setup up to 5 different Youtube Logger Channels`,
              emoji: "🚫"
            },
          ]
          let Selection1 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (1/3) Systems [A-C]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index < Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
              if(option.emoji) Obj.emoji = option.emoji;
              return Obj;
              }
           }).filter(Boolean))
          let Selection2 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (2/3) Systems [C-R]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= Math.ceil(menuoptions.length/3) && index < 2*Math.ceil(menuoptions.length/3)){
                let Obj = {
                  label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                  value: option.value.substr(0, 50),
                  description: option.description.substr(0, 50),
                }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
              }
           }).filter(Boolean))
          let Selection3 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (3/3) Systems [R-Z]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= 2*Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
              }
           }).filter(Boolean))
          //define the embed
          let MenuEmbed1 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (1/3) [A-C]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://discord.gg/milrato")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable1"]))
          let MenuEmbed2 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (2/3) [C-R]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://discord.gg/milrato")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable2"]))
          let MenuEmbed3 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (3/3) [R-Z]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://discord.gg/milrato")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable3"]))
          //send the menu msg
          let menumsg1 = await message.reply({embeds: [MenuEmbed1], components: [new MessageActionRow().addComponents(Selection1)]})
          let menumsg2 = await message.reply({embeds: [MenuEmbed2], components: [new MessageActionRow().addComponents(Selection2)]})
          let menumsg3 = await message.reply({embeds: [MenuEmbed3], components: [new MessageActionRow().addComponents(Selection3)]})
          //function to handle the menuselection
          function menuselection(menu) {
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            menu?.deferUpdate();
            handle_the_picks(menuoptionindex, menuoptiondata)
          }
          //Event
          client.on('interactionCreate',  (menu) => {
            if (menu?.message.id === menumsg1.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg1.edit({components: [], embeds: menumsg1.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg2.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg2.edit({components: [], embeds: menumsg2.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg3.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg3.edit({components: [], embeds: menumsg3.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
          });
        }

        async function handle_the_picks(menuoptionindex, menuoptiondata) {
          require(`./${menuoptiondata.value.toLowerCase()}`).run(client, message, args, cmduser, text, prefix);
        }
      } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable10"]))
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
