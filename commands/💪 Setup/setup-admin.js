var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-admin",
  category: "💪 Setup",
  aliases: ["setupadmin", "setup-mod", "setupmod", "admin-setup", "adminsetup"],
  cooldown: 5,
  usage: "setup-admin  -->  Follow the Steps",
  description: "Allow specific Roles/Users to execute specific Commands / all Commands!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    let timeouterror;
    try {
      first_layer()
      async function first_layer(){
        
        let menuoptions = [
          {
            value: "Add Role",
            description: `Add Roles to the general Admin Roles`,
            emoji: "🔧"
          },
          {
            value: "Remove Role",
            description: `Remove Roles from the general Admin Roles`,
            emoji: "🗑"
          },
          {
            value: "Show Settings",
            description: `Show Settings of all Admin Roles`,
            emoji: "📑"
          },
          {
            value: "Per Command Roles",
            description: `Manage Admin Roles of each Command`,
            emoji: "⚙️"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Admin-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Administration Roles') 
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
        .setAuthor(client.getAuthor('Admin Setup', 'https://cdn.discordapp.com/emojis/892521772002447400.png?size=96', 'https://discord.gg/milrato'))
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
          case "Add Role": 
          {
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable35"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable36"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                if (role) {
                  var adminroles = await client.settings.get(message.guild.id + ".adminroles")
                  if (adminroles.includes(role.id)) return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable37"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))]
                  });
                  try {
                    await client.settings.push(message.guild.id+".adminroles", role.id);
                    const newAdminRoles = await client.settings.get(message.guild.id+".adminroles");
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable38"]))
                      .setColor(es.color)
                      .setDescription(`Everyone with one of those Roles:\n<@&${newAdminRoles.join(">\n<@&")}>\nis now able to use the Admin Commands`.substring(0, 2048))
                      .setFooter(client.getFooter(es))]
                    });
                  } catch (e) {
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable39"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable47"]))
                      .setFooter(client.getFooter(es))]
                    });
                  }
                } else {
                  return message.reply( "you didn't ping a valid Role")
                }
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable41"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
    
          }
          break;
          case "Remove Role": 
          {
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable42"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable43"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                if (role) {
                  var adminroles = await client.settings.get(message.guild.id + ".adminroles")
                  if (!adminroles.includes(role.id)) return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable44"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))]
                  });
                  try {
                    let index = adminroles.indexOf(role.id);
                    if(index > -1) {
                      adminroles.splice(index, 1);
                      client.settings.set(message.guild.id+".adminroles", adminroles);
                    }
                    const newAdminRoles = await client.settings.get(message.guild.id+".adminroles");
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable45"]))
                      .setColor(es.color)
                      .setDescription(`Everyone with one of those Roles:\n<@&${newAdminRoles.join(">\n<@&")}>\nis now able to use the Admin Commands`.substring(0, 2048))
                      .setFooter(client.getFooter(es))]
                    });
                  } catch (e) {
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable46"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable52"]))
                      .setFooter(client.getFooter(es))]
                    });
                  }
                } else {
                  return message.reply( "you didn't ping a valid Role")
                }
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable48"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
          }
          break;
          case "Show Settings": 
          {
            let db = await client.settings.get(message.guild.id+ ".cmdadminroles")
            var cmdrole = []
            for await (const [cmd, values] of Object.entries(db)){
              var percmd = [];
              if(values.length > 0){
                for await (const r of values){
                  if(message.guild.roles.cache.get(r)){
                    percmd.push(`<@&${r}>`)
                  }
                  else if(message.guild.members.cache.get(r)){
                    percmd.push(`<@${r}>`)
                  }
                  else {
                    const File = cmd;
                    let index = values.indexOf(r)
                    if(index > -1) {
                      values.splice(index, 1);
                      await client.settings.set(`${message.guild.id}.cmdadminroles`, values)
                    }
                  }
                }
                var key = `For the \`${cmd}\` Command`
                cmdrole.push({ "info" : percmd, "name": key })
              }
            }
            const newAdminRoles = await client.settings.get(message.guild.id+".adminroles");
            var embed = new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable50"]))
              .setColor(es.color)
              .setDescription(`**General Admin Roles:**\n${newAdminRoles.length > 0 ? `<@&${newAdminRoles.join(">, <@&")}>`: "No General Admin Roles Setup yet"}`.substring(0, 2048))
              .setFooter(client.getFooter(es))
            for await (const cmd of cmdrole){
              embed.addField(cmd.name, cmd.info.join(", "))
            }
            return message.reply({embeds: [embed]});
          }
          break;
          case "Per Command Roles": 
          {
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable4"]))
              .setColor(es.color)
              .setDescription(`
              ${client.commands.filter((cmd) => cmd.category.includes("Admin")).map((cmd) => `\`${cmd.name}\``).join(" | ")}
      
              
              *Enter one of those Commands!*`).setFooter(client.getFooter(es))
            ]})
            var thecmd;
            await dbEnsure(client.settings, message.guild.id, {
              cmdadminroles: {
                removetimeout: [],
                timeout: [],
                idban: [],
                snipe: [],
                listbackups: [],
                loadbackup: [],
                createbackup: [],
                embed: [],
                editembed: [],
                editimgembed: [],
                imgembed: [],
                useridban: [],
                addrole: [],
                addroletoeveryone: [],
                ban: [],
                channellock: [],
                channelunlock: [],
                clear: [],
                clearbotmessages: [],
                close: [],
                copymessage: [],
                deleterole: [],
                detailwarn: [],
                dm: [],
                editembeds: [],
                editimgembeds: [],
                embeds: [],
                embedbuilder: [],
                esay: [],
                giveaway: [],
                image: [],
                imgembeds: [],
                kick: [],
                mute: [],
                nickname: [],
                unlockthread: [],
                unarchivethread: [],
                lockthread: [],
                archivethread: [],
                leavethread: [],
                lockchannel: [],
                unlockchannel: [],
                jointhread: [],
                jointhreads: [],
                setautoarchiveduration: [],
                tempmute: [],
                permamute: [],
                poll: [],
                react: [],
                removeallwarns: [],
                removerole: [],
                report: [],
                say: [],
                slowmode: [],
                suggest: [],
                ticket: [],
                unmute: [],
                unwarn: [],
                updatemessage: [],
                warn: [],
                warnings: [],
              }
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var com = collected.first().content.split(" ")[0]
                const cmd = client.commands.get(com.toLowerCase()) || client.commands.get(client.aliases.get(com.toLowerCase()));
                if(!cmd) 
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable5"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))]
                  });
                if(!cmd.category.toLowerCase().includes("admin")) 
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable6"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))]
                  });
                thecmd = cmd.name;
                if(["detailwarn", "warnings", "report"].includes(thecmd.toLowerCase())) return timeouterror = {
                  message: "YOU CANNOT USE THAT COMMAND, CAUSE IT DOES NOT NEED PERMISSIONS"
                }

                await dbEnsure(client.settings, `${message.guild.id}.cmdadminroles.${thecmd}`, [])

                if(["dm"].includes(thecmd.toLowerCase())) return timeouterror = {
                  message: "YOU CANNOT USE THAT COMMAND, CAUSE IT IS ADMINISTRATOR ONLY"
                }
                second_layer()
                async function second_layer(){
                  
                  let menuoptions = [
                    {
                      value: "Add Role",
                      description: `Add Role/User to ${thecmd.toUpperCase()} ADMIN ROLES`.substring(0, 50),
                      emoji: "🔧"
                    },
                    {
                      value: "Remove Role",
                      description: `Rempove Role/User from ${thecmd.toUpperCase()} ADMIN ROLES`.substring(0, 50),
                      emoji: "🗑"
                    },
                    {
                      value: "Show Settings",
                      description: `Show all Roles of ${thecmd.toUpperCase()} ADMIN ROLES`,
                      emoji: "📑"
                    },
                    {
                      value: "Cancel",
                      description: `Cancel and stop the Admin-Per-Command-Setup!`,
                      emoji: "862306766338523166"
                    }
                  ]
                  //define the selection
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection') 
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder('Click me to setup the Administration Roles') 
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
                  .setAuthor(client.getAuthor('Admin Setup', 'https://cdn.discordapp.com/emojis/892521772002447400.png?size=96', 'https://discord.gg/milrato'))
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
                      handle_the_picks2(menu?.values[0], SetupNumber, menuoptiondata)
                    }
                    else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
                  });
                  //Once the Collections ended edit the menu message
                  collector.on('end', collected => {
                    menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
                  });
                }
                async function handle_the_picks2(optionhandletype, SetupNumber, menuoptiondata) {
                  switch (optionhandletype) {
                    case "Add Role": 
                    {
                      var tempmsg = await message.reply({embeds: [new MessageEmbed()
                        .setTitle("Which Role/User do you wanna add to " + thecmd)
                        .setColor(es.color)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable11"]))
                        .setFooter(client.getFooter(es))]
                      })
                      await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                          max: 1,
                          time: 90000,
                          errors: ["time"]
                        })
                        .then(async collected => {
                          var message = collected.first();
                          var role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                          var user = message.mentions.users.first();
                          if (role) {
                            var adminroles = await client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`, true)
                            if(!adminroles) {
                              await client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, []);
                              adminroles = [];
                            }
                            if (adminroles.includes(role.id)) return message.reply({embeds: [new MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable12"]))
                              .setColor(es.wrongcolor)
                              .setFooter(client.getFooter(es))]
                            });
                            try {
                              await client.settings.push(`${message.guild.id}.cmdadminroles.${thecmd}`, role.id)
                              let cmd = await client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`, true)
                              var cmdrole = []
                                if(cmd.length > 0){
                                  for await (const r of cmd){
                                    if(message.guild.roles.cache.get(r)){
                                      cmdrole.push(`<@&${r}>`)
                                    }
                                    else if(message.guild.members.cache.get(r)){
                                      cmdrole.push(`<@${r}>`)
                                    }
                                    else {
                                      let index = cmd.indexOf(r)
                                      if(index > -1) {
                                        cmd.splice(index, 1);
                                        client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, cmd)
                                      }
                                    }
                                  }
                                }
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable13"]))
                                .setColor(es.color)
                                .setDescription(`Everyone with one of those Roles/Users:\n${cmdrole.join("\n")}\nis now able to use the ${thecmd} Admin Commands`.substring(0, 2048))
                                .setFooter(client.getFooter(es))]
                              });
                            } catch (e) {
                              console.error(e);
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable14"]))
                                .setColor(es.wrongcolor)
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable19"]))
                                .setFooter(client.getFooter(es))]
                              });
                            }
                          } else if (user) {
                            var adminroles = await client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`, true)
                            if(!adminroles) {
                              await client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, []);
                              adminroles = [];
                            }
                            if (adminroles.includes(user.id)) return message.reply({embeds: [new MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable16"]))
                              .setColor(es.wrongcolor)
                              .setFooter(client.getFooter(es))]
                            });
                            try {
                              await client.settings.push(`${message.guild.id}.cmdadminroles.${thecmd}`, user.id)
                              let cmd = await client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`, true)
                              var cmdrole = []
                                if(cmd.length > 0){
                                  for await (const r of cmd){
                                    if(message.guild.roles.cache.get(r)){
                                      cmdrole.push(`<@&${r}>`)
                                    }
                                    else if(message.guild.members.cache.get(r)){
                                      cmdrole.push(`<@${r}>`)
                                    }
                                    else {
                                      let index = cmd.indexOf(r)
                                      if(index > -1) {
                                        cmd.splice(index, 1);
                                        client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, cmd)
                                      }
                                    }
                                  }
                                }
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable17"]))
                                .setColor(es.color)
                                .setDescription(`Everyone with one of those Roles/Users:\n${cmdrole.join("\n")}\nis now able to use the ${thecmd} Admin Commands`.substring(0, 2048))
                                .setFooter(client.getFooter(es))]
                              });
                            } catch (e) {
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable18"]))
                                .setColor(es.wrongcolor)
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable25"]))
                                .setFooter(client.getFooter(es))]
                              });
                            }
                          } else {
                            return message.reply( "you didn't ping a valid Role")
                          }
                        })
                        .catch(e => {
                          timeouterror = e;
                        })
                      if (timeouterror)
                        return message.reply({embeds: [new MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable20"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))]
                        });
                    }
                    break;
                    case "Remove Role":
                    {
                      var tempmsg = await message.reply({embeds: [new MessageEmbed()
                        .setTitle("Which Role/User do you wanna remove from " + thecmd)
                        .setColor(es.color)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable21"]))
                        .setFooter(client.getFooter(es))]
                      })
                      await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                          max: 1,
                          time: 90000,
                          errors: ["time"]
                        })
                        .then(async collected => {
                          var message = collected.first();
                          var role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                          var user = message.mentions.users.first();
                          if (role) {
                            var adminroles = await client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`, true)
                            if(!adminroles) {
                              await client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, []);
                              adminroles = [];
                            }
                            if (!adminroles || !adminroles.includes(role.id)) return message.reply({embeds: [new MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable22"]))
                              .setColor(es.wrongcolor)
                              .setFooter(client.getFooter(es))]
                            });
                            try {
                              let index = adminroles.indexOf(role.id)
                              if(index > -1) {
                                adminroles.splice(index, 1);
                                await client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, adminroles)
                              }
                              let cmd = await client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`, true)
                              var cmdrole = []
                                if(cmd.length > 0){
                                  for await (const r of cmd){
                                    if(message.guild.roles.cache.get(r)){
                                      cmdrole.push(`<@&${r}>`)
                                    }
                                    else if(message.guild.members.cache.get(r)){
                                      cmdrole.push(`<@${r}>`)
                                    }
                                    else {
                                      let index = cmd.indexOf(r)
                                      if(index > -1) {
                                        cmd.splice(index, 1);
                                        client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, cmd)
                                      }
                                    }
                                  }
                                }
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable23"]))
                                .setColor(es.color)
                                .setDescription(`Everyone with one of those Roles/Users:\n${cmdrole.join("\n")}\nis now able to use the ${thecmd} Admin Commands`.substring(0, 2048))
                                .setFooter(client.getFooter(es))]
                              });
                            } catch (e) {
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable24"]))
                                .setColor(es.wrongcolor)
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable29"]))
                                .setFooter(client.getFooter(es))]
                              });
                            }
                          } else if (user) {
                            var adminroles = await client.settings.get(message.guild.id+ `.cmdadminroles.${thecmd}`)
                            
                            if(!adminroles) {
                              await client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, []);
                              adminroles = [];
                            }
                            if (!adminroles.includes(user.id)) return message.reply({embeds: [new MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable26"]))
                              .setColor(es.wrongcolor)
                              .setFooter(client.getFooter(es))]
                            });
                            try {
                              let index = adminroles.indexOf(user.id)
                              if(index > -1) {
                                adminroles.splice(index, 1);
                                await client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, adminroles)
                              }
                              let cmd = client.settings.get(`${message.guild.id}.cmdadminroles.${thecmd}`)
                              var cmdrole = []
                                if(cmd.length > 0){
                                  for await (const r of cmd){
                                    if(message.guild.roles.cache.get(r)){
                                      cmdrole.push(`<@&${r}>`)
                                    }
                                    else if(message.guild.members.cache.get(r)){
                                      cmdrole.push(`<@${r}>`)
                                    }
                                    else {
                                      let index = cmd.indexOf(r)
                                      if(index > -1) {
                                        cmd.splice(index, 1);
                                        client.settings.set(`${message.guild.id}.cmdadminroles.${thecmd}`, cmd)
                                      }
                                    }
                                  }
                                }
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable27"]))
                                .setColor(es.color)
                                .setDescription(`Everyone with one of those Roles/Users:\n${cmdrole.join("\n")}\nis now able to use the ${thecmd} Admin Commands`.substring(0, 2048))
                                .setFooter(client.getFooter(es))]
                              });
                            } catch (e) {
                              return message.reply({embeds: [new MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable28"]))
                                .setColor(es.wrongcolor)
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable40"]))
                                .setFooter(client.getFooter(es))]
                              });
                            }
                          } else {
                            return message.reply( "you didn't ping a valid Role")
                          }
                        })
                        .catch(e => {
                          timeouterror = e;
                        })
                      if (timeouterror)
                        return message.reply({embeds: [new MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable30"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))]
                        });
                    }
                    break;
                    case "Show Settings":
                    {
                      let db = await client.settings.get(message.guild.id+ ".cmdadminroles")
                      var cmdrole = []
                      for await (const [cmd, values] of Object.entries(db)){
                        var percmd = [];
                        if(values.length > 0){
                          for await (const r of values){
                            if(message.guild.roles.cache.get(r)){
                              percmd.push(`<@&${r}>`)
                            }
                            else if(message.guild.members.cache.get(r)){
                              percmd.push(`<@${r}>`)
                            }
                            else {
                              let index = values.indexOf(r)
                              if(index > -1) {
                                values.splice(index, 1);
                                client.settings.set(`${message.guild.id}.cmdadminroles.${cmd}`, values)
                              }
                            }
                          }
                        var key = `For the \`${cmd}\` Command`
                        cmdrole.push({ "info" : percmd, "name": key })
                      }
                }
                var embed = new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable33"]))
                .setColor(es.color)
                .setDescription(`**General Admin Roles:**\n${client.settings.get(message.guild.id, "adminroles").length > 0 ? `<@&${client.settings.get(message.guild.id, "adminroles").join(">, <@&")}>`: "No General Admin Roles Setup yet"}`.substring(0, 2048))
                .setFooter(client.getFooter(es))
        
                for await (const cmd of cmdrole){
                  embed.addField(cmd.name, cmd.info.join(", "))
                }
                return message.reply({embeds: [embed]});
                    }
                    break;
                  }
                }
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admin"]["variable10"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
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