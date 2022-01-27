// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const TikTokScraper = require('tiktok-scraper');
const { delay } = require('../handlers/functions');
const moment = require(`moment`)
module.exports = client => {

    client.Jobtiktok = new CronJob('0 */7 * * * *', async function(){
        await delay(2 * 60 * 1000)
        var guilds = client.social_log.keyArray((v) => (v.tiktok && v.tiktok.channels && v.tiktok.channels.length > 0) && (v.tiktok&&v.tiktok.dc_channel&&v.tiktok.dc_channel.length > 1)).map(v => v.tiktok)
        if(!guilds) return;
        for(const g of guilds){
            var guild = client.guilds.cache.get(g);
            if(!guild) continue;
            check(guild);
            await delay(1500);
        }
     }, null, true, 'America/Los_Angeles');
     
    client.on(`ready`, () => {
        client.Jobtiktok.start(); //start the JOB
    });

    async function check(guild){
        return console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} :: Currently Disabled the TIKTOK Logger`.italic.brightMagenta)
        console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: Checking Accounts...`.italic.brightMagenta)

        try {
            client.social_log.ensure(guild.id, {
                tiktok: {
                    channels: [],
                    dc_channel: ``
                },
            })
            if(!client.social_log.get(guild.id, `tiktok.channels`) || client.social_log.get(guild.id, `tiktok.channels`).length < 1) {
                return  console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: Doesn't have TikTok Channels anymore!`.italic.brightMagenta);
            }
            for(const tt of client.social_log.get(guild.id, `tiktok.channels`)){
                client.tiktok.ensure(tt, {
                    oldvid: ``,
                    message: `**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}`
                })
            }
            var channel = guild.channels.cache.get(client.social_log.get(guild.id, `tiktok.dc_channel`)) || await guild.channels.fetch(client.social_log.get(guild.id, `tiktok.dc_channel`)).catch(() => {}) || false;
            if(!channel) return console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: | No Discord Channel found`.italic.brightMagenta);
           
            client.social_log.get(guild.id, `tiktok.channels`).forEach(async (tiktoker) => {
            console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: [${tiktoker}] | Start checking...`.italic.brightMagenta);
                try {
                    const posts = await TikTokScraper.user(String(tiktoker), {
                        number: 5,
                        by_user_id: true,
                        sessionList: ['sid_tt=58ba9e34431774703d3c34e60d584475;']
                    });
                    const resp = await extract(`https://www.tiktok.com/@${tiktoker}`);
                    if(!posts.collector[0]) return console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} [${tiktoker}] :: NOT FOUND / No Posts!`.italic.brightMagenta) 
                    author = posts.collector[0].authorMeta;
                    var allposts = posts.collector.map(p => {
                        const Obj = {};
                        Obj.id = p.id;
                        Obj.url = p.webVideoUrl;
                        Obj.mentions = p.mentions;
                        Obj.hashtags = p.hashtags;
                        let title = p.text;
                        for(const tag of p.hashtags) title = String(title).toLowerCase().replace(String(tag.name).toLowerCase(), ``)
                        for(const mention of p.mentions) title = String(title).toLowerCase().replace(String(mention), ``)
                        Obj.title = title.split(`#`).join(``);
                        if(title.length <= 1) Obj.title = p.id;
                        return Obj;
                    })
                    var video = allposts[0];
                    if(client.tiktok.get(tiktoker, `oldvid`) == video.id) return console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: [${tiktoker}] | Last video is the same as the last saved`.italic.brightMagenta);
                    channel.send({content: 
                        client.tiktok.get(tiktoker, `message`)
                        .replace(`{videoURL}`, video.url)
                        .replace(`{videoAuthorName}`, author.name)
                        .replace(`{videoTitle}`, video.title)
                        .replace(`{url}`, video.url)
                        .replace(`{author}`, author.name)
                        .replace(`{title}`, video.title)
                    }).catch(() => {});;
                    client.tiktok.set(tiktoker, video.id, `oldvid`)
                    console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: Notification sent !`.italic.brightMagenta);
                } catch (error) {
                    console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: `.magenta, String(error).grey);
                }
            });        
        }catch (e){
            console.log(` [TIKTOK] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} :: `.magenta, String(e).grey.grey)
        }
    }
}
