const {
	MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js")
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  duration, handlemsg
} = require(`../../handlers/functions`)
module.exports = {
  name: "help",
  category: "🔰 Info",
  aliases: ["h", "commandinfo", "halp", "hilfe"],
  usage: "help [Command/Category]",
  description: "Returns all Commmands, or one specific command",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    let settings = await client.settings.get(message.guild.id);
    try {
      if (args[0]) {
        const embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if(args[0].toLowerCase().includes("cust")){
          let cuc = await client.customcommands.get(message.guild.id + ".commands");
          if (cuc.length < 1) cuc = [handlemsg(client.la[ls].cmds.info.help.error1)]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc


          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable1"]))
            .setDescription(items.join("︲"))
            .setFooter(client.getFooter(handlemsg(client.la[ls].cmds.info.help.nocustom), client.user.displayAvatarURL()));
          
          message.reply({embeds: [embed]})
          return;
        }var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          return message.reply({embeds: [embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, {command: args[0].toLowerCase()}))]});
        } else if (cat) {
          var category = cat;
          const items = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable2"]))
            .setFooter(client.getFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, {prefix: prefix}), client.user.displayAvatarURL()));
          let embeds = await allotherembeds_eachcategory();
          if(cat == "🔰 Info")
            return message.reply({embeds: [embeds[0]]})
          if(cat == "💸 Economy")
            return message.reply({embeds: [embeds[1]]})
          if(cat == "🏫 School Commands")
            return message.reply({embeds: [embeds[2]]})
          if(cat == "🎶 Music")
            return message.reply({embeds: [embeds[3]]})
          if(cat == "👀 Filter")
            return message.reply({embeds: [embeds[4]]})
          if(cat == "⚜️ Custom Queue(s)")
            return message.reply({embeds: [embeds[5]]})
          if(cat == "🚫 Administration")
            return message.reply({embeds: [embeds[6]]})
          if(cat == "💪 Setup")
            return message.reply({embeds: [embeds[7]]})
          if(cat == "⚙️ Settings")
            return message.reply({embeds: [embeds[8]]})
          if(cat == "👑 Owner")
            return message.reply({embeds: [embeds[9]]})
          if(cat == "⌨️ Programming")
            return message.reply({embeds: [embeds[10]]})
          if(cat == "📈 Ranking")
            return message.reply({embeds: [embeds[11]]})
          if(cat == "🔊 Soundboard")
            return message.reply({embeds: [embeds[12]]})
          if(cat == "🎤 Voice")
            return message.reply({embeds: [embeds[13]]})
          if(cat == "🕹️ Fun")
            return message.reply({embeds: [embeds[14]]})
          if(cat == "🎮 MiniGames")
            return message.reply({embeds: [embeds[15]]})
          if(cat == "😳 Anime-Emotions")
            return message.reply({embeds: [embeds[16]]})
          if(cat == "🔞 NSFW")
            return message.reply({embeds: [embeds[17]]})
          if (category.toLowerCase().includes("custom")) {
            const cmd = client.commands.get(items[0].split("`").join("").toLowerCase()) || client.commands.get(client.aliases.get(items[0].split("`").join("").toLowerCase()));
            try {
              embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable3"]));
            } catch {}
          } else {
            embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable4"]))
          }
          return message.reply({embeds: [embed]})
        }
        if (cmd.name) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.name), `\`\`\`${cmd.name} \`\`\``);
        if (cmd.name) embed.setTitle(handlemsg(client.la[ls].cmds.info.help.detail.about, {cmdname: cmd.name}));
        if (cmd.description) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.desc), `\`\`\`${cmd.description}\`\`\``);
        if (cmd.aliases && cmd.aliases.length > 0 && cmd.aliases[0].length > 1) try {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.aliases), `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        } catch { }
        if (cmd.cooldown) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`${cmd.cooldown} Seconds\`\`\``);
        else embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`3 Seconds\`\`\``);
        if (cmd.usage) {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.usage), `\`\`\`${prefix}${cmd.usage}\`\`\``);
          embed.setFooter(handlemsg(client.la[ls].cmds.info.help.detail.syntax), es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL());
        }
        return message.reply({embeds: [embed]});
      } else {
        let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.back))
        let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.home))
        let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.forward))        
        let button_tutorial = new MessageButton().setStyle('LINK').setEmoji("950886430421418004").setLabel(client.la[ls].cmds.info.help.buttons.server).setURL("https://youtu.be/E0R7d8gS908")
        let menuOptions = [
          {
            label: `${client.la[ls].cmds.info.help.sixlb}`,
            value: "Overview",
            emoji: "833101995723194437",
            description: `${client.la[ls].cmds.info.help.six}`
          },
          {
            label: `${client.la[ls].cmds.info.help.sevenlb}`,
            value: "Information",
            emoji: "🔰",
            description: `${client.la[ls].cmds.info.help.seven}`
          },
          {
            label: `${client.la[ls].cmds.info.help.eightlb}`,
            value: "Economy",
            emoji: "💸",
            description: `${client.la[ls].cmds.info.help.eight}`
          },
          {
            label: `${client.la[ls].cmds.info.help.ninelb}`,
            value: "School",
            emoji: "🏫",
            description: `${client.la[ls].cmds.info.help.nine}`
          },
          {
            label: `${client.la[ls].cmds.info.help.tenlb}`,
            value: "Music",
            emoji: "🎶",
            description: `${client.la[ls].cmds.info.help.ten}`
          },
          {
            label: `${client.la[ls].cmds.info.help.elevenlb}`,
            value: "Filter",
            emoji: "👀",
            description: `${client.la[ls].cmds.info.help.eleven}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twelvelb}`,
            value: "Customqueue",
            emoji: "⚜️",
            description: `${client.la[ls].cmds.info.help.twelvelb}`
          },
          {
            label: `${client.la[ls].cmds.info.help.thirteenlb}`,
            value: "Admin",
            emoji: "🚫",
            description: `${client.la[ls].cmds.info.help.thirteen}`
          },
          {
            label: `${client.la[ls].cmds.info.help.fourteenlb}`,
            value: "Setup",
            emoji: "💪",
            description: `${client.la[ls].cmds.info.help.fourteen}`
          },
          {
            label: `${client.la[ls].cmds.info.help.fifteenlb}`,
            value: "Settings",
            emoji: "⚙️",
            description: `${client.la[ls].cmds.info.help.fifteen}`
          },
          {
            label: `${client.la[ls].cmds.info.help.sixteenlb}`,
            value: "Owner",
            emoji: "👑",
            description: `${client.la[ls].cmds.info.help.sixteen}`
          },
          {
            label: `${client.la[ls].cmds.info.help.eighteenlb}`,
            value: "Programming",
            emoji: "⌨️",
            description: `${client.la[ls].cmds.info.help.eighteen}`
          },
          {
            label: `${client.la[ls].cmds.info.help.nineteenlb}`,
            value: "Ranking",
            emoji: "📈",
            description: `${client.la[ls].cmds.info.help.nineteen}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twentylb}`,
            value: "Soundboard",
            emoji: "🔊",
            description: `${client.la[ls].cmds.info.help.twenty}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twentyonelb}`,
            value: "Voice",
            emoji: "🎤",
            description: `${client.la[ls].cmds.info.help.twentyone}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twentytwolb}`,
            value: "Fun",
            emoji: "🕹️",
            description: `${client.la[ls].cmds.info.help.twentytwo}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twentythreelb}`,
            value: "Minigames",
            emoji: "🎮",
            description: `${client.la[ls].cmds.info.help.twentythree}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twentyfourlb}`,
            value: "Anime-Emotions",
            emoji: "😳",
            description: `${client.la[ls].cmds.info.help.twentyfour}`
          },
          {
            label: `${client.la[ls].cmds.info.help.twentyfivelb}`,
            value: "Nsfw",
            emoji: "🔞",
            description: `${client.la[ls].cmds.info.help.twentyfive}`
          },
          {
            label: `${client.la[ls].cmds.info.help.swentysixlb}`,
            value: "Customcommand",
            emoji: "🦾",
            description: `${client.la[ls].cmds.info.help.swentysix}`
          },
        ];
        menuOptions = menuOptions.map(i=>{
          if(settings[`${i?.value.toUpperCase()}`] === undefined){
            return i; //if its not in the db, then add it
          }
          else if(settings[`${i?.value.toUpperCase()}`]){
            return i; //If its enabled then add it
          }
          else if(settings.showdisabled && settings[`${i?.value.toUpperCase()}`] === false){
            return i;
          } else {
            //return i // do not return, cause its disabled! to be shown
          }
        })
        const allGuilds = await client.cluster.broadcastEval(c => c.guilds.cache.size).then(r=>r.reduce((prev, val) => prev + val, 0))
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder(`${client.la[ls].cmds.info.help.second}`)
          .setMinValues(1)
          .setMaxValues(5)
        .addOptions(menuOptions.filter(Boolean))
        let buttonRow = new MessageActionRow().addComponents([button_back,button_home, button_forward, button_tutorial])
        let SelectionRow = new MessageActionRow().addComponents([menuSelection])
        const allbuttons = [buttonRow, SelectionRow]
        //define default embed
        if(ls == "ru"){
          var OverviewEmbed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter("Страница осмотра | "+ client.user.username, client.user.displayAvatarURL()))
          .setTitle(`Информация о __${client.user.username}__`)
          .addField(":muscle: **__Мои возможности__**",
  `>>> **58+ Систем**, например: **Авто-постер ютуба** 
  **Заявки-**, Тикеты-, **Изображения "добро пожаловать"-** и роли по реакции-, ... системы
  :notes: Можная **Музыкальная система** с **Фильтрами**
  :video_game: Много **Миниигр** и :joystick: **Фан** команд (150+)
  :no_entry_sign: **Администрация** и **Авто-Модерация** и много чего другого!`)
          .addField(":question: **__Как меня использовать?__**",
  `>>> \`${prefix}setup\` и выбирайте то что нужно!,
  Также можно настроить отдельные системы так: \`${prefix}setup-SYSTEM\` например \`${prefix}setup-welcome\``)
  .addField(":chart_with_upwards_trend: **__Статистика:__**",
  `>>> :gear: **${client.commands.map(a=>a).length} Команд**
  :file_folder: Работаю на **${allGuilds} серверах(ов)**
  ⌚️ **${duration(client.uptime).map(i=> `\`${i}\``).join("︲")} Непрерывной работы**
  📶 **\`${Math.floor(client.ws.ping)}мс\` Пинг**
  :green_circle: **\`${Math.floor(await client.database.ping())}ms\` Пинг базы данных**
    Сделан [**Cepheid**](http://discord.gg/7PdChsBGKd)`)
  .addField("Как пользоватся?", `>>> **\` 1. Путь \`** *Используйте кнопки для переключения вкладок*\n**\` 2. Путь \`** *Используйте меню выбора, чтобы посмотреть команды сразу на нужной страничке*\n**\` 3. Путь \`** *Можешь поплакать)*`)
        }
        else{
          var OverviewEmbed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter("Page Overview | "+ client.user.username, client.user.displayAvatarURL()))
          .setTitle(`Information about __${client.user.username}__`)
          .addField(":muscle: **__My Features__**",
  `>>> **58+ Systems**, like: **Twitter-** & **Youtube-Auto-Poster** 
  **Application-**, Ticket-, **Welcome-Images-** and Reaction Role-, ... Systems
  :notes: An advanced **Music System** with **Audio Filtering**
  :video_game: Many **Minigames** and :joystick: **Fun** Commands (150+)
  :no_entry_sign: **Administration** and **Auto-Moderation** and way much more!`)
          .addField(":question: **__How do you use me?__**",
  `>>> \`${prefix}setup\` and choose for the right action,
  but you can also do \`${prefix}setup-music\` e.g. \`${prefix}setup-music\``)
  .addField(":chart_with_upwards_trend: **__STATS:__**",
  `>>> :gear: **${client.commands.map(a=>a).length} Commands**
  :file_folder: on **${allGuilds} Guilds**
  ⌚️ **${duration(client.uptime).map(i=> `\`${i}\``).join("︲")} Uptime**
  📶 **\`${Math.floor(client.ws.ping)}ms\` Ping**
  :green_circle: **\`${Math.floor(await client.database.ping())}ms\` DB-Ping**
    Made by [**Cepheid**](http://discord.gg/7PdChsBGKd)`)
  .addField("How to get help?", `>>> **\` 1. Way \`** *Use the Buttons, to swap the Pages*\n**\` 2. Way \`** *Use the Menu to select all Help Pages, you want to display*\n**\` 3. Way \`** *Cry)*`)
        }
        let err = false;
        //Send message with buttons
        let helpmsg = await message.reply({   
            content: `${client.la[ls].cmds.info.help.first}`,
            embeds: [OverviewEmbed], 
            components: allbuttons
        }).catch(e=>{
          err = true;
          return message.reply(`${client.la[ls].cmds.info.help.third}`).catch(() => null)
        });
        if(err) return;
        var edited = false;
        var embeds = [OverviewEmbed]
        const otherEmbeds = await allotherembeds_eachcategory(true);
        for await (const e of otherEmbeds)
          embeds.push(e)        
        let currentPage = 0;

        //create a collector for the thinggy
        const collector = helpmsg.createMessageComponentCollector({filter: (i) => (i?.isButton() || i?.isSelectMenu()) && i?.user && i?.message.author?.id == client.user.id, time: 180e3 });
        //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
        collector.on('collect', async b => {
          try{
            if(b?.isButton()){
            if(b?.user.id !== message.author?.id)
              return b?.reply({content: handlemsg(client.la[ls].cmds.info.help.buttonerror, {prefix: prefix}), ephemeral: true});
            
              //page forward
              if(b?.customId == "1") {
                //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
                  if (currentPage !== 0) {
                    currentPage -= 1
                  } else {
                      currentPage = embeds.length - 1
                  }
              }
              //go home
              else if(b?.customId == "2"){
                //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
                  currentPage = 0;
              } 
              //go forward
              else if(b?.customId == "3"){
                //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
                  if (currentPage < embeds.length - 1) {
                      currentPage++;
                  } else {
                      currentPage = 0
                  }
              }
              await helpmsg.edit({embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{})
              b?.deferUpdate().catch(e=>{})
            
              
            }
            if(b?.isSelectMenu()){
              //b?.reply(`***Going to the ${b?.customId.replace("button_cat_", "")} Page***, *please wait 2 Seconds for the next Input*`, true)
              //information, music, admin, settings, voice, minigames, nsfw
              let index = 0;
              let vembeds = []
              const otherEmbeds = await allotherembeds_eachcategory();
              let theembeds = [OverviewEmbed, ...otherEmbeds];
              for await (const value of b?.values){
                switch (value.toLowerCase()){
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
          }catch (e){
            console.error(e)
            console.log(String(e).italic.italic.grey.dim)
          }
        });
        
        collector.on('end', collected => {
          //array of all disabled buttons
          let d_buttonRow = new MessageActionRow().addComponents([button_back.setDisabled(true),button_home.setDisabled(true), button_forward.setDisabled(true), button_tutorial])
          const alldisabledbuttons = [d_buttonRow]
          if(!edited){
            edited = true;
            helpmsg.edit({content: handlemsg(client.la[ls].cmds.info.help.timeended, {prefix: prefix}), embeds: [helpmsg.embeds[0]], components: alldisabledbuttons}).catch((e)=>{})
          }
        });
        }        
        async function allotherembeds_eachcategory(filterdisabled = false){
          //ARRAY OF EMBEDS
          var embeds = [];

          //INFORMATION COMMANDS
          var embed0 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔰 Info").size}\`] 🔰 ${client.la[ls].cmds.info.help.sevenlb} 🔰`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔰 Info").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`🙂 **${client.la[ls].cmds.info.help.usrcmds}**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "user").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`🕹️ **${client.la[ls].cmds.info.help.gamsrelcmds}**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "games").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Discord:943116778618376222> **${client.la[ls].cmds.info.help.serverrelcmds}**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "server").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Bot_Flag:943116768602378290> **${client.la[ls].cmds.info.help.botrelcmds}**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "bot").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Builder:943116466234986517> **${client.la[ls].cmds.info.help.utilrelcmds}**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "util").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          embeds.push(embed0)

          //ECONOMY COMMANDS
          var embed1 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💸 Economy").size}\`] 💸 ${client.la[ls].cmds.info.help.eightlb} 💸 | ${settings.ECONOMY ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💸 Economy").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.mgte}`,  ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "game").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`:clock1: **Repeatingly earn 💸 via Event(s)**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "earn").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Builder:943116466234986517> **Information & Manage 💸**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "info").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            if(!filterdisabled || settings.ECONOMY || settings.showdisabled) embeds.push(embed1)

          //SCHOOL COMMANDS
          var embed2 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🏫 School Commands").size}\`] 🏫 ${client.la[ls].cmds.info.help.ninelb} 🏫 | ${settings.SCHOOL ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🏫 School Commands").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.mathcmds}`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 School Commands" && cmd.type === "math").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.timemgmt}`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 School Commands" && cmd.type === "time").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          if(!filterdisabled || settings.SCHOOL || settings.showdisabled) embeds.push(embed2)

          //MUSIC COMMANDS type: song, queue, queuesong, bot
          var embed3 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎶 Music").size}\`] 🎶 ${client.la[ls].cmds.info.help.tenlb} 🎶 | ${settings.MUSIC ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎶 Music").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.queuecmds}`, "> "+client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("queue")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<a:Playing_Audio:943116563681275904> ${client.la[ls].cmds.info.help.songcmds}`, "> "+client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("song")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Bot_Flag:943116768602378290> ${client.la[ls].cmds.info.help.botcmds}`, "> "+client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("bot")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            if(!filterdisabled || settings.MUSIC || settings.showdisabled) embeds.push(embed3)

          //FILTER COMMANDS
          var embed4 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👀 Filter").size}\`] 👀 ${client.la[ls].cmds.info.help.elevenlb} 👀 | ${settings.FILTER ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👀 Filter").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          if(!filterdisabled || settings.FILTER || settings.showdisabled) embeds.push(embed4)

          //CUSTOM QUEUE COMMANDS
          var embed5 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().extracustomdesc.length}\`] ⚜️ ${client.la[ls].cmds.info.help.twelvelb} ⚜️ | ${settings.CUSTOMQUEUE ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}*`)
            .addField("\u200b", "\u200b")
            .addField(`:white_check_mark: ${client.la[ls].cmds.info.help.usage}`, "> "+client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().usage)
          if(!filterdisabled || settings.CUSTOMQUEUE || settings.showdisabled) embeds.push(embed5)

          //ADMINISTRATION
          var embed6 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🚫 Administration").size}\`] 🚫 ${client.la[ls].cmds.info.help.thirteenlb} 🚫`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🚫 Administration").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`<:Discord:943116778618376222> **${client.la[ls].cmds.info.help.serverrelcmds}**`, "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("server")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Channel:943116450573455420> ${client.la[ls].cmds.info.help.channelrelated}`, "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("channel")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:ThreadChannel:943116441337606184> ${client.la[ls].cmds.info.help.threadrel}`, "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("thread")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Roles:943116430700855326> ${client.la[ls].cmds.info.help.rolerel}`, "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("role")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.memberrel}`, "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("member")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          embeds.push(embed6)

          //SETUP
          var embed7 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💪 Setup").size}\`] 💪 ${client.la[ls].cmds.info.help.fourteenlb} 💪`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💪 Setup").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.setupsent}`, "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("fun")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.infman}`, "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("info")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.mostused}`, "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("system")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Builder:943116466234986517> ${client.la[ls].cmds.info.help.secsyst}`, "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("security")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          embeds.push(embed7)
          
          //Settings
          var embed8 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").size}\`] ⚙️ ${client.la[ls].cmds.info.help.fifteenlb} ⚙️`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.userrel}`, "> "+client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("user")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Bot_Flag:943116768602378290> **${client.la[ls].cmds.info.help.botrelcmds}**`, "> "+client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("bot")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.musicrel}`, "> "+client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("music")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          embeds.push(embed8)
          
          //Owner
          var embed9 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👑 Owner").size}\`] 👑 ${client.la[ls].cmds.info.help.sixteenlb} 👑`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👑 Owner").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`<:Discord:943116778618376222> ${client.la[ls].cmds.info.help.infmanage}`, "> "+client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("info")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`<:Bot_Flag:943116768602378290> ${client.la[ls].cmds.info.help.adj}`, "> "+client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("bot")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            embeds.push(embed9)
          
          //Programming Commands
          var embed10 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").size}\`] ⌨️ ${client.la[ls].cmds.info.help.eighteenlb} ⌨️ | ${settings.PROGRAMMING ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          if(!filterdisabled || settings.PROGRAMMING || settings.showdisabled) embeds.push(embed10)
          
          //Ranking
          var embed11 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "📈 Ranking").size}\`] 📈 ${client.la[ls].cmds.info.help.nineteenlb} 📈 | ${settings.RANKING ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "📈 Ranking").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`<:Builder:943116466234986517> ${client.la[ls].cmds.info.help.rankmanage}`, `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "manage").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
            .addField(`${client.la[ls].cmds.info.help.rankinf}`, `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "info").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          if(!filterdisabled || settings.RANKING || settings.showdisabled) embeds.push(embed11)
          
          //SOUNDBOARD COMMANDS
          var embed12 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").size}\`] 🔊 ${client.la[ls].cmds.info.help.twentylb} 🔊 | ${settings.SOUNDBOARD ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          if(!filterdisabled || settings.SOUNDBOARD || settings.showdisabled) embeds.push(embed12)

          //Voice COMMANDS
          var embed13 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.length}\`] 🎤 ${client.la[ls].cmds.info.help.twentyonelb} 🎤 | ${settings.VOICE ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}*`)
            .addField("\u200b", "\u200b")
            .addField(`:white_check_mark:  ${client.la[ls].cmds.info.help.usage}`, "> "+client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().usage)
          if(!filterdisabled || settings.VOICE || settings.showdisabled) embeds.push(embed13)
          
          //FUN COMMANDS
          var embed14 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").size}\`] 🕹️ ${client.la[ls].cmds.info.help.twentytwolb} 🕹️ | ${settings.FUN ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.funf}`, "> "+client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "user").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.funs}`, "> "+client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "usertext").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.funt}`, "> "+client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "text").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          if(!filterdisabled || settings.FUN || settings.showdisabled) embeds.push(embed14)
          
          //MINIGAMES
          var embed15 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").size}\`] 🎮 ${client.la[ls].cmds.info.help.twentythreelb} 🎮 | ${settings.MINIGAMES ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.minigamesf}`, "> "+client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "text").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .addField(`${client.la[ls].cmds.info.help.minigamess}`, "> "+client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "buttons").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          if(!filterdisabled || settings.MINIGAMES || settings.showdisabled) embeds.push(embed15)

          //ANIME EMOTIONS
          var embed16 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").size}\`] 😳 ${client.la[ls].cmds.info.help.twentyfourlb} 😳 | ${settings.ANIME ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.animef}`, `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "mention").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
            .addField(`${client.la[ls].cmds.info.help.animes}`, `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "self").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          if(!filterdisabled || settings.ANIME || settings.showdisabled) embeds.push(embed16)

          //NSFW COMMANDS
          var embed17 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔞 NSFW").size}\`] 🔞 ${client.la[ls].cmds.info.help.twentyfivelb} 🔞 | ${settings.NSFW ? `:white_check_mark: ${client.la[ls].cmds.info.help.enabledtxt}` : `:x: ${client.la[ls].cmds.info.help.disabledtxt}`}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔞 NSFW").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
            .addField("\u200b", `__**${client.la[ls].cmds.info.help.subcat}:**__`)
            .addField(`${client.la[ls].cmds.info.help.nsfwf}`, `> ${client.commands.filter((cmd) => cmd.category === "🔞 NSFW" && cmd.type === "anime").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
            .addField(`${client.la[ls].cmds.info.help.nsfws}`, `> ${client.commands.filter((cmd) => cmd.category === "🔞 NSFW" && cmd.type === "real").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          if(!filterdisabled || settings.NSFW || settings.showdisabled) embeds.push(embed17)

          //CUSTOM COMMANDS EMBED
          var embed18 = new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable23"]))
          let cuc = await client.customcommands.get(message.guild.id + ".commands");
          console.log(cuc)
          if (!cuc || cuc.length < 1) cuc = [`${client.la[ls].cmds.info.help.four}`]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc
          embed18.setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable24"]))
          embed18.setDescription(">>> " + items.join("︲"))
          embeds.push(embed18)
        
          return embeds.map((embed, index) => {
            return embed
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\n${client.la[ls].cmds.info.help.five} ${config.prefix}help [CMD NAME]`, client.user.displayAvatarURL()));
          })
        }
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

