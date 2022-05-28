const fetch = require("node-fetch");
const { readFile } = require('fs/promises');
const { request } = require('undici');
const svg2img = require('svg2img');
const Canvas = require("canvas");
const SkiaCanvas = require('skia-canvas'); // @napi-rs/canvas

const canvacord = require("canvacord");

Canvas.registerFont("./assets/fonts/DMSans-Bold.ttf" , { family: "DM Sans", weight: "bold" } );
Canvas.registerFont("./assets/fonts/DMSans-Regular.ttf" , { family: "DM Sans", weight: "regular" } );
Canvas.registerFont("./assets/fonts/STIXGeneral.ttf" , { family: "STIXGeneral" } );
Canvas.registerFont("./assets/fonts/AppleSymbol.ttf" , { family: "AppleSymbol" } );
Canvas.registerFont("./assets/fonts/Arial.ttf"       , { family: "Arial" } );
Canvas.registerFont("./assets/fonts/ArialUnicode.ttf", { family: "ArielUnicode" } );
Canvas.registerFont("./assets/fonts/Genta.ttf", { family: "Genta" } );
Canvas.registerFont("./assets/fonts/UbuntuMono.ttf", { family: "UbuntuMono" } );


const Fonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
const wideFonts = "Genta, UbuntuMono, `DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";


const { nFormatter } = require("./functions")
const apiSettings = {
    "valid": [
      "734513783338434591"
    ],
    "ip" : "localhost",
    "port": 4040
  };
const ApiFetchData = {
    URL: `http://${apiSettings.ip || "localhost"}:${apiSettings?.port || 4040}`,
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    method: "POST",
    auth: apiSettings?.tokens?.[0] || "734513783338434591"
};
const Discord = require("discord.js");

function cduration(duration) {
    let remain = duration * 60 * 1000;
    const days = Math.floor(remain / (1000 * 60 * 60 * 24)); remain = remain % (1000 * 60 * 60 * 24);
    const hours = Math.floor(remain / (1000 * 60 * 60)); remain = remain % (1000 * 60 * 60);
    const minutes = Math.floor(remain / (1000 * 60)); remain = remain % (1000 * 60);
    const seconds = Math.floor(remain / (1000)); remain = remain % (1000);
    const time = { days, hours, minutes, seconds };
    const parts = []

    if (time.days) parts.push(time.days + ' D')
    if (time.hours) parts.push(time.hours + ' H')
    if (time.minutes) parts.push(time.minutes + ' M')
    if (time.seconds) parts.push(time.seconds + ' S')
    
    return parts.length === 0 ? ['None'] : parts
    
}
async function getWelcomeDm(data) { 
    let resData = await requestApi(data, `welcomeDm`).catch(() => null); 
    if(resData && resData.buffer) resData = { buffer: Buffer.from(resData.buffer, "base64") };
    if(!resData || resData.error) {
        console.log("/welcomeDm | Invalid response from API - Fetching manually")
        resData = { buffer: await welcomeDm(data).catch(() => null)};
    }
    return resData;
}
async function getWelcomeChannel(data) { 
    let resData = await requestApi(data, `welcomeChannel`).catch(() => null); 
    if(resData && resData.buffer) resData = { buffer: Buffer.from(resData.buffer, "base64") };
    if(!resData || resData.error) {
        console.log("/welcomeChannel | Invalid response from API - Fetching manually")
        resData = { buffer: await welcomeChannel(data).catch(() => null)};
    }
    return resData;
}
async function getLevelUpCard(data) { 
    let resData = await requestApi(data, `levelUpCard`).catch(() => null); 
    if(resData && resData.buffer) resData = { buffer: Buffer.from(resData.buffer, "base64") };
    if(!resData || resData.error) {
        console.log("/levelUpCard | Invalid response from API - Fetching manually")
        resData = { buffer: await levelUpCard(data).catch(() => null)};
    }
    return resData;
}

async function getRankCard(data) { 
    let resData = await requestApi(data, `rankCard`).catch(() => null); 
    if(resData && resData.buffer) resData = { buffer: Buffer.from(resData.buffer, "base64") };
    if(!resData || resData.error) {
        console.log("/rankCard | Invalid response from API - Fetching manually")
        resData = { buffer: await rankCard(data).catch(() => null)};
    } 
    return resData; 
}

async function getLeaderboardCard(data) { 
    let resData = await requestApi(data, `leaderBoardCard`).catch(() => null); 
    if(resData && resData.buffer) resData = { buffer: Buffer.from(resData.buffer, "base64") };
    if(!resData || resData.error) {
        console.log("/leaderBoardCard | Invalid response from API - Fetching manually")
        resData = { buffer: await leaderBoardCard(data).catch(() => null)};
    }
    return resData; 
} 


async function requestApi(data, endpoint) { 
    return new Promise(async (res, rej) => {
        await fetch(`${ApiFetchData.URL}/${endpoint}?token=${ApiFetchData.auth}`, {
            body: JSON.stringify(data), 
            method: ApiFetchData.method, 
            headers: ApiFetchData.headers,
        }).then(async data => { 
            let jsonData = await data.json(); 
            if(jsonData.error) return console.error(jsonData.error);  
            return res(jsonData)
        }).catch(e => {
            return rej(e);
        });
    })
}
    
/** * @param {*} data
    { 
        username: "", 
        newLevel: "", 
        newRank: "", 
        avatarImage: "",
    } 
    * returns CanvasBuffer 
*/ 
async function levelUpCard (data) {
    try {
        const canvas = Canvas.createCanvas(1802, 430); 
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.font = "100px UbuntuMono"; ctx.fillStyle = "#2697FF"; 
        const bgimg = await Canvas.loadImage("./assets/levelup.png"); 
        ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
         // USERNAME
        var text = `${data.username}`.trim(); 
        if (text.length > 15) text = text.substring(0, 11) + ".."
        await canvacord.Util.renderEmoji(ctx, `${text} leveled up!`, 475, 150);
    
        ctx.font = "80px UbuntuMono";
        await canvacord.Util.renderEmoji(ctx, `New Level: ${data.newLevel}`, 475, 290);
        await canvacord.Util.renderEmoji(ctx, ` New Rank: #${data.newRank}`, 475, 380);
    
        ctx.restore();
        try {
            // AVATAR
            ctx.beginPath();
            ctx.arc(345/2 + 83.5, 345/2 + 36, 345/2, 0, Math.PI * 2, true); 
            ctx.closePath();
            ctx.clip();
            const avatar = await Canvas.loadImage(data.avatarImage);
            ctx.drawImage(avatar, 83.5, 36, 345, 345);    
        } catch(e) { console.error(e)  }
        return await canvas.toBuffer();
    } catch (e) {
        console.error(e);
        return e;
    }
}

/**
 * 
 * @param {*} data
    {
        xp_data: {},
        rankuser: rankuser,
        status: "offline",
        boosted: member.premiumSinceTimestamp && member.roles.cache.has(message.guild.roles.premiumSubscriberRole?.id) ? member.premiumSinceTimestamp : null, 
        nitro: member.avatar || banner || rankuser.displayAvatarURL({dynamic:true}).endsWith(".gif")
    }

* returns CanvasBuffer 
*/
async function rankCard(data) {
    try{
        const { xp_data, rankuser, status, boosted, nitro } = data;
        rankuser.flags = new Discord.UserFlags(rankuser.flags)
        const statusimgs = {
            "online": "https://cdn.discordapp.com/attachments/886876093418713129/959116532426866748/Online.png",
            "offline": "https://cdn.discordapp.com/attachments/886876093418713129/959116533236367410/offline.png",
            "idle": "https://cdn.discordapp.com/attachments/886876093418713129/959116532846301284/idle.png",
            "dnd": "https://cdn.discordapp.com/attachments/886876093418713129/959116532615639080/dnd.png"
        }
        
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
                if(boosted) {
                    const getMonths = (t1, t2) => Math.floor((t1-t2)/1000/60/60/24/30) 
                    const difference = getMonths(Date.now(), boosted);
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
                if(nitro) flags.push("NITRO")
                
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
        await canvacord.Util.renderEmoji(ctx, name, NameX -TextNameSize/2, NameY - fontsize/2 + NameYSpace)

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
        return await canvas.toBuffer();
    }catch(e){
        console.error(e);
        return e;
    }
}

/**
 * 
 * @param {*} data
    {
        type: "text|voice",
        usernames: [],
        levels: [],
        points: [],
        avatars: [],
        tags: [],
        amount: [],
    }
* returns CanvasBuffer 
*/
async function leaderBoardCard (data) {
    const canvas = Canvas.createCanvas(830, 1030);
    const ctx = canvas.getContext("2d");
    ctx.font = "75px UbuntuMono";
    ctx.fillStyle = "#2697FF";

    const bgimg = await Canvas.loadImage(`./assets/${data.type == "voice" ? "voice" : "first"}_leaderboard.png`);
    ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
    
    const usernames = data.usernames.slice(0, 10);
    const points = data.points.slice(0, 10);
    const levels = data.levels.slice(0, 10);
    const avatars = data.avatars.slice(0, 10);
    const tags = data.tags.slice(0, 10);
    const array_amount = data.amount.slice(0, 10);
    
    for (let i = 0; i < usernames.length; i++){
        try {
            ctx.save();
            ctx.font = "75px UbuntuMono";
            ctx.fillStyle = "#2697FF";
            
            //USERNAME
            var text = `${usernames[i]}`.trim();
            let yOffset = 0;
            let fontsize = 75; 
            while(ctx.measureText(text).width > 365){
                ctx.font = `${ fontsize-- }px UbuntuMono`;
                yOffset += 0.0025;
            }
            await canvacord.Util.renderEmoji(ctx, text, 435 , 85 + i * 100 + yOffset);


            //LEVEL TEXT
            ctx.font = "40px UbuntuMono";
            ctx.fillStyle = "#6caae7"; 
            var text4 = `LVL ${levels[i]}`.trim();
            await canvacord.Util.renderEmoji(ctx, text4, 275, 100 + i * 100 - 22.5);


            //POINTS TEXT: 
            ctx.font = "19px UbuntuMono";
            ctx.fillStyle = "#858594"
            var text5 = `${nFormatter(points[i], 1)} P. | ${data.type == "voice" ? `${cduration(array_amount[i]).join(", ")} Mins.`: `${nFormatter(array_amount[i], 1)} Msgs.`}`.trim();
            await canvacord.Util.renderEmoji(ctx, text5, 235, 101.25 + i * 100);


            //DISCRIMINATOR TEXT
            ctx.font = "15px UbuntuMono";
            ctx.fillStyle = "#7F7F7F"
            await canvacord.Util.renderEmoji(ctx, `#${tags[i]}`, 750, 100 + i * 100);
            
            try {
                //AVATAR
                ctx.beginPath();
                ctx.arc(80/2 + 30, 80/2 + 25 + i * 100, 80/2, 0, Math.PI * 2, true); 
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(avatars[i]);
                ctx.drawImage(avatar, 30, 25 + i * 100, 80, 80);
            } catch(e) { console.error(e)  }

            ctx.restore();
            if(i == usernames.length - 1) continue;
        } catch (e){
            console.error(e);
            if(i == usernames.length - 1) continue;
        }
    }
    
    return await canvas.toBuffer()
}
/**
 * @param {*} data 
    {
        welcomeSettings: theSettings.welcome,
        guildIconUrl: member.guild.iconURL({ dynamic: false, format: "png", size: 4096 }),
        memberCount: member.guild.memberCount,
        discriminator: member.user.discriminator,
        username: member.user.username,
        guildName: member.guild.name,
        avatarUrl: member.user.displayAvatarURL({ dynamic: false, format: "png", size: 4096 })
    }
 * @returns CanvasBuffer
 */
async function welcomeDm(data) {
    try {

        //member roles add on welcome every single role
        const canvas = Canvas.createCanvas(1772, 633);
        //make it "2D"
        const ctx = canvas.getContext(`2d`);

        if (data.welcomeSettings.backgrounddm !== "transparent") {
            try {
                const bgimg = await Canvas.loadImage(data.welcomeSettings.backgrounddm);
                ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
            } catch {}
        } else {
        try {
            if (data.guildIconUrl && data.guildIconUrl !== null && mdata.guildIconUrl !== undefined) {
                const img = await Canvas.loadImage(data.guildIconUrl);
                ctx.globalAlpha = 0.3;
                ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                ctx.globalAlpha = 1;
            }
        } catch {}
        }

        if (data.welcomeSettings.framedm) {
            let background;
            var framecolor = data.welcomeSettings.framecolordm.toUpperCase();
            if (framecolor == "WHITE") framecolor = "#FFFFF9";
            if (data.welcomeSettings.discriminatordm && data.welcomeSettings.servernamedm)
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

            else if (data.welcomeSettings.discriminatordm)
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

            else if (data.welcomeSettings.servernamedm)
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

            else
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            if (data.welcomeSettings.pbdm) {
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            }
        }

        var fillcolors = data.welcomeSettings.framecolordm.toUpperCase();
        if (fillcolors == "WHITE") framecolor = "#FFFFF9";
        ctx.fillStyle = fillcolors.toLowerCase();

        //set the first text string 
        var textString3 = `${data.username}`;
        //if the text is too big then smaller the text
        if (textString3.length >= 14) {
            ctx.font = `100px ${wideFonts}`;         
            await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
        }
        //else dont do it
        else {
            ctx.font = `150px ${wideFonts}`;
            await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
        }



        ctx.font = `bold 50px ${Fonts}`;
        //define the Discriminator Tag
        if (data.welcomeSettings.discriminatordm) {
            await canvacord.Util.renderEmoji(ctx, `#${data.discriminator}`, 750, canvas.height / 2 + 125);
        }
        //define the Member count
        if (data.welcomeSettings.membercountdm) {
            await canvacord.Util.renderEmoji(ctx, `Member #${data.memberCount}`, 750, canvas.height / 2 + 200);
        }
        //get the Guild Name
        if (data.welcomeSettings.servernamedm) {
            await canvacord.Util.renderEmoji(ctx, `${data.guildName}`, 700, canvas.height / 2 - 150);
        }

        if (data.welcomeSettings.pbdm) {
            //create a circular "mask"
            ctx.beginPath();
            ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
            ctx.closePath();
            ctx.clip();
            //define the user avatar
            const avatar = await Canvas.loadImage(data.avatarUrl);
            //draw the avatar
            ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
        }
        return await canvas.toBuffer();
    } catch(e) {
        console.error(e);
        return e;
    }
}

/**
 * @param {*} data 
    {
        welcomeSettings: theSettings.welcome,
        guildIconUrl: member.guild.iconURL({ dynamic: false, format: "png", size: 4096 }),
        memberCount: member.guild.memberCount,
        discriminator: member.user.discriminator,
        username: member.user.username,
        guildName: member.guild.name,
        avatarUrl: member.user.displayAvatarURL({ dynamic: false, format: "png", size: 4096 })
    }
 * @returns CanvasBuffer
 */
async function welcomeChannel(data) {
    try {
        //member roles add on welcome every single role
        const canvas = Canvas.createCanvas(1772, 633);
        //make it "2D"
        const ctx = canvas.getContext(`2d`);

        if (data.welcomeSettings.background !== "transparent") {
            try {
                const bgimg = await Canvas.loadImage(data.welcomeSettings.background);
                ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
            } catch (e){ console.error(e)}
        } else {
        try {
            if (data.guildIconUrl && data.guildIconUrl !== null && data.guildIconUrl !== undefined) {
                const img = await Canvas.loadImage(data.guildIconUrl);
                ctx.globalAlpha = 0.3;
                ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                ctx.globalAlpha = 1;
            }
        } catch (e){ console.error(e)}
        }

        if (data.welcomeSettings.frame) {
            let background;
            var framecolor = data.welcomeSettings.framecolor.toUpperCase();
            if (framecolor == "WHITE") framecolor = "#FFFFF9";
            if (data.welcomeSettings.discriminator && (data.welcomeSettings.servername || data.welcomeSettings.servernam))
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

            else if (data.welcomeSettings.discriminator)
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

            else if (data.welcomeSettings.servername || data.welcomeSettings.servernam)
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

            else
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            if (data.welcomeSettings.pb) {
                background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb.png`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            }
        }

        var fillcolors = data.welcomeSettings.framecolor.toUpperCase();
        if (fillcolors == "WHITE") framecolor = "#FFFFF9";
        ctx.fillStyle = fillcolors.toLowerCase();

        //set the first text string 
        var textString3 = `${data.username}`;
        //if the text is too big then smaller the text
        if (textString3.length >= 14) {
            ctx.font = `100px ${Fonts}`;         
            await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
        }
        //else dont do it
        else {
            ctx.font = `150px ${Fonts}`;
            await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
        }



        ctx.font = `bold 50px ${wideFonts}`;
        //define the Discriminator Tag
        if (data.welcomeSettings.discriminator) {
            await canvacord.Util.renderEmoji(ctx, `#${data.discriminator}`, 750, canvas.height / 2 + 125);
        }
        //define the Member count
        if (data.welcomeSettings.membercount) {
            await canvacord.Util.renderEmoji(ctx, `Member #${data.memberCount}`, 750, canvas.height / 2 + 200);
        }
        //get the Guild Name
        if (data.welcomeSettings.servernam || data.welcomeSettings.servername) {
            await canvacord.Util.renderEmoji(ctx, `${data.guildName}`, 700, canvas.height / 2 - 150);
        }

        if (data.welcomeSettings.pb) {
            //create a circular "mask"
            ctx.beginPath();
            ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
            ctx.closePath();
            ctx.clip();
            //define the user avatar
            const avatar = await Canvas.loadImage(data.avatarUrl);
            //draw the avatar
            ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
        }
        return await canvas.toBuffer();
    } catch(e) {
        console.error(e);
        return e;
    }
}
module.exports = {
    getLevelUpCard,
    getRankCard,
    getLeaderboardCard,
    requestApi,
    levelUpCard,
    rankCard,
    leaderBoardCard,
    welcomeDm,
    welcomeChannel,
    getWelcomeChannel,
    getWelcomeDm
}