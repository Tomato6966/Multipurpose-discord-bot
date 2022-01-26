//Import Modules
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const {
  onCoolDown,
  escapeRegex,
  delay,
  simple_databasing,
  databasing, 
  handlemsg,
  check_if_dj
} = require(`${process.cwd()}/handlers/functions`);
const Discord = require("discord.js");
module.exports = async (client, interaction) => {
      if (!interaction?.isCommand()) return;
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = interaction;
      const {
        guild
      } = member;
      if(!guild) {
        return interaction?.reply({content: ":x: Interactions only Works inside of GUILDS!", ephemeral: true}).catch(()=>{});
      }
      const CategoryName = interaction?.commandName;
      simple_databasing(client, guild.id, member.id)
      var not_allowed = false;
      const guild_settings = client.settings.get(guild.id);
      let es = guild_settings.embed;
      let ls = guild_settings.language;
      let {
        prefix,
        botchannel,
        unkowncmdmessage
      } = guild_settings;
      let command = false;
      try {
        if (client.slashCommands.has(CategoryName + interaction?.options.getSubcommand())) {
          command = client.slashCommands.get(CategoryName + interaction?.options.getSubcommand());
        }
      } catch {
        if (client.slashCommands.has("normal" + CategoryName)) {
          command = client.slashCommands.get("normal" + CategoryName);
        }
      }
      if (command) {
        if (!command.category?.toLowerCase().includes("nsfw") && botchannel.toString() !== "") {
          if (!botchannel.includes(channelId) && !member.permissions.has("ADMINISTRATOR")) {
            for(const channelId of botchannel){
              let channel = guild.channels.cache.get(channelId);
              if(!channel){
                client.settings.remove(guild.id, channelId, `botchannel`)
              }
            }
            not_allowed = true;
            return interaction?.reply({ephmerla: true, embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.botchat.title)
              .setDescription(`${client.la[ls].common.botchat.description}\n> ${botchannel.map(c=>`<#${c}>`).join(", ")}`)]}
            )
          }
        }
        if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
          client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); //get the current time
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
        if (timestamps.has(member.id)) { //if the user is on cooldown
          const expirationTime = timestamps.get(member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
          if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            not_allowed = true;
            return interaction?.reply({
              ephemeral: true,
              embeds: [new Discord.MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(handlemsg(client.la[ls].common.cooldown, {
                  time: timeLeft.toFixed(1),
                  commandname: command.name
                }))
              ]
            }); //send an information message
          }
        }
        timestamps.set(member.id, now); //if he is not on cooldown, set it to the cooldown
        setTimeout(() => timestamps.delete(member.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
        client.stats.inc(guild.id, "commands"); //counting our Database stats for SERVER
        client.stats.inc("global", "commands"); //counting our Database Stats for GLOBAL
        //if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction?.member.permissions.has(command.memberpermissions)) {
          return interaction?.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.permissions.title)
                    .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)   
          ]
          });
    }
      
    const player = client.manager.players.get(guild.id);
  
    if(player && player.node && !player.node.connected) player.node.connect();
    
    if(guild.me.voice.channel && player) {
      //destroy the player if there is no one
      if(!player.queue) await player.destroy();
      await delay(350);
    }
    
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    if(command.parameters) {
      if(command.parameters.type == "music"){
        //get the channel instance
        const { channel } = member.voice;
        const mechannel = guild.me.voice.channel;
        //if not in a voice Channel return error
        if (!channel) {
          not_allowed = true;
          return interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.join_vc)]});
        }
        //If there is no player, then kick the bot out of the channel, if connected to
        if(!player && mechannel) {
          await guild.me.voice.disconnect().catch(e=>{});
          await delay(350);
        }
        if(player && player.queue && player.queue.current && command.parameters.check_dj){
          if(check_if_dj(client, interaction?.member, player.queue.current)) {
            return interaction?.reply({embeds: [new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter({text: `${ee.footertext}`, iconURL: `${ee.footericon}`})
              .setTitle(` <: no: 833101993668771842 > ** You are not a DJ and not the Song Requester! ** `)
              .setDescription(` ** DJ - ROLES: ** \n${check_if_dj(client, interaction?.member, player.queue.current)}`)
            ],
            ephemeral: true});
          }
        }
        //if no player available return error | aka not playing anything
        if(command.parameters.activeplayer){
          if (!player){
            not_allowed = true;
            return interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.nothing_playing)]});
          }
          if (!mechannel){
            if(player) try{ await player.destroy(); await delay(350); }catch{ }
            not_allowed = true;
            return interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.not_connected)]});
          }
        }
        //if no previoussong
        if(command.parameters.previoussong){
          if (!player.queue.previous || player.queue.previous === null){
            not_allowed = true;
            return interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.nothing_playing)]});
          }
        }
        //if not in the same channel --> return
        if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel){
          return interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.wrong_vc)
            .setDescription(`Channel: <#${player.voiceChannel}>`)]});
        }
        //if not in the same channel --> return
        if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
          return interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.wrong_vc)
            .setDescription(`Channel: <#${player.voiceChannel}> `)]});
        }
      }
    }
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    //run the command with the parameters:  client, message, args, user, text, prefix,
    if (not_allowed) return
    let message = {
      applicationId: interaction?.applicationId,
      attachments: [],
      author: member.user,
      channel: guild.channels.cache.get(interaction?.channelId),
      channelId: interaction?.channelId,
      member: member,
      client: interaction?.client,
      components: [],
      content: null,
      createdAt: new Date(interaction?.createdTimestamp),
      createdTimestamp: interaction?.createdTimestamp,
      embeds: [],
      id: null,
      guild: interaction?.member.guild,
      guildId: interaction?.guildId,
    }
    //Execute the Command
		command.run(client, interaction, interaction?.member.user, es, ls, prefix, player, message)
	}
}
