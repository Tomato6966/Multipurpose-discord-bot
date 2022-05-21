var {
    Manager
  } = require("erela.js"), {
      MessageEmbed, MessageButton, MessageActionRow
    } = require("discord.js"),
    ms = require("ms"),

    config = require(`${process.cwd()}/botconfig/config.json`),
    emoji = require("../../botconfig/emojis.json"),
    ee = require(`${process.cwd()}/botconfig/embed.json`),

    {
      databasing,
    } = require(`../functions`);
  module.exports = (client) => {

      client.once("ready", () => {
        client.manager.init(client.user.id);
      });
      
      client.on("raw", (d) => client.manager.updateVoiceState(d));
      
      //Log if a Channel gets deleted, and the Bot was in, then delete the player if the player exists!
      client.on("channelDelete", async channel => {
        try {
          if (channel.type === "GUILD_VOICE") {
            if (channel.members.has(client.user.id)) {
              var player = client.manager.players.get(channel.guild.id);
              if (!player) return;
              if (channel.id === player.voiceChannel) {
                //destroy
                player.destroy();
              }
            }
          }
        } catch {}
      })
      //If the Bot gets Remove from the Guild and there is still a player, remove it ;)
      client.on("guildRemove", async guild => {
        try {
          var player = client.manager.players.get(guild.id);
          if (!player) return;
          if (guild.id == player.guild) {
            //destroy
            player.destroy();
          }
        } catch {
          /* */ }
      })      
      client.on("voiceStateUpdate", async (oS, nS) => {
        if (nS.channelId && nS.channel.type == "GUILD_STAGE_VOICE" && nS.guild.me.voice.suppress) {
            try {
                await nS.guild.me.voice.setSuppressed(false);
            } catch (e) {
                console.error(e)
            }
        }
      })
      client.on("voiceStateUpdate", async (oS, nS) => {
        if (oS.channelId && (!nS.channelId || nS.channelId)) {
          var player = client.manager.players.get(nS.guild.id);
          if (player && oS.channelId == player.voiceChannel) {
            if ((!oS.streaming && nS.streaming) || (oS.streaming && !nS.streaming) ||
              (!oS.serverDeaf && nS.serverDeaf) || (oS.serverDeaf && !nS.serverDeaf) ||
              (!oS.serverMute && nS.serverMute) || (oS.serverMute && !nS.serverMute) ||
              (!oS.selfDeaf && nS.selfDeaf) || (oS.selfDeaf && !nS.selfDeaf) ||
              (!oS.selfMute && nS.selfMute) || (oS.selfMute && !nS.selfMute) ||
              (!oS.selfVideo && nS.selfVideo) || (oS.selfVideo && !nS.selfVideo)) return; //not the right voicestate
            //if player exist, but not connected or channel got empty (for no bots)
            if (player && (!oS.guild.me.voice.channel || oS.channel.members.filter(m => !m.user.bot).size < 1)){
              try{ player.destroy(); } catch(e){ }
            }
          }
        }
      });
  };

  