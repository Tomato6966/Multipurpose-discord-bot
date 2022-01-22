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
  name: "setup-reactionrole",
  category: "💪 Setup",
  aliases: ["setupreactionrole", "setup-react", "setupreact", "reactionrolesetup", "reactionrole-setup", "react-setup", "reactsetup"],
  cooldown: 5,
  usage: "setup-reactionrole --> Follow Steps",
  description: "Create Reaction Roles, or delete all active Reaction Roles.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var rembed = new MessageEmbed()
      .setColor(es.color)
      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable2"]))
      .setDescription(`
**How to setup Clan Bots's Reaction Role!**
> 1. React to message __BELOW__ **this** message

> 2. Then, afterwards a new message appears! After that, you can PING the ROLE for the reacted EMOJI

> 3. Process 1... continues, enter \`finish\` to finish the process! (or just dont react)

> 4. Once it's finished:

> 4.1 I will ask you, which reaction role **type** you want!
 | - **Multiple** = *you can have every possible reaction option!*
 | - **Single** = *Only one Role at the same time!*
> 4.2 You will be asked for the TITLE of the Reaction Role, that's necessary!
> 4.3 After that, enter in which channel you want to have your Reaction Role listed at! Just ping it! \`#chat\`
> 4.4 After that the Reaction Role Embed, with the information for every Parameter: \`EMOJI = ROLE\`, will be sent in your wished channel and it'll work!

*You have 30 seconds for each input!*
`)
      
      .setFooter(client.getFooter(es))
    message.reply({embeds: [rembed]})
    var objet = {
      MESSAGE_ID: "",
      remove_others: false,
      Parameters: []
    };
    var counters = 0;
    ask_emoji()

    function ask_emoji() {
      counters++;
      if (counters.length === 21) return finished();
      var object2 = {
        Emoji: "",
        Emojimsg: "",
        Role: ""
      };
      var rermbed = new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable4"]))
      var cancel = false;
      message.reply({embeds: [rermbed]}).then(msg => {
        msg.awaitReactions({ filter: (reaction, user) => user.id == message.author.id, 
          max: 1,
          time: 180e3
        }).then(collected => {
          if (collected.first().emoji?.id  && collected.first().emoji?.id.length > 2) {
            msg.delete();
            object2.Emoji = collected.first().emoji?.id ;
            if (collected.first().emoji?.animated)
              object2.Emojimsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
            else
              object2.Emojimsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
            return ask_role();
          } else if (collected.first().emoji?.name) {
            msg.delete();
            object2.Emoji = collected.first().emoji?.name;
            object2.Emojimsg = collected.first().emoji?.name;
            return ask_role();
          } else {
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable5"])});
            return finished();
          }
        }).catch(() => {
          if (!cancel) {
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable6"])});
            return finished();
          }
        });
        msg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
          max: 1,
          time: 180e3
        }).then(collected => {
          if (collected.first().content.toLowerCase() === "finish") {
            cancel = true;
            return finished();
          }
        }).catch(() => {
          if (!cancel) {
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable7"])});
            return finished();
          }
        });
      })

      function ask_role() {
        counters++;
        var rermbed = new MessageEmbed()
          .setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable8"]))
        message.reply({embeds: [rermbed]}).then(msg => {
          msg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
            max: 1,
            time: 180e3
          }).then(collected => {
            var role = collected.first().mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
            if (!role) message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable9"])})
            if (role) {

              object2.Role = role.id;
              objet.Parameters.push(object2)


              try {
                msg.delete();
              } catch {}
              try {
                msg.channel.bulkDelete(1);
              } catch {}

              return ask_emoji();
            } else {
              message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable10"])});
              return finished();
            }
          }).catch((e) => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable11"])});
            return finished();
          });
        })
      }
    }


    function finished() {
      message.reply({embeds: [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable12"]))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable13"]))]}).then(msg => {
        var emojis2 = ["1️⃣", "2️⃣"]
        for (var emoji of emojis2) msg.react(emoji)
        msg.awaitReactions({ filter: (reaction, user) => user.id === message.author.id && emojis2.includes(reaction.emoji?.name),
          max: 1,
          time: 120000,
          erros: ["time"]
        }).then(collected => {
          switch (collected.first().emoji?.name) {
            case "1️⃣":
              break;
            case "2️⃣":
              objet.remove_others = true;
              break;
            default:
              message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable14"])})
              break;
          }


          var thisembed = new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable15"]))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable16"]))
          message.reply({
            content: `I will use **${objet.remove_others ? "Single": "Multiple"}** Reaction Option!\n`,
            embeds: [thisembed]
          }).then(msg => {
            msg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 120000,
              errors: ["TIME"]
            }).then(collected => {
              var title = String(collected.first().content).substr(0, 256);

              message.reply({embeds: [new MessageEmbed()
                .setColor(es.color)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable17"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable18"]))
              ]}).then(msg => {
                msg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 120000,
                  errors: ["TIME"]
                }).then(collected => {

                  if (collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first()) {

                    var channel = collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first();
                    var embed = new MessageEmbed().setColor(es.color).setTitle(title.substr(0, 256)).setFooter(message.guild.name, message.guild.iconURL({
                      dynamic: true
                    }))
                    var buffer = "";
                    for (var i = 0; i < objet.Parameters.length; i++) {
                      try {
                        buffer += objet.Parameters[i].Emojimsg + "  **==**  <@&" + objet.Parameters[i].Role + ">\n";
                      } catch (e) {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      }
                    }
                    channel.send({embeds: [embed.setDescription(buffer)]}).then(msg => {
                      for (var i = 0; i < objet.Parameters.length; i++) {
                        try {
                          msg.react(objet.Parameters[i].Emoji).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
                        } catch (e) {
                          console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        }
                      }
                      objet.MESSAGE_ID = msg.id;
                      client.reactionrole.push(message.guild.id, objet, "reactionroles");
                      message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable19"])})
                    })

                  } else {
                    message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable20"])});
                    return;
                  }
                }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
              })
            }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
          })
        }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
      })
    }
  
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable22"]))
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
