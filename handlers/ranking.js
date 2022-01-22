const config = require(`${process.cwd()}/botconfig/config.json`)
const canvacord = require("canvacord");
const Discord = require("discord.js");
const Canvas = require("canvas");
const { GetUser, duration, nFormatter } = require(`${process.cwd()}/handlers/functions`)
const { parse } = require( "twemoji-parser" )
//Canvas.registerFont( "./assets/fonts/DMSans-Bold.ttf" , { family: "DM Sans", weight: "bold" } );
//Canvas.registerFont( "./assets/fonts/DMSans-Regular.ttf" , { family: "DM Sans", weight: "regular" } );
//Canvas.registerFont( "./assets/fonts/STIXGeneral.ttf" , { family: "STIXGeneral" } );
//Canvas.registerFont( "./assets/fonts/AppleSymbol.ttf" , { family: "AppleSymbol" } );
//Canvas.registerFont( "./assets/fonts/Arial.ttf"       , { family: "Arial" } );
//Canvas.registerFont( "./assets/fonts/ArialUnicode.ttf", { family: "ArielUnicode" } );
//Canvas.registerFont("./assets/fonts/Genta.ttf", { family: "Genta" } );
//Canvas.registerFont("./assets/fonts/UbuntuMono.ttf", { family: "UbuntuMono" } );
const Fonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
module.exports = function (client) {
    //log that the module is loaded
    client.on("messageCreate", async (message) => {
     try{

        if (message.author.bot || !message.guild) return;
        
        if(!client.settings.has(message.guild.id, "language")) client.settings.ensure(message.guild.id, { language: "en" });
        let ls = client.settings.get(message.guild.id, "language");

        client.setups.ensure(message.guild.id,  {
            ranking: {
                enabled: true,
                backgroundimage: "null",
            }
        });
        client.settings.ensure(message.guild.id, {
            embed: {
            "color": ee.color,
            "thumb": true,
            "wrongcolor": ee.wrongcolor,
            "footertext": client.guilds.cache.get(message.guild.id) ? client.guilds.cache.get(message.guild.id).name : ee.footertext,
            "footericon": client.guilds.cache.get(message.guild.id) ? client.guilds.cache.get(message.guild.id).iconURL({
              dynamic: true
            }) : ee.footericon,
          }
        })
        let guildsettings = client.settings.get(message.guild.id);
        const prefix = guildsettings.prefix
        const embedcolor = guildsettings.embed.color || "#fffff9";
        
        let ranking = client.setups.get(message.guild.id, "ranking");

        if(!ranking.enabled) return;
        const key = `${message.guild.id}-${message.author.id}`;

        function databasing(rankuser) {
            //if(rankuser && rankuser.bot) return console.log("GOTTA IGNORE BOT")
            client.points.ensure(rankuser ? `${message.guild.id}-${rankuser.id}` : `${message.guild.id}-${message.author.id}`, {
                user: rankuser ? rankuser.id : message.author.id,
                usertag: rankuser ? rankuser.tag : message.author.tag,
                xpcounter: 1,
                guild: message.guild.id,
                points: 0,
                neededpoints: 400,
                level: 1,
                voicepoints: 0,
                neededvoicepoints: 400,
                voicelevel: 1,
                voicetime: 0,
                oldmessage: "",
            });
            client.points.set(rankuser ? `${message.guild.id}-${rankuser.id}` : `${message.guild.id}-${message.author.id}`, rankuser ? rankuser.tag : message.author.tag, `usertag`); //set the usertag with EVERY message, if he has nitro his tag might change ;)
            client.points.ensure(message.guild.id, {setglobalxpcounter: 1}); 
            client.points.ensure(message.guild.id, {
                channel: false,
                disabled: false
            })

        }
        databasing(message.author);

     
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift()
        if(!command || command.length == 0) return
        command = command.toLowerCase();
        let not_allowed = false;
       
        if (message.content.startsWith(prefix)) {
            let cmd = client.commands.get(command);
            //if the command does not exist, try to get it by his alias
            if (!cmd) cmd = client.commands.get(client.aliases.get(cmd));
            //if the command is on cooldown, return
            if(client.cooldowns.has(cmd)) {
                const now = Date.now(); //get the current time
                const timestamps = client.cooldowns.get(cmd); //get the timestamp of the last used commands
                const cooldownAmount = (cmd.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
                if (timestamps.has(message.author.id)) { //if the user is on cooldown
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
                    if (now < expirationTime) { //if he is still on cooldonw
                        return not_allowed = true;
                    }
                }
            }
            if(not_allowed) return;
            //execute the Command
            switch (command) {
                case `textrank`:
                case `ranktext`:
                case `rank`:
                    try{
                        await message.guild.members.fetch().catch(() => {});
                        let user = await GetUser(message, args)
                        console.log("GETTING RANK...")
                        rank(user, "text");
                    }catch (e){
                        message.reply({content: String('```' + e.message ? String(e.message).substr(0, 1900) : String(e) + '```')})
                    }
                    break;
                case `rankvoice`:
                case `voicerank`: 
                try{
                    await message.guild.members.fetch().catch(() => {});
                    let user = await GetUser(message, args)
                    rank(user, "voice");
                }catch (e){
                    message.reply({content: String('```' + e.message ? String(e.message).substr(0, 1900) : String(e) + '```')})
                }
                break;
                    /////////////////////////////////
                case `leaderboard`:
                    case `lb`:
                    case `top`:
                        if(args[0]){
                            if(args[0].toLowerCase() === "all"){
                                leaderboard();
                            } else{
                                newleaderboard();
                            }
                        } else
                        newleaderboard();
                        break;
                        /////////////////////////////////
                case `voiceleaderboard`:
                    case `voicelb`:
                    case `voicetop`:
                    case `topvoice`:
                        if(args[0]){
                            if(args[0].toLowerCase() === "all"){
                                leaderboard("voice");
                            } else {
                                newleaderboard("voice");
                            }
                        } else
                            newleaderboard("voice");
                        break;
                        /////////////////////////////////
                case `setxpcounter`: 
                if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable1"]))
                    setxpcounter();
                break; 
                    /////////////////////////////////
                case `setglobalxpcounter`: 
                if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable2"]))
                    setglobalxpcounter();
                break; 
                    /////////////////////////////////
                case `addpoints`:
                    if(message.author.id == "442355791412854784") return addpoints();
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable3"]))
                    addpoints();
                    break;
                    /////////////////////////////////
                case `setpoints`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable4"]))

                    setpoints();
                    break;
                    /////////////////////////////////
                case `removepoints`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable5"]))

                    removepoints();
                    break;
                    /////////////////////////////////
                case `addlevel`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable6"]))

                    addlevel();
                    break;
                    /////////////////////////////////
                case `setlevel`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable7"]))

                    setlevel();
                    break;
                    /////////////////////////////////
                case `removelevel`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable8"]))

                    removelevel();
                    break;
                    /////////////////////////////////
                case `resetranking`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable9"]))

                    resetranking();
                    break;
                    /////////////////////////////////
                case `registerall`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable10"]))

                    registerall();
                    break;
                    /////////////////////////////////
                case `addrandomall`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable11"]))

                    addrandomall();
                    break;
                    /////////////////////////////////
                case `resetrankingall`:
                    if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable12"]))

                    resetrankingall()
                    break;
                    /////////////////////////////////
                case `levelhelp`:
                case `rankinghelp`:
                case `levelinghelp`:
                case `rankhelp`:
                    levelinghelp();
                    break;
                    /////////////////////////////////
                default:
                    //message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable13"]))
                    break;
            }
            return;
        }


        function anti_double_messages() {
            const oldmessage = client.points.get(key, `oldmessage`);
            if (oldmessage.toLowerCase() === message.content.toLowerCase().replace(/\s+/g, "")) {
                return;
            }
            client.points.set(key, message.content.toLowerCase().replace(/\s+/g, ""), `oldmessage`); //setting the new old message
        }
        anti_double_messages();

        function Giving_Ranking_Points(thekey, maxnumber) {
            if(!thekey && message.author.bot) return;
            let setglobalxpcounter = client.points.get(message.guild.id, "setglobalxpcounter")
            if (!maxnumber) maxnumber = 5;
            var randomnum = ( Math.floor(Math.random() * Number(maxnumber)) + 1 ) * setglobalxpcounter;
            randomnum *= Number(client.points.get(key, `xpcounter`));
            randomnum = Number(Math.floor(randomnum));

            const curPoints = client.points.get(thekey ? thekey : key, `points`);
            const neededPoints = client.points.get(thekey ? thekey : key, `neededpoints`);
            let leftpoints = neededPoints - curPoints;

            let toaddpoints = randomnum;
            addingpoints(toaddpoints, leftpoints);

            function addingpoints(toaddpoints, leftpoints) {
                if (toaddpoints >= leftpoints) {
                    client.points.set(thekey ? thekey : key, 0, `points`); //set points to 0
                    client.points.inc(thekey ? thekey : key, `level`); //add 1 to level
                    //HARDING UP!
                    const newLevel = client.points.get(thekey ? thekey : key, `level`); //get current NEW level
                    if (newLevel % 4 === 0) client.points.math(thekey ? thekey : key, `+`, 100, `neededpoints`)

                    const newneededPoints = client.points.get(thekey ? thekey : key, `neededpoints`); //get NEW needed Points
                    const newPoints = client.points.get(thekey ? thekey : key, `points`); //get current NEW points

                    addingpoints(toaddpoints - leftpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                    LEVELUP() 
                } else {
                    client.points.math(thekey ? thekey : key, `+`, Number(toaddpoints), `points`)
                }
            }
        }
        Giving_Ranking_Points();

                
        async function LEVELUP() {
            const newLevel = client.points.get(key, `level`); //get current NEW level
            const newPoints = client.points.get(key, `points`); //get current NEW points
            const newneededPoints = client.points.get(key, `neededpoints`);
            //send ping and embed message
            try {
                client.points.ensure(message.guild.id, {
                    rankroles: { }
                })
                let RankRoles = client.points.get(message.guild.id, "rankroles");
                if(RankRoles[Number(newLevel)]){
                    await message.member.roles.add(RankRoles[Number(newLevel)]).catch(() => {})
                }
            }catch (e){ }
            if(client.points.get(message.guild.id, "disabled")) return;

            const filtered = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
            const sorted = filtered
            .sort((a, b) => { 
                if(b?.points) return b?.level - a.level || b?.points - a.points;
                else return b?.level - a.level || -1
            }) 
            .sort((a, b) => b?.level - a.level || b?.points - a.points);
            const top10 = sorted.splice(0, message.guild.memberCount);

            let i = 0;
            //count server rank sometimes an error comes
            for (const data of top10) {
                try {
                    i++;
                    if (data.user === message.author.id) break; //if its the right one then break it ;)
                } catch {
                    i = `X`;
                    break;
                }
            }
            const canvas = Canvas.createCanvas(1802, 430);
            const ctx = canvas.getContext("2d");
            ctx.font = "100px UbuntuMono";
            ctx.fillStyle = "#2697FF";
            const bgimg = await Canvas.loadImage("./assets/levelup.png");
            ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
            //USERNAME
            var text = `${message.author.username}`.trim();
            if (text.length > 15) text = text.substr(0, 11) + ".."
            text += ` leveled up!`
            await canvacord.Util.renderEmoji(ctx, text, 475, 150);
            ctx.font = "80px UbuntuMono";
            await canvacord.Util.renderEmoji(ctx, `New Level: ${newLevel}`, 475, 290);
            await canvacord.Util.renderEmoji(ctx, ` New Rank: #${i}`, 475, 380);
            //AVATAR
            ctx.beginPath();
            ctx.arc(345/2 + 83.5, 345/2 + 36, 345/2, 0, Math.PI * 2, true); 
            ctx.closePath();
            ctx.clip();
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ dynamic: false, format: "png", size: 4096 }));
            ctx.drawImage(avatar, 83.5, 36, 345, 345);

            //get it as a discord attachment
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "ranking-image.png");

            if(!client.points.get(message.guild.id, "channel")) return message.channel.send({content: `${message.author}`, files: [attachment]});
            try{
                let channel = message.guild.channels.cache.get(client.points.get(message.guild.id, "channel"))
                if(!channel){
                    return message.channel.send({content: `${message.author}`, files: [attachment]}).catch(() => {})
                }
                channel.send({content: `${message.author}`, files: [attachment]});

            }catch (e){
                message.channel.send({content: `${message.author}`, files: [attachment]}).catch(() => {})
            }
        }

        async function rank(the_rankuser, type = "text") {
            /**
             * GET the Rank User
             * @info you can tag him
             */
            try {
                let rankuser = the_rankuser || message.author;
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable14"]));

                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable16"]));
                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);
                let theDbDatas = ["level", "points", "neededpoints", ]
                if(type == "voice") theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
                let tempmessage = await message.channel.send(`📊 *Getting the ${type == "voice" ? "🔉" : "💬"}__${type.toUpperCase()}__-RANK-DATA of: **${rankuser.tag}** ...*`)
                //do some databasing
                const filtered = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
                const sorted = filtered
                .sort((a, b) => { 
                    if(b[`${theDbDatas[1]}`]) return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`];
                    else return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || -1
                }) 
                const top10 = sorted.splice(0, message.guild.memberCount);
                let i = 0;
                //count server rank sometimes an error comes
                for (const data of top10) {
                    try {
                        i++;
                        if (data.user === rankuser.id) break; //if its the right one then break it ;)
                    } catch {
                        i = `X`;
                        break;
                    }
                }
                let j = 0;
                //count server rank sometimes an error comes
                if(!client.points.get(key, `${theDbDatas[1]}`)) client.points.set(key, 1, `${theDbDatas[1]}`)
                if(!client.points.get(key, `${theDbDatas[2]}`)) client.points.set(key, 1, `${theDbDatas[2]}`)
                let curpoints = Number(client.points.get(key, `${theDbDatas[1]}`)?.toFixed(2));
                let curnextlevel = Number(client.points.get(key, `${theDbDatas[2]}`)?.toFixed(2));
                if (client.points.get(key, `${theDbDatas[0]}`) === undefined) i = `No Rank`;

               
                var xp_data = {
                    avatar: rankuser.displayAvatarURL({ dynamic: false, format: "png", size: 4096 }),
                    text: {
                        cur_level: Number(client.points.get(key, `${theDbDatas[0]}`)),
                        rank: Number(i),
                        current: Number(curpoints.toFixed(2)),
                        needed: Number(curnextlevel.toFixed(2)),
                        percent: Number(curpoints.toFixed(2)) / Number(curnextlevel.toFixed(2)) * 100,
                    },
                }


                const canvas = Canvas.createCanvas(1500, 500);
                const ctx = canvas.getContext("2d");
                ctx.roundRect = function ( x, y, width, height, radius, fill, stroke ) {
                    //just make the rectangle rounded with a bit px
                    let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
        
                    typeof stroke == "undefined" && ( stroke = true );
        
                    if ( typeof radius === "object" )
                        for ( let [ key ] of Object.entries( radius ) )
                            cornerRadius[key] = radius[key];
        
                    this.beginPath();
                    this.moveTo( x + cornerRadius.upperLeft, y );
                    this.lineTo( x + width - cornerRadius.upperRight, y );
                    this.quadraticCurveTo( x + width, y, x + width, y + cornerRadius.upperRight );
                    this.lineTo( x + width, y + height - cornerRadius.lowerRight );
                    this.quadraticCurveTo( x + width, y + height, x + width - cornerRadius.lowerRight, y + height );
                    this.lineTo( x + cornerRadius.lowerLeft, y + height );
                    this.quadraticCurveTo( x, y + height, x, y + height - cornerRadius.lowerLeft );
                    this.lineTo( x, y + cornerRadius.upperLeft );
                    this.quadraticCurveTo( x, y, x + cornerRadius.upperLeft, y );
                    this.closePath();
                    stroke  && this.stroke();
                    fill    && this.fill();
                };
                ctx.save();

                const bg = await Canvas.loadImage("./assets/base.png")
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height );
                if(rankuser.bot){
                    if(rankuser.flags && rankuser.flags.toArray().includes("VERIFIED_BOT")){
                        const bg = await Canvas.loadImage("https://cdn.discordapp.com/emojis/846290690534015018.png")
                        ctx.drawImage(bg, 480, 175, 225, 80 );
                    }else{
                        const bg = await Canvas.loadImage("https://cdn.discordapp.com/attachments/820695790170275871/869218298833829948/bot.png")
                        ctx.drawImage(bg, 480, 175, 150, 80 );
                    }
                }
                else{
                    if(rankuser.flags) {
                        let flags = rankuser.flags.toArray();
                        let member = message.guild.members.cache.get(rankuser);
                        if(!member) member = await message.guild.members.fetch(rankuser).catch(() => {})
                        if(member.premiumSinceTimestamp != 0) {
                            if(member.premiumSinceTimestamp){
                                flags.push("1_MONTH")
                            }else if(member.premiumSinceTimestamp < Date.now() - (2-1) * 2678400000){
                                flags.push("2_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - (3-1) * 2678400000){
                                flags.push("3_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - (6-1) * 2678400000){
                                flags.push("6_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - (9-1) * 2678400000){
                                flags.push("9_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - (12-1) * 2678400000){
                                flags.push("12_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - (15-1) * 2678400000){
                                flags.push("15_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - (18-1) * 2678400000){
                                flags.push("18_MONTH")
                            } else if(member.premiumSinceTimestamp < Date.now() - 24 * 2678400000){
                                flags.push("24_MONTH")
                            } 
                        }
                        if(rankuser.displayAvatarURL({dynamic:true}).endsWith(".gif")) flags.push("NITRO")
                        if(flags.includes("EARLY_VERIFIED_DEVELOPER")){
                            const index = flags.indexOf("EARLY_VERIFIED_DEVELOPER");
                            if(index > -1){
                                flags.splice(index, 1);
                            }
                        }
                        for(let i = 0; i< flags.length; i++){
                            if (flags[i] === "HOUSE_BALANCE") { 
                                const bg = await Canvas.loadImage("https://discord.com/assets/9fdc63ef8a3cc1617c7586286c34e4f1.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            } 
                            if (flags[i]  === "HOUSE_BRILLIANCE") { 
                                const bg = await Canvas.loadImage("https://discord.com/assets/48cf0556d93901c8cb16317be2436523.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            } 
                            if (flags[i]  === "HOUSE_BRAVERY") { 
                                const bg = await Canvas.loadImage("https://discord.com/assets/64ae1208b6aefc0a0c3681e6be36f0ff.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            } 
                            if (flags[i]  === "VERIFIED_DEVELOPER") { 
                                const bg = await Canvas.loadImage("https://discord.com/assets/45cd06af582dcd3c6b79370b4e3630de.svg")
                                ctx.drawImage(bg, 480 + 80 * i, 175, 80, 80 ); 
                            } 
                            if (flags[i]  === "EARLY_SUPPORTER") { 
                                const bg = await Canvas.loadImage("https://discord.com/assets/23e59d799436a73c024819f84ea0b627.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            } 
                            if(flags[i]  === "NITRO"){
                                const bg = await Canvas.loadImage("https://cdn.discordapp.com/attachments/820695790170275871/869228654775918662/813372466759598110.png")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 100, 80 ); 
                            }
                            if(flags[i]  === "1_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/fbb6f1e160280f0e9aeb5d7c452eefe1.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "2_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/b4b741bef6c3de9b29e2e0653e294620.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "3_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/93f5a393e22796a850931483166d7cb9.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "6_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/4c380650960c2b1e1584115d5e9ad63b?.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "9_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/438dd7ecbffcf21b6cbf2773ade51a04.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "12_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/7a5f78de816fcecbbd1d5d6e635cc7dd.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "15_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/5a24b20b84fb3eafc138916729386e76.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "18_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/f31d590e1f3629cd0b614330f4a8ee2a.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            }
                            if(flags[i]  === "24_MONTH"){
                                const bg = await Canvas.loadImage("https://discordapp.com/assets/9ba64f1fa91ccde0eba506c1c33f3d1a.svg")
                                ctx.drawImage(bg, 480 + 80 * i + (i > 0 ? 15 : 0), 175, 80, 80 ); 
                            } 
                        }
                   } 
                }
                ctx.restore();
                ctx.save();
                ctx.beginPath();
                ctx.arc(126 + 158.5, 92 + 158.5, 158.5, 0, Math.PI * 2, true); 
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(xp_data.avatar);
                ctx.drawImage(avatar, 126, 92, 317, 317);

                ctx.restore();


                let currWidth = 0;

                ctx.font = `bold 57px ${Fonts}`;
                ctx.fillStyle = "#ffffff"


                let fontsize = 57;
                const name = rankuser.username;

                while(ctx.measureText(name).width > 550){
                    ctx.font = `bold ${ fontsize-- }px ${Fonts}`;
                }
                for (const character of name) {
                    const parseEmoji = parse(character);
                    if ( parseEmoji?.length ) {
        
                        const img = await Canvas.loadImage( parseEmoji[0].url );
        
                        ctx.drawImage( img, 482 + currWidth, 149 - fontsize + 10, fontsize - 3, fontsize - 3 );
        
                        currWidth += fontsize;
        
                    } else {
                        ctx.fillText( character, 482 + currWidth, 149 );
                        currWidth += ctx.measureText( character ).width;
                    };
                }
                const disriminator =  "#"+ rankuser.discriminator
                ctx.font = `bold 35px ${Fonts}`;
                ctx.fillStyle = "#666A73"
                ctx.fillText( disriminator, 482 + currWidth, 149 );


                ctx.fillStyle = "#008BFF";
                ctx.font = `bold 57px ${Fonts}`;
                let ranklength = ctx.measureText( xp_data.text.rank ).width;
                ctx.fillText( xp_data.text.rank, 1369 - ranklength , 92 + 57 );

                ctx.fillStyle = "#ffffff";
                ctx.font = `bold 38px ${Fonts}`;

                ctx.globalAlpha = 0.2;
                ctx.fillText( "Rank:" , 1345 - ranklength - ctx.measureText("Rank").width , 92 + 57 );
                ctx.globalAlpha = 1;

                ctx.font = `regular 31px ${Fonts}`;
                // —— Creation of the experience progress bar
                const grd = ctx.createLinearGradient( 482, 349, 907, 59 );
                grd.addColorStop( 0, "#4e5ff4" );
                grd.addColorStop( 1, "#2345e5" );
                ctx.lineWidth = 4;
                ctx.fillStyle = grd;
                ctx.strokeStyle = grd;

                ctx.beginPath();
                ctx.roundRect( 480, 347, 910, 63, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 }, false, false );
                ctx.closePath();
                ctx.clip();

                ctx.roundRect( 482, 349, 907, 59, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 }, false, true );
                ctx.roundRect( 482, 349, 907 * ( xp_data.text.percent / 100 ) , 59, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 }, true, false );

                ctx.font = `regular 38px ${Fonts}`;
                ctx.fillStyle = "#ffffff";
                ctx.fillText( `Lvl. ${ xp_data.text.cur_level }`, 505, 355 + 36 );

                ctx.font = `regular 31px ${Fonts}`;

                const progression = ` ${xp_data.text.current} / ${xp_data.text.needed}`;

                ctx.fillText( progression, 1369 - ctx.measureText( progression ).width, 356 + 33 );

                return tempmessage.edit({
                    content: `${tempmessage.content}${type == "voice" ? `\n**Connected Time:** ${duration(client.points.get(key, "voicetime") * 60 * 1000).map(i=>`\`${i}\``).join(", ")}\n**Note:** *\`You only gain Points, if you leave the Channel!\`*`: ""}`,
                    files:[new Discord.MessageAttachment( canvas.toBuffer(), "card.png" )]});;
            } catch (error) {
                console.log(error)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable17"]));
            }
        }

        function leaderboardembed(type = "text") {
            let theDbDatas = ["level", "points", "neededpoints", ]
            if(type == "voice") theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
            const filtered = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
            let orilent;
            const sorted = filtered.sort((a, b) => b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`]);
            let embeds = [];
            let j = 0;
            let maxnum = sorted.length;
            orilent = sorted.length;
            if(isNaN(maxnum)) {
                maxnum = 50;
            }
            if (maxnum > sorted.length) 
                maxnum = sorted.length + (25 - Number(String(sorted.length/25).slice(2)));
            if(maxnum < 25) maxnum = 25;

            //do some databasing
            var userrank = 0;
            const filtered1 = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
            const sorted1 = filtered1.sort((a, b) => b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`]);
            const top101 = sorted1.splice(0, message.guild.memberCount);
            for (const data of top101) {
                try {
                    userrank++;
                    if (data.user === message.author.id) break; //if its the right one then break it ;)
                } catch {
                    userrank = `X`;
                    break;
                }
            }


            for (let i = 25; i <= maxnum; i += 25) {
                const top = sorted.splice(0, 25);
                const embed = new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable18"]))
                    .setTimestamp()
                    .setColor(embedcolor);
                var string = "";
                for (const data of top) {
                    j++;
                    try {
                        if(j == 1) 
                        string += `:first_place: **${data.usertag}**: \`Level: ${data[`${theDbDatas[0]}`]} | Points: ${shortenLargeNumber(data[`${theDbDatas[1]}`], 2)}\`\n`;
                        else if(j == 2)
                        string += `:second_place: **${data.usertag}**: \`Level: ${data[`${theDbDatas[0]}`]} | Points: ${shortenLargeNumber(data[`${theDbDatas[1]}`], 2)}\`\n`;
                        else if(j == 3)
                        string += `:third_place: **${data.usertag}**: \`Level: ${data[`${theDbDatas[0]}`]} | Points: ${shortenLargeNumber(data[`${theDbDatas[1]}`], 2)}\`\n`;
                        else
                        string += `\`${j}\`. **${data.usertag}**: \`Level: ${data[`${theDbDatas[0]}`]} | Points: ${shortenLargeNumber(data[`${theDbDatas[1]}`], 2)}\`\n`;

                    } catch {

                    }
                }
                embed.setDescription(string.substr(0, 2048))
                embed.setFooter(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable19"]))
                embeds.push(embed);
            }
            return embeds;
        }
        async function leaderboard(type = "text") {
            let theDbDatas = ["level", "points", "neededpoints", ]
            if(type == "voice") theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
            let currentPage = 0;
            const embeds = leaderboardembed();
            if(embeds.length == 1){
                return message.channel.send({embeds: embeds}).catch(() => {})
            }
            const lbembed = await message.channel.send({
                content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                embeds: [embeds[currentPage]]
            }).catch(() => {});

            try {
                await lbembed.react("⏪");
                await lbembed.react("⏹");
                await lbembed.react("⏩");
            } catch (error) {
                console.error(error);
            }

            const filter = (reaction, user) => ["⏪", "⏹", "⏩"].includes(reaction.emoji?.name) && message.author.id === user.id;
            const collector = lbembed.createReactionCollector({filter, 
                time: 60000
            });

            collector.on("collect", async (reaction, user) => {
                try {
                    if (reaction.emoji?.name === "⏩") {
                        if (currentPage < embeds.length - 1) {
                            currentPage++;
                            lbembed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
                        } else {
                            currentPage = 0;
                            lbembed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
                        }
                    } else if (reaction.emoji?.name === "⏪") {
                        if (currentPage !== 0) {
                            --currentPage;
                            lbembed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
                        } else {
                            currentPage = embeds.length - 1;
                            lbembed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
                        }
                    } else {
                        collector.stop();
                        reaction.message.reactions.removeAll();
                    }
                    await reaction.users.remove(message.author.id);
                } catch (error) {
                    console.error(error);
                }
            });
        }

        async function newleaderboard(type = "text") {
            let theDbDatas = ["level", "points", "neededpoints", ]
            if(type == "voice") theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
            let tempmessage = await message.channel.send(`📊 *Getting the ${type == "voice" ? "🔉" : "💬"}__${type.toUpperCase()}__-LEADERBOARD-DATA of: **${message.guild.name}** ...*`)
            var filtered = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
            var sorted = filtered
            .sort((a, b) => { 
                if(b[`${theDbDatas[1]}`]) return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`];
                else return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || -1
            }) 
            let embeds = [];
            let j = 0;
            let maxnum = 10;

            //do some databasing
            var userrank = 0;
            var filtered1 = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
            var sorted1 = filtered1
            .sort((a, b) => { 
                if(b[`${theDbDatas[1]}`]) return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`];
                else return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`]
            }) 
            var top101 = sorted1.splice(0, message.guild.memberCount);

            for (const data of top101) {
                try {
                    userrank++;
                    if (data.user === message.author.id) break; //if its the right one then break it ;)
                } catch {
                    userrank = `X`;
                    break;
                }
            }
            var array_usernames = [];
            var array_discriminator = [];
            var array_level = [];
            var array_avatar = [];
            var array_textpoints = [];
            var array_amount = [];
            for (let i = 10; i <= maxnum; i += 10) {
                const top = sorted.splice(0, 10);
                for (const data of top) {
                    try {
                        var user = await client.users.fetch(data.user).catch(() => {})
                        array_usernames.push(user.username)
                        array_discriminator.push(user.discriminator)
                        array_level.push(data[`${theDbDatas[0]}`] && data[`${theDbDatas[0]}`] > 0 ? data[`${theDbDatas[0]}`] : 1)
                        array_textpoints.push(data[`${theDbDatas[1]}` || 0])
                        if(type == "voice") array_amount.push(data.voicetime || 0)
                        else {
                            let memberData = client.invitesdb?.get(message.guild.id + user.id)
                            if(memberData.messagesCount < 0) memberData.messagesCount *= -1;
                            let messagesCount = memberData.messagesCount;
                            array_amount.push(messagesCount || 0 )
                        }
                        array_avatar.push(user.displayAvatarURL({size: 4096, format: "png"}))      
                    } catch (e){
                        array_usernames.push(undefined)
                        array_avatar.push(client.user.displayAvatarURL({size: 4096, format: "png"}))
                        array_level.push(0)
                        array_textpoints.push(0)
                    }
                }
            }

        
            const canvas = Canvas.createCanvas(830, 1030);
            const ctx = canvas.getContext("2d");
            ctx.font = "75px UbuntuMono";
            ctx.fillStyle = "#2697FF";

            var bgimg = await Canvas.loadImage(`./assets/${type == "voice" ? "voice" : "first"}_leaderboard.png`);
            ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
            array_usernames = array_usernames.slice(0, 10);
            new Promise(async (res, rej)=>{
                for(let i = 0; i < array_usernames.length; i++){
                    try{
                        ctx.save();
                        ctx.font = "75px UbuntuMono";
                        ctx.fillStyle = "#2697FF";
                        
                        //USERNAME
                        var text = `${array_usernames[i]}`.trim();
                        let yOffset = 0;
                        let fontsize = 75; 
                        while(ctx.measureText(text).width > 365){
                            ctx.font = `${ fontsize-- }px UbuntuMono`;
                            yOffset += 0.0025;
                        }
                        canvacord.Util.renderEmoji(ctx, text, 435 , 85 + i * 100 + yOffset);


                        //LEVEL TEXT
                        ctx.font = "40px UbuntuMono";
                        ctx.fillStyle = "#6caae7"; 
                        var text4 = `LVL ${array_level[i]}`.trim();
                        canvacord.Util.renderEmoji(ctx, text4, 275, 100 + i * 100 - 22.5);
        

                        //POINTS TEXT: 
                        ctx.font = "19px UbuntuMono";
                        ctx.fillStyle = "#858594"
                        var text5 = `${nFormatter(array_textpoints[i], 1)} P. | ${type == "voice" ? `${cduration(array_amount[i]).join(", ")} Mins.`: `${nFormatter(array_amount[i], 1)} Msgs.`}`.trim();
                        canvacord.Util.renderEmoji(ctx, text5, 235, 101.25 + i * 100);
        

                        //DISCRIMINATOR TEXT
                        ctx.font = "15px UbuntuMono";
                        ctx.fillStyle = "#7F7F7F"
                        canvacord.Util.renderEmoji(ctx, "#"+array_discriminator[i], 750, 100 + i * 100);
                        
                        
                        //AVATAR
                        ctx.beginPath();
                        ctx.arc(80/2 + 30, 80/2 + 25 + i * 100, 80/2, 0, Math.PI * 2, true); 
                        ctx.closePath();
                        ctx.clip();
                        const avatar = await Canvas.loadImage(array_avatar[i]);
                        ctx.drawImage(avatar, 30, 25 + i * 100, 80, 80);
                        ctx.restore();
                        if(i == array_usernames.length - 1) return res(true)
                    }catch (e){
                        if(i == array_usernames.length - 1) return res(true)
                    }
                }
                return res(true)
            }).then(async ()=>{
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "ranking-image.png");

                var filtered = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
                var sorted = filtered
                .sort((a, b) => { 
                    return b[`voicetime`] - a[`voicetime`] || -1
                }) 
                let embeds = [];
                let j = 0;
                let maxnum = 10;
    
                //do some databasing
                var userrank = 0;
                var filtered1 = client.points.filter(p => p.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
                var sorted1 = filtered1
                .sort((a, b) => { 
                    return b[`voicetime`] - a[`voicetime`] || -1
                }) 
                var top101 = sorted1.splice(0, message.guild.memberCount);
    
                for (const data of top101) {
                    try {
                        userrank++;
                        if (data.user === message.author.id) break; //if its the right one then break it ;)
                    } catch {
                        userrank = `X`;
                        break;
                    }
                }
                var array_usernames = [];
                var array_discriminator = [];
                var array_level = [];
                var array_avatar = [];
                var array_textpoints = [];
                var array_amount = [];
                for (let i = 10; i <= maxnum; i += 10) {
                    const top = sorted.splice(0, 10);
                    for (const data of top) {
                        try {
                            var user = await client.users.fetch(data.user).catch(() => {})
                            array_usernames.push(user.username)
                            array_discriminator.push(user.discriminator)
                            array_level.push(data[`${theDbDatas[0]}`] && data[`${theDbDatas[0]}`] > 0 ? data[`${theDbDatas[0]}`] : 1)
                            array_textpoints.push(data[`voicetime` || 0])
                            if(type == "voice") array_amount.push(data.voicepoints || 0)
                            else {
                                let memberData = client.invitesdb?.get(message.guild.id + user.id)
                                if(memberData.messagesCount < 0) memberData.messagesCount *= -1;
                                let messagesCount = memberData.messagesCount;
                                array_amount.push(messagesCount || 0 )
                            }
                            array_avatar.push(user.displayAvatarURL({size: 4096, format: "png"}))      
                        } catch (e){
                            array_usernames.push(undefined)
                            array_avatar.push(client.user.displayAvatarURL({size: 4096, format: "png"}))
                            array_level.push(0)
                            array_textpoints.push(0)
                        }
                    }
                }
    
            
                const canvas2 = Canvas.createCanvas(830, 1030);
                const ctx2 = canvas2.getContext("2d");
                ctx2.font = "75px UbuntuMono";
                ctx2.fillStyle = "#2697FF";
    
                var bgimg = await Canvas.loadImage(`./assets/${type == "voice" ? "voice" : "first"}_leaderboard.png`);
                ctx2.drawImage(bgimg, 0, 0, canvas2.width, canvas2.height);
                array_usernames = array_usernames.slice(0, 10);
                new Promise(async (res, rej)=>{
                    for(let i = 0; i < array_usernames.length; i++){
                        try{
                            ctx2.save();
                            ctx2.font = "75px UbuntuMono";
                            ctx2.fillStyle = "#2697FF";
                            
                            //USERNAME
                            var text = `${array_usernames[i]}`.trim();
                            let yOffset = 0;
                            let fontsize = 75; 
                            while(ctx2.measureText(text).width > 365){
                                ctx2.font = `${ fontsize-- }px UbuntuMono`;
                                yOffset += 0.0025;
                            }
                            canvacord.Util.renderEmoji(ctx2, text, 435 , 85 + i * 100 + yOffset);
    
    
                            //LEVEL TEXT
                            ctx2.font = "40px UbuntuMono";
                            ctx2.fillStyle = "#6caae7"; 
                            var text4 = `LVL ${array_level[i]}`.trim();
                            canvacord.Util.renderEmoji(ctx2, text4, 275, 100 + i * 100 - 22.5);
            
    
                            //POINTS TEXT: 
                            ctx2.font = "19px UbuntuMono";
                            ctx2.fillStyle = "#858594"
                            var text5 = `${cduration(array_textpoints[i]).join(", ")}`.trim();
                            canvacord.Util.renderEmoji(ctx2, text5, 235, 101.25 + i * 100);
            
                            //DISCRIMINATOR TEXT
                            ctx2.font = "15px UbuntuMono";
                            ctx2.fillStyle = "#7F7F7F"
                            canvacord.Util.renderEmoji(ctx2, "#"+array_discriminator[i], 750, 100 + i * 100);
                            
                            
                            //AVATAR
                            ctx2.beginPath();
                            ctx2.arc(80/2 + 30, 80/2 + 25 + i * 100, 80/2, 0, Math.PI * 2, true); 
                            ctx2.closePath();
                            ctx2.clip();
                            const avatar = await Canvas.loadImage(array_avatar[i]);
                            ctx2.drawImage(avatar, 30, 25 + i * 100, 80, 80);
                            ctx2.restore();
                            if(i == array_usernames.length - 1) return res(true)
                        }catch (e){
                            if(i == array_usernames.length - 1) return res(true)
                        }
                    }
                    return res(true)
                }).then(async ()=>{    
                    const attachment2 = new Discord.MessageAttachment(canvas2.toBuffer(), "ranking-image.png");
                    tempmessage.delete().catch(() => {})
                    message.channel.send({content:`Top 10 Leaderboard of **${message.guild.name}** Sorted after VOICE-POINTS\n> **Type:** \`leaderboard all\` to see all Ranks\n*Rank is counted for the \`${type.toUpperCase()}-RANK\`*\n> ${type != "voice" ? `To see the **Voice Leaderboard** type: \`voiceleaderbaord [all]\`` : `To see the **Text Leaderboard** type: \`leaderbaord [all]\``}`, files: [attachment, attachment2]}).catch(() => {});
                    message.channel.send({content:`Top 10 Leaderboard of **${message.guild.name}** Sorted after VOICE-TIME`, files: [attachment2]}).catch(() => {});
                })
            })
       }

        function setxpcounter(){
            try {
            /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable21"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable22"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable23"]));
                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);
                if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable24"]));
                if(Number(args[1]) > 10) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable25"]))
                client.points.set(key, Number(args[1]), `xpcounter`); //set points to 0
                const embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable26"]))
                message.reply({embeds: [embed]});
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable27"]));
            }
        }
        
        function setglobalxpcounter(){
            try {
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable28"]));
                if(Number(args[1]) > 10) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable29"]))
                client.points.set(message.guild.id, Number(args[0]), `setglobalxpcounter`); //set points to 0
                const embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable30"]))
                message.reply({embeds: [embed]});
            } catch {
            }
        }
        function addpoints(amount) {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable31"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable32"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable33"]));
                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);

                let curPoints = client.points.get(key, `points`);
                let neededPoints = client.points.get(key, `neededpoints`);
                while(curPoints > neededPoints) {
                    client.points.set(key, curPoints - neededPoints, `points`); //set points to 0
                    client.points.inc(key, `level`); //add 1 to level
                    //HARDING UP!
                    const newLevel = client.points.get(key, `level`); //get current NEW level
                    if (newLevel % 4 === 0) client.points.math(key, `+`, 100, `neededpoints`)
                    curPoints = client.points.get(key, `points`);
                    neededPoints = client.points.get(key, `neededpoints`);
                }
                let leftpoints = neededPoints - curPoints;
                if (!args[1] && !amount) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable34"]));
                if(Number(args[1]) > 10000 || Number(args[1]) < -10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable35"]))
                if (!amount) amount = Number(args[1]);
                if (amount < 0) removepoints(amount);
                let toaddpoints = amount;
                addingpoints(toaddpoints, leftpoints);

                function addingpoints(toaddpoints, leftpoints) {
                    if (toaddpoints >= leftpoints) {
                        client.points.set(key, 0, `points`); //set points to 0
                        client.points.inc(key, `level`); //add 1 to level
                        //HARDING UP!
                        const newLevel = client.points.get(key, `level`); //get current NEW level
                        if (newLevel % 4 === 0) client.points.math(key, `+`, 100, `neededpoints`)

                        const newneededPoints = client.points.get(key, `neededpoints`); //get NEW needed Points
                        const newPoints = client.points.get(key, `points`); //get current NEW points

                        //THE INFORMATION EMBED 
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable36"]))
                            .setColor(embedcolor);
                        //send ping and embed message only IF the adding will be completed!
                        if (toaddpoints - leftpoints < newneededPoints)
                        message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});

                        addingpoints(toaddpoints - leftpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                    } else {
                        client.points.math(key, `+`, Number(toaddpoints), `points`)
                    }
                }


                const embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable37"]))
                message.reply({embeds: [embed]});
                rank(rankuser); //also sending the rankcard
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable38"]));
            }
        }

        function setpoints() {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable39"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable40"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable41"]));
                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);

                let toaddpoints = Number(args[1]);
                if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable42"]));
                if(Number(args[1]) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable43"]))
                if (Number(args[1]) < 0) args[1] = 0;
                const neededPoints = client.points.get(key, `neededpoints`);
                addingpoints(toaddpoints, neededPoints);

                function addingpoints(toaddpoints, neededPoints) {
                    if (toaddpoints >= neededPoints) {
                        client.points.set(key, 0, `points`); //set points to 0
                        client.points.inc(key, `level`); //add 1 to level
                        //HARDING UP!
                        const newLevel = client.points.get(key, `level`); //get current NEW level
                        if (newLevel % 4 === 0) client.points.math(key, `+`, 100, `neededpoints`)

                        const newneededPoints = client.points.get(key, `neededpoints`); //get NEW needed Points
                        const newPoints = client.points.get(key, `points`); //get current NEW points

                        //THE INFORMATION EMBED 
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable44"]))
                            .setColor(embedcolor);
                        //send ping and embed message
                            message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});

                        addingpoints(toaddpoints - neededPoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                    } else {
                        client.points.set(key, Number(toaddpoints), `points`)
                    }
                }

                const embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable45"]))
                message.channel.send({embeds: [embed]}).catch(() => {});
                rank(rankuser); //also sending the rankcard
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable46"]));
            }
        }

        function removepoints(amount) {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable47"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable48"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable49"]));
                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);

                const curPoints = client.points.get(key, `points`);
                const neededPoints = client.points.get(key, `neededpoints`);

                if (!args[1] && !amount) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable50"]));
                if (!amount) amount = Number(args[1]);
                if(Number(args[1]) > 10000 || Number(args[1]) < -10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable51"]))
                if (amount < 0) addpoints(amount);
                
                removingpoints(amount, curPoints);

                function removingpoints(amount, curPoints) {
                    if (amount > curPoints) {
                        let removedpoints = amount - curPoints - 1;
                        client.points.set(key, neededPoints - 1, `points`); //set points to 0
                        if (client.points.get(key, `level`) == 1) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable52"]));
                        client.points.dec(key, `level`); //remove 1 from level
                        //HARDING UP!
                        const newLevel = client.points.get(key, `level`); //get current NEW level
                        if ((newLevel + 1) % 4 === 0) { //if old level was divideable by 4 set neededpoints && points -100
                            client.points.math(key, `-`, 100, `points`)
                            client.points.math(key, `-`, 100, `neededpoints`)
                        }

                        const newneededPoints = client.points.get(key, `neededpoints`); //get NEW needed Points
                        const newPoints = client.points.get(key, `points`); //get current NEW points

                        //THE INFORMATION EMBED 
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable53"]))
                            .setColor(embedcolor);
                        //send ping and embed message only IF the removing will be completed!
                        if (amount - removedpoints < neededPoints)
                            message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});

                        removingpoints(amount - removedpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                    } else {
                        client.points.math(key, `-`, Number(amount), `points`)
                    }
                }

                const embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable54"]))
                message.reply({embeds: [embed]});
                rank(rankuser); //also sending the rankcard
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable55"]));
            }
        }

        function addlevel() {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable56"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable57"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable58"]));

                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);
                let newLevel = client.points.get(key, `level`);
                if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable59"]));
                if(Number(args[1]) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable60"]))
                if (Number(args[1]) < 0) args[1] = 0;
                for (let i = 0; i < Number(args[1]); i++) {
                    client.points.set(key, 0, `points`); //set points to 0
                    client.points.inc(key, `level`); //add 1 to level
                    //HARDING UP!
                    newLevel = client.points.get(key, `level`); //get current NEW level
                    if (newLevel % 4 === 0) client.points.math(key, `+`, 100, `neededpoints`)
                }
                const newneededPoints = client.points.get(key, `neededpoints`); //get NEW needed Points
                const newPoints = client.points.get(key, `points`); //get current NEW points

                //THE INFORMATION EMBED 
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable61"]))
                    .setColor(embedcolor);
                    message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});
                rank(rankuser); //also sending the rankcard
                const sssembed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable62"]))
                message.reply(sssembed);
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable63"]));
            }
        }

        function setlevel() {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable64"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable65"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable66"]));

                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);

                if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable67"]));
                if (Number(args[1]) < 1) args[1] = 1;
                
                if(Number(args[1]) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable68"]))

                client.points.set(key, Number(args[1]), `level`); //set level to the wanted level
                client.points.set(key, 0, `points`); //set the points to 0

                let newLevel = client.points.get(key, `level`); //set level to the wanted level
                let counter = Number(newLevel) / 4;

                client.points.set(key, 400, `neededpoints`) //set neededpoints to 0 for beeing sure
                //add 100 for each divideable 4
                for (let i = 0; i < Math.floor(counter); i++) {
                    client.points.math(key, `+`, 100, `neededpoints`)
                }
                const newneededPoints = client.points.get(key, `neededpoints`); //get NEW needed Points

                const newPoints = client.points.get(key, `points`); //get current NEW points
                //THE INFORMATION EMBED 
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable69"]))
                    .setColor(embedcolor);
                    message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});
                rank(rankuser); //also sending the rankcard
                const sssembed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable70"]))
                message.reply(sssembed);
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable71"]));
            }
        }

        function removelevel() {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable72"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable73"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable74"]));

                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);
                let newLevel = client.points.get(key, `level`);
                if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable75"]));
                if (Number(args[1]) < 0) args[1] = 0;
                for (let i = 0; i < Number(args[1]); i++) {
                    client.points.set(key, 0, `points`); //set points to 0
                    client.points.dec(key, `level`); //add 1 to level
                    //HARDING UP!
                    newLevel = client.points.get(key, `level`); //get current NEW level
                    if(newLevel < 1) client.points.set(key, 1 ,`level`); //if smaller then 1 set to 1
                }
                snewLevel = client.points.get(key, `level`); //get current NEW level
                let counter = Number(snewLevel) / 4;

                client.points.set(key, 400, `neededpoints`) //set neededpoints to 0 for beeing sure
                //add 100 for each divideable 4
                for (let i = 0; i < Math.floor(counter); i++) {
                    client.points.math(key, `+`, 100, `neededpoints`)
                }
                const newneededPoints = client.points.get(key, `neededpoints`); //get NEW needed Points
                const newPoints = client.points.get(key, `points`); //get current NEW points

                //THE INFORMATION EMBED 
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable76"]))
                    .setColor(embedcolor);
                    message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});
                rank(rankuser); //also sending the rankcard
                const sssembed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable77"]))
                message.reply(sssembed);
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable78"]));
            }
        }

        function resetranking() {
            try {
                /**
                 * GET the Rank User
                 * @info you can tag him
                 */
                if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable79"]));
                let rankuser = message.mentions.users.first();
                if (!rankuser) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable80"]));
                // if(rankuser.bot) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable81"]));
                
                //Call the databasing function!
                const key = `${message.guild.id}-${rankuser.id}`;
                databasing(rankuser);

                client.points.set(key, 1, `level`); //set level to 0
                client.points.set(key, 0, `points`); //set the points to 0
                client.points.set(key, 400, `neededpoints`) //set neededpoints to 0 for beeing sure
                client.points.set(key, "", `oldmessage`); //set old message to 0

                //THE INFORMATION EMBED 
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable82"]))
                    .setColor(embedcolor);
                    message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => {});
                rank(rankuser); //also sending the rankcard
                const sssembed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable83"]))
                message.reply(sssembed);
            } catch (error) {
                console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable84"]));
            }
        }

        function registerall() {
            let allmembers = message.guild.members.cache.map(i => i.id).slice(0, 100);
            for (let i = 0; i < allmembers.length; i++) {
                //Call the databasing function!
                let rankuser = message.guild.members.cache.get(allmembers[i]).user;
                databasing(rankuser);
            }
            const embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable85"]))
            message.reply({content: `I limited the MAXIMUM MEMBERS to 100`,embeds: [embed]});
        }

        function resetrankingall() {
            const filtered = client.points.filter(p => p.guild === message.guild.id && (p.points > 0 || p.level > 1)).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
            let allmembers = message.guild.members.cache.map(i => i.id).filter(d=>filtered.map(d => d.user).includes(d));
            for (let i = 0; i < allmembers.length; i++) {
                let rankmember = message.guild.members.cache.get(allmembers[i])
                if(!rankmember) continue;
                let rankuser = rankmember.user;
                const key = `${message.guild.id}-${rankuser.id}`;
                if(client.points.has(key)) {
                    client.points.set(key, 1, `level`); //set level to 0
                    client.points.set(key, 0, `points`); //set the points to 0
                    client.points.set(key, 400, `neededpoints`) //set neededpoints to 0 for beeing sure
                    client.points.set(key, "", `oldmessage`); //set old message to 0
                }
            }
            const embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable86"]))
            message.reply({embeds: [embed]});
        }

        function addrandomall() {
            let maxnum = 5;
            if (args[0]) maxnum = Number(args[0]);
            if(args[0] && Number(maxnum) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable87"]))
            let allmembers = message.guild.members.cache.filter(member=> !member.user.bot).keyArray();
            for (let i = 0; i < allmembers.length; i++) {
                //Call the databasing function!
                let rankuser = message.guild.members.cache.get(allmembers[i]).user;
                if(rankuser.bot) continue;
                if(!client.points.has(`${message.guild.id}-${rankuser.id}`)) continue;
                Giving_Ranking_Points(`${message.guild.id}-${rankuser.id}`, maxnum);
                Giving_Ranking_Points(`${message.guild.id}-${message.author.id}`, maxnum);
            }
            const embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable88"]))
            message.reply({embeds: [embed]});
        }

        function levelinghelp() {
            const embed = new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable89"]))
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable90"]))
                .setColor(embedcolor)
                .addFields([{
                        name: "`rank [@User]`",
                        value: ">>> *Shows the Rank of a User*",
                        inline: true
                    },
                    {
                        name: "`leaderboard`",
                        value: ">>> *Shows the Top 10 Leaderboard*",
                        inline: true
                    },
                    {
                        name: "`setxpcounter <@USER> <AMOUNT>`",
                        value: ">>> *Changes the amount of how much to count, x1, x2, x3, ...*",
                        inline: true
                    },

                    {
                        name: "`addpoints <@User> <Amount`",
                        value: ">>> *Add a specific amount of Points to a User*",
                        inline: true
                    },
                    {
                        name: "`setpoints <@User> <Amount`",
                        value: ">>> *Set a specific amount of Points to a User*",
                        inline: true
                    },
                    {
                        name: "`removepoints <@User> <Amount`",
                        value: ">>> *Remove a specific amount of Points to a User*",
                        inline: true
                    },

                    {
                        name: "`addlevel <@User> <Amount`",
                        value: ">>> *Add a specific amount of Levels to a User*",
                        inline: true
                    },
                    {
                        name: "`setlevel <@User> <Amount`",
                        value: ">>> *Set a specific amount of Levels to a User*",
                        inline: true
                    },
                    {
                        name: "`removelevel <@User> <Amount`",
                        value: ">>> *Remove a specific amount of Levels to a User*",
                        inline: true
                    },

                    {
                        name: "`resetranking <@User>`",
                        value: ">>> *Resets the ranking of a User*",
                        inline: true
                    },
                    {
                        name: "`setglobalxpcounter <AMOUNT>`",
                        value: ">>> *Sets the global xp counter for this guild, standard 1*",
                        inline: true
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: true
                    },

                    {
                        name: "`registerall`",
                        value: ">>> *Register everyone in the Server to the Database*",
                        inline: true
                    },
                    {
                        name: "`resetrankingall`",
                        value: ">>> *Reset ranking of everyone in this Server*",
                        inline: true
                    },
                    {
                        name: "`addrandomall`",
                        value: ">>> *Add a random amount of Points to everyone*",
                        inline: true
                    }
                ])
            message.channel.send({embeds: [embed]}).catch(() => {})
        }

        }catch(e){console.log("ranking: " + e)}
    })
    client.points.ensure("Voicerank", {
        voicerank:{}    
    })
    let voiceStates = client.points.get("Voicerank", "voicerank")

    client.on("ready", () => {
        setTimeout(()=>{
            //For each guild, set the voice state into the db if there are none
            client.guilds.cache.each(g => {
                let guild = client.guilds.cache.get(g.id)
                if(guild && guild.voiceStates) {
                    guild.voiceStates.cache.map(voiceState => voiceState.id).forEach(id=>{
                        if(!voiceStates[id]){
                            voiceStates[id] = new Date();
                        }
                    })
                }
            })
            client.points.set("Voicerank", voiceStates, "voicerank")
        }, 1500)
    })


    client.on("voiceStateUpdate", async (oldState, newState) => {
      if(!newState.guild || !newState.member.user || newState.member.user.bot) return;
      var { id } = oldState // This is the user"s ID
      if (!oldState.channel) {
        // The user has joined a voice channel
        voiceStates[id] = new Date()
        voiceStates = client.points.set("Voicerank", voiceStates, "voicerank")
        voiceStates = client.points.get("Voicerank", "voicerank")
      } 
      // The User has left a voice Channel
      else if (!newState.channel) {
        var now = new Date();
        var joined = voiceStates[id] || new Date();
        var connectedTime = now.getTime() - joined.getTime();
        //Grant Coints!
        if(connectedTime > 60000){
            if (newState.member.user.bot || !newState.guild) return;
            client.setups.ensure(newState.guild.id,  {
                ranking: {
                    enabled: true,
                    backgroundimage: "null",
                }
            });
            let ranking = client.setups.get(newState.guild.id, "ranking");
            if(!ranking.enabled) return;
            const key = `${newState.guild.id}-${newState.member.user.id}`;
            client.points.ensure(key, {
                user: newState.member.user.id,
                usertag: newState.member.user.tag,
                xpcounter: 1,
                guild: newState.guild.id,
                points: 0,
                neededpoints: 400,
                level: 1,
                voicepoints: 0,
                neededvoicepoints: 400,
                voicelevel: 1,
                voicetime: 0,
                oldmessage: "",
            });
            client.points.set(key, newState.member.user.tag, `usertag`); 
            let VoicePoints = 0;
            for(let i = 0; i < (connectedTime / 60000); i++) {
                VoicePoints += 5;
            }
            client.points.math(key, "+", Math.floor(connectedTime / 60000), `voicetime`); 
            //console.log("CONNECTED TIME: " + Math.floor(connectedTime / 60000) + "min | " + "POINTS FOR IT: " + VoicePoints);
            let curPoints = client.points.get(key, `voicepoints`);
            let neededPoints = client.points.get(key, `neededvoicepoints`);
            while(curPoints > neededPoints) {
                client.points.set(key, curPoints - neededPoints, `voicepoints`); //set points to 0
                client.points.inc(key, `voicelevel`); //add 1 to level
                //HARDING UP!
                const newLevel = client.points.get(key, `voicelevel`); //get current NEW level
                if (newLevel % 4 === 0) client.points.math(key, `+`, 100, `neededvoicepoints`)
                curPoints = client.points.get(key, `voicepoints`);
                neededPoints = client.points.get(key, `neededvoicepoints`);
            }
            let leftpoints = neededPoints - curPoints;
            let toaddpoints = VoicePoints;
            addingpoints(toaddpoints, leftpoints);
            function addingpoints(toaddpoints, leftpoints) {
                if (toaddpoints >= leftpoints) {
                    client.points.set(key, 0, `voicepoints`); //set points to 0
                    client.points.inc(key, `voicelevel`); //add 1 to level
                    //HARDING UP!
                    const newLevel = client.points.get(key, `voicelevel`); //get current NEW level
                    if (newLevel % 4 === 0) client.points.math(key, `+`, 100, `neededvoicepoints`)
                    const newneededPoints = client.points.get(key, `neededvoicepoints`); //get NEW needed Points
                    addingpoints(toaddpoints - leftpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                } else {
                    client.points.math(key, `+`, Number(toaddpoints), `voicepoints`)
                }
            }
        } else {
            //console.log(`Not enough connected time: ${connectedTime}`)
        }
        //try to remove him from the db
        try{
            delete voiceStates[id]; 
            voiceStates = client.points.set("Voicerank", voiceStates, "voicerank")
            voiceStates = client.points.get("Voicerank", "voicerank")
        }catch (e){
            
        }
      }
    })

}
//Coded by Tomato#6966!
function shortenLargeNumber(num, digits) {
    var units = ["k", "M", "G", "T", "P", "E", "Z", "Y"],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
}
function cduration(duration) {
    let remain = duration * 60 * 1000;
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
    let time = {
    days,
    hours,
    minutes,
    seconds,
    };
    let parts = []
    if (time.days) {
    let ret = time.days + ' D'
    parts.push(ret)
    }
    if (time.hours) {
    let ret = time.hours + ' H'
    parts.push(ret)
    }
    if (time.minutes) {
    let ret = time.minutes + ' M'
    parts.push(ret)

    }
    if (time.seconds) {
    let ret = time.seconds + ' S'
    parts.push(ret)
    }
    if (parts.length === 0) {
        return ['instantly']
    } else {
        return parts
    }
}
