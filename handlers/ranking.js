const config = require(`${process.cwd()}/botconfig/config.json`)
const canvacord = require("canvacord");
const Discord = require("discord.js");
const Canvas = require("canvas");
const { dbEnsure, GetUser, duration, nFormatter, swap_pages2 } = require(`./functions`)

//Canvas.registerFont( "./assets/fonts/DMSans-Bold.ttf" , { family: "DM Sans", weight: "bold" } );
//Canvas.registerFont( "./assets/fonts/DMSans-Regular.ttf" , { family: "DM Sans", weight: "regular" } );
//Canvas.registerFont( "./assets/fonts/STIXGeneral.ttf" , { family: "STIXGeneral" } );
//Canvas.registerFont( "./assets/fonts/AppleSymbol.ttf" , { family: "AppleSymbol" } );
//Canvas.registerFont( "./assets/fonts/Arial.ttf"       , { family: "Arial" } );
//Canvas.registerFont( "./assets/fonts/ArialUnicode.ttf", { family: "ArielUnicode" } );
//Canvas.registerFont("./assets/fonts/Genta.ttf", { family: "Genta" } );
//Canvas.registerFont("./assets/fonts/UbuntuMono.ttf", { family: "UbuntuMono" } );
const Fonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
module.exports = async function (client) {
    // Text Rank
    
    module.exports.messageCreate = async (client, message, guild_settings, setups) => {
        try{

            if (!message.author || message.author?.bot || !message.guild || !message.guild.id) return;
            
            if(!setups || !setups.ranking) {
                await dbEnsure(client.setups, message.guild.id,  {
                    ranking: {
                        enabled: true,
                        backgroundimage: "null",
                    }
                });
                if(!setups) {
                    setups = {};
                }
                if(!setups.ranking) {
                    setups.ranking = {
                        enabled: true,
                        backgroundimage: "null",
                    }
                }
                    
            }
    
            
            let guildsettings = guild_settings;
            const prefix = guildsettings?.prefix || config.prefix;
            const embedcolor = guildsettings?.embed?.color || "#fffff9";
            let ls = guildsettings?.language || "en";
            let ranking = setups.ranking;
            
            if(!ranking || !ranking.enabled) return console.log("RANKING DISABLED", ranking, message.guild.id);
            const key = `${message.guild.id}_${message.author?.id}`;
    
            async function databasing(rankuser) {
                return new Promise(async (res) => {
                    try{
                        //if(rankuser && rankuser.bot) return console.log("GOTTA IGNORE BOT")
                        await dbEnsure(client.points, rankuser ? `${message.guild.id}_${rankuser.id}` : `${message.guild.id}_${message.author?.id}`, {
                            user: rankuser ? rankuser.id : message.author?.id,
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
                        await client.points.set(rankuser ? `${message.guild.id}_${rankuser.id}.usertag` : `${message.guild.id}_${message.author?.id}.usertag`, rankuser ? rankuser.tag : message.author.tag);
                        await dbEnsure(client.points, message.guild.id, {setglobalxpcounter: 1}); 
                        await dbEnsure(client.points, message.guild.id, {
                            channel: false,
                            disabled: false
                        })
                    }catch(e){
                        console.error(e)
                    }
                    res(true);
                })
            }
            await databasing(message.author);
    
         
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            let command = args.shift()
            if(message.content.startsWith(prefix) && (!command || command.length == 0)) return
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
                    if (timestamps.has(message.author?.id)) { //if the user is on cooldown
                        const expirationTime = timestamps.get(message.author?.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
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
                    case `rankvoice`:
                    case `voicerank`:
                    case `rank`:
                        try{
                            await message.guild.members.fetch().catch(() => null);
                            let user = await GetUser(message, args)
                            console.log("GETTING RANK")
                            rank(user, "text");
                        }catch (e){
                            message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
                        }
                        break;
                    /*case `rankvoice`:
                    case `voicerank`: 
                    try{
                        await message.guild.members.fetch().catch(() => null);
                        let user = await GetUser(message, args)
                        rank(user, "voice");
                    }catch (e){
                        message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
                    }
                    break;*/
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
                    if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable1"]))
                        setxpcounter();
                    break; 
                        /////////////////////////////////
                    case `setglobalxpcounter`: 
                    if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable2"]))
                        setglobalxpcounter();
                    break; 
                        /////////////////////////////////
                    case `addpoints`:
                        if(message.author?.id == "442355791412854784") return addpoints();
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable3"]))
                        addpoints();
                        break;
                        /////////////////////////////////
                    case `setpoints`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable4"]))
    
                        setpoints();
                        break;
                        /////////////////////////////////
                    case `removepoints`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable5"]))
    
                        removepoints();
                        break;
                        /////////////////////////////////
                    case `addlevel`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable6"]))
    
                        addlevel();
                        break;
                        /////////////////////////////////
                    case `setlevel`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable7"]))
    
                        setlevel();
                        break;
                        /////////////////////////////////
                    case `removelevel`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable8"]))
    
                        removelevel();
                        break;
                        /////////////////////////////////
                    case `resetranking`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable9"]))
    
                        resetranking();
                        break;
                        /////////////////////////////////
                    case `registerall`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable10"]))
    
                        registerall();
                        break;
                        /////////////////////////////////
                    case `addrandomall`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable11"]))
    
                        addrandomall();
                        break;
                        /////////////////////////////////
                    case `resetrankingall`:
                        if (!message.member?.permissions?.has("ADMINISTRATOR") || !message.member?.permissions?.has("MANAGE_GUILD")) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable12"]))
    
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
    
    
            async function anti_double_messages() {
                const oldmessage = await client.points.get(`${key}.oldmessage`);
                if (oldmessage?.toLowerCase() === message.content.toLowerCase().replace(/\s+/g, "")) {
                    return;
                }
                await client.points.set(`${key}.oldmessage`, message.content.toLowerCase().replace(/\s+/g, "")); //setting the new old message
            }
            await anti_double_messages();
    
            async function Giving_Ranking_Points(thekey, maxnumber = 5) {
                if(!thekey && message.author?.bot) return;
                let setglobalxpcounter = await client.points.get(`${message.guild.id}.setglobalxpcounter`)
                if(!setglobalxpcounter || setglobalxpcounter <= 0) setglobalxpcounter = 1;
                let xpcounter = await client.points.get(`${key}.xpcounter`)
                if(!xpcounter || xpcounter <= 0) xpcounter = 1;
                var randomnum = ( Math.floor(Math.random() * Number(maxnumber)) + 1 ) * setglobalxpcounter;
                randomnum *= Number(xpcounter);
                randomnum = Number(Math.floor(randomnum));
    
                const curPoints = await client.points.get(`${thekey ? thekey : key}.points`);
                let neededPoints = await client.points.get(`${thekey ? thekey : key}.neededpoints`);
                if(neededPoints < 400) {
                    neededPoints = 400;
                    await client.points.set(`${thekey ? thekey : key}.neededpoints`,neededPoints );
                }
                let leftpoints = neededPoints - curPoints;
    
                let toaddpoints = randomnum;
                addingpoints(toaddpoints, leftpoints);
    
                async function addingpoints(toaddpoints, leftpoints) {
                    if (toaddpoints >= leftpoints) {
                        await client.points.set(`${thekey ? thekey : key}.points`, 1); //set points to 0
                        await client.points.add(`${thekey ? thekey : key}.level`, 1); //add 1 to level
                        //HARDING UP!
                        const newLevel = await client.points.get(`${thekey ? thekey : key}.level`); //get current NEW level
                        if (newLevel % 4 === 0) await client.points.add(`${thekey ? thekey : key}.neededpoints`, 100)
    
                        const newneededPoints = await client.points.get(`${thekey ? thekey : key}.neededpoints`); //get NEW needed Points
                        
                        await addingpoints(toaddpoints - leftpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                        await LEVELUP() 
                    } else {
                        await client.points.add(`${thekey ? thekey : key}.points`, Number(toaddpoints))
                    }
                }
            }
            await Giving_Ranking_Points();
    
                    
            async function LEVELUP(thekey) {
                const newLevel = await client.points.get(`${thekey ? thekey : key}.level`); //get current NEW level
                const newPoints = await client.points.get(`${thekey ? thekey : key}.points`); //get current NEW points
                const newneededPoints = await client.points.get(`${thekey ? thekey : key}.neededpoints`);
                //send ping and embed message
                try {
                    await dbEnsure(client.points, message.guild.id, {
                        rankroles: { }
                    })
                    let RankRoles = await client.points.get(message.guild.id + ".rankroles");
                    if(RankRoles[Number(newLevel)]){
                        await message.member.roles.add(RankRoles[Number(newLevel)]).catch(() => null)
                    }
                }catch (e){ }
                let disabled = await client.points.get(message.guild.id + ".disabled");
                if(disabled) return;
    
                const filtered = await client.points.all().then(d => d.filter(p => p.data?.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data));
                const sorted = filtered
                .sort((a, b) => { 
                    if(b?.points) return b?.level - a.level || b?.points - a.points;
                    else return b?.level - a.level || -1
                }) 
                .sort((a, b) => b?.level - a.level || b?.points - a.points);
                const top10 = sorted.slice(0, message.guild.memberCount);
    
                let i = 0;
                //count server rank sometimes an error comes
                for (const data of top10) {
                    try {
                        i++;
                        if (data.user === message.author?.id) break; //if its the right one then break it ;)
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
                if (text.length > 15) text = text.substring(0, 11) + ".."
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
                const chID = await client.points.get(message.guild.id + ".channel");
                if(!chID && message.channel) return message.channel.send({content: `${message.author}`, files: [attachment]}).catch(() => null)
                try {
                    let channel = message.guild.channels.cache.get(chID);
                    if(!channel && message.channel){
                        return message.channel.send({content: `${message.author}`, files: [attachment]}).catch(() => null)
                    } 
                    else if (chanel) channel.send({content: `${message.author}`, files: [attachment]}).catch(() => null)
                }catch (e){
                    message.channel.send({content: `${message.author}`, files: [attachment]}).catch(() => null)
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
                    let rankMember = message.guild.members.cache.get(rankuser.id) || await message.guild.members.fetch(rankuser.id).catch(() => null);
                    const status = rankMember ? rankMember.presence?.status || "offline" : "offline";
                    const statusimgs = {
                        "online": "https://cdn.discordapp.com/attachments/886876093418713129/959116532426866748/Online.png",
                        "offline": "https://cdn.discordapp.com/attachments/886876093418713129/959116533236367410/offline.png",
                        "idle": "https://cdn.discordapp.com/attachments/886876093418713129/959116532846301284/idle.png",
                        "dnd": "https://cdn.discordapp.com/attachments/886876093418713129/959116532615639080/dnd.png"
                    }
                    
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
                    let theDbDatas = [["level", "points", "neededpoints"], ["voicelevel", "voicepoints", "neededvoicepoints"]]
                    let tempmessage = await message.channel.send(`📊 *Getting the RANK-DATA of: **${rankuser.tag}** ...*`)
                    
                    /**
                     * TEXT RANK
                     */
                    const filtered = await client.points.all().then(d => d.filter(p => p.data?.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data));
                    const sortedText = filtered
                    .sort((a, b) => { 
                        if(b[`${theDbDatas[0][1]}`]) return b[`${theDbDatas[0][0]}`] - a[`${theDbDatas[0][0]}`] || b[`${theDbDatas[0][1]}`] - a[`${theDbDatas[0][1]}`];
                        else return b[`${theDbDatas[0][0]}`] - a[`${theDbDatas[0][0]}`] || -1
                    }) 
                    let RankText = sortedText.splice(0, message.guild.memberCount).findIndex(d => d.user == rankuser.id) + 1;
    
                    let rankdata = await client.points.get(key);
                    if(!rankdata || !rankdata[theDbDatas[0][1]] || !rankdata[theDbDatas[0][2]] || !rankdata[theDbDatas[1][1]] || !rankdata[theDbDatas[1][2]]) {
                        if(!rankdata || !rankdata[theDbDatas[0][1]]) await client.points.set(`${key}.${theDbDatas[0][1]}`, 1);
                        if(!rankdata || !rankdata[theDbDatas[0][2]]) await client.points.set(`${key}.${theDbDatas[0][2]}`, 1);
                        if(!rankdata || !rankdata[theDbDatas[1][1]]) await client.points.set(`${key}.${theDbDatas[1][1]}`, 1);
                        if(!rankdata || !rankdata[theDbDatas[1][2]]) await client.points.set(`${key}.${theDbDatas[1][2]}`, 1);
                        
                        rankdata = await client.points.get(key);
                    }
                    let curLevelText = Number(rankdata[theDbDatas[0][0]]?.toFixed(0));
                    let curpointsText = Number(rankdata[theDbDatas[0][1]]?.toFixed(2));
                    let curnextlevelText = Number(rankdata[theDbDatas[0][2]]?.toFixed(2));
                    if (curLevelText === undefined) RankText = `NaN`;
                    
                    /**
                     * VOICE RANK
                     */
                    const sortedVoice = filtered
                    .sort((a, b) => { 
                        if(b[`${theDbDatas[1][1]}`]) return b[`${theDbDatas[1][0]}`] - a[`${theDbDatas[1][0]}`] || b[`${theDbDatas[1][1]}`] - a[`${theDbDatas[1][1]}`];
                        else return b[`${theDbDatas[1][0]}`] - a[`${theDbDatas[1][0]}`] || -1
                    }) 
                    let RankVoice = sortedVoice.splice(0, message.guild.memberCount).findIndex(d => d.user == rankuser.id) + 1;
    
                    let curLevelVoice = Number(rankdata[theDbDatas[1][0]]?.toFixed(0))
                    let curpointsVoice = Number(rankdata[theDbDatas[1][1]]?.toFixed(2));
                    let curnextlevelVoice = Number(rankdata[theDbDatas[1][2]]?.toFixed(2));
                    if (curLevelVoice === undefined) RankVoice = `NaN`;
                    
    
                    
                    var xp_data = {
                        avatar: rankMember && rankMember.avatar ? rankMember.displayAvatarURL({ dynamic: false, format: "png", size: 4096 }) : rankuser.displayAvatarURL({ dynamic: false, format: "png", size: 4096 }),
                        text: {
                            cur_level: Number(curLevelText),
                            rank: Number(RankText),
                            current: Number(curpointsText.toFixed(2)),
                            needed: Number(curnextlevelText.toFixed(2)),
                            percent: Number(Number(curpointsText.toFixed(2)) / Number(curnextlevelText.toFixed(2)) * 100).toFixed(2),
                        },
                        voice: {
                            cur_level: Number(curLevelVoice),
                            rank: Number(RankVoice),
                            current: Number(curpointsVoice.toFixed(2)),
                            needed: Number(curnextlevelVoice.toFixed(2)),
                            percent: Number(Number(curpointsVoice.toFixed(2)) / Number(curnextlevelVoice.toFixed(2)) * 100).toFixed(2),
                        }
                    }
                    /**
                     * GET THE USERBANNER
                     */
    
                    let banner = null;
                    try {
                        await rankuser.fetch().then(u => u.banner ? banner = rankuser.bannerURL({dynamic: false, format: "png", size: 4096}) : banner = false);
                        if(!banner) await rankMember.fetch().then(u => u.banner ? banner = rankuser.bannerURL({dynamic: false, format: "png", size: 4096}) : banner = false);
                    }catch(e){console.error(e)}
    /*
                    if(banner){
                        const BannerBg = await Canvas.loadImage(banner)
                        ctx.drawImage(BannerBg, 0, 0, canvas.width, canvas.height );
                    }
    */
                    /**
                     * DRAWING THE BACKGROUND
                     */
                    createRankCard().then(canvas => {
                        const VoiceTime = rankdata.voicetime ? duration(Number(rankdata.voicetime * 60 * 1000)).map(i=>`\`${i}\``).join(", ") : "0 Mins"
                        return tempmessage.edit({
                            content: `${tempmessage.content}\n**User's Connected Time:** ${VoiceTime}\n**Note:** *\`You only gain Points, if you leave the Channel!\`*`,
                            files:[new Discord.MessageAttachment( canvas.toBuffer(), "card.png" )]}).catch(() => null);
                    }).catch(e => {
                        return tempmessage.edit({
                            content: `\`\`\`${String(e.message ? e.message : e).substring(0, 990)}\`\`\``,
                        }).catch(() => null);
                    })
                    
    
                    async function createRankCard() {
                        return new Promise(async (res, rej) => {
                            try{
                                const canvas = Canvas.createCanvas(3768, 2144);
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
    
                                /**
                                 * DRAWING THE FLAGS
                                 */
                                if(rankuser?.bot){
                                    const FlagsX = 635;
                                    const FlagsY = 1850;
                                    const SizeY = 200;
                                    const SizeX = rankuser.flags && rankuser.flags.toArray().includes("VERIFIED_BOT") ? 400 : 301.1765
                                    let bgIMG = rankuser.flags && rankuser.flags.toArray().includes("VERIFIED_BOT") ? "https://cdn.discordapp.com/emojis/846290690534015018.png" : "https://cdn.discordapp.com/attachments/820695790170275871/869218298833829948/bot.png"
                                    const bg = await Canvas.loadImage(bgIMG)
                                    ctx.drawImage(bg, FlagsX-SizeX/2, FlagsY-SizeY/2, SizeX, SizeY);
                                }
                                else{
                                    if(rankuser.flags) {
                                        let flags = rankuser.flags.toArray();
                                        let member = rankMember
                                        if(member.premiumSinceTimestamp && member.roles.cache.has(message.guild.roles.premiumSubscriberRole?.id)) {
                                            const getMonths = (t1, t2) => Math.floor((t1-t2)/1000/60/60/24/30) 
                                            const difference = getMonths(Date.now(), member.premiumSinceTimestamp);
                                            if(difference >= 24){
                                                flags.push("24_MONTH")
                                            } else if(difference >= 18){
                                                flags.push("18_MONTH")
                                            } else if(difference >= 15){
                                                flags.push("15_MONTH")
                                            } else if(difference >= 12){
                                                flags.push("12_MONTH")
                                            } else if(difference >= 9){
                                                flags.push("9_MONTH")
                                            } else if(difference >= 6){
                                                flags.push("6_MONTH")
                                            } else if(difference >= 3){
                                                flags.push("3_MONTH")
                                            } else if(difference >= 2){
                                                flags.push("2_MONTH")
                                            } else {
                                                flags.push("1_MONTH")
                                            }
                                        }
                                        if(flags.includes("EARLY_VERIFIED_DEVELOPER")){
                                            const index = flags.indexOf("EARLY_VERIFIED_DEVELOPER");
                                            if(index > -1){
                                                flags.splice(index, 1);
                                            }
                                        }
                                        
                                        //NITRO MUST BE ADDED AT THE END
                                        if(member.avatar || banner || rankuser.displayAvatarURL({dynamic:true}).endsWith(".gif")) flags.push("NITRO")
                                        
                                        for (let i = 0; i< flags.length; i++){
                                            const Size = 200;
                                            const spaceBetween = 60;
                                            const x = 635 + i * Size + i * spaceBetween - (flags.length == 1 ? 0 : flags.length == 2 ? 1.5 * Size/2 : 3 * Size/2);
                                            const y = 1850;
                                            if (flags[i] === "HOUSE_BALANCE") { 
                                                const bg = await Canvas.loadImage("https://discord.com/assets/9fdc63ef8a3cc1617c7586286c34e4f1.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size); 
                                            } 
                                            if (flags[i]  === "HOUSE_BRILLIANCE") { 
                                                const bg = await Canvas.loadImage("https://discord.com/assets/48cf0556d93901c8cb16317be2436523.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            } 
                                            if (flags[i]  === "HOUSE_BRAVERY") { 
                                                const bg = await Canvas.loadImage("https://discord.com/assets/64ae1208b6aefc0a0c3681e6be36f0ff.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            } 
                                            if (flags[i]  === "VERIFIED_DEVELOPER") { 
                                                const bg = await Canvas.loadImage("https://discord.com/assets/45cd06af582dcd3c6b79370b4e3630de.svg")
                                                ctx.drawImage(bg, 480 + 80 * i, 175, 80, 80 ); 
                                            } 
                                            if (flags[i]  === "EARLY_SUPPORTER") { 
                                                const bg = await Canvas.loadImage("https://discord.com/assets/23e59d799436a73c024819f84ea0b627.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            } 
                                            if(flags[i]  === "NITRO"){
                                                const bg = await Canvas.loadImage("https://cdn.discordapp.com/attachments/820695790170275871/869228654775918662/813372466759598110.png")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size+Size/5, Size);
                                            }
                                            if(flags[i]  === "1_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/fbb6f1e160280f0e9aeb5d7c452eefe1.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "2_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/b4b741bef6c3de9b29e2e0653e294620.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "3_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/93f5a393e22796a850931483166d7cb9.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "6_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/4c380650960c2b1e1584115d5e9ad63b.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "9_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/438dd7ecbffcf21b6cbf2773ade51a04.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "12_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/7a5f78de816fcecbbd1d5d6e635cc7dd.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "15_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/5a24b20b84fb3eafc138916729386e76.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "18_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/f31d590e1f3629cd0b614330f4a8ee2a.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            }
                                            if(flags[i]  === "24_MONTH"){
                                                const bg = await Canvas.loadImage("https://discordapp.com/assets/9ba64f1fa91ccde0eba506c1c33f3d1a.svg")
                                                ctx.drawImage(bg, x-Size/2, y-Size/2, Size, Size);
                                            } 
                                        }
                                } 
                                }
    
                                ctx.restore();
                                ctx.save();
    
                                /**
                                 * DRAWING THE AVATAR
                                 */
                                const AvatarSize = 912; AvatarX = 167, AvatarY = 307;
    
                                // COLOR BACKGROUND
                                const grd = ctx.createLinearGradient(AvatarX, AvatarY, AvatarSize, AvatarSize );
                                grd.addColorStop(0, "#ff7b00");
                                grd.addColorStop(1, "#ff9d00");
                                ctx.lineWidth = 30;
                                ctx.fillStyle = grd;
                                ctx.strokeStyle = grd;
                                ctx.beginPath()
                                ctx.arc(AvatarX + AvatarSize/2, AvatarY + AvatarSize/2, AvatarSize/2+ ctx.lineWidth, 0, Math.PI * 2, false); 
                                ctx.closePath();
                                ctx.fill();
                                //Draw avatar
                                ctx.beginPath();
                                ctx.arc(AvatarX + AvatarSize/2, AvatarY + AvatarSize/2, AvatarSize/2, 0, Math.PI * 2, true); 
                                ctx.closePath();
                                ctx.clip();
                                const avatar = await Canvas.loadImage(xp_data.avatar);
                                ctx.drawImage(avatar, AvatarX, AvatarY, AvatarSize, AvatarSize);
    
                                //restore ctx
                                ctx.restore();

                                
                                /**
                                 * DRAWING THE STATUS
                                 */
                                const StatusSize = 195; StatusX = 867, StatusY = 960;
                                const statusImg = await Canvas.loadImage(statusimgs[status]);
                                ctx.drawImage(statusImg, StatusX, StatusY, StatusSize, StatusSize);


                                /**
                                 * DRAWING THE USERNAME
                                 */
                                const NameX = 635;
                                const NameY = 1530;
                                let fontsize = 250;
                                ctx.font = `bold ${fontsize}px ${Fonts}`;
                                ctx.fillStyle = "#ffffff"
                                const name = rankuser.username;
                                while(ctx.measureText(name).width > 1200-fontsize){
                                    const newFont = `bold ${ fontsize-- }px ${Fonts}`
                                    ctx.font = newFont;
                                }
                                const NameYSpace = fontsize/2;
                                const TextNameSize = ctx.measureText(name).width
                                canvacord.Util.renderEmoji(ctx, name, NameX -TextNameSize/2, NameY - fontsize/2 + NameYSpace)
    
                                /**
                                 * DRAWING THE DISCRIMINATOR
                                 */
                                const disriminator = "#"+ rankuser.discriminator
                                ctx.font = `bold 125px ${Fonts}`;
                                ctx.fillStyle = "#3d4459"
                                const TextDiscriminatorSize = ctx.measureText(disriminator).width
                                ctx.fillText(disriminator, NameX + TextNameSize/2 - TextDiscriminatorSize, NameY - fontsize/2 + NameYSpace + 150);
    
                                /**
                                 * DRAWING THE RANKS
                                 */
                                const TextRankX = 1985;
                                const TextRankY = 660;
                                const VoiceRankX = 1985;
                                const VoiceRankY = 1755;
                                ctx.fillStyle = "#ff9d00";
                                ctx.font = `bold italic 150px ${Fonts}`;
                                ctx.fillText(xp_data.text.rank, TextRankX , TextRankY);
                                ctx.fillText(xp_data.voice.rank, VoiceRankX , VoiceRankY);
    
                                /**
                                 * DRAWING THE LEVELS
                                 */
                                const TextLevelX = 3105;
                                const TextLevelY = 660;
                                const VoiceLevelX = 3105;
                                const VoiceLevelY = 1755;
                                ctx.fillStyle = "#ff9d00";
                                ctx.font = `bold italic 150px ${Fonts}`;
                                ctx.fillText(xp_data.text.cur_level, TextLevelX , TextLevelY);
                                ctx.fillText(xp_data.voice.cur_level, VoiceLevelX , VoiceLevelY);
    
                                await DrawProgressionBar("#ff9d00", "#ff7b00", 1550, 850, 2000, 125, xp_data.text.current, xp_data.text.needed, 3475, 835, "TEXT")
                                await DrawProgressionBar("#ff9d00", "#ff7b00", 1550, 1985, 2000, 125, xp_data.voice.current, xp_data.voice.needed, 3475, 1970, "VOICE")
                                
                                async function DrawProgressionBar(LeftColor, RightColor, StartX, StartY, Width, Height, current, Needed, ProgressionRightX, ProgressionRightY, BarDescription){
                                    const bounds = (Height + 5) / 2;
                                    const DataRadius = { upperLeft: bounds, upperRight: bounds, lowerLeft: bounds, lowerRight: bounds }
                                    const percent = Number(current / Needed * 100).toFixed(2);
                                    // Save the ctx current settings
                                    ctx.save();
                                    // CREATE THE ROUNDED BOARDED
                                    ctx.beginPath();
                                    ctx.roundRect(StartX - 2, StartY - Height - 2, Width + 3, Height + 5, DataRadius, false, false );
                                    ctx.closePath();
                                    ctx.clip();
                                    //DRAW BACKGROUND
                                    const BGgrd = ctx.createLinearGradient(StartX, StartY, Width, Height );
                                    BGgrd.addColorStop( 0, "#0e101a");
                                    BGgrd.addColorStop( 1, "#080a0f");
                                    ctx.lineWidth = 4;
                                    ctx.fillStyle = BGgrd;
                                    ctx.strokeStyle = BGgrd;
                                    ctx.roundRect(StartX, StartY - Height, Width, Height, DataRadius, true, true );
                                    //Draw bar
                                    const grd = ctx.createLinearGradient(StartX, StartY, Width, Height );
                                    grd.addColorStop( 0, LeftColor);
                                    grd.addColorStop( 1, RightColor);
                                    ctx.lineWidth = 4;
                                    ctx.fillStyle = grd;
                                    ctx.strokeStyle = grd;
                                    ctx.roundRect(StartX, StartY - Height, Width, Height, DataRadius, false, true );
                                    ctx.roundRect(StartX, StartY - Height, Width * ( percent / 100 ) , Height, DataRadius, true, false );
                                    //restore ctx
                                    ctx.restore();
                                    //draw text
                                    const progressionText = `${current} / ${Needed}`;
                                    const FontSize = Height - Height/6;
                                    ctx.font = `regular ${FontSize}px ${Fonts}`;
                                    ctx.fillStyle = "#ffffff";
                                    ctx.fillText(progressionText, ProgressionRightX - ctx.measureText(progressionText).width + (Height/2.5)/2, ProgressionRightY - Height/2 + FontSize/2);
                                    ctx.fillStyle = "#151723";
                                    ctx.fillText(BarDescription, StartX + Height/2.5, ProgressionRightY - Height/2 + FontSize/2)
                                }
                                return res(canvas);
                            }catch(e){
                                console.error(e);
                                rej(e);
                            }
                        })
                        
                    }
                } catch (error) {
                    console.log(error)
                    message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable17"]));
                }
            }
    
            async function leaderboardembed(type = "text") {
                let theDbDatas = ["level", "points", "neededpoints"]
                if(type == "voice") theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
                const filtered = await client.points.all().then(db => db.filter(p => p.data?.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data));
                const sorted = filtered.sort((a, b) => b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`]);
                let embeds = [];
                let j = 0;
                let maxnum = sorted && sorted.length > 25 ? sorted.length : 25;
                let orilent = sorted.length; // dont delete its in eval() 
                //do some databasing
                var userrank = sorted.slice(0, message.guild.memberCount).findIndex(d => d.user == message.author?.id) + 1;
    
                for (let i = 25; i <= maxnum; i += 25) {
                    const top = sorted.slice(i-25, i);
                    if(!top || top.length == 0) continue;
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
                        } catch (e){
                            console.error(e)
                        }
                    }
                    embed.setDescription(string.substring(0, 2048))
                    embed.setFooter(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable19"]))
                    embeds.push(embed);
                }
                return embeds;
            }
            async function leaderboard() {
                const embeds = await leaderboardembed();
                if(embeds.length == 1){
                    return message.channel.send({embeds: embeds}).catch(() => null)
                }
                swap_pages2(client, message, embeds)
            }
    
            async function newleaderboard(type = "text") {
                let theDbDatas = ["level", "points", "neededpoints", ]
                let tempmessage = await message.channel.send(`📊 *Getting the ${type == "voice" ? "🔉" : "💬"}__${type.toUpperCase()}__-LEADERBOARD-DATA of: **${message.guild.name}** ...*`)
                const filtered = await client.points.all().then(db => db.filter(p => p.data?.guild === message.guild.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data));
                const sorted = filtered
                .sort((a, b) => { 
                    if(b[`${theDbDatas[1]}`]) return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || b[`${theDbDatas[1]}`] - a[`${theDbDatas[1]}`];
                    else return b[`${theDbDatas[0]}`] - a[`${theDbDatas[0]}`] || -1
                }) 
                var top101 = sorted.slice(0, message.guild.memberCount);
                var userrank = top101.findIndex(d => d.user == message.author?.id) + 1;
                
                var array_usernames = [];
                var array_discriminator = [];
                var array_level = [];
                var array_avatar = [];
                var array_textpoints = [];
                var array_amount = [];
                for (const data of sorted.slice(0, 10)) {
                    try {
                        var user = await client.users.fetch(data.user).catch(() => null)
                        if(!user) continue;
                        array_usernames.push(user.username)
                        array_discriminator.push(user.discriminator)
                        array_level.push(data[`${theDbDatas[0]}`] && data[`${theDbDatas[0]}`] > 0 ? data[`${theDbDatas[0]}`] : 1)
                        array_textpoints.push(data[`${theDbDatas[1]}` || 0])
                        if(type == "voice") array_amount.push(data.voicetime || 0)
                        else {
                            let memberData = await client.invitesdb.get(message.guild.id + user.id)
                            array_amount.push(memberData && memberData.messagesCount ? memberData.messagesCount < 0 ? memberData.messagesCount *= -1 : memberData.messagesCount : 0)
                        }
                        array_avatar.push(user.displayAvatarURL({size: 4096, format: "png"}))      
                    } catch (e){
                        array_usernames.push(undefined)
                        array_avatar.push(client.user.displayAvatarURL({size: 4096, format: "png"}))
                        array_level.push(0)
                        array_textpoints.push(0)
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
                    for (let i = 0; i < array_usernames.length; i++){
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
                    theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
                
                    var sorted = filtered
                    .sort((a, b) => { 
                        return b[`voicetime`] - a[`voicetime`] || -1
                    }) 
                    let maxnum = 10;
        
        
                    var top101 = sorted.slice(0, message.guild.memberCount);
                    var userrank = top101.findIndex(d => d.user == message.author?.id) + 1;
                
    
                    var array_usernames = [];
                    var array_discriminator = [];
                    var array_level = [];
                    var array_avatar = [];
                    var array_textpoints = [];
                    var array_amount = [];
                    for (const data of sorted.slice(0, 10)) {
                        try {
                            var user = await client.users.fetch(data.user).catch(() => null)
                            if(!user) continue;
                            array_usernames.push(user.username)
                            array_discriminator.push(user.discriminator)
                            array_level.push(data[`${theDbDatas[0]}`] && data[`${theDbDatas[0]}`] > 0 ? data[`${theDbDatas[0]}`] : 1)
                            array_textpoints.push(data[`voicetime` || 0])
                            array_amount.push(data.voicepoints || 0)
                            array_avatar.push(user.displayAvatarURL({size: 4096, format: "png"}))      
                        } catch (e){
                            array_usernames.push(undefined)
                            array_avatar.push(client.user.displayAvatarURL({size: 4096, format: "png"}))
                            array_level.push(0)
                            array_textpoints.push(0)
                        }
                    }
        
                
                    const canvas2 = Canvas.createCanvas(830, 1030);
                    const ctx2 = canvas2.getContext("2d");
                    ctx2.font = "75px UbuntuMono";
                    ctx2.fillStyle = "#2697FF";
        
                    var bgimg = await Canvas.loadImage(`./assets/voice_leaderboard.png`);
                    ctx2.drawImage(bgimg, 0, 0, canvas2.width, canvas2.height);
                    array_usernames = array_usernames.slice(0, 10);
                    new Promise(async (res, rej)=>{
                        for (let i = 0; i < array_usernames.length; i++){
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
                        tempmessage.delete().catch(() => null)
                        message.channel.send({content:`Top 10 Leaderboard of **${message.guild.name}** Sorted after POINTS\n> **Type:** \`leaderboard all\` to see all Ranks\n*Rank is counted for the \`${type.toUpperCase()}-RANK\`*\n> ${type != "voice" ? `To see the **Voice Leaderboard** type: \`voiceleaderbaord [all]\`` : `To see the **Text Leaderboard** type: \`leaderbaord [all]\``}`, files: [attachment, attachment2]}).catch(() => null);
                    })
                })
            }
    
            async function setxpcounter(){
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
                    if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable24"]));
                    if(Number(args[1]) > 10) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable25"]))
                    await client.points.set(`${key}.xpcounter`, Number(args[1])); //set points to 0
                    const embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable26"]))
                    message.reply({embeds: [embed]});
                } catch (error) {
                    console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                    message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable27"]));
                }
            }
            
            async function setglobalxpcounter(){
                try {
                    if (!args[0]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable28"]));
                    if(Number(args[1]) > 10) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable29"]))
                    await client.points.set(`${message.guild.id}.setglobalxpcounter`, Number(args[0])); //set points to 0
                    const embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable30"]))
                    message.reply({embeds: [embed]});
                } catch {
                }
            }
            async function addpoints(amount) {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
    
                    let PointsDB = await client.points.get(key)
                    let curPoints = PointsDB.points;
                    let neededPoints = PointsDB.neededpoints;
                    while(curPoints > neededPoints) {
                        await client.points.set(`${key}.points`, curPoints - neededPoints); //set points to 0
                        await client.points.add(`${key}.level`, 1); //add 1 to level
                        //HARDING UP!
                        const newLevel = await client.points.get(`${key}.level`); //get current NEW level
                        if (newLevel % 4 === 0) client.points.add(`${key}.neededpoints`, 100)
                        PointsDB = await client.points.get(key);
                        curPoints = PointsDB.points;
                        neededPoints = PointsDB.neededpoints;
                    }
                    let leftpoints = neededPoints - curPoints;
                    if (!args[1] && !amount) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable34"]));
                    if(Number(args[1]) > 10000 || Number(args[1]) < -10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable35"]))
                    if (!amount) amount = Number(args[1]);
                    if (amount < 0) removepoints(amount);
                    let toaddpoints = amount;
                    addingpoints(toaddpoints, leftpoints);
    
                    async function addingpoints(toaddpoints, leftpoints) {
                        if (toaddpoints >= leftpoints) {
                            await client.points.set(`${key}.points`, 1); //set points to 0
                            await client.points.add(`${key}.level`, 1); //add 1 to level
                            //HARDING UP!
                            const newLevel = await client.points.get(`${key}.level`); //get current NEW level
                            if (newLevel % 4 === 0) await client.points.add(`${key}.neededpoints`, 100)
    
                            const newneededPoints = await client.points.get(`${key}.neededpoints`); //get NEW needed Points
                            
                            //THE INFORMATION EMBED 
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(client.getAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                                    dynamic: true
                                })))
                                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable36"]))
                                .setColor(embedcolor);
                            //send ping and embed message only IF the adding will be completed!
                            if (toaddpoints - leftpoints < newneededPoints)
                            message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
    
                            addingpoints(toaddpoints - leftpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                        } else {
                            await client.points.add(`${key}.points`, Number(toaddpoints))
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
    
            async function setpoints() {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
    
                    let toaddpoints = Number(args[1]);
                    if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable42"]));
                    if(Number(args[1]) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable43"]))
                    if (Number(args[1]) < 0) args[1] = 0;
                    const neededPoints = await client.points.get(`${key}`, `neededpoints`);
                    addingpoints(toaddpoints, neededPoints);
    
                    async function addingpoints(toaddpoints, neededPoints) {
                        if (toaddpoints >= neededPoints) {
                            await client.points.set(`${key}.points`, 1); //set points to 0
                            await client.points.inc(`${key}.level`); //add 1 to level
                            //HARDING UP!
                            const newLevel = await client.points.get(`${key}.level`); //get current NEW level
                            if (newLevel % 4 === 0) client.points.add(`${key}.neededpoints`, 100)
    
                            const newneededPoints = await client.points.get(`${key}`, `neededpoints`); //get NEW needed Points
                            const newPoints = await client.points.get(`${key}.points`); //get current NEW points
    
                            //THE INFORMATION EMBED 
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable44"]))
                                .setColor(embedcolor);
                            //send ping and embed message
                                message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
    
                            addingpoints(toaddpoints - neededPoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                        } else {
                            await client.points.set(`${key}.points`, Number(toaddpoints))
                        }
                    }
    
                    const embed = new Discord.MessageEmbed()
                        .setColor(embedcolor)
                        .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable45"]))
                    message.channel.send({embeds: [embed]}).catch(() => null);
                    rank(rankuser); //also sending the rankcard
                } catch (error) {
                    console.log("RANKING:".underline.red + " :: " + error.stack.toString().grey)
                    message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable46"]));
                }
            }
    
            async function removepoints(amount) {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    databasing(rankuser);
    
                    const curPoints = await client.points.get(`${key}.points`);
                    const neededPoints = await client.points.get(`${key}`, `neededpoints`);
    
                    if (!args[1] && !amount) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable50"]));
                    if (!amount) amount = Number(args[1]);
                    if(Number(args[1]) > 10000 || Number(args[1]) < -10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable51"]))
                    if (amount < 0) addpoints(amount);
                    console.log(curPoints, Number(amount))
                    removingpoints(amount, curPoints);
    
                    async function removingpoints(amount, curPoints) {
                        if (amount > curPoints) {
                            let removedpoints = amount - curPoints - 1;
                            const newLevel = await client.points.get(`${key}.level`); //get current NEW level
                            if (newLevel == 1) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable52"]));
                            await client.points.set(`${key}.points`, neededPoints - 1); //set points to 0
                            await client.points.subtract(`${key}.level`, 1); //remove 1 from level
                            //HARDING UP!
                            if ((newLevel + 1) % 4 === 0) { //if old level was divideable by 4 set neededpoints && points -100
                                await client.points.subtract(`${key}.points`, 100)
                                await client.points.subtract(`${key}.neededpoints`, 100)
                            }
    
                            const newneededPoints = await client.points.get(`${key}`, `neededpoints`); //get NEW needed Points
                            const newPoints = await client.points.get(`${key}.points`); //get current NEW points
    
                            //THE INFORMATION EMBED 
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable53"]))
                                .setColor(embedcolor);
                            //send ping and embed message only IF the removing will be completed!
                            if (amount - removedpoints < neededPoints)
                                message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
    
                            removingpoints(amount - removedpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                        } else {
                            await client.points.subtract(`${key}.points`, Number(amount))
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
    
            async function addlevel() {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    databasing(rankuser);
                    let newLevel = await client.points.get(`${key}.level`);
                    if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable59"]));
                    if(Number(args[1]) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable60"]))
                    if (Number(args[1]) < 0) args[1] = 0;
                    for (let i = 0; i < Number(args[1]); i++) {
                        await client.points.set(`${key}.points`, 1); //set points to 0
                        await client.points.add(`${key}.level`, 1); //add 1 to level
                        //HARDING UP!
                        newLevel = await client.points.get(`${key}.level`); //get current NEW level
                        if (newLevel % 4 === 0) client.points.add(`${key}.neededpoints`, 100)
                    }
                    const newneededPoints = await client.points.get(`${key}.neededpoints`); //get NEW needed Points
                    const newPoints = await client.points.get(`${key}.points`); //get current NEW points
    
                    //THE INFORMATION EMBED 
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(client.getAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                            dynamic: true
                        })))
                        .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable61"]))
                        .setColor(embedcolor);
                        message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
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
    
            async function setlevel() {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
    
                    if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable67"]));
                    if (Number(args[1]) < 1) args[1] = 1;
                    
                    if(Number(args[1]) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable68"]))
    
                    await client.points.set(`${key}.level`, Number(args[1])); //set level to the wanted level
                    await client.points.set(`${key}.points`, 1); //set the points to 0
    
                    let newLevel = await client.points.get(`${key}.level`); //set level to the wanted level
                    let counter = Number(newLevel) / 4;
    
                    await client.points.set(`${key}.neededpoints`, 400) //set neededpoints to 0 for beeing sure
                    //add 100 for each divideable 4
                    for (let i = 0; i < Math.floor(counter); i++) {
                        await client.points.add(`${key}.neededpoints`, 100)
                    }
                    const newneededPoints = await client.points.get(`${key}.neededpoints`); //get NEW needed Points
    
                    const newPoints = await client.points.get(`${key}.points`); //get current NEW points
                    //THE INFORMATION EMBED 
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(client.getAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                            dynamic: true
                        })))
                        .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable69"]))
                        .setColor(embedcolor);
                        message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
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
    
            async function removelevel() {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
                    let newLevel = await client.points.get(`${key}.level`);
                    if (!args[1]) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable75"]));
                    if (Number(args[1]) < 0) args[1] = 0;
                    for (let i = 0; i < Number(args[1]); i++) {
                        await client.points.set(`${key}.points`, 1); //set points to 0
                        await client.points.subtract(`${key}.level`, 1); //add 1 to level
                        //HARDING UP!
                        newLevel = await client.points.get(`${key}.level`); //get current NEW level
                        if(newLevel < 1) client.points.set(`${key}.level`, 1); //if smaller then 1 set to 1
                    }
                    snewLevel = await client.points.get(`${key}.level`); //get current NEW level
                    let counter = Number(snewLevel) / 4;
    
                    await client.points.set(`${key}.neededpoints`, 400) //set neededpoints to 0 for beeing sure
                    //add 100 for each divideable 4
                    for (let i = 0; i < Math.floor(counter); i++) {
                        await client.points.add(`${key}.neededpoints`, 100)
                    }
                    const newneededPoints = await client.points.get(`${key}.neededpoints`); //get NEW needed Points
                    const newPoints = await client.points.get(`${key}.points`); //get current NEW points
    
                    //THE INFORMATION EMBED 
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(client.getAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                            dynamic: true
                        })))
                        .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable76"]))
                        .setColor(embedcolor);
                        message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
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
    
            async function resetranking() {
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
                    const key = `${message.guild.id}_${rankuser.id}`;
                    await databasing(rankuser);
    
                    await client.points.set(`${key}.level`, 1); //set level to 0
                    await client.points.set(`${key}.points`, 1); //set the points to 0
                    await client.points.set(`${key}.neededpoints`, 400) //set neededpoints to 0 for beeing sure
                    await client.points.set(`${key}.oldmessage`, ""); //set old message to 0
    
                    //THE INFORMATION EMBED 
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(client.getAuthor(`Ranking of:  ${rankuser.tag}`, rankuser.displayAvatarURL({
                            dynamic: true
                        })))
                        .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable82"]))
                        .setColor(embedcolor);
                        message.channel.send({content: `${rankuser}`, embeds: [embed]}).catch(() => null);
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
    
            async function registerall() {
                let allmembers = message.guild.members.cache.map(i => i.id).slice(0, 100);
                for (let i = 0; i < allmembers.length; i++) {
                    //Call the databasing function!
                    let rankuser = message.guild.members.cache.get(allmembers[i])?.user;
                    if(rankuser) await databasing(rankuser);
                }
                const embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable85"]))
                message.reply({content: `I limited the MAXIMUM MEMBERS to 100`,embeds: [embed]});
            }
    
            async function resetrankingall() {
                const filtered = await client.points.all().then(d => d.filter(p => p.data?.guild === message.guild.id && (p.data?.points > 0 || p.data?.level > 1)).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data));
                let allmembers = message.guild.members.cache.map(i => i.id).filter(d=>filtered.map(d => d.user).includes(d));
                for (let i = 0; i < allmembers.length; i++) {
                    let rankmember = message.guild.members.cache.get(allmembers[i])
                    if(!rankmember) continue;
                    let rankuser = rankmember.user;
                    const key = `${message.guild.id}_${rankuser.id}`;
                    if(await client.points.has(key)) {
                        await client.points.set(`${key}.level`, 1); //set level to 0
                        await client.points.set(`${key}.points`, 1); //set the points to 0
                        await client.points.set(`${key}.neededpoints`, 400) //set neededpoints to 0 for beeing sure
                        await client.points.set(`${key}.oldmessage`, ""); //set old message to 0
                    }
                }
                const embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable86"]))
                message.reply({embeds: [embed]});
            }
    
            async function addrandomall() {
                let maxnum = 5;
                if (args[0]) maxnum = Number(args[0]);
                if(args[0] && Number(maxnum) > 10000) return message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable87"]))
                let allmembers = message.guild.members.cache.filter(member=> !member.user?.bot).keyArray();
                for (let i = 0; i < allmembers.length; i++) {
                    //Call the databasing function!
                    let rankuser = message.guild.members.cache.get(allmembers[i]).user;
                    if(!rankuser?.id || rankuser?.bot) continue;
                    if(!awaitclient.points.has(`${message.guild.id}_${rankuser.id}`)) continue;
                    Giving_Ranking_Points(`${message.guild.id}_${rankuser.id}`, maxnum);
                    Giving_Ranking_Points(`${message.guild.id}_${message.author?.id}`, maxnum);
                }
                const embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable88"]))
                message.reply({embeds: [embed]});
            }
    
            async function levelinghelp() {
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
                message.channel.send({embeds: [embed]}).catch(() => null)
            }
    
            }catch(e){
                
                console.error(e)
            
            }
    }

    await dbEnsure(client.points, "ranks", {
        voicerank:{}    
    })
    
    let voiceStates = await client.points.get("ranks")
    if(typeof voiceStates != "object" || !voiceStates.voicerank) voiceStates = {
        voicerank: { }
    };
    
    client.on("ready", () => {
        setTimeout(async ()=>{
            //For each guild, set the voice state into the db if there are none
            client.guilds.cache.each(async g => {
                let guild = client.guilds.cache.get(g.id)
                if(guild && guild.voiceStates) {
                    guild.voiceStates.cache.map(voiceState => voiceState.id).forEach(id=>{
                        if(!voiceStates.voicerank[id]){
                            voiceStates.voicerank[id] = new Date();
                        }
                    })
                }
            })
            await client.points.set("ranks", voiceStates)
        }, 1500)
    })


    client.on("voiceStateUpdate", async (oldState, newState) => {
      if(!newState.guild || !newState.member.user || newState.member.user?.bot) return;
      var { id } = oldState // This is the user"s ID
      if (!oldState.channel) {
        // The user has joined a voice channel
        voiceStates.voicerank[id] = new Date()
        voiceStates = await client.points.get("ranks")
        if(typeof voiceStates != "object" || !voiceStates.voicerank) voiceStates = {
            voicerank: { }
        };
      } 
      // The User has left a voice Channel
      else if (!newState.channel) {
        var now = new Date();
        var joined = voiceStates.voicerank[id] || new Date();
        var connectedTime = now.getTime() - joined.getTime();
        //Grant Coints!
        if(connectedTime > 60000){
            if (newState.member.user?.bot || !newState.guild) return;
            await dbEnsure(client.setups, newState.guild.id,  {
                ranking: {
                    enabled: true,
                    backgroundimage: "null",
                }
            });
            let ranking = await client.setups.get(`${newState.guild.id}.ranking`);
            if(!ranking ||!ranking.enabled) return console.log("disabled ranking", ranking);
            const key = `${newState.guild.id}_${newState.id}`;
            await dbEnsure(client.points, key, {
                user: newState.id,
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
            if(newState.member.user && newState.member.user.tag) await client.points.set(`${key}.usertag`, newState.member.user.tag); 
            let VoicePoints = Math.floor(connectedTime / 60000)
            await client.points.add(`${key}.voicetime`, Math.floor(connectedTime / 60000)); 
            //console.log("CONNECTED TIME: " + Math.floor(connectedTime / 60000) + "min | " + "POINTS FOR IT: " + VoicePoints);
            let curPoints = await client.points.get(`${key}.voicepoints`);
            let neededPoints = await client.points.get(`${key}.neededvoicepoints`);
            while(curPoints > neededPoints) {
                await client.points.set(`${key}.voicepoints`, curPoints - neededPoints); //set points to 0
                await client.points.add(`${key}.voicelevel`, 1); //add 1 to level
                //HARDING UP!
                const newLevel = await client.points.get(`${key}.voicelevel`); //get current NEW level
                if (newLevel % 4 === 0) await client.points.add(`${key}.neededvoicepoints`, 100)
                curPoints = await client.points.get(`${key}.voicelevel`);
                neededPoints = await client.points.get(`${key}.neededvoicepoints`);
            }
            let leftpoints = neededPoints - curPoints;
            let toaddpoints = VoicePoints;
            await addingpoints(toaddpoints, leftpoints);
            async function addingpoints(toaddpoints, leftpoints) {
                if (toaddpoints >= leftpoints) {
                    await client.points.set(`${key}.voicepoints`, 0); //set points to 0
                    await client.points.add(`${key}.voicelevel`, 1); //add 1 to level
                    //HARDING UP!
                    const newLevel = await client.points.get(`${key}.voicelevel`); //get current NEW level
                    if (newLevel % 4 === 0) await client.points.add(`${key}.neededvoicepoints`, 100)
                    const newneededPoints = await client.points.get(`${key}.neededvoicepoints`); //get NEW needed Points
                    await addingpoints(toaddpoints - leftpoints, newneededPoints); //Ofc there is still points left to add so... lets do it!
                } else {
                    await client.points.add(`${key}.voicepoints`, Number(toaddpoints))
                }
            }
        } else {
            //console.log(`Not enough connected time: ${connectedTime}`)
        }
        //try to remove him from the db
        try{
            delete voiceStates.voicerank[id]; 
            await client.points.set("ranks", voiceStates)
            voiceStates = await client.points.get("ranks")
            if(typeof voiceStates != "object" || !voiceStates.voicerank) voiceStates = {
                voicerank: { }
            };
        }catch (e){
            
        }
      }
    })

}
//Coded by Tomato#6966!
function shortenLargeNumber(num, digits) {
    var units = ["k", "M", "G", "T", "P", "E", "Z", "Y"],
        decimal;
    for (var i=units.length-1; i>=0; i--) {
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
