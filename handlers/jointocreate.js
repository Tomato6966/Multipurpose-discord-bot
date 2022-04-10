const {
  MessageEmbed,
  Collection, Permissions, Guild
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
const kernelsettings = require(`${process.cwd()}/botconfig/settings.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  databasing,
  check_voice_channels,
  check_created_voice_channels,
  create_join_to_create_Channel
} = require(`./functions`);
var CronJob = require('cron').CronJob;


module.exports = function (client) {

  // check channels every minute
  client.JobJointocreate = new CronJob('0 * * * * *', async function () {
    check_voice_channels(client);
    check_created_voice_channels(client);
    return;
  }, null, true, 'Europe/Berlin');

  client.on("ready", () => {
    check_voice_channels(client);
    check_created_voice_channels(client)
    setTimeout(() => {
      client.JobJointocreate.start();
    }, 45_000)
    return;
  })
  //voice state update event to check joining/leaving channels
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (
      (!oldState.streaming === false && newState.streaming === true) ||
      (oldState.streaming === true && !newState.streaming === false) ||
      (!oldState.serverDeaf === false && newState.serverDeaf === true) ||
      (oldState.serverDeaf === true && !newState.serverDeaf === false) ||
      (!oldState.serverMute === false && newState.serverMute === true) ||
      (oldState.serverMute === true && !newState.serverMute === false) ||
      (!oldState.selfDeaf === false && newState.selfDeaf === true) ||
      (oldState.selfDeaf === true && !newState.selfDeaf === false) ||
      (!oldState.selfMute === false && newState.selfMute === true) ||
      (oldState.selfMute === true && !newState.selfMute === false) ||
      (!oldState.selfVideo === false && newState.selfVideo === true) ||
      (oldState.selfVideo === true && !newState.selfVideo === false)
    ) {if(newState.id == "442355791412854784" ) console.log("no new join".bgCyan); return true;}
    const guildData = await client.jtcsettings.all().then(Data => Data.filter(d => d.data && typeof d.data == "object" ? Object.entries(d.data).some(([k, v]) => v.channel && v.channel != "no") : false).find(d => d.ID == newState.guild.id)?.data);
    if (!guildData || typeof guildData !== "object") {if(newState.id == "442355791412854784" ) console.log("no data".bgCyan); return }
    // JOINED A CHANNEL
    if (!oldState.channelId && newState.channelId) {
      let joined = await joinChannel();
      if (joined) return true;
    }
    // LEFT A CHANNEL
    else if (oldState.channelId && !newState.channelId) {
      let left = await leaveChannel()
      if (left) return true;
    }
    // Switch A CHANNEL
    else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      let joined = await joinChannel();
      let left = await leaveChannel();
      if (joined || left) return true;
    }
    return true;

    async function joinChannel() {
      return new Promise(async (res, rej) => {
        const validEntries = Object.entries(guildData).filter(([k, v]) => v.channel && v.channel != "no");
        if(!validEntries || validEntries.length == 0) {if(newState.id == "442355791412854784" ) console.log("no valid entries".bgCyan); return res(true);}
        for await (const [key, value] of validEntries) {
          if (value.channel == newState.channelId) {
            await create_join_to_create_Channel(client, newState, key);
            return res(true);
          } else {if(newState.id == "442355791412854784" ) console.log("not the rright channel".bgCyan); continue;}
        }
        return res(false);
      })
    }

    async function leaveChannel() {
      return new Promise(async (res) => {
        const tempC = await client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
        var vc = oldState.guild.channels.cache.get(tempC);
        if (tempC && vc) {
          //CHANNEL DELETE CHECK
          if (vc?.members?.size < 1) {
            await client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
            await client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
            console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"} DUE TO EMPTYNESS`.strikethrough.brightRed)
            vc.delete().catch(() => null);
            return res(true);
          } else {
            let ownerId = await client.jointocreatemap.get(`owner_${vc.guild.id}_${vc.id}`);
            //if owner left, then pick a random user
            if (ownerId == oldState.id) {
              let members = vc.members.map(m => m.id);
              let randommemberid = members[Math.floor(Math.random() * members.length)];
              //set the new owner + perms
              await client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, randommemberid);
              if (vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                await vc.permissionOverwrites.edit(randommemberid, {
                  CONNECT: true,
                  VIEW_CHANNEL: true,
                  MANAGE_CHANNELS: true,
                  MANAGE_ROLES: true
                }).catch(() => null)
              }
              //delete the old owner
              await vc.permissionOverwrites.delete(oldState.id).catch(() => null)
              try {
                let es = await client.settings.get(vc.guild.id + ".embed")
                client.users.fetch(randommemberid).then(user => {
                  user.send({
                    embeds: [new MessageEmbed()
                      .setColor(es.color).setThumbnail(oldState.member.displayAvatarURL({ dynamic: true }))
                      .setFooter(client.getFooter(es))
                      .setTitle(`The VC-OWNER \`${oldState.member.user.tag}\` left the VC! A new Random Owner got picked!`)
                      .addField(`You now have access to all \`voice Commands\``, `> ${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}`)
                    ]
                  }).catch(() => null)
                }).catch(() => null)
              } catch {
                /* */
              }
              return res(true);
            } else {
              return;
            }
          }
        }
        return res(false);
      })
    }
    return;
  })
}

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
