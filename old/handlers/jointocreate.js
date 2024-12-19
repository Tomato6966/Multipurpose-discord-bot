const {
  MessageEmbed,
  Collection, Permissions
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

  const maxJoinToCreate = 100;

  client.JobJointocreate = new CronJob('0 * * * * *', function() {
    check_voice_channels(client)
  }, null, true, 'America/Los_Angeles');
  client.JobJointocreate2 = new CronJob('0 * * * * *', function() {
    check_created_voice_channels(client)
  }, null, true, 'America/Los_Angeles');

  client.on("ready", () => {
    check_voice_channels(client);
    check_created_voice_channels(client)
    client.JobJointocreate.start();
    client.JobJointocreate2.start();
  })
  //voice state update event to check joining/leaving channels
  client.on("voiceStateUpdate", (oldState, newState) => {
    // JOINED A CHANNEL
    if (!oldState.channelId && newState.channelId) {
      let index = false;
      if (!index) {
        for (let i = 1; i <= maxJoinToCreate; i++) {
          const d = client.jtcsettings
          var pre = `jtcsettings${i}`;
          if (d?.has(newState.guild.id) && d?.has(newState.guild.id, pre) && d?.get(newState.guild.id, pre+".channel").includes(newState.channelId)) index = i;
        }
      }
      if (!index) {
        return // console.log("No valid database for this jtc channel found...");
      }
      return create_join_to_create_Channel(client, newState, index);
    }
    // LEFT A CHANNEL
    if (oldState.channelId && !newState.channelId) {
      if (client.jointocreatemap.has(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`) && oldState.guild.channels.cache.has(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`))) {
        //CHANNEL DELETE CHECK
        var vc = oldState.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));
        if (vc.members.size < 1) {
          client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
          client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
          console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"} DUE TO EMPTYNESS`.strikethrough.brightRed)
          return vc.delete().catch(e => console.log("Couldn't delete room"));
        } else {
          let ownerId = client.jointocreatemap.get(`owner_${vc.guild.id}_${vc.id}`);
          //if owner left, then pick a random user
          if (ownerId == oldState.id) {
            let members = vc.members.map(m => m.id);
            let randommemberid = members[Math.floor(Math.random() * members.length)];
            //set the new owner + perms
            client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, randommemberid);
            if(vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              vc.permissionOverwrites.edit(randommemberid, {
                CONNECT: true,
                VIEW_CHANNEL: true,
                MANAGE_CHANNELS: true,
                MANAGE_ROLES: true
              }).catch(() => {})
            }
            //delete the old owner
            vc.permissionOverwrites.delete(oldState.id).catch(() => {})
            try {
              let es = client.settings.get(vc.guild.id, "embed")
              client.users.fetch(randommemberid).then(user => {
                user.send({embeds: [new MessageEmbed()
                  .setColor(es.color).setThumbnail(oldState.member.displayAvatarURL({dynamic:true}))
                  .setFooter(client.getFooter(es))
                  .setTitle(`The VC-OWNER \`${oldState.member.user.tag}\` left the VC! A new Random Owner got picked!`)
                  .addField(`You now have access to all \`voice Commands\``, `> ${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}`)
                ]}).catch(() => {})
              }).catch(() => {})
            } catch {
              /* */
            }
          }
        }
      }
    }
    // Switch A CHANNEL
    if (oldState.channelId && newState.channelId) {
      if (oldState.channelId !== newState.channelId) {
        let index = false;
        if (!index) {
          for (let i = 1; i <= maxJoinToCreate; i++) {
            const d = client.jtcsettings
            var pre = `jtcsettings${i}`;
            if (d?.has(newState.guild.id) && d?.has(newState.guild.id, pre) && d?.get(newState.guild.id, pre+".channel").includes(newState.channelId)) index = i;
          }
        }
        if (index) {
          create_join_to_create_Channel(client, newState, index);
        }
        
        //IF STATEMENT
        if (client.jointocreatemap.has(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`) && oldState.guild.channels.cache.has(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`))) {
          var vc = oldState.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));
          if (vc.members.size < 1) {
            client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
            client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
            return vc.delete().catch(e => console.log("Couldn't delete room"));
          } let ownerId = client.jointocreatemap.get(`owner_${vc.guild.id}_${vc.id}`);
          //if owner left, then pick a random user
          if (ownerId == oldState.id) {
            let members = vc.members.map(m => m.id);
            let randommemberid = members[Math.floor(Math.random() * members.length)];
            //set the new owner + perms
            client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, randommemberid);
            if(vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              vc.permissionOverwrites.edit(randommemberid, {
                CONNECT: true,
                VIEW_CHANNEL: true,
                MANAGE_CHANNELS: true,
                MANAGE_ROLES: true
              }).catch(() => {})
            }
            //delete the old owner perms
            vc.permissionOverwrites.delete(oldState.id).catch(() => {})
            try {
              let es = client.settings.get(vc.guild.id, "embed")
              client.users.fetch(randommemberid).then(user => {
                user.send({embeds: [new MessageEmbed()
                  .setColor(es.color).setThumbnail(oldState.member.displayAvatarURL({dynamic:true}))
                  .setFooter(client.getFooter(es))
                  .setTitle(`The VC-OWNER \`${oldState.member.user.tag}\` left the VC! A new Random Owner got picked!`)
                  .addField(`You now have access to all \`voice Commands\``, `> ${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}`)
                ]}).catch(() => {})
              }).catch(() => {})
            } catch {
              /* */
            }
          }
        }
      }
    }
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
