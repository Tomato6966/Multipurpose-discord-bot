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
  name: "setup-epicgamesverify",
  category: "💪 Setup",
  aliases: ["setupepicgamesverify", "epicgamesverify-setup", "epicgamesverifysetup"],
  cooldown: 5,
  usage: "setup-epicgamesverify  -->  Follow the Steps",
  description: "Setup an Epic Games Verification System for your Server to Host events and play better together!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Enable Verification",
            description: `Define the Channel for the Verification Process`,
            emoji: "✅"
          },
          {
            value: "Enable Log",
            description: `Define the Command Log Channel`,
            emoji: "✅"
          },
          {
            value: "Disable Log",
            description: `Disable the Action Log`,
            emoji: "❌"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Epic Games Verify') 
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
          .setAuthor('Epic Games Verify Setup', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/882px-Epic_Games_logo.svg.png', 'https://discord.gg/milrato')
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
        client.epicgamesDB.ensure(message.guild.id, { 
            logChannel: "",
            verifychannel: "",
        });
        switch (optionhandletype) {
          case "Enable Verification":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable4"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable5"])).setFooter(client.getFooter(es))
            ]})
            var thecmd;
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(async collected => {
              var message = collected.first();
              if(!message) return message.reply( "NO MESSAGE SENT");
              if(message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first()){
                var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first();
                
                channel.send({
                  embeds: [
                    new MessageEmbed().setColor(es.color).setFooter(message.guild.name + " | Powered by: discord.gg/milrato", message.guild.iconURL({dynamic: true})).setThumbnail(es.thumb ? message.guild.iconURL({dynamic: true}) : null)
                    .setTitle(`Click the Button to Verify and Link your Epic Games Account`)
                    .setDescription(`If you click the Button you can verify your Epic Games account to this Server!\nYou can click it again to change your Account details!`)
                  ],
                  components: [
                    new MessageActionRow().addComponents([
                      new MessageButton().setCustomId("epicgamesverify").setStyle("PRIMARY").setLabel("Verify").setEmoji("✋")
                    ])
                  ]
                });

                client.epicgamesDB.set(message.guild.id, channel.id, `verifychannel`)
                
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Enabled the Verification System!")
                  .setColor(es.color)
                  .setDescription(`People can now verify their Epic Games Account in <#${channel.id}>\n> If wished, you can edit the Embed in there by running the \`${prefix}editembed\` Command!`.substr(0, 2048))
                  .setFooter(client.getFooter(es))]
                });
              }
              else{
                return message.reply( "NO CHANNEL PINGED");
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable7"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }
          break;case "Enable Log":
          {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable4"]))
            .setColor(es.color)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable5"])).setFooter(client.getFooter(es))
          ]})
          var thecmd;
          await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
              max: 1,
              time: 90000,
              errors: ["time"]
          })
          .then(async collected => {
            var message = collected.first();
            if(!message) return message.reply( "NO MESSAGE SENT");
            if(message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first()){
              client.epicgamesDB.set(message.guild.id, message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().id, `logChannel`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Enabled the Log")
                .setColor(es.color)
                .setDescription(`I will now log all Actions in <#${message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().id}>`.substr(0, 2048))
                .setFooter(client.getFooter(es))]
              });
            }
            else{
              return message.reply( "NO CHANNEL PINGED");
            }
          })
          .catch(e => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable7"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
              .setFooter(client.getFooter(es))]
            });
          })
        }
        break;
          case "Disable Log":
            {
              client.epicgamesDB.set(message.guild.id, "", `logChannel`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Disabled the Log Channel")
                .setColor(es.color)
                .setFooter(client.getFooter(es))]
              });
            }
          break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable11"]))
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