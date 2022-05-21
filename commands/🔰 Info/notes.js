const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg, delay, dbEnsure
} = require(`../../handlers/functions`)
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
  name: "notes",
  aliases: ["mynotes"],
  category: "🔰 Info",
  description: "See all of your Notes + edit/add/remove them!",
  usage: "notes",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    var es = client.settings.get(message.guild.id, "embed");var ls = client.settings.get(message.guild.id, "language")
    try {
      
      await dbEnsure(client.notes, message.author?.id, {notes: [
          /*
           {
             title: "",
             description: "",
           }
           */
        ]}
      )
      var notes = await client.notes.get(message.author?.id+".notes");
      var button_forward = new MessageButton().setStyle('PRIMARY').setCustomId('notes_forwards').setEmoji('832598861813776394').setLabel("Forwards")
      var button_back = new MessageButton().setStyle('PRIMARY').setCustomId('notes_backwards').setEmoji("833802907509719130").setLabel("Backwards")
      var button_jump = new MessageButton().setStyle('PRIMARY').setCustomId('notes_jump').setLabel('Jump to Page').setEmoji("🔢");
      var button_empty1 = new MessageButton().setStyle('SECONDARY').setCustomId('notes_empty1').setLabel("\u200b").setDisabled(true)
      var button_list = new MessageButton().setStyle('PRIMARY').setCustomId('notes_list').setLabel('List Notes').setEmoji("📑");
      
      var button_create = new MessageButton().setStyle('SUCCESS').setCustomId('notes_create').setEmoji('📋').setLabel("Create New Note")
      var button_edit = new MessageButton().setStyle('PRIMARY').setCustomId('notes_edit').setEmoji('✏️').setLabel("Edit this Note")
      var button_Delete = new MessageButton().setStyle('PRIMARY').setCustomId('notes_delete').setEmoji('🗑').setLabel("Delete this Note")
      var button_disable = new MessageButton().setStyle('SECONDARY').setCustomId('notes_disable').setLabel('Stop the Buttons').setEmoji("833101993668771842");
      
      var embeds = [];
      var currentPage = 0;
      if(!notes || notes.length == 0){
          embeds.push(new MessageEmbed().setColor(es.color)
          .setFooter(client.getFooter(message.author.tag+ ` Page | 0/0`, message.author.displayAvatarURL({dynamic: true})))
          .setTitle(`:x: No Notes created yet`)
          .setDescription(`To create your first Note click on the green Button "\`📋 Create New Note\`"`)
          )
          button_forward.setDisabled(true);
          button_back.setDisabled(true);
          button_jump.setDisabled(true);
          button_list.setDisabled(true);
          button_edit.setDisabled(true);
          button_Delete.setDisabled(true);
      } else {
        embeds.push(new MessageEmbed().setColor(es.color)
          .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true})))
          .setTitle(`All of your Notes you can jump to!`)
          .setDescription(`${notes.map((data, index) => `**\`Page: ${index + 2}/${notes.length + 1}\`:** ${String(data.title).substring(0, 80)}`).join("\n")}`.substring(0, 2048))
        );
        let counter = 1;
        for (const note of notes){
          counter++;
          embeds.push(new MessageEmbed().setColor(es.color)
            .setFooter(client.getFooter(message.author.tag + ` | Page: ${counter}/${notes.length + 1}`  + ` | ${note.edited ? "Edited": "Created"} at: `, message.author.displayAvatarURL({dynamic: true})))
            .setTitle(`${note.title}`)
            .setDescription(`${note.description}`)                    
            .setTimestamp(Date.now())
          );
        }
        button_edit.setDisabled(true);
        button_Delete.setDisabled(true);
      }
      var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
      var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
      allbuttons = [buttonRow1, buttonRow2]

      var notemsg = await message.reply({   
          content: `***Click on the __Buttons__ to swap the NOTES***`,
          embeds: [embeds[0]], 
          components: allbuttons
      })
    
    //create a collector for the thinggy
    const collector = notemsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.message.author?.id == client.user.id, time: 600e3 }); //collector for 5 seconds
    let edited = false;
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
      try{
        if(b?.user.id !== message.author?.id)
          return b?.reply({content: handlemsg(client.la[ls].cmds.info.help.buttonerror, {prefix: prefix}), ephemeral: true})
          //go home
          if(b?.customId == "notes_create"){
            if(notes.length >= 25) return message.reply("You've reached the Limit of Notes which is **25**").then(msg=>{
              setTimeout(()=>{
                try{msg.delete()}catch(e){console.log(String(e).grey)}
              }, 2500)
            }).catch(e=>{
              console.log(String(e).grey)
            });
              let msgtodelete = [];
              await b?.deferUpdate();
              var mmmm = await message.reply("What should be the __Title__ of your **new Note** ?").catch(e=>{
                console.log(String(e).grey)
              });
              msgtodelete.push(mmmm);
              var err = false;
              await mmmm.channel.awaitMessages({filter: m=>m.author.id == cmduser.id, max: 1, time: 180e3}).then(async collected => {
                var title = collected.first().content;
                msgtodelete.push(collected.first());
                if(title.length > 256) {
                  title = title.substring(0, 256);
                  message.reply(`*This is a Note: I've shortend your __Title__, cause \`256 Letters\` is the Maximum!*`);
                }
                var mmmmm = await message.reply("What should be the __Description__ of your **new Note** ?").catch(e=>{
                  console.log(String(e).grey)
                });
                msgtodelete.push(mmmmm);
                var err = false;
                await mmmmm.channel.awaitMessages({filter: m=>m.author.id == cmduser.id, max: 1, time: 180e3}).then(async collected => {
                  var description = collected.first().content;
                  msgtodelete.push(collected.first());
                  if(description.length > 2048) {
                    description = description.substring(0, 2048);
                    message.reply(`*This is a Note: I've shortend your __Description__, cause \`2048 Letters\` is the Maximum!*`).catch(e=>{
                      console.log(String(e).grey)
                    });
                  }
                  let note = {
                    title: title,
                    description: description,
                    timestamp: Date.now(),
                    edited: true,
                  };
                  await client.notes.push(message.author?.id+".notes", note);
                  notes = await client.notes.get(message.author?.id+".notes");
                  embeds = [];
                  if(!notes || notes.length == 0){
                      embeds.push(new MessageEmbed().setColor(es.color)
                      .setFooter(client.getFooter(message.author.tag+ ` Page | 0/0`, message.author.displayAvatarURL({dynamic: true})))
                      .setTitle(`:x: No Notes created yet`)
                      .setDescription(`To create your first Note click on the green Button "\`📋 Create New Note\`"`)
                      )
                      button_forward.setDisabled(true);
                      button_back.setDisabled(true);
                      button_jump.setDisabled(true);
                      button_list.setDisabled(true);
                      button_edit.setDisabled(true);
                      button_Delete.setDisabled(true);
                  } else {
                    embeds.push(new MessageEmbed().setColor(es.color)
                      .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true})))
                      .setTitle(`All of your Notes you can jump to!`)
                      .setDescription(`${notes.map((data, index) => `**\`Page: ${index + 2}/${notes.length + 1}\`:** ${String(data.title).substring(0, 80)}`).join("\n")}`.substring(0, 2048))
                    );
                    let counter = 1;
                    for (const note of notes){
                      counter++;
                      embeds.push(new MessageEmbed().setColor(es.color)
                      .setFooter(client.getFooter(message.author.tag + ` | Page: ${counter}/${notes.length + 1}`  + ` | ${note.edited ? "Edited": "Created"} at: `, message.author.displayAvatarURL({dynamic: true})))
                      .setTitle(`${note.title}`)
                      .setDescription(`${note.description}`)                    
                      .setTimestamp(Date.now())
                      );
                    }
                  }
                  var buttonRow1 = new MessageActionRow().addComponents([button_back.setDisabled(false), button_forward.setDisabled(false), button_jump.setDisabled(false), button_empty1.setDisabled(false), button_list.setDisabled(false)])
                  var buttonRow2 = new MessageActionRow().addComponents([button_create.setDisabled(false), button_edit.setDisabled(false), button_Delete.setDisabled(false), button_disable.setDisabled(false)])
                  allbuttons = [buttonRow1, buttonRow2]
                  await notemsg.edit({   
                      content: `***Click on the __Buttons__ to swap the NOTES***`,
                      embeds: [embeds[embeds.length - 1]], 
                      components: allbuttons
                  }).catch(e=>{console.log(String(e).grey)});
                  try{
                    await message.channel.bulkDelete(msgtodelete);
                  }catch (e){
                    console.log(String(e).grey)
                  }
                  await delay(500);
                  await message.reply(`**Successfully created your new Note and swapped to it!**`).then(msg=>{
                    setTimeout(()=>{
                      try{msg.delete()}catch(e){console.log(String(e).grey)}
                    }, 2500)
                  }).catch(e=>{
                    console.log(String(e).grey)
                  });
                }).catch(e => {
                  err = e;
                  console.log(err);
                })
                if(err){
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Your Time ran out!")
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]}).catch(e=>{
                    console.log(String(e).grey)
                  });
                }
              }).catch(e => {
                err = e;
                console.log(err);
              })
              if(err){
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Your Time ran out!")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]}).catch(e=>{
                  console.log(String(e).grey)
                });
              }
          } 
          //page forward
          if(b?.customId == "notes_backwards") {
              if (currentPage !== 0) {
                currentPage -= 1;
                if(currentPage == 0) {
                  button_edit.setDisabled(true);
                  button_Delete.setDisabled(true);
                  var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
                  var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
                  allbuttons = [buttonRow1, buttonRow2]
                }
                await b?.deferUpdate();
                await notemsg.edit({content: `***Click on the __Buttons__ to swap the NOTES***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)});
              } else {
                  button_edit.setDisabled(false);
                  button_Delete.setDisabled(false);
                  var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
                  var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
                  allbuttons = [buttonRow1, buttonRow2]
                  currentPage = embeds.length - 1;
                  await b?.deferUpdate();
                  await notemsg.edit({content: `***Click on the __Buttons__ to swap the NOTES***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)});
              }
          }
          //go home
          if(b?.customId == "notes_list") {
              currentPage = 0;
              await b?.deferUpdate();
              button_edit.setDisabled(true);
              button_Delete.setDisabled(true);
              var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
              var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
              allbuttons = [buttonRow1, buttonRow2]
              await notemsg.edit({content: `***Click on the __Buttons__ to swap the NOTES***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)}).catch(e=>{console.log(String(e).grey)});
          } 
          //go forward
          if(b?.customId == "notes_forwards") {
              if (currentPage < embeds.length - 1) {
                  currentPage++;
                  button_edit.setDisabled(false);
                  button_Delete.setDisabled(false);
                  var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
                  var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
                  allbuttons = [buttonRow1, buttonRow2]
                  await b?.deferUpdate();
                  await notemsg.edit({content: `***Click on the __Buttons__ to swap the NOTES***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)});
              } else {
                  currentPage = 0
                  if(currentPage == 0) {
                    button_edit.setDisabled(true);
                    button_Delete.setDisabled(true);
                    var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
                    var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
                    allbuttons = [buttonRow1, buttonRow2]
                  }
                  await b?.deferUpdate();
                  await notemsg.edit({content: `***Click on the __Buttons__ to swap the NOTES***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)});
              }
          }
          //go home
          if(b?.customId == "notes_disable") {
            edited = true;
            button_forward.setDisabled(true);
            button_create.setDisabled(true);
            button_back.setDisabled(true);
            button_jump.setDisabled(true);
            button_list.setDisabled(true);
            button_edit.setDisabled(true);
            button_Delete.setDisabled(true);
            button_disable.setDisabled(true);
            var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
            var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
            allbuttons = [buttonRow1, buttonRow2]
            await b?.reply(":x: **Disabled the Buttons**", true);
            await notemsg.edit({content: `***NOTE BUTTONS DISABLED***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)});
          } 
          //Number Jump
          if(b?.customId == "notes_jump") {
            await b?.deferUpdate()
            var mmmmm = await message.reply(`**To which Page should I Jump?**\nPlease enter a Number between 1 and ${embeds.length}`).catch(e=>{
              console.log(String(e).grey)
            });
            var err = false;
            await mmmmm.channel.awaitMessages({filter: m=>m.author.id == cmduser.id, max: 1, time: 180e3}).then(async collected => {
              var Page = parseInt(collected.first().content) - 1;
              try{mmmmm.delete()}catch(e){console.log(String(e).grey)}
              try{collected.first().delete()}catch(e){console.log(String(e).grey)}
              if(Page < 0 || Page > embeds.length - 1){
                return message.reply(":x: **Value out of Range!**").then(msg=>{
                  setTimeout(()=>{
                    try{msg.delete()}catch(e){console.log(String(e).grey)}
                  }, 2500)
                }).catch(e=>{
                  console.log(String(e).grey)
                })
              }
              if(Page == 0){
                button_edit.setDisabled(true);
                button_Delete.setDisabled(true);
                var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
                var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
                allbuttons = [buttonRow1, buttonRow2]
              } else {
                button_edit.setDisabled(false);
                button_Delete.setDisabled(false);
                var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
                var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
                allbuttons = [buttonRow1, buttonRow2]
              }
              await notemsg.edit({   
                  content: `***Click on the __Buttons__ to swap the NOTES***`,
                  embeds: [embeds[Page]], 
                  components: allbuttons
              }).catch(e=>{console.log(String(e).grey)});
            }).catch(e => {
              err = e;
              console.log(err);
            })
            if(err){
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Your Time ran out!")
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]}).catch(e=>{
                console.log(String(e).grey)
              });
            }
          }
          //Delete a note
          if(b?.customId == "notes_delete") {
            await b?.reply("🗑 **Deleted the Note**", true)
            await client.notes.set(message.author?.id+".notes", notes.filter(v => String(v.title).toLowerCase().trim().split(" ").join("") !== String(embeds[currentPage].title).toLowerCase().trim().split(" ").join("")))
            if (currentPage !== 0) {
              currentPage -= 1;
            } else {
              currentPage = embeds.length - 1;
            }
            notes = await client.notes.get(message.author?.id+".notes");
            embeds = [];
            if(!notes || notes.length == 0){
                embeds.push(new MessageEmbed().setColor(es.color)
                .setFooter(client.getFooter(message.author.tag+ ` Page | 0/0`, message.author.displayAvatarURL({dynamic: true})))
                .setTitle(`:x: No Notes created yet`)
                .setDescription(`To create your first Note click on the green Button "\`📋 Create New Note\`"`)
                )
                button_forward.setDisabled(true);
                button_back.setDisabled(true);
                button_jump.setDisabled(true);
                button_list.setDisabled(true);
                button_edit.setDisabled(true);
                button_Delete.setDisabled(true);
            } else {
              embeds.push(new MessageEmbed().setColor(es.color)
                .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true})))
                .setTitle(`All of your Notes you can jump to!`)
                .setDescription(`${notes.map((data, index) => `**\`Page: ${index + 2}/${notes.length + 1}\`:** ${String(data.title).substring(0, 80)}`).join("\n")}`.substring(0, 2048))
              );
              let counter = 1;
              for (const note of notes){
                counter++;
                embeds.push(new MessageEmbed().setColor(es.color)
                .setFooter(client.getFooter(message.author.tag + ` | Page: ${counter}/${notes.length + 1}`  + ` | ${note.edited ? "Edited": "Created"} at: `, message.author.displayAvatarURL({dynamic: true})))
                .setTitle(`${note.title}`)
                .setDescription(`${note.description}`)                    
                .setTimestamp(Date.now())
                );
              }
            }
            if(currentPage == 0) {
              button_edit.setDisabled(true);
              button_Delete.setDisabled(true);
            }
            var buttonRow1 = new MessageActionRow().addComponents([button_back, button_forward, button_jump, button_empty1, button_list])
            var buttonRow2 = new MessageActionRow().addComponents([button_create, button_edit, button_Delete, button_disable])
            allbuttons = [buttonRow1, buttonRow2]
           
            await notemsg.edit({   
                content: `***Click on the __Buttons__ to swap the NOTES***`,
                embeds: [embeds[currentPage]], 
                components: allbuttons
            }).catch(e=>{console.log(String(e).grey)});
          }
          //Edit a note
          if(b?.customId == "notes_edit") {
            let msgtodelete = [];
            await b?.deferUpdate()
            try{
              let thmsg = await message.channel.messages.fetch(notemsg.id).catch((e)=>{
                console.log(String(e).grey)
                return message.reply("Something went wrong...")
              })
              if(!thmsg || !thmsg.embeds || !thmsg.embeds[0])
              return message.reply("Something went wrong...")
            let thenote = notes.findIndex(v => String(v.title).toLowerCase().trim().split(" ").join("") == String(thmsg.embeds[0].title).toLowerCase().trim().split(" ").join(""))
            
            var mmmm = await message.reply("What should be the __Title__ of your **new Note** ?").catch(e=>{
              console.log(String(e).grey)
            });
            msgtodelete.push(mmmm)
              var err = false;
              await mmmm.channel.awaitMessages({filter: m=>m.author.id == cmduser.id, max: 1, time: 180e3}).then(async collected => {
                var title = collected.first().content;
                msgtodelete.push(collected.first())
                if(title.length > 256) {
                  title = title.substring(0, 256);
                  message.reply(`*This is a Note: I've shortend your __Title__, cause \`256 Letters\` is the Maximum!*`).catch(e=>{
                    console.log(String(e).grey)
                  });
                }
                var mmmmm = await message.reply("What should be the __Description__ of your **new Note** ?").catch(e=>{
                  console.log(String(e).grey)
                });
                msgtodelete.push(mmmmm)
                var err = false;
                await mmmmm.channel.awaitMessages({filter: m=>m.author.id == cmduser.id, max: 1, time: 180e3}).then(async collected => {
                  var description = collected.first().content;
                  msgtodelete.push(collected.first())
                  if(description.length > 2048) {
                    description = description.substring(0, 2048);
                    message.reply(`*This is a Note: I've shortend your __Description__, cause \`2048 Letters\` is the Maximum!*`).catch(e=>{
                      console.log(String(e).grey)
                    });
                  }
                  let newnote = {
                    title: title,
                    description: description,
                    timestamp: Date.now(),
                    edited: true,
                  }
                  notes[thenote] = newnote;
                  await client.notes.set(message.author?.id+".notes", notes);
                  notes = await client.notes.get(message.author?.id+".notes");
                  embeds[0] = new MessageEmbed().setColor(es.color)
                  .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true})))
                  .setTitle(`All of your Notes you can jump to!`)
                  .setDescription(`${notes.map((data, index) => `**\`Page: ${index + 2}/${notes.length + 1}\`:** ${String(data.title).substring(0, 80)}`).join("\n")}`.substring(0, 2048));
                  embeds[thenote + 1] = new MessageEmbed().setColor(es.color)
                    .setFooter(client.getFooter(message.author.tag + ` | Page: ${thenote + 2}/${embeds.length}` + ` | ${newnote.edited ? "Edited": "Created"} at: `, message.author.displayAvatarURL({dynamic: true})))
                    .setTitle(`${title}`)
                    .setDescription(`${description}`)
                    .setTimestamp(Date.now())
                    var buttonRow1 = new MessageActionRow().addComponents([button_back.setDisabled(false), button_forward.setDisabled(false), button_jump.setDisabled(false), button_empty1.setDisabled(false), button_list.setDisabled(false)])
                    var buttonRow2 = new MessageActionRow().addComponents([button_create.setDisabled(false), button_edit.setDisabled(false), button_Delete.setDisabled(false), button_disable.setDisabled(false)])
                    allbuttons = [buttonRow1, buttonRow2]
                    await notemsg.edit({   
                        content: `***Click on the __Buttons__ to swap the NOTES***`,
                        embeds: [embeds[thenote + 1]], 
                        components: allbuttons
                    }).catch(e=>{console.log(String(e).grey)});
                  try{
                    await message.channel.bulkDelete(msgtodelete);
                  }catch (e){
                    console.log(String(e).grey)
                  }
                  await delay(500);
                  await message.reply(`**Successfully edited your Note!**`).then(msg=>{
                    setTimeout(()=>{
                      try{msg.delete()}catch(e){console.log(String(e).grey)}
                    }, 2500)
                  }).catch(e=>{
                    console.log(String(e).grey)
                  })
                }).catch(e => {
                  err = e;
                  console.log(err);
                })
                if(err){
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Your Time ran out!")
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]}).catch(e=>{
                    console.log(String(e).grey)
                  });
                }
              }).catch(e => {
                err = e;
                console.log(err);
              })
              if(err){
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Your Time ran out!")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]}).catch(e=>{
                  console.log(String(e).grey)
                });
              }

          }catch (e){
            console.log(String(e).grey)
          }
          }
      }catch (e){ console.error(e)}
    });
    collector.on('end', async collected => {
      if(!edited){
        edited = true;
        button_forward.setDisabled(true);
        button_create.setDisabled(true);
        button_back.setDisabled(true);
        button_jump.setDisabled(true);
        button_list.setDisabled(true);
        button_edit.setDisabled(true);
        button_Delete.setDisabled(true);
        button_disable.setDisabled(true);
        var buttonRow1 = new MessageActionRow().addComponents([button_back.setDisabled(false), button_forward.setDisabled(false), button_jump.setDisabled(false), button_empty1.setDisabled(false), button_list.setDisabled(false)])
        var buttonRow2 = new MessageActionRow().addComponents([button_create.setDisabled(false), button_edit.setDisabled(false), button_Delete.setDisabled(false), button_disable.setDisabled(false)])
        allbuttons = [buttonRow1, buttonRow2]
        await notemsg.edit({content: `***NOTE BUTTONS DISABLED***`,embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{console.log(String(e).grey)});
      }
    });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}

