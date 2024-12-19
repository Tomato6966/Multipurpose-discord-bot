//Import npm modules
const Discord = require("discord.js");
const Canvas = require("canvas");
const canvacord = require("canvacord");
//Load fonts
// Canvas.registerFont( "./assets/fonts/DMSans-Bold.ttf" , { family: "DM Sans", weight: "bold" } );
// Canvas.registerFont( "./assets/fonts/DMSans-Regular.ttf" , { family: "DM Sans", weight: "regular" } );
// Canvas.registerFont( "./assets/fonts/STIXGeneral.ttf" , { family: "STIXGeneral" } );
// Canvas.registerFont( "./assets/fonts/AppleSymbol.ttf" , { family: "AppleSymbol" } );
// Canvas.registerFont( "./assets/fonts/Arial.ttf"       , { family: "Arial" } );
// Canvas.registerFont( "./assets/fonts/ArialUnicode.ttf", { family: "ArielUnicode" } );
// Canvas.registerFont(`./assets/fonts/Genta.ttf`, { family: `Genta` } );
// Canvas.registerFont("./assets/fonts/UbuntuMono.ttf", { family: "UbuntuMono" } );
// require functions from files
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  delay,
  duration,
  simple_databasing
} = require(`./functions`);
const {
  Captcha
} = require(`captcha-canvas`); //require package here
const ms = require("ms");
//Create Variables
const Fonts = "Genta, UbuntuMono, `DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
const wideFonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
let invitemessage = "\u200b";
//Start the module
module.exports = client => {

  client.fetched = false;
  client.invitations = {};
  
  /**
   * FETCH THE INVITES OF ALL GUILDS
   */
  client.on("ready", async () => {
    for(const guild of [...client.guilds.cache.values()]){
      let fetchedInvites = null;
      if (guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
        await guild.invites.fetch().catch(() => {});
      }
      fetchedInvites = await generateInvitesCache(guild.invites.cache);
      client.invitations[guild.id] = fetchedInvites;
    }
    client.fetched = true;
  })

  /**
   * FETCH THE INVITES OF THAT GUILD
   */
  client.on("guildCreate", async (guild) => {
      let fetchedInvites = null;
      if (guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
        await guild.invites.fetch().catch(() => {});
      }
      fetchedInvites = await generateInvitesCache(guild.invites.cache);
      client.invitations[guild.id] = fetchedInvites;
  })

  /**
   * Register new Created Invites
   */
  client.on("inviteCreate", (invite) => {
    if(!invite.guild) return;
    function SetInvite(i){
      if (!client.fetched) {
        if(!client.invitations[invite.guild.id]){
          setTimeout(() => {
            SetInvite(i);
          }, 5_000)
          return;
        }
      }
      client.invitations[invite.guild.id].set(invite.code, inviteToJson(invite));
    }
    SetInvite(invite)
  })
  /**
   * Handle Invite Delete Event
   */
  client.on("inviteDelete", (invite) => {
    if(!invite.guild) return;
    function SetInvite(i){
      if (!client.fetched) {
        if(!client.invitations[invite.guild.id]){
          setTimeout(() => {
            SetInvite(i);
          }, 5_000)
          return;
        }
      }
      client.invitations[invite.guild.id].delete(invite.code);
    }
    SetInvite(invite)
  })

  /**
   * if a User leaves, remove him from the db
   * Done in: ./leave.js
   */
  

  /**
   * WELCOMING + Register the Invites etc.
   */
  client.on("guildMemberAdd", async mem => {
    if (!mem.guild || mem.user.bot) return; //if not finished yet return
    simple_databasing(client, mem.guild.id, mem.id)
    let ls = client.settings.get(mem.guild.id, "language");
    let es = client.settings.get(mem.guild.id, "embed");
    welcome(mem);
    async function welcome(member) {
      if (!client.fetched) {
        if(client.invitations[mem.guild.id]){
          console.log("NOT FETCHED ALL SERVERS, but this one did")
        } else {
          console.log("NOT FETCHED YET PLS WAIT! Retrying in 5 Seconds...");
          setTimeout(() => {
            welcome(member);
          }, 5_000)
          return;
        }
      }
      if(!client.isReady()) {
        setTimeout(() => {
          welcome(member);
        }, 5_000); //try in 5 secs again
        return; 
      }
      // Fetch guild and member data from the db
      EnsureInviteDB(member.guild, member.user)

      let memberData = client.invitesdb.find(v => v.id == member.id && v.guildId == member.guild.id && v.bot == member.user.bot);
      let memberDataKey = client.invitesdb.findKey(v => v.id == member.id && v.guildId == member.guild.id && v.bot == member.user.bot);
      /* Find who is the inviter */
      let invite = null;
      let vanity = false; //if a vanity invite
      let perm = false; //if manage guild permissions

      //if i dont exist in the guild fetch me
      if (!member.guild.me) {
        await member.guild.members.fetch({
            user: client.user.id,
            cache: true
        }).catch(() => {});
      }
      //if not allowed set perm to true
      if (!member.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) perm = true;
      /**
       * @INFO
       * GET THE INVITE LINK INFORMATION
       */
      //if i am allowed to do so then start
      if (!perm) {
        // Fetch the current invites of the guild
        await member.guild.invites.fetch().catch(() => {});
        //generate an invites cache collection
        const guildInvites = generateInvitesCache(member.guild.invites.cache);
        //get the old GUild INvites
        const oldGuildInvites = client.invitations[member.guild.id];
        
        if (guildInvites && oldGuildInvites) {
          // Update the cache
          client.invitations[member.guild.id] = guildInvites;
          // Find the invitations which doesn't have the same number of use
          let inviteUsed = guildInvites.find((i) => 
            oldGuildInvites.has(i?.code) && 
            (oldGuildInvites.get(i?.code).uses ? oldGuildInvites.get(i?.code).uses : "Infinite") < i?.uses
          );
          // Special case: The invitation used was deleted shortly after the member's arrival and only
          // before GUILD_MEMBER_ADD is output. (An invitation with a limited number of uses works like this)
          if (!inviteUsed) {
            oldGuildInvites.map(i => i).sort((a, b) => (a.deletedTimestamp && b.deletedTimestamp) ? b.deletedTimestamp - a.deletedTimestamp : 0).forEach((invite) => {
                if (!guildInvites.get(invite.code) && invite.maxUses > 0 && invite.uses === (invite.maxUses - 1)) {
                    inviteUsed = invite;
                }
            });
          }
          //if it's a vanity code          
          if ((isEqual(oldGuildInvites.map((i) => `${i?.code}|${i?.uses}` ).sort(), guildInvites.map((i) => `${i?.code}|${i?.uses}` ).sort())) && !inviteUsed && member.guild.features.includes("VANITY_URL")){
            vanity = true;
          } 
          if (!inviteUsed){
              const newAndUsed = guildInvites.filter((i) => !oldGuildInvites.get(i?.code) && i?.uses >= 1);
              if (newAndUsed.size >= 1){
                  inviteUsed = newAndUsed.first();
              }
          }
          if (inviteUsed && !vanity) invite = inviteUsed;
        } else if (guildInvites) {
          client.invitations[member.guild.id] = guildInvites;
        }

        //if there wasn't an invite found, yet
        if (!invite && guildInvites){
            //try to find the inviter
            const targetInvite = guildInvites.find((i) => i?.targetUser && (i?.targetUser.id === member.id));
            if (targetInvite && targetInvite.uses === 1) {
                invite = targetInvite;
            }
        }
      }
      const inviter = invite && invite.inviter ? invite.inviter : null;
      //if there is an inviter, ensure the database
      if (inviter) {
        //ensure him in the database
        EnsureInviteDB(member.guild, inviter)
        //get the inviterData
        const inviterData = inviter ? client.invitesdb.find(v => v.id == inviter.id && v.guildId == member.guild.id) : null;
        const inviterDataKey = client.invitesdb.findKey(v => v.id == inviter.id && v.guildId == member.guild.id && v.bot == inviter.bot)
          //make sure that the inviter Data is an array 
          if(!inviterData.left || !Array.isArray(inviterData.left)) {
            inviterData.left = [];
          }
          if(!inviterData.invited || !Array.isArray(inviterData.invited)) {
            inviterData.invited = [];
          }
          // If the member was a rejoin, remove it from whom invited him before
          if (inviterData.left.includes(member.id)) {
            // We`re removing a leave
            inviterData.leaves--;
            //Setting it back to 0 if its less then 0
            if(inviterData.leaves < 0) inviterData.leaves = 0;
          }

          // FAKEINVITE - If the member had already invited this member before
          if (inviterData.invited.includes(member.id)) {
            // We increase the number of fake invitations
            inviterData.fake++;
          } 
          if(!inviterData.invited.includes(member.id))
          inviterData.invited.push(member.id);

          // We increase the number of regular invitations
          inviterData.invites++;
          //update the database
          client.invitesdb.set(inviterDataKey, inviterData)
        }

      /**
       * @INFO CHANGE THE MEMBERDATA TO WHOM INVITED HIM
       */
      if (invite) {
        memberData.joinData = {
          type: "normal",
          invite: {
            uses: invite.uses,
            code: invite.code,
            inviter: inviter ? inviter.id : null
          }
        };
      } else if (vanity) {
        memberData.joinData = {
          type: "vanity",
          invite: null
        }
      } else if (perm) {
        memberData.joinData = {
          type: "perm",
          invite: null
        }
      }
      //update the database for the MEMBER
      client.invitesdb.set(memberDataKey, memberData)
      
      if (invite && inviter) {
        //get the new memberdata
        let {
          invites,
          fake,
          leaves
         } = client.invitesdb.get(member.guild.id + inviter.id);
        if(fake < 0) fake *= -1;
        if(leaves < 0) leaves *= -1;
        if(invites < 0) invites *= -1;
        let realinvites = invites - fake - leaves;
        invitemessage = `Invited by ${inviter.tag ? `**${inviter.tag}**` : `<@${inviter.id}>`}\n<:Like:857334024087011378> **${realinvites} Invite${realinvites == 1 ? "" : "s"}**\n[<:joines:866356465299488809> ${invites} Joins | <:leaves:866356598356049930> ${leaves} Leaves | <:no:833101993668771842> ${fake} Fakes]`;
      } 
      else if(invite){
        invitemessage = `Invited by an **Unknown Member**`
      }
      else if (vanity) {
        try{
          let res = await member.guild.fetchVanityData().catch(() => {});
          if(res){
            invitemessage = `Invited by a **[Vanity URL](https://discord.gg/${res.code})** with \`${res.uses} Uses\``
          } else {
            invitemessage = `Invited by a **Vanity Link!**`;
          }
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          invitemessage = `Invited by a **Vanity Link!**`;
        }
      } else if (perm) {
        //get the new memberdata
        invitemessage = `I need the **Manage Server** Permission, to fetch Invites!`;
      } else {
        invitemessage = "\u200b"
      }
      if (client.settings.get(member.guild.id, "welcome.captcha") && !member.user.bot) {
       const captcha = new Captcha();
        captcha.async = false //Sync
        captcha.addDecoy(); //Add decoy text on captcha canvas.
        captcha.drawTrace(); //draw trace lines on captcha canvas.
        captcha.drawCaptcha(); //draw captcha text on captcha canvas
        const buffer = captcha.png; //returns buffer of the captcha image
        const attachment = new Discord.MessageAttachment(buffer, `${captcha.text}_Captcha.png`)
        //fin a muted role
        let mutedrole = member.guild.roles.cache.find(r => r.name.toLowerCase().includes("captcha")) || false;
        //if no muted role found, create a new one
        if (!mutedrole) {
          mutedrole = await member.guild.roles.create({
            name: `DISABLED - CAPTCHA`,
            color: `#222222`,
            hoist: true,
            position: member.guild.me.roles.highest.position - 1,
            reason: `This role got created, to DISABLED - CAPTCHA Members!`
          }).catch((e) => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey);
          });
        }
        //For each channel, not including the captcha role, change the permissions
        await mem.guild.channels.cache
            .filter(c => c.permissionOverwrites)
            .filter(c => 
              !c.permissionOverwrites.cache.has(mutedrole.id) || 
              (c.permissionOverwrites.cache.has(mutedrole.id) && !c.permissionOverwrites.cache.get(mutedrole.id).deny.toArray().includes("SEND_MESSAGES")) ||
              (c.permissionOverwrites.cache.has(mutedrole.id) && !c.permissionOverwrites.cache.get(mutedrole.id).deny.toArray().includes("ADD_REACTIONS"))
        ).forEach(async (ch) => {
          try {
            if(ch.permissionsFor(ch.guild.me).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)){
              await ch.permissionOverwrites.edit(mutedrole, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                CONNECT: false,
                SPEAK: false
              }).catch(() => {});
              await delay(300);
            };
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey);
          }
        });
        //Add the role
        member.roles.add(mutedrole.id).catch(() => {});
        const captchaembed = new Discord.MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable1"]))
          .setDescription(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable2"]))
        //Dm him

        member.send({content: `**${member.guild.name}** has a Captcha Security Option enabled!\n> Solve it first, by typing the WHOLE LETTERS of the IMAGE!`, embeds: [captchaembed], files: [attachment]}).then(msg => {
          msg.channel.awaitMessages({filter: m => m.author.id === member.user.id, 
            max: 1,
            time: 60000,
            errors: ["time"]
          }).then(async collected => {
            if (collected.first().content.trim().toLowerCase() == captcha.text.toLowerCase()) {
              //remove the role again
              member.roles.remove(mutedrole.id).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
              //Send the message to success
              await msg.channel.send({
                embeds: [msg.embeds[0].setDescription(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable3"])).setImage("https://cdn.discordapp.com/attachments/807985610265460766/834519837782704138/success-3345091_1280.png")]
              }).catch(() => {});
              //try to delete the original message
              msg.delete().catch(() => {});
              //Do the WELCOME functions
              add_roles(member)
              message(member)
            } else {
              msg.edit({
                embeds: [],
                content: `**Failed the CAPTCHA!**`
              }).catch(() => {});
              try{ 
                //kick the member, but fetch the invites first if there is no valid invite
                if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size < 1)
                  await member.guild.invites.fetch().catch(() => {});
                //if there is a valid invite which lasts for at least 10 minutes or forever
                if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size > 0){
                  await member.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${member.guild.invites.cache.filter(i => i?.code && i?.maxAge === 0).first().code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                  member.kick("FAILED THE CAPTCHA").catch(() => {});
                } else {
                  let channels = member.guild.channels.cache.filter(ch => ch.permissionsFor(member.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
                  if(channels.size > 0) {
                    member.guild.invites.create(channels.first().id).create().then(async invite => {
                      await member.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${invite.code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                      member.kick("FAILED THE CAPTCHA").catch(() => {});
                    }).catch(async e => {
                      await member.user.send(`**OH NO - You failed the CAPTCHA!**\n> :hammer: *I kicked you from the Server due to Security Reasons*`).catch(() => {})
                      member.kick("FAILED THE CAPTCHA").catch(() => {});
                    })
                  }
                }
              }catch (E){
                member.kick("FAILED THE CAPTCHA").catch(() => {});
              }
            }
          }).catch(async ()=>{
            msg.edit({
              embeds: [],
              content: `**Failed the CAPTCHA!**`
            }).catch(() => {});
            try{ 
              //kick the member, but fetch the invites first if there is no valid invite
              if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size < 1)
                await member.guild.invites.fetch().catch(() => {});
              //if there is a valid invite which lasts for at least 10 minutes or forever
              if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size > 0){
                await member.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${member.guild.invites.cache.filter(i => i?.code && i?.maxAge === 0).first().code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                member.kick("FAILED THE CAPTCHA").catch(() => {});
              } else {
                let channels = member.guild.channels.cache.filter(ch => ch.permissionsFor(member.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
                if(channels.size > 0) {
                  member.guild.invites.create(channels.first().id).create().then(async invite => {
                    await member.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${invite.code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                    member.kick("FAILED THE CAPTCHA").catch(() => {});
                  }).catch(async e => {
                    await member.user.send(`**OH NO - You failed the CAPTCHA!**\n> :hammer: *I kicked you from the Server due to Security Reasons*`).catch(() => {})
                    member.kick("FAILED THE CAPTCHA").catch(() => {});
                  })
                }
              }
            }catch (E){
              member.kick("FAILED THE CAPTCHA").catch(() => {});
            }
          })
        }).catch(e => {
          member.guild.channels.create(`verify-${member.user.username}`.substring(0, 32), {
            type: "GUILD_TEXT",
            topic: "PLEASE SEND THE CAPTCHA CODE IN THE CHAT!",
            permissionOverwrites: [{
                id: member.user.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
              },
              {
                id: client.user.id,
                allow: ["VIEW_CHANNEL", "EMBED_LINKS", "ATTACH_FILES", "SEND_MESSAGES"]
              },
              {
                id: member.guild.id,
                deny: ["VIEW_CHANNEL"]
              }
            ]
          }).then(ch => {
            try{
              if(ch.permissionsFor(ch.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                if(ch.permissionsFor(ch.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)){
                  ch.send({
                    content: `<@${member.user.id}>`,
                    embeds: [captchaembed], 
                    files: [attachment]
                  }).then(msg => {
                    msg.channel.awaitMessages({filter: m => m.author.id === member.user.id, 
                      max: 1,
                      time: 60000,
                      errors: ["time"]
                    }).then(async collected => {
                      if (collected.first().content.trim().toLowerCase() == captcha.text.toLowerCase()) {
                        //remove the role again
                        member.roles.remove(mutedrole.id).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
                        //Send the message to success
                        ch.delete().catch(() => {});
                        //Do the WELCOME functions
                        add_roles(member)
                        message(member)
                      } else {
                        msg.edit({
                          embeds: [],
                          content: `**Failed the CAPTCHA!**`
                        }).catch(() => {});
                        try{ 
                          //kick the member, but fetch the invites first if there is no valid invite
                          if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size < 1)
                            await member.guild.invites.fetch().catch(() => {});
                          //if there is a valid invite which lasts for at least 10 minutes or forever
                          if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size > 0){
                            await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${member.guild.invites.cache.filter(i => i?.code && i?.maxAge === 0).first().code}\n> :hammer: *I will kick you in 2 Seconds from the Server due to Security Reasons*`)
                            await delay(2000)
                            member.kick("FAILED THE CAPTCHA").catch(() => {});
                            ch.delete(() => {});
                          } else {
                            let channels = member.guild.channels.cache.filter(ch => ch.permissionsFor(member.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
                            if(channels.size > 0) {
                              member.guild.invites.create(channels.first().id).create().then(async invite => {
                                await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${invite.code}\n> :hammer: *I will kick you in 2 Seconds from the Server due to Security Reasons*`)
                                await delay(2000)
                                member.kick("FAILED THE CAPTCHA").catch(() => {});
                                ch.delete(() => {});
                              }).catch(async e => {
                                await ch.user.send(`**OH NO - You failed the CAPTCHA!**\n> :hammer: *I will kick you in 2 Seconds from the Server due to Security Reasons*`).catch(() => {})
                                await delay(2000)
                                member.kick("FAILED THE CAPTCHA").catch(() => {});
                                ch.delete(() => {});
                              })
                            }
                          }
                        }catch (E){
                          member.kick("FAILED THE CAPTCHA").catch(() => {});
                        }
                      }
                    }).catch(async () => {
                      msg.edit({
                        embeds: [],
                        content: `**Failed the CAPTCHA!**`
                      }).catch(() => {});
                      try{ 
                        //kick the member, but fetch the invites first if there is no valid invite
                        if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size < 1)
                          await member.guild.invites.fetch().catch(() => {});
                        //if there is a valid invite which lasts for at least 10 minutes or forever
                        if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size > 0){
                          await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${member.guild.invites.cache.filter(i => i?.code && i?.maxAge === 0).first().code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                          await delay(2000)
                          member.kick("FAILED THE CAPTCHA").catch(() => {});
                          ch.delete(() => {});
                        } else {
                          let channels = member.guild.channels.cache.filter(ch => ch.permissionsFor(member.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
                          if(channels.size > 0) {
                            member.guild.invites.create(channels.first().id).create().then(async invite => {
                              await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${invite.code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                              await delay(2000)
                              member.kick("FAILED THE CAPTCHA").catch(() => {});
                              ch.delete(() => {});
                            }).catch(async e => {
                              await ch.user.send(`**OH NO - You failed the CAPTCHA!**\n> :hammer: *I kicked you from the Server due to Security Reasons*`).catch(() => {})
                              await delay(2000)
                              member.kick("FAILED THE CAPTCHA").catch(() => {});
                              ch.delete(() => {});
                            })
                          }
                        }
                      }catch (E){
                        member.kick("FAILED THE CAPTCHA").catch(() => {});
                      }
                    })
                  }).catch(() => {
                    member.guild.fetchOwner().then(owner => {
                      owner.send(`:warning: **I can't create Channels_with_SEND_MESSAGES_PERMISSIONS for Captcha User, please give me PERMISSIONS for it asap!**`).catch(() => {});
                    }).catch(() => {});
                    member.kick().catch(() => {});
                  })
                } else {
                  ch.send({
                    content: `<@${member.user.id}>\n${captchaembed.description}`.substring(0, 2000), files: [attachment]
                  }).then(msg => {
                    msg.channel.awaitMessages({filter: m => m.author.id === member.user.id, 
                      max: 1,
                      time: 60000,
                      errors: ["time"]
                    }).then(async collected => {
                      if (collected.first().content.trim().toLowerCase() == captcha.text.toLowerCase()) {
                        //remove the role again
                        member.roles.remove(mutedrole.id).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
                        //Send the message to success
                        ch.delete().catch(() => {});
                        //Do the WELCOME functions
                        add_roles(member)
                        message(member)
                      } else {
                        msg.edit({
                          embeds: [],
                          content: `**Failed the CAPTCHA!**`
                        }).catch(() => {});
                        try{ 
                          //kick the member, but fetch the invites first if there is no valid invite
                          if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size < 1)
                            await member.guild.invites.fetch().catch(() => {});
                          //if there is a valid invite which lasts for at least 10 minutes or forever
                          if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size > 0){
                            await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${member.guild.invites.cache.filter(i => i?.code && i?.maxAge === 0).first().code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                            await delay(2000)
                            member.kick("FAILED THE CAPTCHA").catch(() => {});
                            ch.delete(() => {});
                          } else {
                            let channels = member.guild.channels.cache.filter(ch => ch.permissionsFor(member.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
                            if(channels.size > 0) {
                              member.guild.invites.create(channels.first().id).create().then(async invite => {
                                await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${invite.code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                                await delay(2000)
                                member.kick("FAILED THE CAPTCHA").catch(() => {});
                                ch.delete(() => {});
                              }).catch(async e => {
                                await ch.user.send(`**OH NO - You failed the CAPTCHA!**\n> :hammer: *I kicked you from the Server due to Security Reasons*`).catch(() => {})
                                await delay(2000)
                                member.kick("FAILED THE CAPTCHA").catch(() => {});
                                ch.delete(() => {});
                              })
                            }
                          }
                        }catch (E){
                          member.kick("FAILED THE CAPTCHA").catch(() => {});
                        }
                      }
                    }).catch(async () => {
                      msg.edit({
                        embeds: [],
                        content: `**Failed the CAPTCHA!**`
                      }).catch(() => {});
                      try{ 
                        //kick the member, but fetch the invites first if there is no valid invite
                        if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size < 1)
                          await member.guild.invites.fetch().catch(() => {});
                        //if there is a valid invite which lasts for at least 10 minutes or forever
                        if(member.guild.invites.cache.filter(i => i?.code && (i?.maxAge === 0 || i?.maxAge > 600)).size > 0){
                          await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${member.guild.invites.cache.filter(i => i?.code && i?.maxAge === 0).first().code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                          await delay(2000)
                          member.kick("FAILED THE CAPTCHA").catch(() => {});
                          ch.delete(() => {});
                        } else {
                          let channels = member.guild.channels.cache.filter(ch => ch.permissionsFor(member.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
                          if(channels.size > 0) {
                            member.guild.invites.create(channels.first().id).create().then(async invite => {
                              await ch.send(`**OH NO - You failed the CAPTCHA!**\n> Here is an Invite Link in case u need one: https://discord.gg/${invite.code}\n> :hammer: *I kicked you from the Server due to Security Reasons*`)
                              await delay(2000)
                              member.kick("FAILED THE CAPTCHA").catch(() => {});
                              ch.delete(() => {});
                            }).catch(async e => {
                              await ch.user.send(`**OH NO - You failed the CAPTCHA!**\n> :hammer: *I kicked you from the Server due to Security Reasons*`).catch(() => {})
                              await delay(2000)
                              member.kick("FAILED THE CAPTCHA").catch(() => {});
                              ch.delete(() => {});
                            })
                          }
                        }
                      }catch (E){
                        member.kick("FAILED THE CAPTCHA").catch(() => {});
                      }
                    })
                  }).catch(() => {})
                }
              } else {
                member.guild.fetchOwner().then(owner => {
                  owner.send(`:warning: **I can't create Channels_with_SEND_MESSAGES_PERMISSIONS for Captcha User, please give me PERMISSIONS for it asap!**`).catch(() => {});
                }).catch(() => {});
                member.kick().catch(() => {});
              }

            }catch(e){
              console.log(e);
              ch.delete().catch(() => {})
              member.kick().catch(() => {});
            }
          }).catch(e => {
            member.kick().catch(() => {});
            member.guild.fetchOwner().then(owner => {
              owner.send(`:warning: **I can't create Channels for Captcha User, please give me PERMISSIONS for it asap!**`).catch(() => {});
            }).catch(() => {});
          })
        })
      } else {
        add_roles(member)
        message(member)
      }
    }
    async function message(member) {
      let welcome = client.settings.get(member.guild.id, "welcome");
      if(welcome && welcome.secondchannel !== "nochannel"){
        let themessage = String(welcome.secondmsg);
        if(!themessage || themessage.length == 0) themessage = ":wave: {user} **Welcome to our Server!** :v:";
        themessage = themessage.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`)
        let channel = member.guild.channels.cache.get(welcome.secondchannel);
        if(!channel){
          try{
            client.channels.fetch(welcome.secondchannel).then(ch => {
              ch.send({content: themessage}).catch(() => {});
            }).catch(() => {});
          }catch (e){
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
          }
        } else {
          if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
            channel.send({content: themessage}).catch(() => {});
          }
        }
      }

      if (welcome && welcome.channel !== "nochannel") {
        if (welcome.image) {
          if (welcome.dm) {
            if (welcome.customdm === "no") dm_msg_autoimg(member);
            else dm_msg_withimg(member);
          }

          if (welcome.custom === "no") msg_autoimg(member);
          else msg_withimg(member);
        } else {

          if (welcome.dm) {
            dm_msg_withoutimg(member);
          }

          msg_withoutimg(member)
        }
      }


      async function msg_withoutimg(member) {
        let welcomechannel = client.settings.get(member.guild.id, "welcome.channel");
        if (!welcomechannel) return;
        let channel = await client.channels.fetch(welcomechannel).catch(() => {})
        if (!channel) return;

        //define the welcome embed
        const welcomeembed = new Discord.MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter({text: `ID: ${member.user.id}`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`})
          .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable7"]))
          .setDescription(client.settings.get(member.guild.id, "welcome.msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
          .addField(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variablex_8"]), eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable8"]))
        
          //send the welcome embed to there
          if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
            if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)){
              channel.send({
                content: `<@${member.user.id}>`,
                embeds: [welcomeembed]
              }).catch(() => {});
            } else {
              channel.send({
                content: `<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
              }).catch(() => {});
            }
          }
        
      }
      async function dm_msg_withoutimg(member) {
        //define the welcome embed
        const welcomeembed = new Discord.MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter({text: `ID: ${member.user.id}`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`})
          .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable9"]))
          .setDescription(client.settings.get(member.guild.id, "welcome.dm_msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
          if(client.settings.get(member.guild.id, "welcome.invitedm")) welcomeembed.addField("\u200b", `${invitemessage}`)
          //send the welcome embed to there
        member.user.send({
          content: `<@${member.user.id}>`,
          embeds: [welcomeembed]
        }).catch(() => {});
      }


      async function dm_msg_withimg(member) {
        //define the welcome embed
        const welcomeembed = new Discord.MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter({text: `ID: ${member.user.id}`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`})
          .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable10"]))
          .setDescription(client.settings.get(member.guild.id, "welcome.dm_msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
          .setImage(client.settings.get(member.guild.id, "welcome.customdm"))
          if(client.settings.get(member.guild.id, "welcome.invitedm")) welcomeembed.addField("\u200b", `${invitemessage}`)
          //send the welcome embed to there
        member.user.send({
          content: `<@${member.user.id}>`,
          embeds: [welcomeembed]
        }).catch(() => {});
      }
      async function msg_withimg(member) {
        let welcomechannel = client.settings.get(member.guild.id, "welcome.channel");
        if (!welcomechannel) return;
        let channel = await client.channels.fetch(welcomechannel).catch(() => {})
        if (!channel) return;

        //define the welcome embed
        const welcomeembed = new Discord.MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter({text: `ID: ${member.user.id}`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`})
          .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable11"]))
          .setDescription(client.settings.get(member.guild.id, "welcome.msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
          .setImage(client.settings.get(member.guild.id, "welcome.custom"))
          if(client.settings.get(member.guild.id, "welcome.invite")) welcomeembed.addField("\u200b", `${invitemessage}`)
          //send the welcome embed to there
        if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
          if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)){
            channel.send({
              content: `<@${member.user.id}>`,
              embeds: [welcomeembed]
            }).catch(() => {});
          } else {
            channel.send({
              content: `<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
            }).catch(() => {});
          }
        }
      }

      async function dm_msg_autoimg(member) {
        try {
          //define the welcome embed
          const welcomeembed = new Discord.MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setTimestamp()
            .setFooter({text: `ID: ${member.user.id}`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`})
          .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable12"]))
            .setDescription(client.settings.get(member.guild.id, "welcome.dm_msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
          if(client.settings.get(member.guild.id, "welcome.invitedm")) welcomeembed.addField("\u200b", `${invitemessage}`)
        //member roles add on welcome every single role
          const canvas = Canvas.createCanvas(1772, 633);
          //make it "2D"
          const ctx = canvas.getContext(`2d`);

          if (client.settings.get(member.guild.id, "welcome.backgrounddm") !== "transparent") {
            try {
              const bgimg = await Canvas.loadImage(client.settings.get(member.guild.id, "welcome.backgrounddm"));
              ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
            } catch {}
          } else {
            try {
              if (!member.guild.iconURL() || member.guild.iconURL() == null || member.guild.iconURL() == undefined) return;
              const img = await Canvas.loadImage(member.guild.iconURL({
                format: "png"
              }));
              ctx.globalAlpha = 0.3;
              //draw the guildicon
              ctx.drawImage(img, 1772 - 633, 0, 633, 633);
              ctx.globalAlpha = 1;
            } catch {}
          }

          if (client.settings.get(member.guild.id, "welcome.framedm")) {
            let background;
            var framecolor = client.settings.get(member.guild.id, "welcome.framecolordm").toUpperCase();
            if (framecolor == "WHITE") framecolor = "#FFFFF9";
            if (client.settings.get(member.guild.id, "welcome.discriminatordm") && client.settings.get(member.guild.id, "welcome.servernamedm"))
              background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

            else if (client.settings.get(member.guild.id, "welcome.discriminatordm"))
              background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

            else if (client.settings.get(member.guild.id, "welcome.servernamedm"))
              background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

            else
              background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            if (client.settings.get(member.guild.id, "welcome.pbdm")) {
              background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
              ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            }
          }

          var fillcolors = client.settings.get(member.guild.id, "welcome.framecolordm").toUpperCase();
          if (fillcolors == "WHITE") framecolor = "#FFFFF9";
          ctx.fillStyle = fillcolors.toLowerCase();

          //set the first text string 
          var textString3 = `${member.user.username}`;
          //if the text is too big then smaller the text
          if (textString3.length >= 14) {
            ctx.font = `100px ${Fonts}`;         
            await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
          }
          //else dont do it
          else {
            ctx.font = `150px ${Fonts}`;
            await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
          }



          ctx.font = `bold 50px ${wideFonts}`;
          //define the Discriminator Tag
          if (client.settings.get(member.guild.id, "welcome.discriminatordm")) {
            await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
          }
          //define the Member count
          if (client.settings.get(member.guild.id, "welcome.membercountdm")) {
            await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
          }
          //get the Guild Name
          if (client.settings.get(member.guild.id, "welcome.servernamedm")) {
            await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
          }

          if (client.settings.get(member.guild.id, "welcome.pbdm")) {
            //create a circular "mask"
            ctx.beginPath();
            ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
            ctx.closePath();
            ctx.clip();
            //define the user avatar
            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
              format: `png`
            }));
            //draw the avatar
            ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
          }

          //get it as a discord attachment
          const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-image.png`);
          //send the welcome embed to there
          member.user.send({
            content: `<@${member.user.id}>`,
            embeds: [welcomeembed.setImage(`attachment://welcome-image.png`) ],
            files: [attachment]
          }).catch(() => {});
          //member roles add on welcome every single role
        } catch {}
      }
      async function msg_autoimg(member) {
        try {
          let welcomechannel = client.settings.get(member.guild.id, "welcome.channel");
          if (!welcomechannel) return
          let channel = await client.channels.fetch(welcomechannel).catch(() => {})
          if (!channel) return 
          //define the welcome embed
          const welcomeembed = new Discord.MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setTimestamp()
            .setFooter({text: `ID: ${member.user.id}`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`})
            .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable13"]))
            .setDescription(client.settings.get(member.guild.id, "welcome.msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
            if(client.settings.get(member.guild.id, "welcome.invite")) welcomeembed.addField("\u200b", `${invitemessage}`)
            try {
            //member roles add on welcome every single role
            const canvas = Canvas.createCanvas(1772, 633);
            //make it "2D"
            const ctx = canvas.getContext(`2d`);

            if (client.settings.get(member.guild.id, "welcome.background") !== "transparent") {
              try {
                const bgimg = await Canvas.loadImage(client.settings.get(member.guild.id, "welcome.background"));
                ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
              } catch {}
            } else {
              try {
                if (!member.guild.iconURL() || member.guild.iconURL() == null || member.guild.iconURL() == undefined) return;
                const img = await Canvas.loadImage(member.guild.iconURL({
                  format: "png"
                }));
                ctx.globalAlpha = 0.3;
                //draw the guildicon
                ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                ctx.globalAlpha = 1;
              } catch {}
            }


            if (client.settings.get(member.guild.id, "welcome.frame")) {
              let background;
              var framecolor = client.settings.get(member.guild.id, "welcome.framecolor").toUpperCase();
              if (framecolor == "WHITE") framecolor = "#FFFFF9";
              if (client.settings.get(member.guild.id, "welcome.discriminator") && client.settings.get(member.guild.id, "welcome.servername"))
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

              else if (client.settings.get(member.guild.id, "welcome.discriminator"))
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

              else if (client.settings.get(member.guild.id, "welcome.servername"))
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

              else
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

              ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

              if (client.settings.get(member.guild.id, "welcome.pb")) {
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
              }
            }

            var fillcolor = client.settings.get(member.guild.id, "welcome.framecolor").toUpperCase();
            if (fillcolor == "WHITE") framecolor = "#FFFFF9";
            ctx.fillStyle = fillcolor.toLowerCase();

            //set the first text string 
            var textString3 = `${member.user.username}`;
            //if the text is too big then smaller the text
            if (textString3.length >= 14) {
              ctx.font = `100px ${Fonts}`;
              await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
            }
            //else dont do it
            else {
              ctx.font = `150px ${Fonts}`;
              await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
            }

            ctx.font = `bold 50px ${wideFonts}`;
            //define the Discriminator Tag
            if (client.settings.get(member.guild.id, "welcome.discriminator")) {
              await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
            }
            //define the Member count
            if (client.settings.get(member.guild.id, "welcome.membercount")) {
              await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
            }
            //get the Guild Name
            if (client.settings.get(member.guild.id, "welcome.servername")) {
              await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
            }


            if (client.settings.get(member.guild.id, "welcome.pb")) {
              //create a circular "mask"
              ctx.beginPath();
              ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
              ctx.closePath();
              ctx.clip();
              //define the user avatar
              const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
                format: `png`
              }));
              //draw the avatar
              ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
            }
            //get it as a discord attachment
            const attachment = new Discord.MessageAttachment(await canvas.toBuffer(), `welcome-image.png`);
            //send the welcome embed to there
            if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
              if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS) && channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.ATTACH_FILES)){
                channel.send({
                  content: `<@${member.user.id}>`,
                  embeds: [welcomeembed.setImage(`attachment://welcome-image.png`)],
                  files: [attachment]
                }).catch(() => {});
              } else if(channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.ATTACH_FILES)){
                channel.send({
                  content: `<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                  files: [attachment]
                }).catch(() => {});
              } else {
                channel.send({
                  content: `<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                  files: [attachment]
                }).catch(() => {});
              }
            }
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey);
          }
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      }
    }

    function add_roles(member) {
      let roles = client.settings.get(member.guild.id, "welcome.roles")
      if (roles && roles.length > 0) {
        for (const role of roles) {
          try {
            let R = member.guild.roles.cache.get(role);
            if(R) member.roles.add(R.id).catch(() => {});
          } catch (e){ }
        }
      }
    }
  })
  

  /**
   * ANTI-NEW-ACCOUNT Detector
   */
  client.on("guildMemberAdd", async member => {
    if(!member.guild || member.user.bot) return;
    client.settings.ensure(member.guild.id, {
      antinewaccount: {
        enabled: false,
        delay: ms("2 days"),
        action: "kick", // kick / ban
        extra_message: "Please do not join back, unless you meet the requirements!"
      } 
    });
    //Return if account system is disabled
    if(!client.settings.get(member.guild.id, "antinewaccount.enabled")) return; 
    //get the ms time of the account creationj
    const createdAccount = new Date(member.user.createdAt).getTime(); 
    const newaccount_delay = client.settings.get(member.guild.id, "antinewaccount.delay");
    //return if account is old enough
    if(newaccount_delay < Date.now() - createdAccount) return;
    const extramessage = client.settings.get(member.guild.id, "antinewaccount.extra_message");
    const action = client.settings.get(member.guild.id, "antinewaccount.action");
    if(action == "ban") {
      await member.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle(`You got banned from __${member.guild.name}__`)
          .setThumbnail(member.guild.iconURL({dynamic: true}))
          .setFooter({text: `${member.guild.name} | ${member.guild.id}`, iconURL: `${member.guild.iconURL({dynamic: true})}`})
          .setDescription(`This is because your Account was Created ${duration(Date.now() - createdAccount).map(a => `\`${a}\``).join(", ")} ago, and the minimum Amount of Account-Age should be: ${duration(newaccount_delay).map(a => `\`${a}\``).join(", ")}`)
          .addField(`**Guild-Message:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No Extra Message provided"}`.substring(0, 1024))
        ]
      }).catch(() => {});
      member.ban({reason: `Alt Account Detection | Account created ${duration(Date.now() - createdAccount).join(", ")} ago`})
    } else {
      await member.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle(`You got kicked from __${member.guild.name}__`)
          .setThumbnail(member.guild.iconURL({dynamic: true}))
          .setFooter({text: `${member.guild.name} | ${member.guild.id}`, iconURL: `${member.guild.iconURL({dynamic: true})}`})
          .setDescription(`This is because your Account was Created ${duration(Date.now() - createdAccount).map(a => `\`${a}\``).join(", ")} ago, and the minimum Amount of Account-Age should be: ${duration(newaccount_delay).map(a => `\`${a}\``).join(", ")}`)
          .addField(`**Guild-Message:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No Extra Message provided"}`.substring(0, 1024))
        ]
      }).catch(() => {});
      member.kick({reason: `Alt Account Detection | Account created ${duration(Date.now() - createdAccount).join(", ")} ago`})
    }
  })


  /**
   * JOINLIST SYSTEM
   */
  client.on("guildMemberAdd", async member => {
    if(!member.guild || member.user.bot) return;
    client.settings.ensure(member.guild.id, {
      joinlist: {
        username_contain: [/*
          {
            data: "",
            action: "",
            time: TIMESTAMP,
            nickname: NICKNAME/{random}
          } 
        */],
        username_equal: [],
        userid: [],
        server_in_common: [],
        server_not_in_common: [],
        noavatar: []
      }
    });

    const joinlist = client.settings.get(member.guild.id, "joinlist");
    
    let inthere = false;
    let notInthere = false;
    
    if(!member.user.avatarURL() && joinlist.noavatar.filter(d => d.data == "enable").length > 0) {
      const reason = '`User not having an Avatar (joinlist)`'
      const datas = joinlist.noavatar.filter(d => d.data == "enable");
      await handleDatas(datas, reason);
    }

    if(joinlist.username_contain.map(d => d.data).some(d => member.user.username.toLowerCase().includes(d.toLowerCase()))) {
      const reason = '`Username contains ${data.data} (joinlist)`'
      const datas = joinlist.username_contain.filter(d => member.user.username.toLowerCase().includes(d.data.toLowerCase()));
      await handleDatas(datas, reason);
    }

    if(joinlist.username_equal.map(d => d.data).some(d => d.toLowerCase() == member.user.username.toLowerCase())) {
      const reason = '`Username is equal to ${data.data} (joinlist)`'
      const datas = joinlist.username_equal.filter(d => d.data.toLowerCase() == member.user.username.toLowerCase());
      await handleDatas(datas, reason);
    }

    if(joinlist.userid.map(d => d.data).some(d => d == member.id)) {
      const reason = '`User ID is equal to ${data.data} (joinlist)`'
      const datas = joinlist.userid.filter(d => d.data == member.id);
      await handleDatas(datas, reason);
    }

    if(joinlist.server_in_common.map(d => d.data).length > 0) {
      const guilds = joinlist.server_in_common.map(d => d.data);
      for(const guild of guilds) {
        const g = client.guilds.cache.get(guild);
        if(g) {
          let themember = g.members.cache.get(member.id) || await g.members.fetch(member.id).catch(() => {})
          if(themember) {
            inthere = g;
            break;
          }
        }
      }
      const reason = '`You are in the Guild ${inthere.name} (joinlist)`'
      const datas = joinlist.server_in_common.filter(d => d.data == inthere.id);
      await handleDatas(datas, reason, true);
    }

    if(joinlist.server_not_in_common.map(d => d.data).length > 0) {
      const guilds = joinlist.server_not_in_common.map(d => d.data);
      for(const guild of guilds) {
        const g = client.guilds.cache.get(guild);
        if(g) {
          let themember = g.members.cache.get(member.id) || await g.members.fetch(member.id).catch(() => {})
          if(!themember) {
            notInthere = g;
            break;
          }
        }
      }
      const reason = '`You are not in the Guild ${notInthere.name} (joinlist)`'
      const datas = joinlist.server_not_in_common.filter(d => d.data == notInthere.id);
      await handleDatas(datas, reason);
    }

    function handleDatas(datas, reason = "No reason provided") {
      return new Promise(async (resolve, reject) => {
        if(datas.length > 0) {
          for(const data of datas) {
            if(data.action == "kick") {
              if(member.kickable) {
                await member.send(`You got kicked from \`${member.guild.name}\` because:\n> ${eval(reason)}`).catch(() => {});
                await member.kick({reason: `${eval(reason)}`}).catch(console.warn)
              }
            } 
            if(data.action == "ban") {
              if(member.bannable) {
                await member.send(`You got banned from \`${member.guild.name}\` for ${data.days != 0 ? `${data.days} Days` : `ever`} because:\n> ${eval(reason)}`).catch(() => {});
                await member.ban({reason: `${eval(reason)}`, days: data.days }).catch(console.warn)
              }
            } 
            if(data.time && data.time > 0 && data.action == "timeout") {
              if(member.manageable) {
                await member.send(`You got timeouted until <t:${Math.floor((Date.now() + data.time) / 1000)}:F> from \`${member.guild.name}\` because:\n> ${eval(reason)}`).catch(() => {});
                await member.timeout(data.time, `${eval(reason)}`).catch(console.warn)
              }
            } 
            if(data.nickname && data.nickname.length > 0 && data.nickname.length < 32 && data.action == "setnickname") {
              if(member.manageable) {
                await member.setNickname(data.nickname, `${eval(reason)}`).catch(console.warn)
              }
            }
          }
          return resolve(true);
        } else {
          return resolve(true);
        }
      })
    }
  })


  /**
   * INCREASE THE MESSAGECOUNTER 
   */
  client.on("messageCreate", message => {
    if(message.guild && message.author.id){
      // Fetch guild and member data from the db
      client.invitesdb.ensure(message.guild.id + message.author.id, {
        messagesCount: 0,
      });
      client.invitesdb.inc(message.guild.id + message.author.id, "messagesCount")
    }
  })

  function inviteToJson (invite) {
    return {
        code: invite.code,
        uses: invite.uses,
        maxUses: invite.maxUses,
        inviter: invite.inviter,
        deletedTimestamp: invite.deletedTimestamp,
    };
  };

  function generateInvitesCache (invitesCache) {
    const cacheCollection = new Discord.Collection();
    invitesCache.forEach((invite) => {
        cacheCollection.set(invite.code, inviteToJson(invite));
    });
    return cacheCollection;
  };

  function isEqual (value, other) {
    const type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(other)) return false;
    if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
    const valueLen = type === "[object Array]" ? value.length : Object.keys(value).length;
    const otherLen = type === "[object Array]" ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
    const compare = (item1, item2) => {
        const itemType = Object.prototype.toString.call(item1);
        if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }
        else {
            if (itemType !== Object.prototype.toString.call(item2)) return false;
            if (itemType === "[object Function]") {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }
        }
    };
    if (type === "[object Array]") {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }
    return true;
  };
  function EnsureInviteDB(guild, user) {
    client.invitesdb.ensure(guild.id + user.id, {
      /* REQUIRED */
      id: user.id, // Discord ID of the user
      guildId: guild.id,
      /* STATS */
      fake: 0,
      leaves: 0,
      invites: 0,
      /* INVITES DATA */
      invited: [],
      left: [],
      /* INVITER */
      joinData: {
        type: "unknown",
        invite: null
      }, // { type: "normal" || "unknown" || "vanity", invite: inviteData || null }
      messagesCount: 0,
      /* BOT */
      bot: user.bot
    });
  }
}
