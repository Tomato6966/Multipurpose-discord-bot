var {
  MessageEmbed,
  MessageButton, 
  MessageActionRow, 
  MessageMenuOption, 
  MessageSelectMenu,
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-advertise",
  category: "👑 advertise",
  aliases: ["setup-advert", "setupadvertise", "setupadvert"],
  cooldown: 5,
  usage: "setup-advertise  -->  Follow the Steps",
  type: "bot",
  description: "Changes if the Advertisement of BERO-HOST.de Should be there or NOT",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable2"]))
      ]});
    try {
      

      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: `${client.ad.enabled? "Disable" : "Enable"} Advertisement`,
            description: `${client.ad.enabled? "Disables the Ads from Bero-Host and Milrato" : "Enables the Ads from Bero-Host and Milrato"}`,
            emoji: client.ad.enabled? emoji?.react.ERROR : emoji?.react.SUCCESS
          },
          {
            value: "Settings",
            description: `Show the current Settings`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Advertisement Setup!`,
            emoji: "833101993668771842"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Advertising System!')
          .addOptions(menuoptions.map(option => {
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
        .setAuthor('Advertising Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab?.png',  'https://discord.gg/milrato')
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable4"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.channel.send({embeds : [MenuEmbed], components: [new MessageActionRow().addComponents([Selection])]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable5"]))
          menu?.deferUpdate();
          used1 = true;
          handle_the_picks(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('interactionCreate',  (menu) => {
          if (menu?.message.id === menumsg.id) {
            if (menu?.user.id === cmduser.id) {
              if(used1) return menu?.reply({content : `<:no:833101993668771842> You already selected something, this Selection is now disabled!`}, {ephermal : true});
              menuselection(menu);
            }
            else menu?.reply({content : `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`}, {ephermal : true});
          }
        });
      }

      const d2p = (bool) => bool ? "`✔️ Enabled`" : "`❌ Disabled`"; 
      const d2p2 = (bool) => bool ? "`✔️ Yes`" : "`❌ Nope`"; 

      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch (menuoptionindex) {
          case 0:
            {
              let advertisement = require("../../botconfig/advertisement.json");
            advertisement.adenabled = !advertisement.adenabled;
            fs.writeFile(`./botconfig/advertisement.json`, JSON.stringify(advertisement, null, 3), (e) => {
              if (e) {
                console.log(e.stack ? String(e.stack).dim : String(e).dim);
                return message.channel.send({embedq: [new MessageEmbed()
                  .setFooter(client.getFooter(es))
                  .setColor(es.wrongcolor)
                  .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable6"]))
                  .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable7"]))
                ]})
              }
            let advertisement = require("../../botconfig/advertisement.json");
            client.ad.enabled = advertisement.adenabled;
            client.ad.statusad = advertisement.statusad
            client.ad.spacedot = advertisement.spacedot;
            client.ad.textad = advertisement.textad;
            return message.channel.send({embeds: [new MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable8"]))
            ]})
          });
            }
            break;
          case 1: {
            var embed = new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable9"]))
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setDescription(`**Enabled:** ${d2p2(client.ad.enabled)}\n**Statusad:** \`${client.ad.statusad.name}\`\n**Textad:** \`${client.ad.textad}\`\n**Space Dot:** \`${client.ad.spacedot}\``.substr(0, 2048))
            .setFooter(client.getFooter(es))
  
          return message.channel.send({embeds: [embed]});
          } break;
          default:
            break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable10"]))
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