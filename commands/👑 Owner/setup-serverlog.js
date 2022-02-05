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
    name: "setup-serverlog",
    category: "👑 Owner",
    //aliases: ["setup-advert", "setupadvertise", "setupadvert"],
    cooldown: 5,
    usage: "setup-serverlog  -->  Follow the Steps",
    type: "bot",
    description: "Changes if the Server joins and leaves should be sent to the owners",
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
              value: `${!client.settings.get(guild.id,"showjoinandleave") ? "Enable" : "Disable"} Server Logs`,
              description: `${!client.settings.get(guild.id,"showjoinandleave") ? "Enables the DM Server Log System" : "Disables the DM Server Log System"}`,
              emoji: !client.settings.get(guild.id,"showjoinandleave") ? emoji?.react.SUCCESS : emoji?.react.ERROR
            },
            {
              value: "Settings",
              description: `Show the current Settings`,
              emoji: "📑"
            },
            {
              value: "Cancel",
              description: `Cancel and stop the Server Log Setup!`,
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
          .setAuthor('Server Log Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/282/clipboard_1f4cb.png',  'https://discord.gg/milrato')
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
            //     let advertisement = require("../../botconfig/advertisement.json");
            //   advertisement.adenabled = !advertisement.adenabled;
            let val = client.settings.get(message.guild.id,"showjoinandleave");
            client.settings.set(message.guild.id,!val,"showjoinandleave");
             
              return message.channel.send({embeds: [new MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor(es.color)
                .setTitle(`${emoji.msg.SUCCESS} The Server Log System is now ${d2p(client.settings.get(guild.id,"showjoinandleave"))}`)
              ]})
              }
              break;
            case 1: {
              var embed = new MessageEmbed()
              .setTitle("📑 Settings of the Server Log System`")
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setDescription(`**Enabled:** ${d2p2(client.settings.get(guild.id,"showjoinandleave"))}`.substring(0, 2048))
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