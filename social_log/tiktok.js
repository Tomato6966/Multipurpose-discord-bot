// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const TikTokScraper = require('tiktok-scraper');
const { delay, dbEnsure } = require('../handlers/functions');
const moment = require(`moment`)
module.exports = async (client) => {

    client.Jobtiktok = new CronJob('0 2,10,18,24,32,36,42,48,54 * * * *', async function(){
        var guilds = await client.social_log.all().then(d => {
            return d.filter(d => d?.data?.tiktok?.channels?.length > 0 && d?.data?.tiktok.dc_channel > 1).map(d => d.ID)
        })
        if(!guilds) return;
        for await (const g of guilds){
            var guild = client.guilds.cache.get(g);
            if(!guild) continue;
            check(guild);
            await delay(1500);
        }
     }, null, true, 'Europe/Berlin');
     
    client.on(`ready`, () => {
        // client.Jobtiktok.start(); //start the JOB
    });

    async function check(guild){
        return //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} :: Currently Disabled the TIKTOK Logger`.italic.brightMagenta)
        //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: Checking Accounts...`.italic.brightMagenta)

        try {
            const DBdata = await client.social_log.get(guild.id);
            if(!DBdata || !DBdata.tiktok || !DBdata.tiktok.channels || DBdata.tiktok.channels.length < 1) {
                return  //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: Doesn't have TikTok Channels anymore!`.italic.brightMagenta);
            }
            for await (const tt of DBdata.tiktok.channels){
                await dbEnsure(client.tiktok, tt, {
                    oldvid: ``,
                    message: `**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}`
                })
            }
            var channel = guild.channels.cache.get(DBdata.tiktok?.dc_channel) || await guild.channels.fetch(DBdata.tiktok?.dc_channel).catch(() => null) || false;
            if(!channel) return //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: | No Discord Channel found`.italic.brightMagenta);
           
            DBdata.tiktok.channels.forEach(async (tiktoker) => {
            //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: [${tiktoker}] | Start checking...`.italic.brightMagenta);
                try {
                    const posts = await TikTokScraper.user(String(tiktoker), {
                        number: 5,
                        by_user_id: true,
                        sessionList: ['sid_tt=58ba9e34431774703d3c34e60d584475;']
                    });
                    const resp = await extract(`https://www.tiktok.com/@${tiktoker}`);
                    if(!posts.collector[0]) return //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} [${tiktoker}] :: NOT FOUND / No Posts!`.italic.brightMagenta) 
                    author = posts.collector[0].authorMeta;
                    var allposts = posts.collector.map(async p => {
                        const Obj = {};
                        Obj.id = p.id;
                        Obj.url = p.webVideoUrl;
                        Obj.mentions = p.mentions;
                        Obj.hashtags = p.hashtags;
                        let title = p.text;
                        for await (const tag of p.hashtags) title = String(title).toLowerCase().replace(String(tag.name).toLowerCase(), ``)
                        for await (const mention of p.mentions) title = String(title).toLowerCase().replace(String(mention), ``)
                        Obj.title = title.split(`#`).join(``);
                        if(title.length <= 1) Obj.title = p.id;
                        return Obj;
                    })
                    var video = allposts[0];
                    const TikToker = await client.tiktok.get(tiktoker)
                    if(TikToker && TikToker.oldVid == video.id) return //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: [${tiktoker}] | Last video is the same as the last saved`.italic.brightMagenta);
                    channel.send({content: TikToker.message ? 
                        TikToker.message.replace(`{videoURL}`, video.url)
                        .replace(`{videoAuthorName}`, author.name)
                        .replace(`{videoTitle}`, video.title)
                        .replace(`{url}`, video.url)
                        .replace(`{author}`, author.name)
                        .replace(`{title}`, video.title) : `${author.name} posted ${video.url}`
                    }).catch(() => null);;
                    await client.tiktok.set(`${tiktoker}.oldvid`, video.id)
                    //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: Notification sent !`.italic.brightMagenta);
                } catch (error) {
                    //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: `.magenta, String(error).grey);
                }
            });        
        }catch (e){
            //console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: `.magenta, String(e).grey.grey)
        }
    }
}
