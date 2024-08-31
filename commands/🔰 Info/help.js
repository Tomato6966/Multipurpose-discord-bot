const {
  MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const customEmojis = require(`${process.cwd()}/botconfig/customEmojis.json`);
const {
  duration, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "help",
  category: "🔰 Info",
  aliases: ["h", "commandinfo", "halp", "hilfe"],
  usage: "help [Command/Category]",
  description: "Returns all Commmands, or one specific command",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {

    let settings = client.settings.get(message.guild.id);
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    try {
      if (args[0]) {
        const embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if (args[0].toLowerCase().includes("cust")) {
          let cuc = client.customcommands.get(message.guild.id, "commands");
          if (cuc.length < 1) cuc = [handlemsg(client.la[ls].cmds.info.help.error1)]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc


          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable1"]))
            .setDescription(items.join("︲"))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom), client.user.displayAvatarURL());

          message.reply({ embeds: [embed] })
          return;
        } var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          return message.reply({ embeds: [embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, { command: args[0].toLowerCase() }))] });
        } else if (cat) {
          var category = cat;
          const items = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable2"]))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, { prefix: prefix }), client.user.displayAvatarURL());
          let embeds = allotherembeds_eachcategory();
          if (cat == "🔰 Info")
            return message.reply({ embeds: [embeds[0]] })
          if (cat == "💸 Economy")
            return message.reply({ embeds: [embeds[1]] })
          if (cat == "🏫 School Commands")
            return message.reply({ embeds: [embeds[2]] })
          if (cat == "🎶 Music")
            return message.reply({ embeds: [embeds[3]] })
          if (cat == "👀 Filter")
            return message.reply({ embeds: [embeds[4]] })
          if (cat == "⚜️ Custom Queue(s)")
            return message.reply({ embeds: [embeds[5]] })
          if (cat == "🚫 Administration")
            return message.reply({ embeds: [embeds[6]] })
          if (cat == "💪 Setup")
            return message.reply({ embeds: [embeds[7]] })
          if (cat == "⚙️ Settings")
            return message.reply({ embeds: [embeds[8]] })
          if (cat == "👑 Owner")
            return message.reply({ embeds: [embeds[9]] })
          if (cat == "⌨️ Programming")
            return message.reply({ embeds: [embeds[10]] })
          if (cat == "📈 Ranking")
            return message.reply({ embeds: [embeds[11]] })
          if (cat == "🔊 Soundboard")
            return message.reply({ embeds: [embeds[12]] })
          if (cat == "🎤 Voice")
            return message.reply({ embeds: [embeds[13]] })
          if (cat == "🕹️ Fun")
            return message.reply({ embeds: [embeds[14]] })
          if (cat == "🎮 MiniGames")
            return message.reply({ embeds: [embeds[15]] })
          if (cat == "😳 Anime-Emotions")
            return message.reply({ embeds: [embeds[16]] })
          if (cat == "🔞 NSFW")
            return message.reply({ embeds: [embeds[17]] })
          if (category.toLowerCase().includes("custom")) {
            const cmd = client.commands.get(items[0].split("`").join("").toLowerCase()) || client.commands.get(client.aliases.get(items[0].split("`").join("").toLowerCase()));
            try {
              embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable3"]));
            } catch { }
          } else {
            embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable4"]))
          }
          return message.reply({ embeds: [embed] })
        }
        if (cmd.name) embed.addFields({ name: handlemsg(client.la[ls].cmds.info.help.detail.name), value: `\`\`\`${cmd.name}\`\`\``});
        if (cmd.name) embed.setTitle(handlemsg(client.la[ls].cmds.info.help.detail.about, { cmdname: cmd.name }));
        if (cmd.description) embed.addFields({ name: handlemsg(client.la[ls].cmds.info.help.detail.desc), value: `\`\`\`${cmd.description}\`\`\``});
        if (cmd.aliases && cmd.aliases.length > 0 && cmd.aliases[0].length > 1) try {
          embed.addFields({ name: handlemsg(client.la[ls].cmds.info.help.detail.aliases), value: `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``});
        } catch { }
        if (cmd.cooldown) embed.addFields({ name: handlemsg(client.la[ls].cmds.info.help.detail.cooldown), value: `\`\`\`${cmd.cooldown} Seconds\`\`\``});
        else embed.addFields({ name: handlemsg(client.la[ls].cmds.info.help.detail.cooldown), value: `\`\`\`3 Seconds\`\`\``});
        if (cmd.usage) {
          embed.addFields({ name: handlemsg(client.la[ls].cmds.info.help.detail.usage), value: `\`\`\`${prefix}${cmd.usage}\`\`\``});
          embed.setFooter(handlemsg(client.la[ls].cmds.info.help.detail.syntax), es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL());
        }
        return message.reply({ embeds: [embed] });
      } else {
        let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji(customEmojis.help.buttons.buttonBack).setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.back))
        let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(customEmojis.help.buttons.buttonHome).setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.home))
        let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji(customEmojis.help.buttons.buttonForward).setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.forward))
        let button_tutorial = new MessageButton().setStyle('LINK').setEmoji(customEmojis.help.buttons.buttonTutorial).setLabel("Tutorial").setURL("https://youtu.be/E0R7d8gS908")
        let menuOptions = [
          {
            label: "Overview",
            value: "Overview",
            emoji: customEmojis.help.buttons.overview,
            description: "My Overview of me!"
          },
          {
            label: "Information",
            value: "Information",
            emoji: "🔰",
            description: "Commands to share Information"
          },
          {
            label: "Economy",
            value: "Economy",
            emoji: "💸",
            description: "Commands to use the Economy System"
          },
          {
            label: "School",
            value: "School",
            emoji: "🏫",
            description: "Commands useful for School and work!"
          },
          {
            label: "Music",
            value: "Music",
            emoji: "🎶",
            description: "Commands to play Music / add Filter"
          },
          {
            label: "Filter",
            value: "Filter",
            emoji: "👀",
            description: "Commands to add Filters to the Music"
          },
          {
            label: "Customqueue",
            value: "Customqueue",
            emoji: "⚜️",
            description: "Commands to Save Queues and Manage them"
          },
          {
            label: "Admin",
            value: "Admin",
            emoji: "🚫",
            description: "Commands to Administrate the Server"
          },
          {
            label: "Setup",
            value: "Setup",
            emoji: "💪",
            description: "Commands to Setup Systems"
          },
          {
            label: "Settings",
            value: "Settings",
            emoji: "⚙️",
            description: "Commands to change Server Settings"
          },
          {
            label: "Owner",
            value: "Owner",
            emoji: "👑",
            description: "Commands to to manage the Bot"
          },
          {
            label: "Programming",
            value: "Programming",
            emoji: "⌨️",
            description: "Commands useful for Programming"
          },
          {
            label: "Ranking",
            value: "Ranking",
            emoji: "📈",
            description: "Commands to mange and show Ranks"
          },
          {
            label: "Soundboard",
            value: "Soundboard",
            emoji: "🔊",
            description: "Commands for Voice Soundboard"
          },
          {
            label: "Voice",
            value: "Voice",
            emoji: "🎤",
            description: "Commands for Voice Channels Management"
          },
          {
            label: "Fun",
            value: "Fun",
            emoji: "🕹️",
            description: "Commands for Fun (Image) uses"
          },
          {
            label: "Minigames",
            value: "Minigames",
            emoji: "🎮",
            description: "Commands for Minigames with the Bot"
          },
          {
            label: "Anime-Emotions",
            value: "Anime-Emotions",
            emoji: "😳",
            description: "Commands to show your Emotions with Anime style"
          },
          {
            label: "Nsfw",
            value: "Nsfw",
            emoji: "🔞",
            description: "Commands for Nsfw (underage) Content."
          },
          {
            label: "Customcommand",
            value: "Customcommand",
            emoji: "🦾",
            description: "Custom Commands of this Server"
          },
        ];
        menuOptions = menuOptions.map(i => {
          if (settings[`${i?.value.toUpperCase()}`] === undefined) {
            return i; //if its not in the db, then add it
          }
          else if (settings[`${i?.value.toUpperCase()}`]) {
            return i; //If its enabled then add it
          }
          else if (settings.showdisabled && settings[`${i?.value.toUpperCase()}`] === false) {
            return i;
          } else {
            //return i // do not return, cause its disabled! to be shown
          }
        })
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click me to view Help-Menu-Category-Page(s)")
          .setMinValues(1)
          .setMaxValues(5)
          .addOptions(menuOptions.filter(Boolean))
        let buttonRow = new MessageActionRow().addComponents([button_back, button_home, button_forward, button_tutorial])
        let SelectionRow = new MessageActionRow().addComponents([menuSelection])
        const allbuttons = [buttonRow, SelectionRow]
        //define default embed
        let OverviewEmbed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          //.setFooter("Page Overview\n"+ client.user.username, client.user.displayAvatarURL())
          .setFooter({ text: "Page Overview\n" + client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTitle(`Information about __${client.user.username}__`)
          .addFields(
            {
              name: ":muscle: **__My Features__**",
              value: `>>> **58+ Systems**, like: \n- ${customEmojis.companies.twitter} **Twitter-Auto-Poster**\n- ${customEmojis.companies.youtube} **Youtube-Auto-Poster**\n- **Advanced Systems**\n - **Application**\n - **Ticket**\n - **Welcome-Images**\n - **Reaction Role**\n- :notes: An advanced ${customEmojis.companies.spotify} **Music System** with **Audio Filtering**\n- :video_game: Many **Minigames** and :joystick: **Fun** Commands (150+)\n- :no_entry_sign: **Administration** and **Auto-Moderation** and way much more!`
            },
            {
              name: ":question: **__How do you use me?__**",
              value: `>>> \`${prefix}setup\` and react with the Emoji for the right action,\nbut you can also do \`${prefix}setup-SYSTEM\` e.g. \`${prefix}setup-welcome\``
            },
            {
              name: ":chart_with_upwards_trend: **__STATS:__**",
              value: `>>> ${customEmojis.general.gear} **${client.commands.map(a => a).length} Commands**\n${customEmojis.general.folder} on **${client.guilds.cache.size} Guilds**\n${customEmojis.general.time} **${duration(client.uptime).map(i => `\`${i}\``).join("︲")} Uptime**\n${customEmojis.general.ping} **\`${Math.floor(client.ws.ping)}ms\` Ping**\n${customEmojis.general.development}  Made by [**Milrato Development**](https://discord.gg/milrato)`
            },
            {
              name: "How to get help?",
              value: `>>> **\` 1. Way \`** *Use the Buttons, to swap the Pages*\n**\` 2. Way \`** *Use the Menu to select all Help Pages, you want to display*\n**\` 3. Way \`** *Watch the Youtube Tutorial*`
            }
          );

        let err = false;
        //Send message with buttons
        let helpmsg = await message.reply({
          content: `***Click on the __Buttons__ to swap the Help-Pages***`,
          embeds: [OverviewEmbed],
          components: allbuttons
        }).catch(e => {
          err = true;
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply(`:x: I couldn't send help? Maybe I am missing the Permission to **EMBED LINKS**`).catch(() => { })
        });
        if (err) return;
        var edited = false;
        var embeds = [OverviewEmbed]
        for (const e of allotherembeds_eachcategory(true))
          embeds.push(e)
        let currentPage = 0;

        //create a collector for the thinggy
        const collector = helpmsg.createMessageComponentCollector({ filter: (i) => (i?.isButton() || i?.isSelectMenu()) && i?.user && i?.message.author.id == client.user.id, time: 180e3 });
        //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
        collector.on('collect', async b => {
          try {
            if (b?.isButton()) {
              if (b?.user.id !== message.author.id)
                return b?.reply({ content: handlemsg(client.la[ls].cmds.info.help.buttonerror, { prefix: prefix }), ephemeral: true });

              //page forward
              if (b?.customId == "1") {
                //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
                if (currentPage !== 0) {
                  currentPage -= 1
                } else {
                  currentPage = embeds.length - 1
                }
              }
              //go home
              else if (b?.customId == "2") {
                //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
                currentPage = 0;
              }
              //go forward
              else if (b?.customId == "3") {
                //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
                if (currentPage < embeds.length - 1) {
                  currentPage++;
                } else {
                  currentPage = 0
                }
              }
              await helpmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons }).catch(e => { })
              b?.deferUpdate().catch(e => { })


            }
            if (b?.isSelectMenu()) {
              //b?.reply(`***Going to the ${b?.customId.replace("button_cat_", "")} Page***, *please wait 2 Seconds for the next Input*`, true)
              //information, music, admin, settings, voice, minigames, nsfw
              let index = 0;
              let vembeds = []
              let theembeds = [OverviewEmbed, ...allotherembeds_eachcategory()];
              for (const value of b?.values) {
                switch (value.toLowerCase()) {
                  case "overview": index = 0; break;
                  case "information": index = 1; break;
                  case "economy": index = 2; break;
                  case "school": index = 3; break;
                  case "music": index = 4; break;
                  case "filter": index = 5; break;
                  case "customqueue": index = 6; break;
                  case "admin": index = 7; break;
                  case "setup": index = 8; break;
                  case "settings": index = 9; break;
                  case "owner": index = 10; break;
                  case "programming": index = 11; break;
                  case "ranking": index = 12; break;
                  case "soundboard": index = 13; break;
                  case "voice": index = 14; break;
                  case "fun": index = 15; break;
                  case "minigames": index = 16; break;
                  case "anime-emotions": index = 17; break;
                  case "nsfw": index = 18; break;
                  case "customcommand": index = 19; break;
                }
                vembeds.push(theembeds[index])
              }
              b?.reply({
                embeds: vembeds,
                ephemeral: true
              });
            }
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            console.log(String(e).italic.italic.grey.dim)
          }
        });

        collector.on('end', collected => {
          //array of all disabled buttons
          let d_buttonRow = new MessageActionRow().addComponents([button_back.setDisabled(true), button_home.setDisabled(true), button_forward.setDisabled(true), button_tutorial])
          const alldisabledbuttons = [d_buttonRow]
          if (!edited) {
            edited = true;
            helpmsg.edit({ content: handlemsg(client.la[ls].cmds.info.help.timeended, { prefix: prefix }), embeds: [helpmsg.embeds[0]], components: alldisabledbuttons }).catch((e) => { })
          }
        });
      }
      function allotherembeds_eachcategory(filterdisabled = false) {
        //ARRAY OF EMBEDS
        var embeds = [];

        //INFORMATION COMMANDS
        var embed0 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔰 Info").size}\`] 🔰 Information Commands 🔰`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔰 Info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            { 
              name: `🙂 **User Commands**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "user").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲") 
            },
            { 
              name: `🕹️ **Games Related Commands**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "games").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲") 
            },
            { 
              name: `${customEmojis.companies.discord} **Server Related Commands**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "server").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲") 
            },
            { 
              name: `${customEmojis.help.botFlag} **Bot Related Commands**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "bot").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲") 
            },
            { 
              name: `${customEmojis.help.builder} **Util Related Commands**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "util").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲") 
            }
          )
        embeds.push(embed0)

        //ECONOMY COMMANDS
        var embed1 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💸 Economy").size}\`] 💸 Economy Commands 💸 | ${settings.ECONOMY ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💸 Economy").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__"
            },
            { 
              name: `🕹️ **Mini Game to earn 💸**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "game").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `:clock1: **Repeatingly earn 💸 via Event(s)**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "earn").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `${customEmojis.help.builder} **Information & Manage 💸**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        if (!filterdisabled || settings.ECONOMY || settings.showdisabled) embeds.push(embed1)

        //SCHOOL COMMANDS
        var embed2 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🏫 School Commands").size}\`] 🏫 School Commands 🏫 | ${settings.SCHOOL ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🏫 School Commands").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__"
            },
            { 
              name: `:school: **Mathematics**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 School Commands" && cmd.type === "math").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `:clock1: **Time Management**`, 
              value: ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 School Commands" && cmd.type === "time").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          )
        if (!filterdisabled || settings.SCHOOL || settings.showdisabled) embeds.push(embed2)

        //MUSIC COMMANDS type: song, queue, queuesong, bot
        var embed3 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎶 Music").size}\`] 🎶 Music Commands 🎶 | ${settings.MUSIC ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎶 Music").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            { 
              name: "📑 **Queue Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("queue")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `${customEmojis.general.playingAudio} **Song Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("song")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `${customEmojis.help.botFlag} **Bot Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        if (!filterdisabled || settings.MUSIC || settings.showdisabled) embeds.push(embed3)

        //FILTER COMMANDS
        var embed4 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👀 Filter").size}\`] 👀 Filter Commands 👀 | ${settings.FILTER ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👀 Filter").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.FILTER || settings.showdisabled) embeds.push(embed4)

        //CUSTOM QUEUE COMMANDS
        var embed5 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().extracustomdesc.length}\`] ⚜️ Custom Queue(s) Commands ⚜️ | ${settings.CUSTOMQUEUE ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "\u200b"
            },
            { 
              name: `${customEmojis.general.yes} **Usage**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().usage
            }
          );
        if (!filterdisabled || settings.CUSTOMQUEUE || settings.showdisabled) embeds.push(embed5)

        //ADMINISTRATION
        var embed6 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🚫 Administration").size}\`] 🚫 Admin Commands 🚫`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🚫 Administration").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            { 
              name: `${customEmojis.companies.discord} **Server Related Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("server")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `${customEmojis.general.channel} **Channel Related Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("channel")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `${customEmojis.general.threadChannel} **Thread Related Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("thread")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: `${customEmojis.general.roles} **Role Related Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("role")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: "🙂 **Member Related Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("member")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        embeds.push(embed6)

        //SETUP
        var embed7 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💪 Setup").size}\`] 💪 Setup Commands 💪`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💪 Setup").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            { 
              name: "😛 **Setups for Entertainment**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("fun")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            { 
              name: "💡 **Information & Manage (Bot/Server) Settings**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("info")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: `${customEmojis.general.development} **Most used Systems**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("system")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: `${customEmojis.help.builder} **Security Systems**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("security")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        embeds.push(embed7)

        //Settings
        var embed8 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").size}\`] ⚙️ Settings Commands ⚙️`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: "🙂 **User Related Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("user")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: `${customEmojis.help.botFlag} **Bot Related Commands**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: "🎶 **Music Related Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("music")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        embeds.push(embed8)

        //Owner
        var embed9 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👑 Owner").size}\`] 👑 Owner Commands 👑`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👑 Owner").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: `${customEmojis.companies.discord} **Information & Manage**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("info")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: `${customEmojis.help.botFlag} **Adjust the Bot**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        embeds.push(embed9)

        //Programming Commands
        var embed10 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").size}\`] ⌨️ Programming Commands ⌨️ | ${settings.PROGRAMMING ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.PROGRAMMING || settings.showdisabled) embeds.push(embed10)

        //Ranking
        var embed11 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "📈 Ranking").size}\`] 📈 Ranking Commands 📈 | ${settings.RANKING ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "📈 Ranking").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: `${customEmojis.help.builder} **Manage Rank**`, 
              value: `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "manage").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            },
            {
              name: "📈 **Rank Information**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            }
          );
        if (!filterdisabled || settings.RANKING || settings.showdisabled) embeds.push(embed11)

        //SOUNDBOARD COMMANDS
        var embed12 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").size}\`] 🔊 Soundboard Commands 🔊 | ${settings.SOUNDBOARD ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.SOUNDBOARD || settings.showdisabled) embeds.push(embed12)

        //Voice COMMANDS
        var embed13 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.length}\`] 🎤 Voice Commands 🎤 | ${settings.VOICE ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "\u200b"
            },
            {
              name: `${customEmojis.general.yes} **Usage**`, 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().usage
            }
          );
        if (!filterdisabled || settings.VOICE || settings.showdisabled) embeds.push(embed13)

        //FUN COMMANDS
        var embed14 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").size}\`] 🕹️ Fun Commands 🕹️ | ${settings.FUN ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: "🙂 **Fun User Image Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "user").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: "🙂💬 **Fun User Image-Text Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "usertext").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            },
            {
              name: "💬 **Fun Text Commands**", 
              value: "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "text").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")
            }
          );
        if (!filterdisabled || settings.FUN || settings.showdisabled) embeds.push(embed14)

        //MINIGAMES
        var embed15 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").size}\`] 🎮 Mini Games Commands 🎮 | ${settings.MINIGAMES ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: "💬 **Text Based Minigames**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "text").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            },
            {
              name: "🔘 **Button(s) Minigames**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "buttons").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            },
            {
              name: "🎙️ **Voice Minigames**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "voice").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            }
          )
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.MINIGAMES || settings.showdisabled) embeds.push(embed15)

        //ANIME EMOTIONS
        var embed16 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").size}\`] 😳 Anime Commands 😳 | ${settings.ANIME ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: "😳 **Anime-Mention-Emotions (or Self.)**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "mention").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            },
            {
              name: "😳 **Anime-Self-Emotions**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "self").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            }
          );
        if (!filterdisabled || settings.ANIME || settings.showdisabled) embeds.push(embed16)

        //NSFW COMMANDS
        var embed17 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔞 NSFW").size}\`] 🔞 NSFW Commands 🔞 | ${settings.NSFW ? `${customEmojis.general.yes} ENABLED` : `${customEmojis.general.no} DISABLED`}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔞 NSFW").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addFields(
            { 
              name: "\u200b", 
              value: "__**Sub-Categorized Commands:**__" 
            },
            {
              name: "😳 **Animated (Hentai, Neko, SFW, ...)**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "🔞 NSFW" && cmd.type === "anime").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            },
            {
              name: "🔞 **Reallife (Porn, Erotik, etc.)**", 
              value: `> ${client.commands.filter((cmd) => cmd.category === "🔞 NSFW" && cmd.type === "real").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
            }
          );
        if (!filterdisabled || settings.NSFW || settings.showdisabled) embeds.push(embed17)

        //CUSTOM COMMANDS EMBED
        var embed18 = new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable23"]))
        let cuc = client.customcommands.get(message.guild.id, "commands");
        if (cuc.length < 1) cuc = ["NO CUSTOM COMMANDS DEFINED YET, do it with: `!setup-customcommands`"]
        else cuc = cuc.map(cmd => `\`${cmd.name}\``)
        const items = cuc
        embed18.setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable24"]))
        embed18.setDescription(">>> " + items.join("︲"))
        embeds.push(embed18)

        return embeds.map((embed, index) => {
          return embed
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\nTo see command Descriptions and Information, type: ${config.prefix}help [CMD NAME]`, client.user.displayAvatarURL()));
        })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
        ]
      });
    }
  }
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
