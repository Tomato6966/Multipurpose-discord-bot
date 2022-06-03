const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js")
const { check_if_dj, autoplay, escapeRegex, format, duration, createBar, handlemsg } = require("../functions");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../playermanager`);
//we need to create the music system, somewhere...
module.exports = async (client) => {
    client.on("interactionCreate", async (interaction) => {
        var { guild, message, channel, member, user } = interaction;
        if(!guild) guild = client.guilds.cache.get(interaction.guildId)
        if(!guild) return 
        var data = await client.musicsettings.get(guild.id);
        if(!data) return
        var musicChannelId = data.channel;
        var musicChannelMessage = data.message;
        //if not setupped yet, return
        if(!musicChannelId || musicChannelId.length < 5) return;
        if(!musicChannelMessage || musicChannelMessage.length < 5) return;
        //if the channel doesnt exist, try to get it and the return if still doesnt exist
        if(!channel) channel = guild.channels.cache.get(interaction?.channelId);
        if(!channel) return;
        //if not the right channel return
        if(musicChannelId != channel.id) return;
        //if not the right message, return
        if(musicChannelMessage != message.id) return;

        if(!member) member = guild.members.cache.get(user.id);
        if(!member) member = await guild.members.fetch(user.id).catch(() => null);
        if(!member) return;
        let settings = await client.settings.get(guild.id)
        let es = settings.embed;
        let ls = settings.language;
        //if the member is not connected to a vc, return
        //now its time to start the music system
        if (!member.voice.channel && interaction?.customId != "Text")
            return interaction?.reply({
                content: `${client.la[ls].cmds.music.musicsystem.joinvc}`,
                ephemeral: true
            })      
            
        var player = client.manager.players.get(interaction?.guild.id);
        if (!interaction.isSelectMenu() && interaction?.customId != "Join" && interaction?.customId != "Text" && interaction?.customId != "Leave" && (!player || !player.queue || !player?.queue?.current))
            return interaction?.reply({content: `${client.la[ls].cmds.music.musicsystem.nothingplay}`, ephemeral: true})
                        
        //if not connected to the same voice channel, then make sure to connect to it!
        if (player && member.voice.channel.id !== player.voiceChannel)
            return interaction?.reply({
                content: `${client.la[ls].cmds.music.musicsystem.joinmevc} <#${player.voiceChannel}>**`,
                ephemeral: true
            })
        //here i use my check_if_dj function to check if he is a dj if not then it returns true, and it shall stop!
        const dj = await check_if_dj(client, member, player?.queue?.current);
        if(player && interaction?.customId != `Join` && interaction?.customId != "Text" && interaction?.customId != `Lyrics` && dj) {
                return interaction?.reply({embeds: [new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter({text: `${ee.footertext}`, iconURL: `${ee.footericon}`})
                  .setTitle(client.la[ls].cmds.music.musicsystem.djerr)
                  .setDescription(`${client.la[ls].cmds.music.musicsystem.djroles}\n${dj}`)
                ],
                ephemeral: true});
        }
        switch(interaction?.customId){
          case "Join": {
            //create the player
            var player = await client.manager.create({
                guild: guild.id,
                voiceChannel: member.voice.channel.id,
                textChannel: channel.id,
                selfDeafen: config.settings.selfDeaf,
            });
            await player.connect();
            await player.stop();
             interaction?.reply({embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTitle(client.la[ls].cmds.music.join.title)
                .setDescription(`<#${member.voice.channel.id}>`)]
            });
            //edit the message so that it's right!
            var data = await generateQueueEmbed(client, guild.id)
            message.edit(data).catch((e) => {
              //console.error(e)
            })
        }break;
        case "Leave": {
            //Stop the player
            interaction?.reply({
              embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(handlemsg(client.la[ls].cmds.music.leave.title))
              .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
            }) 
            if(player){
                await player.destroy();
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            } else {
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                //console.error(e)
                })
            }
        }break;
            case "Skip": {
                //if ther is nothing more to skip then stop music and leave the Channel
                if (!player.queue || !player?.queue?.size || player?.queue?.size === 0) {
                    //if its on autoplay mode, then do autoplay before leaving...
                    if(player.get("autoplay")) return autoplay(client, player, "skip");
                    interaction?.reply({
                        embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(client.la[ls].cmds.music.leave.title1)
                        .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                    await player.destroy()
                    //edit the message so that it's right!
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                    //console.error(e)
                    })
                    return
                }
                //skip the track
                await player.stop();
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(client.la[ls].cmds.music.skip.title2)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Stop": {
                //Stop the player
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(client.la[ls].cmds.music.stop.variable1)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                await player.destroy()
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Pause": {
                if (!player.playing){
                    player.pause(false);
                    interaction?.reply({
                      embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(client.la[ls].cmds.music.musicsystem.resume)
                      .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                  } else{
                    //pause the player
                    player.pause(true);

                    interaction?.reply({
                      embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(client.la[ls].cmds.music.musicsystem.pause)
                      .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                  }
                  //edit the message so that it's right!
                  var data = await generateQueueEmbed(client, guild.id)
                  message.edit(data).catch((e) => {
                    //console.error(e)
                  })
            }break;
            case "Autoplay": {
                //pause the player
                player.set(`autoplay`, !player.get(`autoplay`))
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.get(`autoplay`) ? `:white_check_mark: ${client.la[ls].cmds.music.musicsystem.autoplayon}`: `:x: ${client.la[ls].cmds.music.musicsystem.autoplayoff}`}`)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Shuffle": {
                //set into the player instance an old Queue, before the shuffle...
                player.set(`beforeshuffle`, player?.queue?.map(track => track));
                //shuffle the Queue
                player?.queue?.shuffle();
                //Send Success Message
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`${client.la[ls].cmds.music.musicsystem.shuffled} ${player?.queue?.length} ${client.la[ls].cmds.music.musicsystem.shuffleds}`)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Song": {
                //if there is active queue loop, disable it + add embed information
                if (player.queueRepeat) {
                  player.setQueueRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setTrackRepeat(!player.trackRepeat);
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.trackRepeat ? `:white_check_mark: ${client.la[ls].cmds.music.musicsystem.songloopon}`: `:x: ${client.la[ls].cmds.music.musicsystem.songloopoff}`}`)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Queue": {
                //if there is active queue loop, disable it + add embed information
                if (player.trackRepeat) {
                  player.setTrackRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setQueueRepeat(!player.queueRepeat);
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.queueRepeat ? `:white_check_mark: ${client.la[ls].cmds.music.musicsystem.queueloopon}`: `:x: ${client.la[ls].cmds.music.musicsystem.queueloopoff}`}`)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Forward": {
                //get the seektime variable of the user input
                var seektime = Number(player.position) + 10 * 1000;
                //if the userinput is smaller then 0, then set the seektime to just the player.position
                if (10 <= 0) seektime = Number(player.position);
                //if the seektime is too big, then set it 1 sec earlier
                if (Number(seektime) >= player?.queue?.current.duration) seektime = player?.queue?.current.duration - 1000;
                //seek to the new Seek position
                await player.seek(Number(seektime));
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.forward)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Rewind": {
                var seektime = player.position - 10 * 1000;
                if (seektime >= player?.queue?.current.duration - player.position || seektime < 0) {
                  seektime = 0;
                }
                //seek to the new Seek position
                await player.seek(Number(seektime));
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.rewind)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }break;
            case "Lyrics": {
              	await player.seek(0);
              	
              	
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
              interaction.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(client.la[ls].cmds.music.musicsystem.replay)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                   })))
                  ]
                })
            }
            break;
            case "Volmax": {
              if(player.volume == 150){
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.alrmax)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                     })))
                    ]
                  })
                break;
              }
                await player.setVolume(150)
                
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
                  interaction.reply({
                    embeds: [new MessageEmbed()
                      .setColor(es.color)
                      .setTimestamp()
                      .setTitle(client.la[ls].cmds.music.musicsystem.volmax)
                      .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                        dynamic: true
                      })))
                    ]
                  })
            }
            break;
            case "Volmin": {
              if(player.volume == 1){
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.alrmin)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                     })))
                    ]
                  })
                break;
              }
              await player.setVolume(1)
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
              interaction.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(client.la[ls].cmds.music.musicsystem.volmin)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                 ]
                })
            }
            break;
            case "Volmid": {
              if(player.volume == 100){
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.alrmid)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                     })))
                    ]
                  })
                break;
              }
              await player.setVolume(100)
              interaction.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(client.la[ls].cmds.music.musicsystem.volmid)
                  .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                 ]
                })
                var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.error(e)
                })
            }
            break;
            case "Vol+": {
              if(player.volume == 150){
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.alrmax)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                     })))
                    ]
                  })
                break;
              }
              if(player.volume <= 140){
                await  player.setVolume(player.volume + 10)
                
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.volp)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                })
              }
              else{
                await player.setVolume(150)
                
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.volmax)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                     })))
                    ]
                  })
                }
            }
            break;
            case "Vol-": {
              if(player.volume == 1){
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.alrmin)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                     })))
                    ]
                  })
                break;
              }
              if(player.volume > 10){
                await  player.setVolume(player.volume - 10)
                
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.volm)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                })
              }
              else{
                await player.setVolume(1)
                
                    var data = await generateQueueEmbed(client, guild.id)
                    message.edit(data).catch((e) => {
                      //console.error(e)
                    })
                interaction.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(client.la[ls].cmds.music.musicsystem.volmin)
                    .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.actionby} ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                 })
              }
            }
            break;
            case "Text": {
              let musicsettings = await client.musicsettings.get(guild.id)
              if(musicsettings.text == false) {
                await client.musicsettings.set(guild.id+".text", true);
                interaction?.reply({embeds : [new MessageEmbed()
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                  .setTitle(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["title1"]))
                  .setDescription(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["subtitle1"]))
              ]});
              }else{
                await client.musicsettings.set(guild.id+".text", false);
                  interaction?.reply({embeds : [new MessageEmbed()
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                  .setTitle(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["title2"]))
                  .setDescription(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["subtitle2"]))
                ]});
              }
              var data = await generateQueueEmbed(client, guild.id)
              message.edit(data).catch((e) => {
                //console.error(e)
              })
            }
            break;
            case "Save": {
              let settingss = await client.settings.get(player.guild)
              let prefixx = settingss.prefix
              interaction?.user.send({embeds : [new MessageEmbed()
                .setAuthor(client.la[ls].cmds.music.grab?.author, message.author.displayAvatarURL({
                  dynamic: true
                }))
                .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
                .setURL(player.queue.current.uri)
                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["music"]["grab"]["variable1"]))
                .addField(client.la[ls].cmds.music.grab?.field1, `\`${format(player.queue.current.duration)}\``, true)
                .addField(client.la[ls].cmds.music.grab?.field2, `\`${player.queue.current.author}\``, true)
                .addField(client.la[ls].cmds.music.grab?.field3, `\`${player.queue.length} ${client.la[ls]["cmds"]["music"]["musicsystem"]["songg"]}\``, true)
                .addField(client.la[ls].cmds.music.grab?.field4, `\`${prefixx}play ${player.queue.current.uri}\``)
                .addField(client.la[ls].cmds.music.grab?.field5, `<#${message.channel.id}>`)
                .setFooter(
                  handlemsg(client.la[ls].cmds.music.grab?.footer, { usertag: player.queue.current.requester.tag, guild: message.guild.name + " | " + message.guild.id})
                  , player.queue.current.requester.displayAvatarURL({
                  dynamic: true
                }))
              ]}).catch(e => {
                return interaction?.reply({content : client.la[ls].common.dms_disabled})
              })
              interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
                .setColor(es.color)
                .setFooter(client.getFooter(es))
                .setTitle(handlemsg(client.la[ls].cmds.music.musicsystem.savetitle))
                .setDescription(handlemsg(client.la[ls].cmds.music.musicsystem.savesubtitle))
              ]});
              // -------------
              var data = await generateQueueEmbed(client, guild.id)
              message.edit(data).catch((e) => {
                //console.error(e)
              })
            }
            break;
            	case "Previous": {
			if (!player.queue.previous){
				return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
                			.setColor(es.wrongcolor)
                			.setFooter(client.getFooter(es))
                			.setTitle(handlemsg(client.la[ls].cmds.music.musicsystem.previoustitleerr))
                			.setDescription(handlemsg(client.la[ls].cmds.music.musicsystem.previoussubtitleerr))
              			]});
			}else{
			        let type = `skiptrack:youtube`;
      				//if the previous was from soundcloud, then use type soundcloud
      				if (player.queue.previous.uri?.includes(`soundcloud`)) type = `skiptrack:soundcloud`
      				//adds/plays it
      				playermanager(client, message, Array(player.queue.previous.uri), type);
      				return interaction?.reply({embeds : [new MessageEmbed()
                			.setColor(es.color)
                			.setFooter(client.getFooter(es))
                			.setTitle(handlemsg(client.la[ls].cmds.music.musicsystem.previoustitle))
                			.setDescription(handlemsg(client.la[ls].cmds.music.musicsystem.previoussubtitle))
              			]});
			}
		var data = await generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                //console.error(e)
              })
            }
            break;
            }
          if (interaction.isSelectMenu()) {
            let link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
            if (interaction.values[0]) {
              //ncs | no copyrighted music
              if (interaction.values[0].toLowerCase().startsWith("miyagi")) link = "https://open.spotify.com/playlist/4XprsFTl5HyeZ0vwgd98Nq?si=d0a913330590448d";
               //default
              if (interaction.values[0].toLowerCase().startsWith("d")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
              //remixes from Magic Release
              if (interaction.values[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
              //gaming
              if (interaction.values[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6";
              //Charts
         //Chill
              if (interaction.values[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
              //Jazz
           //strange-fruits
              if (interaction.values[0].toLowerCase().startsWith("s")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51";
              //magic-release
              if (interaction.values[0].toLowerCase().startsWith("magic")) link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
              //metal
            //my
              if (interaction.values[0].toLowerCase().startsWith("cepheid")) link = "https://open.spotify.com/playlist/70Z2lb2F2g2LXaBkcpxABM?si=16e58d38908749cb";
              //music storage
              if (interaction.values[0].toLowerCase().startsWith("bandit")) link = "https://open.spotify.com/playlist/6gCc1MHzFZhjYhwRipKtFw?si=66797fa029ce4c24";
            }
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setAuthor(client.getAuthor(`Loading '${interaction.values[0] ? interaction.values[0] : "Default"}' Music Mix`, "https://imgur.com/xutrSuq.gif", link))
                .setTitle(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable1"]))
                .setDescription(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable2"]))
                .setFooter(client.getFooter(es))
              ]
            })
            playermanager(client, {
              guild,
              member,
              author: member.user,
              channel
            }, Array(link), `song:youtube`, false, "songoftheday");

          }
        })
    //this was step 1 now we need to code the REQUEST System...

    client.on("messageCreate", async message => {
        if(!message.guild) return;
        var data = await client.musicsettings.get(message.guild.id);
        if(!data) return
        let settings = await client.settings.get(message.guild.id)
        let es = settings.embed;
        let ls = settings.language;
        var musicChannelId = data.channel;
        //if not setupped yet, return
        if(!musicChannelId || musicChannelId.length < 5) return;
        //if not the right channel return
        if(musicChannelId != message.channel.id) return;
        //Delete the message once it got sent into the channel, bot messages after 5 seconds, user messages instantly!
        if (message.author?.id === client.user.id) 
            setTimeout(()=> message.delete().catch(() => null), 3500)
        else setTimeout(()=> message.delete().catch(() => null), 500)
            
        if (message.author?.bot) return; // if the message  author is a bot, return aka ignore the inputs
        var prefix = await client.settings.get(message.guild.id+".prefix")
        //get the prefix regex system
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`); //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        var args;
        var cmd;
        if (prefixRegex.test(message.content)) {
            //if there is a attached prefix try executing a cmd!
            const [, matchedPrefix] = message.content.match(prefixRegex); //now define the right prefix either ping or not ping
            args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //create the arguments with sliceing of of the rightprefix length
            cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1
            if (cmd || cmd.length === 0) return// message.reply(":x: **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => null);}catch(e){ }}, 3000)})
        
            var command = client.commands.get(cmd); //get the command from the collection
            if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias
            if (command) //if the command is now valid
            {
                return// message.reply(":x: **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => null);}catch(e){ }}, 3000)})
            }
        }
        //getting the Voice Channel Data of the Message Member
        const {
          channel
        } = message.member.voice;
        //if not in a Voice Channel return!
        if (!channel) return message.reply(client.la[ls].cmds.music.musicsystem.join).then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => null);}catch(e){ }}, 5000)})
        //get the lavalink erela.js player information
        const player = client.manager.players.get(message.guild.id);
        //if there is a player and the user is not in the same channel as the Bot return information message
        if (player && channel.id !== player.voiceChannel) return message.reply(client.la[ls].cmds.music.musicsystem.joinch+`**<#${player.voiceChannel}>**`).then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => null);}catch(e){ }}, 3000)})

        
        else {
            return playermanager(client, message, message.content.trim().split(/ +/), "request:song");
        }
    })


}
async function generateQueueEmbed(client, guildId, leave) {
  const guild = client.guilds.cache.get(guildId)
  if (!guild) return;
  let settings = await client.settings.get(guild.id);
    
  let es = settings.embed;
  let ls = settings.language;
  
  var embeds = [
    new MessageEmbed()
    .setColor(es.color)
    .setTitle(client.la[ls].cmds.music.musicsystem.qof+`__${guild.name}__`)
    .setDescription(client.la[ls].cmds.music.musicsystem.osongs)
    .setThumbnail(guild.iconURL({
      dynamic: true
    })),
    new MessageEmbed()
    .setColor(es.color)
    .setFooter(client.getFooter(es))
    .setImage(guild.banner ? guild.bannerURL({
      size: 4096
    }) : "https://cdn.discordapp.com/attachments/927258550185640026/963672134192869396/marshal_1.gif")
    .setTitle(client.la[ls].cmds.music.musicsystem.title)
    .setDescription(client.la[ls].cmds.music.musicsystem.subtitle)
  ]
  const player = client.manager.players.get(guild.id);
  if (!leave && player && player.queue && player.queue.current) {
    embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .setFooter(client.getFooter(`${client.la[ls].cmds.music.musicsystem.by} ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
        dynamic: true
      })))
      .addField(`${emoji.msg.time} ${client.la[ls].cmds.music.musicsystem.dur} `, `\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``, true)
      .addField(`${emoji.msg.song_by} By: `, `\`${player.queue.current.author}\``, true)
      .addField(`${emoji.msg.repeat_mode} ${client.la[ls].cmds.music.musicsystem.ql} `, `\`${player.queue.length} ${client.la[ls].cmds.music.musicsystem.songg}\``, true)
      .addField(`:sound: ${client.la[ls].cmds.music.musicsystem.cvol}`, `\`${player.volume}% \``)
      .setAuthor(client.getAuthor(`${player.queue.current.title}`, "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif", player.queue.current.uri))
    delete embeds[1].description;
    delete embeds[1].title;
    //get the right tracks of the current tracks
    const tracks = player.queue;
    var maxTracks = 10; //tracks / Queue Page
    //get an array of quelist where 10 tracks is one index in the array
    var songs = tracks.slice(0, maxTracks);
    embeds[0] = new MessageEmbed()
    .setTitle(client.la[ls].cmds.music.musicsystem.qof+`__${guild.name}__  -  [ ${player.queue.length} ${client.la[ls].cmds.music.musicsystem.songg} ]`)
    .setColor(es.color)
    .setDescription(String(songs.map((track, index) => `**\` ${++index}. \` ${track.uri ? `[${track.title.substr(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.uri})` : track.title}** - \`${track.isStream ? `LIVE` : format(track.duration).split(` | `)[0]}\`\n> *${client.la[ls].cmds.music.musicsystem.by}: __${track.requester.tag}__*`).join(`\n`)).substr(0, 2048));
    if(player.queue.length > 10)
      embeds[0].addField(`**\` N. \` *${player.queue.length > maxTracks ? player.queue.length - maxTracks : player.queue.length} ${client.la[ls].cmds.music.musicsystem.ot} ...***`, `\u200b`)
    embeds[0].addField(`**\` 0. \` __${client.la[ls].cmds.music.musicsystem.curt}__**`, `**${player.queue.current.uri ? `[${player.queue.current.title.substr(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.queue.current.uri})` : player.queue.current.title}** - \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration).split(` | `)[0]}\`\n> *${client.la[ls].cmds.music.musicsystem.by}: __${player.queue.current.requester.tag}__*`)
  }
  var Emojis = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
    "🟥",
    "🟧",
    "🟨",
    "🟩",
    "🟦",
    "🟪",
    "🟫",
  ]
  //now we add the components!
  let musicsettings = await client.musicsettings.get(guild.id)
  var musicmixMenu = new MessageSelectMenu()
  .setCustomId("MessageSelectMenu")
  .addOptions(["Strange-Fruits", "Gaming", "Chill", "Magic-Release", "MiYaGi playlist", "Default", "Cepheid's Spotify Playlist", "Bandit Camp Music Storage"].map((t, index) => {
    return {
      label: t.substr(0, 25),
      value: t.substr(0, 25),
      description: `${client.la[ls].cmds.music.musicsystem.load} "${t}"`.substr(0, 50),
      emoji: Emojis[index]
    }
  }))
  if(musicsettings.text == true){
  
  var stopbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Stop').setEmoji(`<:stop:978181805645656104>`).setLabel(`${client.la[ls].cmds.music.musicsystem.stopbt}`).setDisabled()
  var skipbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Skip').setEmoji(`<:skip:978181805679185970>`).setLabel(`${client.la[ls].cmds.music.musicsystem.skipbt}`).setDisabled();
  var shufflebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Shuffle').setEmoji('<:shuffle:978181805972803654>').setLabel(`${client.la[ls].cmds.music.musicsystem.shuffbt}`).setDisabled();
  var pausebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('<:pause:978181784925765684>').setLabel(`${client.la[ls].cmds.music.musicsystem.pausebt}`).setDisabled();
  var autoplaybutton = new MessageButton().setStyle('SECONDARY').setCustomId('Autoplay').setEmoji('<:joines:950878825254883378>').setLabel(`${client.la[ls].cmds.music.musicsystem.autoplbt}`).setDisabled();
  var songbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Song').setEmoji(`<:song_loop:978181804198617088>`).setLabel(`${client.la[ls].cmds.music.musicsystem.slbt}`).setDisabled();
  var queuebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Queue').setEmoji(`<:queue_loop:978181805641449522>`).setLabel(`${client.la[ls].cmds.music.musicsystem.qlbt}`).setDisabled();
  var rewindbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Rewind').setEmoji('<:rewind_1:978181785206808587>').setLabel(`${client.la[ls].cmds.music.musicsystem.rewbt}`).setDisabled();
  var forwardbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Forward').setEmoji('<:forward_1:978181794933375006>').setLabel(`${client.la[ls].cmds.music.musicsystem.forbt}`).setDisabled();
  var lyricsbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Lyrics').setEmoji('<:replay:978181795508015145>').setLabel(`${client.la[ls].cmds.music.musicsystem.replbt}`).setDisabled();
  var volumeup = new MessageButton().setStyle('SECONDARY').setCustomId('Vol+').setEmoji('<:low_volume:978181794799157289>').setLabel(`${client.la[ls].cmds.music.musicsystem.volpbt}`).setDisabled();
  var volumedown = new MessageButton().setStyle('SECONDARY').setCustomId('Vol-').setEmoji('<:volume:978221266345558056>').setLabel(`${client.la[ls].cmds.music.musicsystem.volmbt}`).setDisabled();
  var volumemax = new MessageButton().setStyle('PRIMARY').setCustomId('Volmax').setEmoji('<:max_volume:978181806107021312>').setLabel(`${client.la[ls].cmds.music.musicsystem.volmaxbt}`).setDisabled();
  var volumemid = new MessageButton().setStyle('PRIMARY').setCustomId('Volmid').setEmoji('<:low_volume:978181794799157289>').setLabel(`${client.la[ls].cmds.music.musicsystem.midvolbt}`).setDisabled();
  var volumemin = new MessageButton().setStyle('PRIMARY').setCustomId('Volmin').setEmoji('<:volume:978221266345558056>').setLabel(`${client.la[ls].cmds.music.musicsystem.volminbt}`).setDisabled();
  var joinbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Join').setEmoji(`<:join_vc:950885408290508821>`).setLabel(`${client.la[ls].cmds.music.musicsystem.joinbt}`).setDisabled(false);
  var leavebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Leave').setEmoji(`<:home:981615902778851388>`).setLabel(`${client.la[ls].cmds.music.musicsystem.leavebt}`).setDisabled();
  var textbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Text').setEmoji(`<:on_1:981615931283345478>`).setLabel(`${client.la[ls].cmds.music.musicsystem.textbt2}`).setDisabled(false);
  var savebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Save').setEmoji(`<:save:978918412673753098>`).setLabel(`${client.la[ls].cmds.music.musicsystem.savebt}`).setDisabled();
  var previousbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Previous').setEmoji(`<:prev:980838844398194758>`).setLabel(`${client.la[ls].cmds.music.musicsystem.prevbt}`).setDisabled();
  
  if (musicsettings.text == false) {
    textbutton = textbutton.setEmoji(`<:off:977868613895741470>`).setLabel(`${client.la[ls].cmds.music.musicsystem.textbt1}`)
  }
  if (musicsettings.text == true) {
    textbutton = textbutton.setEmoji(`<:on_1:981615931283345478>`).setLabel(`${client.la[ls].cmds.music.musicsystem.textbt2}`)
  }
  
  if (!leave && player && player.queue && player.queue.current) {
    skipbutton = skipbutton.setDisabled(false);
    shufflebutton = shufflebutton.setDisabled(false);
    stopbutton = stopbutton.setDisabled(false);
    songbutton = songbutton.setDisabled(false);
    queuebutton = queuebutton.setDisabled(false);
    forwardbutton = forwardbutton.setDisabled(false);
    rewindbutton = rewindbutton.setDisabled(false);
    autoplaybutton = autoplaybutton.setDisabled(false);
    pausebutton = pausebutton.setDisabled(false);
    lyricsbutton = lyricsbutton.setDisabled(false);
    volumeup = volumeup.setDisabled(false);
    volumedown = volumedown.setDisabled(false);
    volumemax = volumemax.setDisabled(false);
    volumemin = volumemin.setDisabled(false);
    volumemid = volumemid.setDisabled(false);
    savebutton = savebutton.setDisabled(false);
    if (player.queue.previous){
    	previousbutton = previousbutton.setDisabled(false)
    }
    if (!player.queue.previous){
    	previousbutton = previousbutton.setDisabled(true)
    }
    if (player.volume >= 91){
      volumeup = volumeup.setStyle('DANGER').setLabel('BOOST!').setEmoji('<:max_volume:978181806107021312>')
    }
    if (player.volume == 150){
      volumemax = volumemax.setDisabled()
      volumeup = volumeup.setDisabled()
    }
    if (player.volume !== 150) {
      volumemax = volumemax.setDisabled(false)
      volumeup = volumeup.setDisabled(false)
    }
    if (player.volume == 100){
      volumemid = volumemid.setDisabled()
    }
    if (player.volume !== 100){
      volumemid = volumemid.setDisabled(false)
    }
    if (player.volume == 1){
      volumemin = volumemin.setDisabled()
      volumedown = volumedown.setDisabled()
    }
    if (player.volume !== 1){
      volumemin = volumemin.setDisabled(false)
      volumedown = volumedown.setDisabled(false)
    }
    if (player.get("autoplay")) {
      autoplaybutton = autoplaybutton.setStyle('PRIMARY')
    }
    if (!player.playing) {
      pausebutton = pausebutton.setStyle('PRIMARY').setEmoji('<:play:977868616282275860>').setLabel(`${client.la[ls].cmds.music.musicsystem.resumebt}`)
    }
    if (!player.queueRepeat && !player.trackRepeat) {
      songbutton = songbutton.setStyle('SECONDARY')
      queuebutton = queuebutton.setStyle('SECONDARY')
    }
    if (player.trackRepeat) {
      songbutton = songbutton.setStyle('PRIMARY')
      queuebutton = queuebutton.setStyle('SECONDARY')
    }
    if (player.queueRepeat) {
      songbutton = songbutton.setStyle('SECONDARY')
      queuebutton = queuebutton.setStyle('PRIMARY')
    }
  }
  if(player){
    joinbutton = joinbutton.setDisabled(true)
    leavebutton = leavebutton.setDisabled(false);
  }
  if(!player){
    joinbutton = joinbutton.setDisabled(false)
    leavebutton = leavebutton.setDisabled(true);
  }
}else{
  var stopbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Stop').setEmoji(`<:stop:978181805645656104>`).setDisabled()
  var skipbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Skip').setEmoji(`<:skip:978181805679185970>`).setDisabled();
  var shufflebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Shuffle').setEmoji('<:shuffle:978181805972803654>').setDisabled();
  var pausebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('<:pause:978181784925765684>').setDisabled();
  var autoplaybutton = new MessageButton().setStyle('SECONDARY').setCustomId('Autoplay').setEmoji('<:joines:950878825254883378>').setDisabled();
  var songbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Song').setEmoji(`<:song_loop:978181804198617088>`).setDisabled();
  var queuebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Queue').setEmoji(`<:queue_loop:978181805641449522>`).setDisabled();
  var rewindbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Rewind').setEmoji('<:rewind_1:978181785206808587>').setDisabled();
  var forwardbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Forward').setEmoji('<:forward_1:978181794933375006>').setDisabled();
  var lyricsbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Lyrics').setEmoji('<:replay:978181795508015145>').setDisabled();
  var volumeup = new MessageButton().setStyle('SECONDARY').setCustomId('Vol+').setEmoji('<:low_volume:978181794799157289>').setDisabled();
  var volumedown = new MessageButton().setStyle('SECONDARY').setCustomId('Vol-').setEmoji('<:volume:978221266345558056>').setDisabled();
  var volumemax = new MessageButton().setStyle('PRIMARY').setCustomId('Volmax').setEmoji('<:max_volume:978181806107021312>').setDisabled();
  var volumemid = new MessageButton().setStyle('PRIMARY').setCustomId('Volmid').setEmoji('<:low_volume:978181794799157289>').setDisabled();
  var volumemin = new MessageButton().setStyle('PRIMARY').setCustomId('Volmin').setEmoji('<:volume:978221266345558056>').setDisabled();
  var joinbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Join').setEmoji(`<:join_vc:950885408290508821>`).setDisabled(false);
  var leavebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Leave').setEmoji(`<:home:981615902778851388>`).setDisabled();
  var textbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Text').setEmoji(`<:on_1:981615931283345478>`).setDisabled(false);
  var savebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Save').setEmoji(`<:save:978918412673753098>`).setDisabled();
  var previousbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Previous').setEmoji(`<:prev:980838844398194758>`).setDisabled();

  if (musicsettings.text == false) {
    textbutton = textbutton.setEmoji(`<:off:977868613895741470>`)
  }
  if (musicsettings.text == true) {
    textbutton = textbutton.setEmoji(`<:on_1:981615931283345478>`)
  }
  
  if (!leave && player && player.queue && player.queue.current) {
    skipbutton = skipbutton.setDisabled(false);
    shufflebutton = shufflebutton.setDisabled(false);
    stopbutton = stopbutton.setDisabled(false);
    songbutton = songbutton.setDisabled(false);
    queuebutton = queuebutton.setDisabled(false);
    forwardbutton = forwardbutton.setDisabled(false);
    rewindbutton = rewindbutton.setDisabled(false);
    autoplaybutton = autoplaybutton.setDisabled(false);
    pausebutton = pausebutton.setDisabled(false);
    lyricsbutton = lyricsbutton.setDisabled(false);
    volumeup = volumeup.setDisabled(false);
    volumedown = volumedown.setDisabled(false);
    volumemax = volumemax.setDisabled(false);
    volumemin = volumemin.setDisabled(false);
    volumemid = volumemid.setDisabled(false);
    savebutton = savebutton.setDisabled(false);
    if (player.queue.previous){
    	previousbutton = previousbutton.setDisabled(false)
    }
    if (!player.queue.previous){
    	previousbutton = previousbutton.setDisabled(true)
    }
    if (player.volume >= 91){
      volumeup = volumeup.setStyle('DANGER')
      volumeup = volumeup.setEmoji('<:max_volume:978181806107021312>')
    }
    if (player.volume == 150){
      volumemax = volumemax.setDisabled()
      volumeup = volumeup.setDisabled()
    }
    if (player.volume !== 150) {
      volumemax = volumemax.setDisabled(false)
      volumeup = volumeup.setDisabled(false)
    }
    if (player.volume == 100){
      volumemid = volumemid.setDisabled()
    }
    if (player.volume !== 100){
      volumemid = volumemid.setDisabled(false)
    }
    if (player.volume == 1){
      volumemin = volumemin.setDisabled()
      volumedown = volumedown.setDisabled()
    }
    if (player.volume !== 1){
      volumemin = volumemin.setDisabled(false)
      volumedown = volumedown.setDisabled(false)
    }
    if (player.get("autoplay")) {
      autoplaybutton = autoplaybutton.setStyle('PRIMARY')
    }
    if (!player.playing) {
      pausebutton = pausebutton.setStyle('PRIMARY').setEmoji('<:play:977868616282275860>')
    }
    if (!player.queueRepeat && !player.trackRepeat) {
      songbutton = songbutton.setStyle('SECONDARY')
      queuebutton = queuebutton.setStyle('SECONDARY')
    }
    if (player.trackRepeat) {
      songbutton = songbutton.setStyle('PRIMARY')
      queuebutton = queuebutton.setStyle('SECONDARY')
    }
    if (player.queueRepeat) {
      songbutton = songbutton.setStyle('SECONDARY')
      queuebutton = queuebutton.setStyle('PRIMARY')
    }
  }
  if(player){
    joinbutton = joinbutton.setDisabled(true)
    leavebutton = leavebutton.setDisabled(false);
  }
  if(!player){
    joinbutton = joinbutton.setDisabled(false)
    leavebutton = leavebutton.setDisabled(true);
  }
}
  //now we add the components!
  var components = [
    new MessageActionRow().addComponents([
      musicmixMenu
    ]),
    new MessageActionRow().addComponents([
      joinbutton,
      textbutton,
      leavebutton,
      savebutton,
      autoplaybutton,
    ]),
    new MessageActionRow().addComponents([
      volumedown,
      previousbutton,
      pausebutton,
      skipbutton,
      volumeup,
    ]),
    new MessageActionRow().addComponents([
      rewindbutton,
      songbutton,
      stopbutton,
      queuebutton,
      forwardbutton,
    ]),
    new MessageActionRow().addComponents([
      lyricsbutton,
      volumemin,
      volumemid,
      volumemax,
      shufflebutton,
    ]), 
  ]
  return {
    embeds,
    components
  }
}
module.exports.generateQueueEmbed = generateQueueEmbed;
