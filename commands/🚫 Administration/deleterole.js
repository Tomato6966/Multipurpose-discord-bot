const config = require(`../../botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const {
  MessageEmbed, MessageActionRow, MessageButton,
  Permissions
} = require(`discord.js`)
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `deleterole`,
  category: `🚫 Administration`,
  aliases: [`roledelete`, "delete-role", "role-delete"],
  cooldown: 4,
  usage: `deleterole  @Role`,
  description: `Delets a Role from this Server`,
  type: "role",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    if(!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES]))      
    return message.reply({embeds : [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable1"]))
    ]})
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.deleterole || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `deleterole`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable3"]))
        ]});
      let role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first() || message.guild.roles.cache.get(args[0]);
      if (!role || role == null || role == undefined || role.name == null || role.name == undefined)
        return message.reply({embeds : [
        ]});
      let button_verify = new MessageButton().setStyle('SUCCESS').setCustomId('deleterole_verify').setLabel("Verify this Step").setEmoji("950884027320135711")
      let msg = await message.channel.send({
          content: `<@${message.author?.id}>`,
          embeds: [
            new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable6"]))
              .setColor(es.color)
          ],
          components: [new MessageActionRow().addComponents(button_verify)]
      })
      let edited = false;
      const collector = msg.createMessageComponentCollector(bb => !bb?.user.bot, {
          time: 30000
      }); //collector for 5 seconds
      collector.on('collect', async b => {
          if (b?.user.id !== message.author?.id)
              return b?.reply(`:x: **Only the one who typed ${prefix}help is allowed to react!**`, true)

          edited = true;
          msg.edit({
              content: `<@${message.author?.id}>`,
              embeds: [new MessageEmbed()
                  .setTitle("Verified!")
                  .setColor(es.color)
              ],
              components: [new MessageActionRow().addComponents(button_verify.setDisabled(true))]
          }).catch((e) => {
              console.log(String(e).grey)
          });


          //page forward
          if (b?.customId == "deleterole_verify") {
            let membersize = [...role.members.values()].length;
            role.delete(`${message.author.tag} Requested a Role delete`)
              .then(r => {
                message.reply({embeds : [new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable8"]))
                ]});
                if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
                  try {
                    var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
                    if (!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
                    channel.send({embeds : [new MessageEmbed()
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                      .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
                        dynamic: true
                      }))
                      .setDescription(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable9"]))
                      .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                      .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                      .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
                    ]})
                  } catch (e) {
                    console.error(e)
                  }
                }
              })
              .catch(() => null);
          } else {
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable12"]))
              .setDescription(ge.message)
            ]});
          }
      })

      let endedembed = new MessageEmbed()
        .setTitle("Time ran out!")
        .setColor(es.wrongcolor)
      collector.on('end', collected => {
          if (!edited) {
              edited = true;
              msg.edit({
                  content: `<@${message.author?.id}>`,
                  embeds: [endedembed],
                  components: [new MessageActionRow().addComponents(button_verify.setDisabled(true).setLabel("FAILED TO VERIFY").setEmoji("951013282607685632").setStyle('DANGER'))]
              }).catch((e) => {
                  console.log(String(e).grey)
              });
          }
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["deleterole"]["variable14"]))
       ]} );
    }
  }
};

