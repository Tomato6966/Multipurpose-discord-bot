//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ms = require("ms");
var {
  MessageEmbed, Permissions
} = require(`discord.js`);
const { databasing, delay, dbEnsure } = require(`./functions`)
const countermap = new Map()
const messagesmap = new Map()
module.exports = async (client) => {
  module.exports.messageCreate = (client, message, guild_settings) => {
    checkSelfBot(client, message, guild_settings);
  }
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!newMessage.guild || newMessage.guild.available === false || !newMessage.channel || newMessage.author?.bot) return;
    let guild_settings = await client.settings.get(newMessage.guild.id);
    checkSelfBot(client, newMessage, guild_settings)
  })
  async function checkSelfBot(client, message, guild_settings) {
    if (!message.guild || message.guild.available === false || message.author?.bot) return;
    try {
      if (!message.embeds || !message.embeds[0] || message.embeds.length == 0 || message.embeds.some(e => e.type != "rich" || (e.footer && e.footer.text === "Twitter") || (e.author && e.author.url && e.author.url.includes('twitter.com')))) return; //means no self bot 

      // Define the Settings
      let theSettings = guild_settings;
      //if one of the settings isn't available, ensure and re-get it!
      if (!theSettings || !theSettings.warnsettings || !theSettings.embed || !theSettings.language || !theSettings.adminroles || !theSettings.antiselfbot || !theSettings.autowarn) {
        if (!theSettings || !theSettings.autowarn) {
          await dbEnsure(client.settings, message.guild.id, {
            autowarn: {
              antispam: false,
              antiselfbot: false,
              antimention: false,
              antilinks: false,
              antidiscord: false,
              anticaps: false,
              blacklist: false,
              ghost_ping_detector: false,
            }
          })
        }
        if (!theSettings || !theSettings.warnsettings) {
          await dbEnsure(client.settings, message.guild.id, {
            warnsettings: {
              ban: false,
              kick: false,
              roles: [
                /*
                { warncount: 0, roleid: "1212031723081723"}
                */
              ]
            }
          })
        }
        if (!theSettings || !theSettings.adminroles) {
          await dbEnsure(client.settings, message.guild.id, {
            adminroles: [],
          });
        }
        if (!theSettings || !theSettings.language) {
          await dbEnsure(client.settings, message.guild.id, {
            language: "en"
          });
        }
        if (!theSettings || !theSettings.embed) {
          await dbEnsure(client.settings, message.guild.id, {
            embed: ee
          });
        }
        if (!theSettings || !theSettings.antiselfbot) {
          await dbEnsure(client.settings, message.guild.id, {
            antiselfbot: {
              enabled: true,
              action: "mute", // mute, kick, ban
              mute_amount: 1
            },
          });
        }
        theSettings = await client.settings.get(message.guild.id);
      }
      //get the constant variables
      let adminroles = theSettings.adminroles
      let ls = theSettings.language
      let es = theSettings.embed;
      let autowarn = theSettings.autowarn;
      let antiselfbot = theSettings.antiselfbot;
      let mute_amount = antiselfbot?.mute_amount
      let member = message.member || message.guild.members.cache.get(message.authorId) || await message.guild.members.fetch(message.authorId).catch(() => null);
      if(!member) return console.log("NO MEMBER FOUND");
      let warnsettings = theSettings.warnsettings

      if (!antiselfbot?.enabled) return
      try {
        if (autowarn.antiselfbot) {
          await dbEnsure(client.userProfiles, message.author?.id, {
            id: message.author?.id,
            guild: message.guild.id,
            totalActions: 0,
            warnings: [],
            kicks: []
          });
          const newActionId = await client.modActions.stats().then(d => client.getUniqueID(d.count));
          await client.modActions.set(newActionId, {
            user: message.author?.id,
            guild: message.guild.id,
            type: 'warning',
            moderator: message.author?.id,
            reason: "Antiselfbot Autowarn",
            when: new Date().toLocaleString(`de`),
            oldhighesrole: message.member.roles ? message.member.roles.highest : `Had No Roles`,
            oldthumburl: message.author.displayAvatarURL({
              dynamic: true
            })
          });
          // Push the action to the user's warnings
          await client.userProfiles.push(message.author?.id + '.warnings', newActionId);
          await client.userProfiles.add(message.author?.id + '.totalActions', 1);
          await client.stats.push(message.guild.id + message.author?.id + ".warn", new Date().getTime());
          const warnIDs = await client.userProfiles.get(message.author?.id + '.warnings')
          const modActions = await client.modActions.all();
          const warnData = warnIDs.map(id => modActions.find(d => d.ID == id)?.data);
          let warnings = warnData.filter(v => v.guild == message.guild.id);
          message.channel.send({
            embeds: [
              new MessageEmbed().setAuthor(client.getAuthor(message.author.tag, message.member.displayAvatarURL({ dynamic: true })))
                .setColor("ORANGE").setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({ dynamic: true })))
                .setDescription(`> <@${message.author?.id}> **received an autogenerated Warn - \`antiselfbot\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
            ]
          });
          if (warnsettings.kick && warnsettings.kick == warnings.length) {
            if (!message.member.kickable)
              message.channel.send({
                embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
                ]
              });
            else {
              try {
                message.member.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
                  ]
                });
              } catch {
                return message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
                  ]
                });
              }
              try {
                message.member.kick({
                  reason: `Reached ${warnings.length} Warnings`
                }).then(async () => {
                  message.channel.send({
                    embeds: [new MessageEmbed()
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                      .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                    ]
                  });
                });
              } catch (e) {
                console.error(e);
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.erroroccur)
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                  ]
                });
              }
            }

          }
          if (warnsettings.ban && warnsettings.ban == warnings.length) {
            if (!message.member.bannable)
              message.channel.send({
                embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
                ]
              });
            else {
              try {
                message.member.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
                  ]
                });
              } catch {
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
                  ]
                });
              }
              try {
                message.member.ban({
                  reason: `Reached ${warnings.length} Warnings`
                }).then(async () => {
                  message.channel.send({
                    embeds: [new MessageEmbed()
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                      .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                    ]
                  });
                });
              } catch (e) {
                console.error(e);
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
                  ]
                });
              }
            }
          }
          for (const role of warnsettings.roles) {
            if (role.warncount == warnings.length) {
              if (!message.member.roles.cache.has(role.roleid)) {
                message.member.roles.add(role.roleid).catch((O) => { })
              }
            }
          }
        }
        message.delete().catch(() => { });
        if (!countermap.get(message.author?.id)) countermap.set(message.author?.id, 1)
        setTimeout(() => {
          countermap.set(message.author?.id, Number(countermap.get(message.author?.id)) - 1)
          if (Number(countermap.get(message.author?.id)) < 1) countermap.set(message.author?.id, 1)
        }, 15000)
        countermap.set(message.author?.id, Number(countermap.get(message.author?.id)) + 1)

        if (Number(countermap.get(message.author?.id)) > mute_amount) {
          if (antiselfbot.action == "mute") {
            let time = 10 * 60 * 1000; let mutetime = time;

            member.timeout(mutetime, "Using a Selfbot").then(async () => {
              message.channel.send({
                embeds: [new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(`${member.user.tag} Got timeouted due to using a SelfBot`)
                  .setDescription(`He/She/They will get untimeouted after 10 Minutes`)
                ]
              }).catch(() => { });
            }).catch(() => {
              return message.channel.send(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                setTimeout(() => { m.delete().catch(() => { }) }, 5000);
              });
            });

            countermap.set(message.author?.id, 1)

          }
          if (antiselfbot.action == "kick") {
            if (member.kickable) {
              member.kick({ reason: "Using a selfbot" }).then(m => {
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`${member.user.tag} Got kicked for using a Selfbot`)
                  ]
                }).catch(() => { });
              }).catch(e => {
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`Could not kick ${member.user.tag} using a Selfbot`)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                  ]
                }).catch(() => { });
              })
            } else {
              message.channel.send({
                embeds: [new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(`Could not kick ${member.user.tag} using a Selfbot`)
                  .setDescription(`\`\`\`Member is not kickable\`\`\``)
                ]
              }).catch(() => { });
            }
          }
          if (antiselfbot.action == "ban") {
            if (member.bannable) {
              member.kick({ reason: "Using a selfbot" }).then(m => {
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`${member.user.tag} Got banned for using a Selfbot`)
                  ]
                }).catch(() => { });
              }).catch(e => {
                message.channel.send({
                  embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`Could not ban ${member.user.tag} using a Selfbot`)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                  ]
                }).catch(() => { });
              })
            } else {
              message.channel.send({
                embeds: [new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(`Could not ban ${member.user.tag} using a Selfbot`)
                  .setDescription(`\`\`\`Member is not bannable\`\`\``)
                ]
              }).catch(() => { });
            }
          }
        }
        else {
          return message.channel.send({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(`${member.user.tag} No Selfbots are allowed in here!`)
              .setDescription(`Please stop using them`)
            ]
          }).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 3000)).catch(() => { });
        }

      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable7"]))
          ]
        }).catch(() => { });
      }
    } catch (e) { console.log(String(e).grey) }
  }
}