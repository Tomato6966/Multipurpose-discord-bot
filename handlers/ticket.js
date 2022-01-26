const ee = require(`${process.cwd()}/botconfig/embed.json`)
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const moment = require("moment");
const { dbEnsure } = require("./functions");

module.exports = (client, preindex) => {

  const maxTicketsAmount = 100;

  client.on("interactionCreate", async (interaction) => {
    if (!interaction?.isButton()) return;
    var { guild, channel, user, message } = interaction;
    if (!guild || !channel || !message || !user) return
    if (!interaction?.customId.includes("create_a_ticket")) return
    
    let index = preindex ? preindex : false;
    if (!index) {
      for (let i = 1; i <= maxTicketsAmount; i++) {
        let d = client.setups
        if (d.has(guild.id)) {
          let data = d.get(guild.id, `ticketsystem${i}`);
          if (data && message.id === data.messageid && channel.id === data.channelid) index = i;
        }
      }
    }
    if (!index) {
      return interaction?.editReply(":x: Could not find the Database for your Ticket!");
    }

    let filename = `ticket${index}`;
    let systempath = `ticketsystem${index}`;
    let ticketspath = `tickets${index}`;
    let idpath = `ticketid${index}`;
    let tickettypepath = `ticket-setup-${index}`;


    client.setups.ensure(guild.id, {
      enabled: false,
      guildid: guild.id,
      defaultname: "🎫・{count}・{member}",
      messageid: "",
      channelid: "",
      parentid: "",
      claim: {
        enabled: false,
        messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
        messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
      },
      message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
      adminroles: []
    }, systempath);


    let ticket = client.setups.get(guild.id, systempath);
    if (!ticket.claim || !ticket.claim.messageOpen) {
      client.setups.ensure(guild.id, {
        enabled: false,
        messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
        messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
      }, `${systempath}.claim`);
    }
    //if invalid return
    if (guild.id !== ticket.guildid || interaction?.message.id !== ticket.messageid) return

    if (client.setups.get("TICKETS", ticketspath).includes(user.id)) {
      try {
        var ticketchannel = guild.channels.cache.get(client.setups.get(user.id, idpath))
        if (!ticketchannel || ticketchannel == null || !ticketchannel.id || ticketchannel.id == null) throw {
          message: "NO TICKET CHANNEL FOUND AKA NO ANTISPAM"
        }
        if (client.setups.has(ticketchannel.id) && client.setups.has(ticketchannel.id, "ticketdata")) {
          let data = client.setups.get(ticketchannel.id, "ticketdata");
          if (data.state != "closed") {
            return interaction?.reply({ content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true });
          }
        }
      } catch {
        client.setups.remove("TICKETS", user.id, ticketspath)
      }

    }

    client.stats.ensure(guild.id, {
      ticketamount: 0
    });
    client.stats.inc(guild.id, "ticketamount");
    let ticketamount = client.stats.get(guild.id, "ticketamount");

    let channelname = ticket.defaultname.replace("{member}", user.username).replace("{count}", ticketamount).replace(/\s/igu, "-").substring(0, 31);

    let optionsData = {
      topic: `📨 #${String(filename).replace("ticket", "").length > 0 ? String(filename).replace("ticket", "") : "1"} Ticket for: ${user.tag} (${user.id}) | ✅ Created at: ${moment().format("LLLL")}`,
      type: "GUILD_TEXT",
      reason: `Ticket System #${String(filename).replace("ticket", "").length > 0 ? String(filename).replace("ticket", "") : "1"} for: ${user.tag}`,
      permissionOverwrites: []
    }


    /**
     * CHANNEL CATEGORY
     */
    try {
      var cat = guild.channels.cache.get(ticket.parentid)
      if (cat) {
        if (cat.type == "GUILD_CATEGORY") {
          if (cat.children.size < 50) {
            optionsData.parent = String(cat.id);
          }
        }
      } else {
        if (channel.parent) {
          if (channel.parent.children.size < 50) {
            optionsData.parent = String(channel.parent.id);
          }
        }
      }
    } catch (e) {
      if (channel.parent) {
        if (channel.parent.children.size < 50) {
          optionsData.parent = String(channel.parent.id);
        }
      }
    }



    /**
     * CREATE THE PERMISSIONOVERWRITES DATA
     */
    optionsData.permissionOverwrites = [...guild.roles.cache.filter(d => d.id != guild.id).values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(r => {
      let Obj = {}
      if (r.id) {
        Obj.id = r.id;
        Obj.type = "role";
        Obj.deny = ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"]
        Obj.allow = [];
        return Obj;
      } else {
        return false;
      }
    }).filter(Boolean);
    //MAKE TICKET PRIVATE
    optionsData.permissionOverwrites.push({
      id: guild.id,
      type: "role",
      allow: [],
      deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
    })
    //Add USER ID Permissions to the TICKET
    optionsData.permissionOverwrites.push({
      id: user.id,
      type: "member",
      allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
      deny: [],
    })
    if (guild.roles.cache.some(r => ticket.adminroles.includes(r ? r.id : r))) {
      for (let adminrole of ticket.adminroles) {
        if (guild.roles.cache.has(adminrole)) {
          const index = optionsData.permissionOverwrites.findIndex(d => d.id == adminrole);
          if (index > -1) {
            optionsData.permissionOverwrites.splice(index, 1);
          }
          if (ticket.claim.enabled) {
            optionsData.permissionOverwrites.push({
              id: adminrole,
              type: "role",
              allow: ["VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
              deny: ["SEND_MESSAGES"], //dont allow to send messages until its claimed
            });
          } else {
            optionsData.permissionOverwrites.push({
              id: adminrole,
              type: "role",
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
              deny: []
            });
          }
        } else {
        }
      }
    }
    //if there are too many, remove the first ones..
    while (optionsData.permissionOverwrites.length >= 99) {
      optionsData.permissionOverwrites.shift();
    }



    /**
     * CREATE THE CHANNEL
     */
    await interaction?.reply({ content: `<a:Loading:833101350623117342> **Creating your Ticket...** (Usually takes 0-2 Seconds)`, ephemeral: true });
    guild.channels.create(channelname.substring(0, 31), optionsData).then(async ch => {
      let es = client.settings.get(guild.id, "embed")
      client.setups.push("TICKETS", user.id, ticketspath);
      client.setups.push("TICKETS", ch.id, ticketspath);
      client.setups.set(user.id, ch.id, idpath);
      client.setups.set(ch.id, {
        user: user.id,
        channel: ch.id,
        guild: guild.id,
        type: tickettypepath,
        state: "open",
        date: Date.now(),
      }, "ticketdata");

      var ticketembed = new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(`To close/manage this ticket react with the buttons\nYou can also type: ${client.settings.get(guild.id, "prefix")}ticket`, es.footericon))
        .setAuthor(client.getAuthor(`Ticket for: ${user.tag}`, user.displayAvatarURL({
          dynamic: true
        }), "https://discord.gg/milrato"))
        .setDescription(ticket.message.replace(/\{user\}/igu, `${user}`).substring(0, 2000))
      var ticketembeds = [ticketembed]
      if (ticket.claim.enabled) {
        var claimEmbed = new MessageEmbed()
          .setColor("ORANGE").setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setAuthor(client.getAuthor(`A Staff Member will claim the Ticket soon!`, "https://cdn.discordapp.com/emojis/833101350623117342.gif?size=44", "https://discord.gg/milrato"))
          .setDescription(ticket.claim.messageOpen.replace(/\{user\}/igu, `${user}`).substring(0, 2000))
        ticketembeds.push(claimEmbed)
      }
      const {
        MessageButton
      } = require('discord.js')
      let button_close = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_close').setLabel('Close').setEmoji("🔒")
      let button_delete = new MessageButton().setStyle('SECONDARY').setCustomId('ticket_delete').setLabel("Delete").setEmoji("🗑️")
      let button_transcript = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_transcript').setLabel("Transcript").setEmoji("📑")
      let button_user = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_user').setLabel("Users").setEmoji("👤")
      let button_role = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_role').setLabel("Roles").setEmoji("📌")
      const allbuttons = [new MessageActionRow().addComponents([button_close, button_delete, button_transcript, button_user, button_role])]
      if (ticket.claim.enabled) {
        allbuttons.push(new MessageActionRow().addComponents([new MessageButton().setStyle('SECONDARY').setCustomId('ticket_claim').setLabel("Claim the Ticket").setEmoji("✅")]))
      }
      let ticketroles = ticket.adminroles.map(r => `<@&${r}>`);
      if (ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
        if (ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.EMBED_LINKS)) {
          await ch.send({
            content: `<@${user.id}> ${ticketroles.length > 0 ? "| " + ticketroles.join(" / ") : ""}`,
            embeds: ticketembeds,
            components: allbuttons
          }).catch((O) => {
            console.log(String(O).grey)
          }).then(msg => {
            if (msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
              msg.pin().catch((O) => {
                console.log(String(O).grey)
              })
            }
          })
        } else {
          await ch.send({
            content: `<@${user.id}> ${ticketroles.length > 0 ? "| " + ticketroles.join(" / ") : ""}\n${ticketembeds[0].description}`.substring(0, 2000),
            components: allbuttons
          }).catch((O) => {
            console.log(String(O).grey)
          }).then(msg => {
            if (msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
              msg.pin().catch((O) => {
                console.log(String(O).grey)
              })
            }
          })
        }
      }
      await interaction?.editReply({ content: `<a:yes:833101995723194437> **Your Ticket is created!** <#${ch.id}>`, ephemeral: true });
    }).catch(e => {
      interaction?.editReply({ content: ":x: **Something went wrong!**", ephemeral: true })
      console.error(e)
    })
  });
}
