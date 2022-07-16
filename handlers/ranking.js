const config = require(`${process.cwd()}/botconfig/config.json`)

const Discord = require("discord.js");
const MilratoCanvasApi = require("./CanvasApi")
const { dbEnsure, GetUser, duration, swap_pages2 } = require(`./functions`)
const { rankingAllCache } = require("./caches");

module.exports = {
    run,
    messageCreate,
    cachePointsAll,
    shortenLargeNumber
}

async function run (client) {
    // Text Rank

    await dbEnsure(client.points, "ranks", {
        voicerank:{}    
    })
    
    const allPoints = await client.points.all();

    let voiceStates = allPoints.find(d => d.ID == "ranks")?.data; 

    if(typeof voiceStates != "object" || !voiceStates.voicerank) voiceStates = {
        voicerank: { }
    };
    
    client.on("ready", async () => {
        //For each guild, set the voice state into the db if there are none
        client.guilds.cache.each(async g => {
            let guild = client.guilds.cache.get(g.id);
            
            // Update the leaderboard cache
            rankingAllCache.set(`last_fetched_${g.id}`, Date.now());
            
            rankingAllCache.set(g.id, allPoints.filter(p => p.data?.guild === g.id).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data))

            if(guild && guild.voiceStates) {
                guild.voiceStates.cache.map(voiceState => voiceState.id).forEach(id=>{
                    if(!voiceStates.voicerank[id]){
                        voiceStates.voicerank[id] = new Date();
                    }
                })
            }
        })
        await client.points.set("ranks", voiceStates)
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
        var connectedTime = null;
        try {
            var connectedTime = now.getTime() - joined.getTime();
        } catch (e){
            console.error(e);
            console.log(joined);
            var connectedTime = now.getTime()
        }
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
            if(!ranking ||!ranking.enabled) return 
            const key = `${newState.guild.id}_${newState.id}`;
            await dbEnsure(client.points, key, {
                user: newState.id,
                usertag: newState.member?.user?.tag,
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
            if(newState.member && newState.member.user && newState.member.user.tag) await client.points.set(`${key}.usertag`, newState.member.user.tag); 
            let VoicePoints = Math.floor(connectedTime / 60000)
            await client.points.add(`${key}.voicetime`, Math.floor(connectedTime / 60000)); 
            
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

async function cachePointsAll(client, GuildId) {
    const maxCacheDuration = 60_000;

    if(!rankingAllCache.get(GuildId)) {
        rankingAllCache.set(`last_fetched_${GuildId}`, Date.now());
        rankingAllCache.set(GuildId, await client.points.all().then(db => db.filter(p => p.data?.guild === GuildId).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data)))
    } else {
        // Update the Cache if the last Fetched is 60 Seconds or older
        if(!rankingAllCache.has(`last_fetched_${GuildId}`) || Date.now() - Number(rankingAllCache.get(`last_fetched_${GuildId}`)) > maxCacheDuration) {
            (async () => {
                rankingAllCache.set(`last_fetched_${GuildId}`, Date.now());
                rankingAllCache.set(GuildId, await client.points.all().then(db => db.filter(p => p.data?.guild === GuildId).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966.data)))
            })();
        } else {
            // wont update db
        }
    }
    return rankingAllCache.get(GuildId);
}

async function messageCreate(client, message, guild_settings, setups) {
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
        
        if(!ranking || !ranking.enabled) return 
        const key = `${message.guild.id}_${message.author?.id}`;

        async function databasing(rankuser) {
            return new Promise(async (res) => {
                try{
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
                    return res(true);
                }catch(e){
                    console.error(e)
                    return res(true);
                }
                return res(true);
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
            const filtered = await cachePointsAll(client, message.guild.id);

            const newLevel = filtered?.find(d => d.ID == `${thekey ? thekey : key}`)?.data.level || await client.points.get(`${thekey ? thekey : key}.level`); //get current NEW level
            const newPoints = filtered?.find(d => d.ID == `${thekey ? thekey : key}`)?.data?.points || await client.points.get(`${thekey ? thekey : key}.points`); //get current NEW points
            const newneededPoints = filtered?.find(d => d.ID == `${thekey ? thekey : key}`)?.data.neededpoints || await client.points.get(`${thekey ? thekey : key}.neededpoints`);
            //send ping and embed message
            try {
                const res = await dbEnsure(client.points, message.guild.id, {
                    rankroles: { }
                })
                let RankRoles = res && res.changed ? {} : filtered?.find(d => d.ID == `${message.guild.id}`)?.data?.rankroles || await client.points.get(`${message.guild.id}.rankroles`);
                if(RankRoles[Number(newLevel)]){
                    await message.member.roles.add(RankRoles[Number(newLevel)]).catch(() => null)
                }
            } catch (e){ }
            let disabled = filtered?.find(d => d.ID == `${message.guild.id}`)?.data?.disabled || await client.points.get(`${message.guild.id}.disabled`);
            if(disabled) return;

            
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
            
            // Get the buffer from the api / Handler File
            const { buffer } = await MilratoCanvasApi.getLevelUpCard({
                username: message.author.username,
                newLevel: newLevel,
                newRank: i,
                avatarImage: message.author.displayAvatarURL({ dynamic: false, format: "png", size: 4096 }),
            });

            //get it as a discord attachment
            const attachment = new Discord.MessageAttachment(Buffer.from(buffer), "ranking-image.png");
            const chID = filtered?.find(d => d.ID == `${message.guild.id}`)?.data?.channel || await client.points.get(`${message.guild.id}.channel`);
            if(!chID && message.channel) return message.reply({content: `${message.author}`, files: [attachment]}).catch(() => null)
            try {
                let channel = message.guild.channels.cache.get(chID);
                if(!channel && message.channel){
                    return message.reply({content: `${message.author}`, files: [attachment]}).catch(() => null)
                } 
                else if (channel) channel.send({content: `${message.author}`, files: [attachment]})
            } catch (e){
                message.reply({content: `${message.author}`, files: [attachment]}).catch(() => null)
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
                
                const key = `${message.guild.id}_${rankuser.id}`;
                await databasing(rankuser);
                let theDbDatas = [["level", "points", "neededpoints"], ["voicelevel", "voicepoints", "neededvoicepoints"]]
                let tempmessage = await message.channel.send(`📊 *Getting the RANK-DATA of: **${rankuser.tag}** ...*`)
                
                /**
                 * TEXT RANK
                 */
                
                const filtered = await cachePointsAll(client, message.guild.id).then(db => db.map(d => d.data && d.ID ? d.data :d));;
                
                const sortedText = filtered
                .sort((a, b) => { 
                    if(b[`${theDbDatas[0][1]}`]) return b[`${theDbDatas[0][0]}`] - a[`${theDbDatas[0][0]}`] || b[`${theDbDatas[0][1]}`] - a[`${theDbDatas[0][1]}`];
                    else return b[`${theDbDatas[0][0]}`] - a[`${theDbDatas[0][0]}`] || -1
                }) 
                let RankText = sortedText.splice(0, message.guild.memberCount).findIndex(d => d.user == rankuser.id) + 1;

                let rankdata = filtered?.find(d => d.ID == key)?.data || await client.points.get(key);
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
                
                const { buffer: rankBuffer } = await MilratoCanvasApi.getRankCard({
                    xp_data: xp_data,
                    rankuser: rankuser,
                    status: status,
                    boosted: rankMember.premiumSinceTimestamp && rankMember.roles.cache.has(message.guild.roles.premiumSubscriberRole?.id) ? rankMember.premiumSinceTimestamp : null, 
                    nitro: rankMember.avatar || banner || rankuser.displayAvatarURL({dynamic:true}).endsWith(".gif") ? true : false
                });

                const RankAttachment = new Discord.MessageAttachment(rankBuffer, "card.png" )
                const VoiceTime = rankdata.voicetime ? duration(Number(rankdata.voicetime * 60 * 1000)).map(i=>`\`${i}\``).join(", ") : "0 Mins"
                return tempmessage.edit({
                     content: `${tempmessage.content}\n**User's Connected Time:** ${VoiceTime}\n**Note:** *\`You only gain Points, if you leave the Channel!\`*`,
                     files:[RankAttachment]
                }).catch(() => null);
                
       

            } catch (error) {
                console.error(error)
                message.reply(eval(client.la[ls]["handlers"]["rankingjs"]["ranking"]["variable17"]));
            }
        }

        async function leaderboardembed(type = "text") {
            let theDbDatas = ["level", "points", "neededpoints"]
            if(type == "voice") theDbDatas = ["voicelevel", "voicepoints", "neededvoicepoints", ]
            
            const filtered = await cachePointsAll(client, message.guild.id).then(db => db.map(d => d.data && d.ID ? d.data :d));;
            
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
            let theDbDatas = {
                text: ["level", "points", "neededpoints"],
                voice: ["voicelevel", "voicepoints", "neededvoicepoints"]
            }
            let tempmessage = await message.channel.send(`📊 *Getting the ${type == "voice" ? "🔉" : "💬"}__${type.toUpperCase()}__-LEADERBOARD-DATA of: **${message.guild.name}** ...*`)

            
            const filtered = await cachePointsAll(client, message.guild.id).then(db => db.map(d => d.data && d.ID ? d.data :d));

            tempmessage = await tempmessage.edit(tempmessage.content += `\n> Received the Database-Data, now getting the Image Data`);
            
            let sorted = filtered.sort((a, b) => { 
                if(b[`${theDbDatas.text[1]}`]) return b[`${theDbDatas.text[0]}`] - a[`${theDbDatas.text[0]}`] || b[`${theDbDatas.text[1]}`] - a[`${theDbDatas.text[1]}`];
                else return b[`${theDbDatas.text[0]}`] - a[`${theDbDatas.text[0]}`] || -1
            }) 
            
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
                    if(type == "voice") array_amount.push(data.voicetime || 0)
                    else {
                        let memberData = client.invitesdb?.get(message.guild.id + user.id)
                        if(memberData.messagesCount < 0) memberData.messagesCount *= -1;
                        let messagesCount = memberData.messagesCount;
                        array_amount.push(messagesCount || 0 )
                    }
                    array_usernames.push(user.username)
                    array_discriminator.push(user.discriminator)
                    array_level.push(data[`${theDbDatas.text[0]}`] && data[`${theDbDatas.text[0]}`] > 0 ? data[`${theDbDatas.text[0]}`] : 1)
                    array_textpoints.push(data[`${theDbDatas.text[1]}` || 0])
                    array_avatar.push(user.displayAvatarURL({size: 4096, format: "png"}))      
                } catch (e){
                    array_usernames.push(undefined)
                    array_discriminator.push(undefined)
                    array_avatar.push(client.user.displayAvatarURL({size: 4096, format: "png"}))
                    array_level.push(0)
                    array_textpoints.push(0)
                    array_amount.push(0)
                }
            }

            sorted = filtered.sort((a, b) => { 
                return b[`voicetime`] - a[`voicetime`] || -1
            })

            var voice_array_usernames = [];
            var voice_array_discriminator = [];
            var voice_array_level = [];
            var voice_array_avatar = [];
            var voice_array_textpoints = [];
            var voice_array_amount = [];
            for (const data of sorted.slice(0, 10)) {
                try {
                    var user = await client.users.fetch(data.user).catch(() => null)
                    if(!user) continue;
                    
                    voice_array_usernames.push(user.username)
                    voice_array_discriminator.push(user.discriminator)
                    voice_array_level.push(data[`${theDbDatas.voice[0]}`] && data[`${theDbDatas.voice[0]}`] > 0 ? data[`${theDbDatas.voice[0]}`] : 1)
                    voice_array_textpoints.push(data[`voicetime` || 0])
                    voice_array_avatar.push(user.displayAvatarURL({size: 4096, format: "png"}))      
                    if(type == "voice") voice_array_amount.push(data.voicepoints || 0)
                    else {
                        let memberData = client.invitesdb?.get(message.guild.id + user.id)
                        if(memberData.messagesCount < 0) memberData.messagesCount *= -1;
                        let messagesCount = memberData.messagesCount;
                        voice_array_amount.push(messagesCount || 0 )
                    }
                } catch (e){
                    voice_array_amount.push(0);
                    voice_array_usernames.push(undefined)
                    voice_array_discriminator.push(undefined)
                    voice_array_avatar.push(client.user.displayAvatarURL({size: 4096, format: "png"}))
                    voice_array_level.push(0)
                    voice_array_textpoints.push(0)
                }
            }


        
            // Get the buffer from the api / Handler File
            const { buffer: buffer1 } = await MilratoCanvasApi.getLeaderboardCard({
                type: "text",
                usernames: array_usernames.slice(0, 10),
                points: array_textpoints.slice(0, 10),
                levels: array_level.slice(0, 10),
                avatars: array_avatar.slice(0, 10),
                tags: array_discriminator.slice(0, 10),
                amount: array_amount.slice(0, 10),
            });


            // Get the buffer from the api / Handler File
            const { buffer: buffer2 } = await MilratoCanvasApi.getLeaderboardCard({
                type: "voice",
                usernames: voice_array_usernames.slice(0, 10),
                points: voice_array_textpoints.slice(0, 10),
                levels: voice_array_level.slice(0, 10),
                avatars: voice_array_avatar.slice(0, 10),
                tags: voice_array_discriminator.slice(0, 10),
                amount: voice_array_amount.slice(0, 10),
            });


            //get it as a discord attachment
            const attachment = new Discord.MessageAttachment(buffer1, "ranking-image.png");
            const attachment2 = new Discord.MessageAttachment(buffer2, "ranking-image.png");
            
            tempmessage = tempmessage.delete().catch(() => null)
            message.channel.send({ content: `> 💬 Top 10 TEXT-Leaderboard of **${message.guild.name}** Sorted after \`POINTS\`\n\n> 🔊 Top 10 VOICE-Leaderboard of **${message.guild.name}** Sorted after \`MINUTES\``, files: [ attachment, attachment2 ]}).catch(() => null);
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
                console.error(error)
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
                console.error(error)
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
                console.error(error)
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
                console.error(error)
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
                console.error(error)
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
                console.error(error)
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
                console.error(error)
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
                console.error(error)
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
            const filtered = await cachePointsAll(client, message.guild.id).then(d => d?.filter(p => p.data?.points > 0 || p.data?.level > 1));
            
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