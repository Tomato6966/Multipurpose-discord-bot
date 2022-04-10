//all reactions for the finished channel
const moment = require('moment');
const { dbEnsure } = require(`./functions`);
const config = require(`../botconfig/config.json`)
const Discord = require(`discord.js`);
const antimap = new Map()
const cooldown = new Set();
const { MessageButton, MessageActionRow, Permissions } = require('discord.js')
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Modal and TextInputComponent class


const Buttons = {
  acceptbutton: new MessageButton().setStyle('SUCCESS').setEmoji(`✅`).setCustomId(`Apply_accept`).setLabel(`Accept`),
  declinebutton: new MessageButton().setStyle('DANGER').setEmoji(`❌`).setCustomId(`Apply_deny`).setLabel(`Decline`),
  ticketbutton: new MessageButton().setStyle('SECONDARY').setEmoji(`🎟️`).setCustomId(`Apply_ticket`).setLabel(`Ask Question`),
  emoji1button: new MessageButton().setStyle('PRIMARY').setEmoji(`1️⃣`).setCustomId(`Apply_1`),
  emoji2button: new MessageButton().setStyle('PRIMARY').setEmoji(`2️⃣`).setCustomId(`Apply_2`),
  emoji3button: new MessageButton().setStyle('PRIMARY').setEmoji(`3️⃣`).setCustomId(`Apply_3`),
  emoji4button: new MessageButton().setStyle('PRIMARY').setEmoji(`4️⃣`).setCustomId(`Apply_4`),
  emoji5button: new MessageButton().setStyle('PRIMARY').setEmoji(`5️⃣`).setCustomId(`Apply_5`),
  acceptbutton_d: new MessageButton().setStyle('SUCCESS').setEmoji(`✅`).setCustomId(`Apply_accept`).setLabel(`Accept`).setDisabled(true),
  declinebutton_d: new MessageButton().setStyle('DANGER').setEmoji(`❌`).setCustomId(`Apply_deny`).setLabel(`Decline`).setDisabled(true),
  ticketbutton_d: new MessageButton().setStyle('SECONDARY').setEmoji(`🎟️`).setCustomId(`Apply_ticket`).setLabel(`Ask Question`).setDisabled(true),
  emoji1button_d: new MessageButton().setStyle('PRIMARY').setEmoji(`1️⃣`).setCustomId(`Apply_1`).setDisabled(true),
  emoji2button_d: new MessageButton().setStyle('PRIMARY').setEmoji(`2️⃣`).setCustomId(`Apply_2`).setDisabled(true),
  emoji3button_d: new MessageButton().setStyle('PRIMARY').setEmoji(`3️⃣`).setCustomId(`Apply_3`).setDisabled(true),
  emoji4button_d: new MessageButton().setStyle('PRIMARY').setEmoji(`4️⃣`).setCustomId(`Apply_4`).setDisabled(true),
  emoji5button_d: new MessageButton().setStyle('PRIMARY').setEmoji(`5️⃣`).setCustomId(`Apply_5`).setDisabled(true),
}
//Start the module
module.exports = async (client) => {

  const applySystemAmount = 100;


  //define the apply system variable
  async function ApplySystem({ guild, channel, user, message, interaction, es, ls, preindex = false }) {
    let index = preindex ? preindex : false;
    const rawData = await client.apply.all();
    if(!index) {
      let rawIds = rawData.map(x => x?.ID ? x.ID : null).filter(Boolean);
      if(rawIds.includes(guild.id)) {
        let dData = rawData.find(d => d.ID == guild.id)?.data;
        for (let i = 1; i<=applySystemAmount; i++) {
          let pre = `apply${i}`;
          if(!dData) break;
          if(!dData[pre]) continue;
          if(message.id === dData[pre][`message_id`] && (channel.id === dData[pre][`channel_id`] || message.channelId === dData[pre][`channel_id`])) {
            index = i;
            break;
          }
        }
      }
    }
    if(!index) {
      if(!interaction?.replied) return interaction?.reply({ephemeral: true, content: `:x: Could not find the Database for your Application!`}).catch(() => null);
      else return interaction?.editReply({ephemeral: true, content: `:x: Could not find the Database for your Application!`}).catch(() => null);
    }
    
    let applyname = `apply${index}`;
    let applytickets = `applytickets${index}`; 
    let ticketsetupapply = `ticket-setup-apply-${index}`; 
    let pre = `apply${index}`;
    console.log("APPLY DB NUMBER: ".green, index);
    var applyDbData = rawData.find(d => d.ID == guild.id)?.data?.[pre] || await apply_db.get(`${message.guild.id}.${pre}`);
    let apply_db = client.apply
    let buttonRow1 = new MessageActionRow().addComponents([Buttons.acceptbutton, Buttons.declinebutton, Buttons.ticketbutton]);
    let buttonRow2 = new MessageActionRow().addComponents([Buttons.emoji1button, Buttons.emoji2button, Buttons.emoji3button, Buttons.emoji4button, Buttons.emoji5button]);
    let allbuttons = [buttonRow1, buttonRow2];
    if(!interaction?.replied && (!applyDbData.applytype || applyDbData.applytype !== "modal")) await interaction.reply({ephemeral: true, content: `Found the DB and now creating the APPLICATION ...`}).catch(() => null);
    
    //
    try {
      //COOLDOWN SYSTEM
      if (cooldown.has(user.id) && user.id != "442355791412854784") {
        return interaction?.reply({embeds: [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable1`]))
          .addField(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variablex_2`]), eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable2`]))]
         ,ephemeral: true})
      } else {
        cooldown.add(user.id);
        setTimeout(() => {
          cooldown.delete(user.id);
        }, 120 * 1000);
      }
      var originaluser = user;
      var originalchannel = message.channel;
      
      var channel_tosend = guild.channels.cache.get(applyDbData.f_channel_id);
      if (!channel_tosend) return 
      
      if (!antimap.has(user.id)) antimap.set(user.id)
      else if(user.id != "442355791412854784") {
        let e = {
          message: "You are on cooldown"
        }
        if(!interaction?.replied) return interaction?.reply({
          content: `${user}`, 
          embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable5`]))
            .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable6`]))
          ], 
          ephemeral: true
        }).catch(() => null);
        else return interaction?.editReply({
          content: `${user}`, 
          embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable5`]))
            .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable6`]))
          ], 
          ephemeral: true
        }).catch(() => null);
      }

      var answers = [];
      var counter = 0;
      var url = ``;
      var Questions = applyDbData.QUESTIONS
      // if it's a modal
      if(applyDbData.applytype && applyDbData.applytype == "modal") {
        const modal = new Modal() // We create a Modal
        .setCustomId(`modal-apply-${originaluser.id}`)
        .setTitle(`Apply for ${guild.name}`)
        .addComponents(Questions.map( (Question, index) => {
          return new TextInputComponent()
            .setCustomId(`modalquestion_${index}`)
            .setLabel(`${Object.values(Question)[0].content}`.substring(0, 45))
            .setStyle(`${Object.values(Question)[0].modalquestion?.toUpperCase()}`)
            .setMinLength(Object.values(Question)[0].minlength)
            .setMaxLength(Object.values(Question)[0].maxlength)
            .setPlaceholder('Write your Answer here..')
            .setRequired(true)
          })
        );
        showModal(modal, {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction // Show the modal with interaction data.
        })
        client.on('modalSubmit', async (modal) => {
          if(modal.customId === `modal-apply-${originaluser.id}` && client.cluster.ids.map(d => d.id).includes(modal.guild.shard.id)){
            const answers = []
            Object.values(Questions).forEach( (Question, index) => {
              const response = modal.getTextInputValue(`modalquestion_${index}`)
              answers.push(response);
            });
            var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable13`])) //${user.tag} -
              .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable14`]))
              .setFooter(client.getFooter(originaluser.id, originaluser.displayAvatarURL({
                dynamic: true
              })))
              .setThumbnail(originaluser.displayAvatarURL({
                dynamic: true
              }))
              .setTimestamp()

            //for each question add a field
            for (var i = 0; i < Questions.length; i++) {
              try {
                let qu = Object.values(Questions[i])[0].content;
                if (qu.length > 100) qu = String(Object.values(Questions[i])[0].content).substring(0, 100) + ` ...`
                embed.addField((`**` + Object.keys(Questions[i])[0] + `. |** ` + qu).substring(0, 256), `>>> ` + String(answers[i]).substring(0, 1024))
              } catch (e) {
                console.error(e)
                /* */
              }
            }


            //send the embed into the channel
            channel_tosend.send({embeds: [embed], components: allbuttons}).then(async thmsg => {
              //set the message to the database
              var obj = { };
              obj[pre] = { temp: originaluser.id }
              await apply_db.set(thmsg.id, obj);
              //react with each emoji of all reactions
              await modal.deferReply({ ephemeral: true })
              modal.followUp({content: "Successfully sent your application!", ephemeral: true});
            }).catch(async e => {
              console.error(e);
              await modal.deferReply({ ephemeral: true })
              modal.followUp({content: "Could not send your application! Something went wrong...", ephemeral: true});
            })
            //then try catch
            try {
              //find the role from the database
              var roleid =applyDbData.TEMP_ROLE;
              if (roleid) {
                if (roleid.length == 18) {
                  //find the member from the reaction event
                  var member = message.guild.members.cache.get(originaluser.id);
                  //find the role
                  var role = await message.guild.roles.cache.get(roleid);
                  if (!role) return channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable16`]))
                  if (!member) return channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable17`]))
                  //add the role
                  member.roles.add(role.id).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
                }
              }

            } catch (e) {
              console.error(e)
              channel_tosend.send(`I am Missing Permissions to grant the TEMPROLE\n` + e.message)
              /* */
            }
          }  
        });
        return;
      }
      
      var current_question = Object.values(Questions[counter]).join(` `)

      if(!interaction.replied) await interaction?.reply({content: `Starting the Application in your **Direct Messages!**`, ephemeral: true}).catch(() => null);
      else await interaction?.editReply({content: `Starting the Application in your **Direct Messages!**`, ephemeral: true}).catch(() => null);
      //ask the current (first) Question from the Database
      ask_question(current_question);

      /** @param ask_question {qu} Question == Ask the current Question and push the answer
       * This function is for asking ONE SINGLE Question to the USER
       */
      function ask_question(qu) {
        if (counter === Questions.length) return send_finished();
        //send the user the first question
        user.send({embeds: [new Discord.MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
            .setDescription(qu)
            .setAuthor(client.getAuthor(`Question ${counter + 1} / ${Questions.length}`, client.user.displayAvatarURL(), `https://discord.gg/MBPsvcphGf`))
            .setFooter(client.getFooter(es))
        ]}).then(msg => {
            msg.channel.awaitMessages({ filter: m => m.author.id === user.id, 
              max: 1,
              time: 300e3,
              errors: [`time`]
            }).then(async collected => {
              //push the answer of the user into the answers lmfao
              if (collected.first().attachments.size > 0) {
                if (collected.first().attachments.every(attachIsImage)) {
                  answers.push(`${collected.first().content}\n${url}`);
                } else {
                  answers.push(`${collected.first().content}\nThere was an attachment, which i cannot display!`);
                }
              } else {
                answers.push(`${collected.first().content}`);
              }
              //count up with 1
              counter++;
              //if it reached the questions limit return with the finished embed
              if (counter === Questions.length) return send_finished();

              //get the new current question
              var new_current_question = Object.values(Questions[counter]).join(` `)

              //ask the new current question
              ask_question(new_current_question);

            }).catch(error => {
              console.error(error)
              antimap.delete(user.id)
              return user.send({embeds: [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable7`]))
                .setFooter(client.getFooter(es))
              ]}).catch(e => {
                antimap.delete(user.id)
                message.reply({embeds: [new Discord.MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable8`]))
                  .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable9`]))]
                }).then(async msg=>{
                  setTimeout(()=>{
                    try{msg.delete();}catch{}
                  }, 5000)
                })
              })
            })
        })
          .catch(e => {
            console.error(e)
            antimap.delete(user.id)
            return interaction?.editReply({content: `${user}`, embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable10`]))
              .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable11`]))
            ]}).then(async msg=>{
              setTimeout(()=>{
                try{msg.delete();}catch{}
              }, 5000)
            })
          })
      }

      /** @param send_finished {*} == Send the finished application embed to the finished application questions channel ;)
       * This function is for asking ONE SINGLE Question to the USER
       */
      async function send_finished() {
        if (applyDbData.last_verify) {
          user.send({embeds: [new Discord.MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
            .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable12`]))
            .setFooter(client.getFooter(es))
          ]}).then(async msg => {

            msg.react(`✅`)
            msg.react(`❌`)

            const filter = (reaction, user) => {
              return user.id === originaluser.id;
            };
            msg.awaitReactions({filter, 
                max: 1,
                time: 300e3,
                errors: ['time']
              })
              .then(async collected => {
                let reaction = collected.first();
                if (reaction.emoji?.name === `✅`) {
                  antimap.delete(originaluser.id)
                  var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable13`])) //${user.tag} -
                    .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable14`]))
                    .setFooter(client.getFooter(originaluser.id, originaluser.displayAvatarURL({
                      dynamic: true
                    })))
                    .setThumbnail(originaluser.displayAvatarURL({
                      dynamic: true
                    }))
                    .setTimestamp()

                  //for each question add a field
                  for (var i = 0; i < Questions.length; i++) {
                    try {
                      let qu = Object.values(Questions[i]);
                      if (qu.length > 100) qu = String(Object.values(Questions[i])).substring(0, 100) + ` ...`
                      embed.addField((`**` + Object.keys(Questions[i]) + `. |** ` + qu).substring(0, 256), `>>> ` + String(answers[i]).substring(0, 1000))
                    } catch (e) {
                      console.error(e)
                      /* */
                    }
                  }


                  //send the embed into the channel
                  
                  channel_tosend.send({embeds: [embed], components: allbuttons}).then(async thmsg => {
                    //set the message to the database
                    var obj = { };
                    obj[pre] = { temp: originaluser.id }
                    await apply_db.set(thmsg.id, obj);
                    //react with each emoji of all reactions
                  });
                  // `Producing Code` (May take some time)
                  const finished_embed = new Discord.MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable15`]))
                    .addField(`\u200b`, `**❯** Go Back to the Channel ${originalchannel}`).setFooter(client.getFooter(es))

                  //send an informational message
                  originaluser.send({embeds: [finished_embed]})
                  //then try catch
                  try {
                    //find the role from the database
                    var roleid =applyDbData.TEMP_ROLE;
                    if (roleid) {
                      if (roleid.length == 18) {
                        //find the member from the reaction event
                        var member = message.guild.members.cache.get(originaluser.id);
                        //find the role
                        var role = await message.guild.roles.cache.get(roleid);
                        if (!role) return channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable16`]))
                        if (!member) return channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable17`]))
                        //add the role
                        member.roles.add(role.id).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
                      }
                    }

                  } catch (e) {
                    console.error(e)
                    channel_tosend.send(`I am Missing Permissions to grant the TEMPROLE\n` + e.message)
                    /* */
                  }




                } else {
                  antimap.delete(originaluser.id)
                  originaluser.send({embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable18`]))
                    .setFooter(client.getFooter(es))
                  ]})
                }
              }).catch(e => {
                console.error(e)
                antimap.delete(originaluser.id)
                originaluser.send({embeds: [new Discord.MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable19`]))
                  .setFooter(client.getFooter(es))
                ]})
              });
          })

        } else {
          antimap.delete(user.id)
          var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
            .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable20`])) //${user.tag} -
            .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable21`]))
            .setFooter(originaluser.id, originaluser.displayAvatarURL({
              dynamic: true
            }))
            .setTimestamp()

          //for each question add a field
          for (var i = 0; i < Questions.length; i++) {
            try {
              let qu = Object.values(Questions[i]);
              if (qu.length > 100) qu = String(Object.values(Questions[i])).substring(0, 100) + ` ...`
              embed.addField((`**` + Object.keys(Questions[i]) + `. |** ` + qu).substring(0, 256), `>>> ` + String(answers[i]).substring(0, 1000))
            } catch {
              /* */
            }
          }

          //send the embed into the channel
          let thhmsg = await channel_tosend.send({ embeds: [embed], components: allbuttons })
          //set the message to the database
          var obj = { };
          obj[pre] = { temp: originaluser.id }
          await apply_db.set(thhmsg.id, obj);
          //react with each emoji of all reactions            

          // `Producing Code` (May take some time)
          const finished_embed = new Discord.MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
            .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable22`]))
            .addField(`\u200b`, `**❯** Go Back to the Channel ${originalchannel}`).setFooter(client.getFooter(es))
          originaluser.send({content: `**❯** Go Back to the Channel ${originalchannel}`, embeds: [finished_embed]})

          //then try catch
          try {
            //find the role from the database
            var roleid = await applyDbData.TEMP_ROLE;
            if (roleid) {
              if (roleid.length == 18) {
                //find the member from the reaction event
                var member = message.guild.members.cache.get(originaluser.id);
                //find the role
                var role = await message.guild.roles.cache.get(roleid);
                if (!role) return channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable23`]))
                if (!member) return channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable24`]))
                //add the role
                member.roles.add(role.id).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            }

          } catch (e) {
            console.error(e)
            channel_tosend.send(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable25`]))
            /* */
          }


        }

      }

      //this function is for turning each attachment into a url
      function attachIsImage(msgAttach) {
        url = msgAttach.url;
        //True if this url is a png image.
        return url.indexOf(`png`, url.length - `png`.length /*or 3*/ ) !== -1 ||
          url.indexOf(`jpeg`, url.length - `jpeg`.length /*or 3*/ ) !== -1 ||
          url.indexOf(`gif`, url.length - `gif`.length /*or 3*/ ) !== -1 ||
          url.indexOf(`jpg`, url.length - `jpg`.length /*or 3*/ ) !== -1;
      }
    } catch (e) {
      console.error(e)
      message.reply({embeds: [new Discord.MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable26`]))
        .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable27`]))
      ]}).then(async msg=>{
        setTimeout(()=>{
          try{msg.delete();}catch{}
        }, 5000)
      })
    }
  }
  module.exports.ApplySystem = ApplySystem;


  //For the application start
  client.on(`interactionCreate`, async (interaction) => {
    if (!interaction?.isButton()) return;
    var { guild, channel, user, message } = interaction;
    if(!guild || !channel || !message || !user) return;
    if (message.author?.id != client.user.id) return;
    if (interaction?.customId.startsWith(`User_Apply`)) {
      const guildSettings = await client.settings.get(guild.id);
      const es = guildSettings.embed;
      const ls = guildSettings.language
      ApplySystem({ guild, channel, user, message, interaction, es, ls })
    }
  })

  //for the accepting etc.
  client.on(`interactionCreate`, async (interaction) => {
    if (!interaction?.isButton()) return;
    var { guild, channel, user, message } = interaction;
    if(!guild || !channel || !message || !user) return;
    if (message.author?.id != client.user.id) return;
    const guildSettings = await client.settings.get(guild.id);
    const es = guildSettings.embed;
    const ls = guildSettings.language
    if (interaction?.customId.startsWith(`Apply_`)) {
        let index = false;
        const rawData = await client.apply.all();
        let dData = rawData.find(d => d.ID == guild.id)?.data
        let mData = rawData.find(d => d.ID == message.id)?.data
        if(dData) {
          for (let i = 1; i<=applySystemAmount; i++) {
            let pre = `apply${i}`;
            if(!mData || !mData[pre]) continue;
            if(!dData[pre]) continue;
            if(channel.id === dData[pre][`f_channel_id`]) index = i;
          }
        }
        if(!index) {
          return console.log(`NO DB FOUND`)
        }
        let applyname = `apply${index}`;
        let applytickets = `applytickets${index}`; 
        let ticketsetupapply = `ticket-setup-apply-${index}`; 
        let pre = `apply${index}`;
        let apply_db = client.apply
        if(!rawData.find(d => d.ID == message.id)) return;
        let applyDbData = rawData.find(d => d.ID == guild.id)?.data;
        let applyMsgData = rawData.find(d => d.ID == message.id)?.data;
        if(!applyDbData) return;
        if(!applyDbData[pre]) return;
        if(!applyDbData[pre].f_channel_id) return;
        if(applyDbData[pre].f_channel_id !== channel.id) return;
        applyDbData = applyDbData?.[pre];
        applyMsgData = applyMsgData?.[pre];
        try {
          //fetch the message from the data
          const targetMessage = await message.channel.messages.fetch(message.id, false, true).catch(() => null)
  
          //if no message found, return an error
          if (!targetMessage)
            return interaction?.reply({embeds: [new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable28`]))
              .setFooter(client.getFooter(es))], ephemeral: true});
          
          //get the old embed information
          const oldEmbed = targetMessage.embeds[0];
  
          //if there is no old embed, return an error
          if (!oldEmbed)
            return interaction?.reply({embeds: [new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable29`]))
              .setFooter(client.getFooter(es))]
            , ephemeral: true});
  
            let emoji = {
              "Apply_accept": `✅`,
              "Apply_deny": `❌`,
              "Apply_ticket": `🎟️`,
              "Apply_1": `1️⃣`,
              "Apply_2": `2️⃣`,
              "Apply_3": `3️⃣`,
              "Apply_4": `4️⃣`,
              "Apply_5": `5️⃣`,
            }
          //create a new embed
          const embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))
            .setTitle(oldEmbed.title)
            .setDescription(`${oldEmbed.description ? `${oldEmbed.description}\n`: ``} Edited by: <@${interaction?.user.id}> | ${emoji[interaction?.customId]}`.substring(0, 2048))
  
          //for each data in it from before hand
          if (oldEmbed.fields[0]) {
            try {
              for (var i = 0; i <= oldEmbed.fields.length; i++) {
                try {
                  if (oldEmbed.fields[i]) embed.addField(oldEmbed.fields[i].name, oldEmbed.fields[i].value)
                } catch {}
              }
            } catch {}
          }
          
          let buttonRow1_d = new MessageActionRow().addComponents([Buttons.acceptbutton_d, Buttons.declinebutton_d, Buttons.ticketbutton_d]);
          let buttonRow2_d = new MessageActionRow().addComponents([Buttons.emoji1button_d, Buttons.emoji2button_d, Buttons.emoji3button_d, Buttons.emoji4button_d, Buttons.emoji5button_d]);
          let allbuttons_d = [buttonRow1_d, buttonRow2_d];
          //if the reaction is for APPROVE
          if (interaction?.customId == `Apply_accept`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`GREEN`)
            
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id+`.${pre}.Apply`, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              })
            })
  
            //CREATE THE APPROVE MESSAGE
            var approve = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(`GREEN`)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable30`]))
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              .setDescription(applyDbData.accept)
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]), ephemeral: true});
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
  
            //send the user the approve message
            usert.send({embeds: [approve]}).catch(e => {
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable32`]), ephemeral: true});
              console.error(e);
            }).then(()=>{
              if(interaction?.replied) {
                interaction.editReply({content: `👍`, ephemeral: true}).catch(() => null);
              }
              interaction?.reply({content: `👍`, ephemeral: true}).catch(() => null);
            })
            //TRY CATCH --- ADDING ROLE
            try {
              //get the roleid from the db
              let roleid = applyDbData.accept_role;
              if (roleid) {
                //if no roleid added then return error
                if (roleid.length !== 18) return;
                //try to add the role
                var member = message.guild.members.cache.get(usert.id)
                member.roles.add(roleid).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            } catch (e) {
              console.log(String(e).grey)
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable33`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
          }
  
          //if the reaction is for deny
          if (interaction?.customId === `Apply_deny`) {
            embed.setColor(es.wrongcolor)
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              }, `${pre}.Apply`)
            })
            var deny = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable34`]))
              .setDescription(applyDbData.deny)
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});

            usert.send({embeds: [deny]}).then(()=>{
              interaction?.reply({content: `👍`, ephemeral: true})
            }).catch(e => {
              if(e) {
                console.error(e);
                interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable35`]),ephemeral:  true});
              }
            })
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
          }
  
  
          //if the reaction is for CREATE A TICKET
          if (interaction?.customId === `Apply_ticket`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`ORANGE`)
  
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              }, `${pre}.Apply`)
            })
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            if(!usert)  {
              if(interaction?.replied) interaction.channel.send({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
              else interaction.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
              return;
            }

            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
  
            //TRY CATCH --- ADDING ROLE
            try {
              message.guild.channels.create(`Ticket-${usert.username}`.substring(0, 32), {
                  type: 'text',
                  topic: `Just Delete this channel, if not needed there is no delete/close command!`,
                  permissionOverwrites: [{
                      id: message.guild.id,
                      deny: ['VIEW_CHANNEL'],
                    },
                    {
                      id: usert.id,
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                    {
                      id: interaction?.user.id,
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                  ],
                })
                .then((channel) => {
                  setTimeout(()=>{
                    try{
                      if(channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                        channel.permissionOverwrites.edit(usert.id, {
                          VIEW_CHANNEL: true,
                          SEND_MESSAGES: true
                        }).catch(() => null)
                        channel.permissionOverwrites.edit(interaction?.user.id, {
                          VIEW_CHANNEL: true,
                          SEND_MESSAGES: true
                        }).catch(() => null)
                      }
                    }catch{
  
                    }
                  }, 2000)
                  //TRY CATCH SEND CHANNEL INFORMATION
                  let button_close = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_close').setLabel('Close').setEmoji(`🔒`) 
                  let button_delete = new MessageButton().setStyle('SECONDARY').setCustomId('ticket_delete').setLabel(`Delete`).setEmoji(`🗑️`)
                  let button_transcript = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_transcript').setLabel(`Transcript`).setEmoji(`📑`)
                  let button_user = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_user').setLabel(`Managee Users`).setEmoji(`👤`)
                  let button_role = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_role').setLabel(`Managee Roles`).setEmoji(`📌`) 
                  let buttonRow1 = new MessageActionRow()
                  .addComponents([button_close, button_delete, button_transcript])
                  let buttonRow2 = new MessageActionRow()
                  .addComponents([button_user, button_role])
                  const allbuttons = [buttonRow1, buttonRow2]
                  try {
                    if(client.setups.get(`TICKETS`, applytickets).includes(usert.id)){
                      channel.send({ 
                        content: `<@${usert.id}>\nBecause he already has a TICKET for this Application System, this Channel got created!`,
                        embeds: [new Discord.MessageEmbed()
                              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
                              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable36`]))
                              .setFooter(client.getFooter(`Just Delete this channel, if not needed there is no delete/close command!`, message.guild.iconURL({
                                dynamic: true
                              })))
                              .setDescription(applyDbData.ticket?.replace(`{user}`, `<@${usert.id}>`))]
                            })
                    }else {
                      client.setups.push(`TICKETS`, usert.id, applytickets);
                      client.setups.push(`TICKETS`, channel.id, applytickets);
                      client.setups.set(interaction?.user.id, channel.id, applytickets);
                      client.setups.set(channel.id, {
                        user: usert.id,
                        channel: channel.id,
                        guild: channel.guild.id,
                        type: ticketsetupapply,
                        state: `open`,
                        date: Date.now(),
                      }, `ticketdata`);
                      channel.send({ 
                        content: `<@${usert.id}>`,
                        embeds: [new Discord.MessageEmbed()
                              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes(`http://`) || es.footericon.includes(`https://`)) ? es.footericon : client.user.displayAvatarURL() : null)
                              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable37`]))
                              .setFooter(client.getFooter(`To close/manage this ticket react with the buttons
You can also type: ${client.settings.get(channel.guild.id, `prefix`)}ticket!`, message.guild.iconURL({
                                dynamic: true
                              })))
                              .setDescription(applyDbData.ticket?.replace(`{user}`, `<@${usert.id}>`))],
                         components: allbuttons})
                      }
                  } catch {
                    /* */
                  }
  
                  //try catch send user message
                  try {
                    //CREATE THE APPROVE MESSAGE
                    var approve = new Discord.MessageEmbed()
                      .setColor(`ORANGE`)
                      .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable38`]))
                      .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                        dynamic: true
                      })))
                      .setDescription(applyDbData.ticket?.replace(`{user}`, `<@${usert.id}>`) + `Channel: <#${channel.id}>`)
  
                    //send the user the approve message
                    usert.send({embeds: [approve]}).catch(e => {
                      interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable39`]),ephemeral:  true});
                      console.error(e);
                    }).then(()=>{
                      interaction?.reply({content: `👍`, ephemeral: true})
                    })
                  } catch {
                    /* */
                  }
                });
            } catch (e) {
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable40`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
  
          }
  
  
          //if the reaction is for FIRST ROLE APPROVE
          if (interaction?.customId === `Apply_1`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`#54eeff`)
  
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id+`.${pre}.Apply`, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              })
            })
  
            //CREATE THE APPROVE MESSAGE
            var approve = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(`GREEN`)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable41`]))
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              .setDescription(applyDbData.one.message)
            //if image is enabled then set the image
            if (applyDbData.one.image.enabled) try {
              approve.setImage(applyDbData.one.image.url)
            } catch {
              /* */
            }
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
  
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
  
            //send the user the approve message
            usert.send({embeds: [approve]}).catch(e => {
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable42`]),ephemeral:  true});
              console.error(e);
            }).then(()=>{
              interaction?.reply({content: `👍`, ephemeral: true})
            })
  
            //TRY CATCH --- ADDING ROLE
            try {
              //get the roleid from the db
              let roleid = await applyDbData.one.role;
              if (roleid) {
                //if no roleid added then return error
                if (roleid.length !== 18) return;
                //try to add the role
                var member = message.guild.members.cache.get(usert.id)
                member.roles.add(roleid).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            } catch (e) {
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable43`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
  
  
          }
  
  
          //if the reaction is for SECOND ROLE APPROVE
          if (interaction?.customId === `Apply_2`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`#54cfff`)
  
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id+`.${pre}.Apply`, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              })
            })
  
            //CREATE THE APPROVE MESSAGE
            var approve = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(`GREEN`)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable44`]))
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              .setDescription(applyDbData.two.message)
            //if image is enabled then set the image
            if (applyDbData.two.image.enabled) try {
              approve.setImage(applyDbData.two.image.url)
            } catch {
              /* */
            }
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
  
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
  
            //send the user the approve message
            usert.send({embeds: [approve]}).catch(e => {
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable45`]),ephemeral:  true});
              console.error(e);
            }).then(()=>{
              interaction?.reply({content: `👍`, ephemeral: true})
            })
  
            //TRY CATCH --- ADDING ROLE
            try {
              //get the roleid from the db
              let roleid = applyDbData.two.role
              if (roleid) {
                //if no roleid added then return error
                if (roleid.length !== 18) return;
                //try to add the role
                var member = message.guild.members.cache.get(usert.id)
                member.roles.add(roleid).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            } catch (e) {
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable46`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
  
          }
  
  
          //if the reaction is for THIRD ROLE APPROVE
          if (interaction?.customId === `Apply_3`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`#549bff`)
  
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id+`.${pre}.Apply`, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              })
            })
  
            //CREATE THE APPROVE MESSAGE
            var approve = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(`GREEN`)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable47`]))
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              .setDescription(applyDbData.three.message)
            //if image is enabled then set the image
            if (applyDbData.three.image.enabled) try {
              approve.setImage(applyDbData.three.image.url)
            } catch {
              /* */
            }
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
  
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
  
            //send the user the approve message
            usert.send({embeds: [approve]}).catch(e => {
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable48`]),ephemeral:  true});
              console.error(e);
            }).then(()=>{
              interaction?.reply({content: `👍`, ephemeral: true})
            })
  
            //TRY CATCH --- ADDING ROLE
            try {
              //get the roleid from the db
              let roleid = applyDbData.three.role;
              if (roleid) {
                //if no roleid added then return error
                if (roleid.length !== 18) return;
                //try to add the role
                var member = message.guild.members.cache.get(usert.id)
                member.roles.add(roleid).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            } catch (e) {
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable49`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
          }
  
  
          //if the reaction is for FOURTH ROLE APPROVE
          if (interaction?.customId === `Apply_4`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`#6254ff`)
  
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id+`.${pre}.Apply`, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              })
            })
  
            //CREATE THE APPROVE MESSAGE
            var approve = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(`GREEN`)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable50`]))
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              .setDescription(applyDbData.four.message)
            //if image is enabled then set the image
            if (applyDbData.four.image.enabled) try {
              approve.setImage(applyDbData.four.image.url)
            } catch {
              /* */
            }
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
  
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
            
            //send the user the approve message
            usert.send({embeds: [approve]}).catch(e => {
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable51`]),ephemeral:  true});
              console.error(e);
            }).then(()=>{
              interaction?.reply({content: `👍`, ephemeral: true})
            })
  
            //TRY CATCH --- ADDING ROLE
            try {
              //get the roleid from the db
              let roleid = applyDbData.four.role;
              if (roleid) {
                //if no roleid added then return error
                if (roleid.length !== 18) return;
                //try to add the role
                var member = message.guild.members.cache.get(usert.id)
                member.roles.add(roleid).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            } catch (e) {
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable52`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
          }
  
  
          //if the reaction is for FITH ROLE APPROVE
          if (interaction?.customId === `Apply_5`) {
            //SET THE EMBED COLOR TO GREEN
            embed.setColor(`#1705e6`)
  
            //EDIT THE EMBED
            targetMessage.edit({embeds: [embed], components: allbuttons_d}).catch(() => null).then(async msg=>{
              apply_db.set(msg.id+`.${pre}.Apply`, {
                id: msg.id,
                user: interaction?.user.id,
                State: interaction?.customId,
              })
            })
  
            //CREATE THE APPROVE MESSAGE
            var approve = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(`GREEN`)
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable53`]))
              .setFooter(client.getFooter(`By: ` + interaction?.user.tag, interaction?.user.displayAvatarURL({
                dynamic: true
              })))
              .setDescription(applyDbData.five.message)
            //if image is enabled then set the image
            if (applyDbData.five.image.enabled) try {
              approve.setImage(applyDbData.five.image.url)
            } catch {
              /* */
            }
  
            //GET THE USER FROM THE DATABASE
            var usert = await client.users.fetch(applyMsgData?.temp).catch(() => null);
            if(!usert) return interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable31`]),ephemeral:  true});
  
            //try to remove all roles after that continue?
            await rome_old_roles(message, usert, applyDbData, pre);
  
            //send the user the approve message
            usert.send({embeds: [approve]}).catch(e => {
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable54`]),ephemeral:  true});
              console.error(e);
            }).then(()=>{
              interaction?.reply({content: `👍`, ephemeral: true})
            })
  
            //TRY CATCH --- ADDING ROLE
            try {
              //get the roleid from the db
              let roleid = applyDbData.five.role;
              if (roleid) {
                //if no roleid added then return error
                if (roleid.length !== 18) return;
                //try to add the role
                var member = message.guild.members.cache.get(usert.id)
                member.roles.add(roleid).catch((e)=>{channel_tosend.send(`I am Missing Permissions to grant the Role\n` + e.message)});
              }
            } catch (e) {
              //if an error happens, show it
              interaction?.reply({content: eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable55`]),ephemeral:  true}).then(async msg=>{
                setTimeout(()=>{
                  try{msg.delete();}catch{}
                }, 5000)
              })
            }
          }
          try{ if(!interaction?.replied) interaction?.deferUpdate().catch(() => null) }catch{ }
        } catch (e) {
          console.error(e)
          if(interaction?.replied) {
            interaction?.channel.send({embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable56`]))
              .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable57`]))]
              , ephemeral: true}).then(async msg=>{
              setTimeout(()=>{
                try{msg.delete();}catch{}
              }, 5000)
            })
          } else {
            interaction?.reply({embeds: [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable56`]))
              .setDescription(eval(client.la[ls][`handlers`][`applyjs`][`apply`][`variable57`]))]
              , ephemeral: true})
          }
        }
    }
  });

}

/** ////////////////////////////////////////// *
 * FUNCTION FOR REMOVING ALL OLD ROLES
 * ////////////////////////////////////////// *
 */

// Be a good listener, so that you can encourage others to talk about themselve.
// Soemtimes add some questions / responses, so that they feel like having interest

// Talk about what some1 else is interested in, don't just talk about stuff u like and they don't 


function rome_old_roles(message, user, applyDbData) {
  return new Promise(async (resolve, reject) => {
    //get the reactionmember from the reactions
    let reactionmember = message.guild.members.cache.get(user);

    //get the temprole, Try to remove the temprole if its valid
    let temprole = applyDbData.TEMP_ROLE;
    if (temprole != `0`) {
      try {
        if (reactionmember.roles.cache.has(temprole))
        await reactionmember.roles.remove(temprole);
      } catch {
        /* */
      }
    }

    //get the one.role, Try to remove the temprole if its valid
    let onerole = await applyDbData.one.role;
    if (onerole != `0`) {
      try {
        if (reactionmember.roles.cache.has(onerole))
        await reactionmember.roles.remove(onerole);
      } catch {
        /* */
      }
    }
    //get the two.role, Try to remove the temprole if its valid
    let tworole = await applyDbData.two.role;
    if (tworole != `0`) {
      try {
        if (reactionmember.roles.cache.has(tworole))
        await reactionmember.roles.remove(tworole);
      } catch {
        /* */
      }
    }

    //get the three.role, Try to remove the temprole if its valid
    let threerole = await applyDbData.three.role;
    if (threerole != `0`) {
      try {
        if (reactionmember.roles.cache.has(threerole))
        await reactionmember.roles.remove(threerole);
      } catch {
        /* */
      }
    }

    //get the four.role, Try to remove the temprole if its valid
    let fourrole = await applyDbData.four.role;
    if (fourrole != `0`) {
      try {
        if (reactionmember.roles.cache.has(fourrole))
        await reactionmember.roles.remove(fourrole);
      } catch {
        /* */
      }
    }

    //get the five.role, Try to remove the temprole if its valid
    let fiverole = await applyDbData.five.role;
    if (fiverole != `0`) {
      try {
        if (reactionmember.roles.cache.has(fiverole))
          await reactionmember.roles.remove(fiverole);
      } catch {
        /* */
      }
    }
    return resolve(`FINISHED`)
  })
}

