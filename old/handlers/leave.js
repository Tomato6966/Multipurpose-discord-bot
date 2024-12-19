//Import npm modules
const Discord = require("discord.js");
const Canvas = require("canvas");
const canvacord = require("canvacord");
//Load fonts
//Canvas.registerFont( "./assets/fonts/DMSans-Bold.ttf" , { family: "DM Sans", weight: "bold" } );
//Canvas.registerFont( "./assets/fonts/DMSans-Regular.ttf" , { family: "DM Sans", weight: "regular" } );
//Canvas.registerFont( "./assets/fonts/STIXGeneral.ttf" , { family: "STIXGeneral" } );
//Canvas.registerFont( "./assets/fonts/AppleSymbol.ttf" , { family: "AppleSymbol" } );
//Canvas.registerFont( "./assets/fonts/Arial.ttf"       , { family: "Arial" } );
//Canvas.registerFont( "./assets/fonts/ArialUnicode.ttf", { family: "ArielUnicode" } );
//Canvas.registerFont(`./assets/fonts/Genta.ttf`, { family: `Genta` } );
//Canvas.registerFont("./assets/fonts/UbuntuMono.ttf", { family: "UbuntuMono" } );
//require functions from files
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
//Create Variables
const Fonts = "Genta, UbuntuMono, `DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
const wideFonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
let invitemessage = "\u200b";
//Start the module
module.exports = client => {


  client.on("guildMemberRemove", async member => {
    if (!member.guild || member.user.bot) return; //if not finished yet return
    let ls = client.settings.get(member.guild.id, "language");
    let es = client.settings.get(member.guild.id, "embed");
    // Fetch guild and member data from the db
    EnsureInviteDB(member.guild, member.user)

    let memberData = client.invitesdb.find(v => v.id == member.id && v.guildId == member.guild.id && v.bot == member.user.bot);
    if (!memberData.joinData) {
      memberData.joinData = {
        type: "unknown",
        invite: null
      }
    }
    const leftInviterData = client.invitesdb.find(v => v.guildId == member.guild.id && v.invited && Array.isArray(v.invited) && v.invited.includes(member.id))
    const leftInviterDataKey = client.invitesdb.findKey(v => v.guildId == member.guild.id && v.invited && Array.isArray(v.invited) && v.invited.includes(member.id))
    // If the member was a rejoin, remove it from whom invited him before
    if (leftInviterData) {
      //make sure that the inviter Data is an array 
      if(!leftInviterData.left || !Array.isArray(leftInviterData.left)) {
        leftInviterData.left = [];
      }
      if(!leftInviterData.invited || !Array.isArray(leftInviterData.invited)) {
        leftInviterData.invited = [];
      }
      // It is removed from the invited members // inviterData
      if(!leftInviterData.left.includes(member.id))
        leftInviterData.left.push(member.id);
      //add a leave
      leftInviterData.leaves++;
      //Setting it back to 0 if its less then 0
      client.invitesdb.set(leftInviterDataKey, leftInviterData)
      let {
        invites,
        fake,
        leaves
      } = client.invitesdb.get(leftInviterDataKey);
      if(fake < 0) fake *= -1;
      if(leaves < 0) leaves *= -1;
      if(invites < 0) invites *= -1;
      let realinvites = invites - fake - leaves;
      let invitedby = member.guild.members.cache.get(leftInviterData.id) || await member.guild.members.fetch(leftInviterData.id).catch(()=>{}) || false;
      invitemessage = `Was Invited by ${invitedby && invitedby.tag ? `**${invitedby.tag}**` : `<@${leftInviterData.id}>`}\n<:Like:857334024087011378> **${realinvites} Invite${realinvites == 1 ? "" : "s"}**\n[<:joines:866356465299488809> ${invites} Joins | <:leaves:866356598356049930> ${leaves} Leaves | <:no:833101993668771842> ${fake} Fakes]`;
    } else {
      if(memberData.joinData.type == "vanity"){
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
      } else {
        invitemessage = `Invited by an **unkown Member!**`
      }
    }
    message(member);
  })


  async function message(member) {
    let ls = client.settings.get(member.guild.id, "language");
    let es = client.settings.get(member.guild.id, "embed");
    let leave = client.settings.get(member.guild.id, "leave");
    if (leave && leave.channel !== "nochannel") {
      if (leave.image) {
        if (leave.dm) {
          if (leave.customdm === "no") dm_msg_autoimg(member);
          else dm_msg_withimg(member);
        }
        if (leave.custom === "no") msg_autoimg(member);
        else msg_withimg(member);
      } else {
        if (leave.dm) {
          dm_msg_withoutimg(member);
        }
        msg_withoutimg(member)
      }
    }



    async function msg_withoutimg(member) {
      let leavechannel = client.settings.get(member.guild.id, "leave.channel");
      if (!leavechannel) return;
      let channel = await client.channels.fetch(leavechannel).catch(() => {})
      if (!channel) return;

      //define the leave embed
      const leaveembed = new Discord.MessageEmbed()
        .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTimestamp()
        .setFooter(client.getFooter("Good bye: " + member.user.id, member.user.displayAvatarURL({
          dynamic: true
        })))
        .setTitle(eval(client.la[ls]["handlers"]["leavejs"]["leave"]["variable1"]))
        .setDescription(client.settings.get(member.guild.id, "leave.msg").replace("{user}", `${member.user}`))
      if (client.settings.get(member.guild.id, "leave.invite")) leaveembed.addField("\u200b", invitemessage)
      //send the leave embed to there
      channel.send({
        embeds: [leaveembed]
      }).catch(e => console.log("This catch prevents a crash"))
    }
    async function dm_msg_withoutimg(member) {

      //define the leave embed
      const leaveembed = new Discord.MessageEmbed()
        .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTimestamp()
        .setFooter(client.getFooter("Good bye: " + member.user.id, member.user.displayAvatarURL({
          dynamic: true
        })))
        .setTitle(eval(client.la[ls]["handlers"]["leavejs"]["leave"]["variable2"]))
        .setDescription(client.settings.get(member.guild.id, "leave.dm_msg").replace("{user}", `${member.user}`))
      if (client.settings.get(member.guild.id, "leave.invitedm")) leaveembed.addField("\u200b", invitemessage)
      //send the leave embed to there
      member.user.send({
        embeds: [leaveembed]
      }).catch(e => console.log("This catch prevents a crash"))
    }


    async function dm_msg_withimg(member) {
      //define the leave embed
      const leaveembed = new Discord.MessageEmbed()
        .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTimestamp()
        .setFooter(client.getFooter("Good bye: " + member.user.id, member.user.displayAvatarURL({
          dynamic: true
        })))
        .setTitle(eval(client.la[ls]["handlers"]["leavejs"]["leave"]["variable3"]))
        .setDescription(client.settings.get(member.guild.id, "leave.dm_msg").replace("{user}", `${member.user}`))
        .setImage(client.settings.get(member.guild.id, "leave.customdm"))
      if (client.settings.get(member.guild.id, "leave.invitedm")) leaveembed.addField("\u200b", invitemessage)
      //send the leave embed to there
      member.user.send({
        embeds: [leaveembed]
      }).catch(e => console.log("This catch prevents a crash"))
    }
    async function msg_withimg(member) {
      let leavechannel = client.settings.get(member.guild.id, "leave.channel");
      if (!leavechannel) return;
      let channel = await client.channels.fetch(leavechannel).catch(() => {})
      if (!channel) return;

      //define the leave embed
      const leaveembed = new Discord.MessageEmbed()
        .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTimestamp()
        .setFooter(client.getFooter("Good bye: " + member.user.id, member.user.displayAvatarURL({
          dynamic: true
        })))
        .setTitle(eval(client.la[ls]["handlers"]["leavejs"]["leave"]["variable4"]))
        .setDescription(client.settings.get(member.guild.id, "leave.msg").replace("{user}", `${member.user}`))
        .setImage(client.settings.get(member.guild.id, "leave.custom"))
      if (client.settings.get(member.guild.id, "leave.invite")) leaveembed.addField("\u200b", invitemessage)
      //send the leave embed to there
      channel.send({
        embeds: [leaveembed]
      }).catch(e => console.log("This catch prevents a crash"))
    }

    async function dm_msg_autoimg(member) {
      try {
        //define the leave embed
        const leaveembed = new Discord.MessageEmbed()
          .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter(client.getFooter("Good bye: " + member.user.id, member.user.displayAvatarURL({
            dynamic: true
          })))
          .setTitle(eval(client.la[ls]["handlers"]["leavejs"]["leave"]["variable5"]))
          .setDescription(client.settings.get(member.guild.id, "leave.dm_msg").replace("{user}", `${member.user}`))
        if (client.settings.get(member.guild.id, "leave.invitedm")) leaveembed.addField("\u200b", invitemessage)

        //member roles add on leave every single role
        const canvas = Canvas.createCanvas(1772, 633);
        //make it "2D"
        const ctx = canvas.getContext('2d');

        if (client.settings.get(member.guild.id, "leave.backgrounddm") !== "transparent") {
          try {
            const bgimg = await Canvas.loadImage(client.settings.get(member.guild.id, "leave.backgrounddm"));
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

        if (client.settings.get(member.guild.id, "leave.framedm")) {
          let background;
          var framecolor = client.settings.get(member.guild.id, "leave.framecolordm").toUpperCase();
          if (framecolor == "WHITE") framecolor = "#FFFFF9";
          if (client.settings.get(member.guild.id, "leave.discriminatordm") && client.settings.get(member.guild.id, "leave.servernamedm"))
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

          else if (client.settings.get(member.guild.id, "leave.discriminatordm"))
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

          else if (client.settings.get(member.guild.id, "leave.servernamedm"))
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

          else
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          if (client.settings.get(member.guild.id, "leave.pbdm")) {
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          }
        }

        var fillcolors = client.settings.get(member.guild.id, "leave.framecolordm").toUpperCase();
        if (fillcolors == "WHITE") fillcolor == "#FFFFF9"
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
        if (client.settings.get(member.guild.id, "leave.discriminatordm")) {
          await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
        }
        //define the Member count
        if (client.settings.get(member.guild.id, "leave.membercountdm")) {
          await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
        }
        //get the Guild Name
        if (client.settings.get(member.guild.id, "leave.servernamedm")) {
          await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
        }

        if (client.settings.get(member.guild.id, "leave.pbdm")) {
          //create a circular "mask"
          ctx.beginPath();
          ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
          ctx.closePath();
          ctx.clip();
          //define the user avatar
          const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
            format: 'png'
          }));
          //draw the avatar
          ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
        }

        //get it as a discord attachment
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'leave-image.png');
        //define the leave embed
        //send the leave embed to there
        member.user.send({
          embeds: [leaveembed.setImage(`attachment://leave-image.png`)],
          files: [attachment]
        }).catch(e => console.log("This catch prevents a crash"))
        //member roles add on leave every single role
      } catch {}
    }
    async function msg_autoimg(member) {
      try {
        let leavechannel = client.settings.get(member.guild.id, "leave.channel");
        if (!leavechannel) return;
        let channel = await client.channels.fetch(leavechannel).catch(() => {})
        if (!channel) return;
        //define the leave embed
        const leaveembed = new Discord.MessageEmbed()
          .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setTimestamp()
          .setFooter(client.getFooter("Good bye: " + member.user.id, member.user.displayAvatarURL({
            dynamic: true
          })))
          .setTitle(eval(client.la[ls]["handlers"]["leavejs"]["leave"]["variable6"]))
          .setDescription(client.settings.get(member.guild.id, "leave.msg").replace("{user}", `${member.user}`))
        if (client.settings.get(member.guild.id, "leave.invite")) leaveembed.addField("\u200b", invitemessage)

        //member roles add on leave every single role
        const canvas = Canvas.createCanvas(1772, 633);
        //make it "2D"
        const ctx = canvas.getContext('2d');

        if (client.settings.get(member.guild.id, "leave.background") !== "transparent") {
          try {
            const bgimg = await Canvas.loadImage(client.settings.get(member.guild.id, "leave.background"));
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


        if (client.settings.get(member.guild.id, "leave.frame")) {
          let background;
          var framecolor = client.settings.get(member.guild.id, "leave.framecolor").toUpperCase();
          if (framecolor == "WHITE") framecolor = "#FFFFF9";
          if (client.settings.get(member.guild.id, "leave.discriminator") && client.settings.get(member.guild.id, "leave.servername"))
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

          else if (client.settings.get(member.guild.id, "leave.discriminator"))
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

          else if (client.settings.get(member.guild.id, "leave.servername"))
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

          else
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

          if (client.settings.get(member.guild.id, "leave.pb")) {
            background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          }
        }


        var fillcolor = client.settings.get(member.guild.id, "leave.framecolor").toUpperCase();
        if (fillcolor == "WHITE") fillcolor == "#FFFFF9";
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
        if (client.settings.get(member.guild.id, "leave.discriminator")) {
          await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
        }
        //define the Member count
        if (client.settings.get(member.guild.id, "leave.membercount")) {
          await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
        }
        //get the Guild Name
        if (client.settings.get(member.guild.id, "leave.servername")) {
          await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
        }


        if (client.settings.get(member.guild.id, "leave.pb")) {
          //create a circular "mask"
          ctx.beginPath();
          ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
          ctx.closePath();
          ctx.clip();
          //define the user avatar
          const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
            format: 'png'
          }));
          //draw the avatar
          ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
        }
        //get it as a discord attachment
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'leave-image.png');
        //define the leave embed
        //send the leave embed to there
        channel.send({
          embeds: [leaveembed.setImage(`attachment://leave-image.png`)],
          files: [attachment]
        }).catch(e => console.log("This catch prevents a crash"))
        //member roles add on leave every single role
      } catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
      }
    }
  }
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


