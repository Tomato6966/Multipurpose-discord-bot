const ee = require(`${process.cwd()}/botconfig/embed.json`)
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const moment = require("moment");
const { dbEnsure, dbRemove, delay } = require("./functions");

module.exports = (client, preindex) => {

  const maxTicketsAmount = 100;

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    var { guild, channel, user, message, channelId } = interaction;
    if (!guild || !channel || !message || !user) return
    if (!interaction.customId.includes("create_a_ticket")) return
    
    let index = preindex ? preindex : false;
    let d = client.setups
    let guildData = await d.get(guild.id)
    if (!index) {
      for (let i = 1; i <= maxTicketsAmount; i++) {
        if (guildData) {
          let data = guildData[`ticketsystem${i}`]
          if (!data) continue;
          if (message.id === data.messageid && (channel.id === data.channelid || channelId === data.channelid)) index = i;
          else continue;
        } else {
          break;
        }
      }
    }
    if (!index) {
      if(!interaction.replied) await interaction.reply(":x: Could not find the Database for your Ticket!").catch(console.warn);
      else await interaction.editReply(":x: Could not find the Database for your Ticket!").catch(console.warn);
      return 
    }
    if(!interaction.replied) await interaction.reply({ephemeral: true, content: `Found the DB-INDEX`}).catch(console.warn);
    else await interaction.editReply({ephemeral: true, content: `Found the DB-INDEX`}).catch(console.warn);
    let filename = `ticket${index}`;
    let systempath = `ticketsystem${index}`;
    let ticketspath = `tickets${index}`;
    let idpath = `ticketid${index}`;
    let tickettypepath = `ticket-setup-${index}`;

    const obj = {};
    obj[systempath] = {
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
    }
    await dbEnsure(client.setups, `${guild.id}`, obj, true);


    let ticket = await guildData[systempath];
    
    //if invalid return
    if (guild.id !== ticket.guildid || interaction.message.id !== ticket.messageid) return console.log(`Invalid Ticket Data`, ticket)
    let dd = await client.setups.get(`TICKETS.${ticketspath}`);
    if (dd.includes(user.id)) {
      try {
        var ticketchannel = guild.channels.cache.get(await client.setups.get(`${user.id}.${idpath}`))
        if (!ticketchannel || ticketchannel == null || !ticketchannel.id || ticketchannel.id == null) throw {
          message: "NO TICKET CHANNEL FOUND AKA NO ANTISPAM"
        }
        let data = await client.setups.get(`${ticketchannel.id}.ticketdata`);
        if (data) {
          if (data.state != "closed") {
            if(!interaction.replied) await interaction.reply({ content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true }).catch(console.warn);
            else await interaction.editReply({ content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true }).catch(console.warn);
            return
          }
        }
      } catch {
        await dbRemove(client.setups, `TICKETS.${ticketspath}`, user.id)
      }

    }

    await dbEnsure(client.stats, guild.id, {
      ticketamount: 0
    });
    await client.stats.add(guild.id+ ".ticketamount", 1);
    let ticketamount = await client.stats.get(guild.id+".ticketamount");

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
    if(!interaction.replied) await interaction.reply({ content: `<a:Loading:833101350623117342> **Creating your Ticket...** (Usually takes 0-2 Seconds)`, ephemeral: true }).catch(console.warn);
    else await interaction.editReply({ content: `<a:Loading:833101350623117342> **Creating your Ticket...** (Usually takes 0-2 Seconds)`, ephemeral: true }).catch(console.warn);
    guild.channels.create(channelname.substring(0, 31), optionsData).then(async ch => {
      let settings = await client.settings.get(guild.id)
      let es = settings.embed || ee

      client.setups.push(`TICKETS.${ticketspath}`, user.id);
      client.setups.push(`TICKETS.${ticketspath}`, ch.id);
      client.setups.set(`${user.id}.${idpath}`, ch.id);
      client.setups.set(`${ch.id}.ticketdata`, {
        user: user.id,
        channel: ch.id,
        guild: guild.id,
        type: tickettypepath,
        state: "open",
        date: Date.now(),
      });

      var ticketembed = new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(`To close/manage this ticket react with the buttons\nYou can also type: ${settings.prefix || config.prefix}ticket`, es.footericon))
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
          }).catch(console.error).then(msg => {
            if (msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
              msg.pin().catch(console.error)
            }
          })
        } else {
          await ch.send({
            content: `<@${user.id}> ${ticketroles.length > 0 ? "| " + ticketroles.join(" / ") : ""}\n${ticketembeds[0].description}`.substring(0, 2000),
            components: allbuttons
          }).catch(console.error).then(msg => {
            if (msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
              msg.pin().catch(console.error)
            }
          })
        }
      }
      await interaction.editReply({ content: `<a:yes:833101995723194437> **Your Ticket is created!** <#${ch.id}>`, ephemeral: true });
    }).catch(e => {
      interaction.editReply({ content: ":x: **Something went wrong!**", ephemeral: true })
      console.error(e)
    })
  });
}
