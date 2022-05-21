// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const { databasing, delay, getLatestVideos, channelInfo } = require('../handlers/functions');

module.exports = async (client) => {

    client.Jobyoutube = new CronJob('0 3,11,19,25,31,37,43,49,55 * * * *', async function () {
        await check(client);
    }, null, true, 'Europe/Berlin');

    client.on("ready", () => {
        setTimeout(() => check(client), 1000)
        client.Jobyoutube.start(); //start the JOB
    });


    /** Check the Videos, and if there is a valid video or not
      * @param
     */
    async function checkVideos(youtubeChannel, youtuber) {
        try {
            let lastVideos = await getLatestVideos(youtubeChannel);
            // If there isn't any video in the youtube channel, return
            if (!lastVideos || !lastVideos[0]) return false;
            let ytData = await client.youtube_log.get(youtuber)
            if (!ytData) return false;
            let lastSavedVideo = ytData.oldvid;
            let alrsentvideos = ytData.alrsent;
            // If the last video is the same as the last saved, return
            if (lastSavedVideo && (lastSavedVideo === lastVideos[0].id || lastSavedVideo.includes(lastVideos[0].id))) return false;
            if (alrsentvideos && (alrsentvideos.includes(lastVideos[0].id))) return false;
            return lastVideos[0];
        } catch (e) {
            return false;
        }
    }

    async function check(client) {
        //console.log(" [YOUTUB] :: Checking Accounts...".italic.brightRed)
        const guildChannels = client.guilds.cache.map(g => {
            return {
                channels: g.channels.cache.map(c => c.id),
                guildID: g.id || "NO_GUILD_ID",
            }
        })
        const guildDatas = await client.social_log.all().then(D => {
            let filterYoutube = D.filter(d => d.data?.youtube?.dc_channel);
            const filteredForThisShard = filterYoutube.filter(d => {
                // if no dc channel setupped return false
                let dcChannel = d.data.youtube.dc_channel;
                if (!dcChannel || dcChannel.length < 8) return false;

                // if no youtube channels setupped, return false
                let channels = d.data.youtube.channels;
                if (!channels || channels.length <= 0) return false;

                let guildID = guildChannels.find(g => g.channels.includes(dcChannel))?.guildID;
                // ifs not on this shard, return false
                if (!guildID || !client.guilds.cache.has(guildID)) return false;
                // all tests passed! return true
                return true;
            })
            const GuildDatas = filteredForThisShard.filter(Boolean).map(value => value.data.youtube)
            return GuildDatas;
        })
        //if no userids return
        if (!guildDatas || guildDatas.length == 0) return //console.log(` [YOUTUB] :: NO GUILD DATAS`.brightRed)
        for await (const Data of guildDatas) {
            try {
                if (Data && Data.youtube && Data.youtube.channel) {
                    for await (const youtuber of Data.youtube.channel) {
                        await dbEnsure(client.youtube_log, youtuber, {
                            oldvid: "",
                            alrsent: [],
                            message: "**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}"
                        })
                        //console.log(` [YOUTUB] :: [${youtuber}] | Start checking...`.italic.brightRed);
                        
                        let channelInfos = await channelInfo(youtuber);
                        if (!channelInfos) {
                            console.log(String(" [YOUTUB] :: [ERR] | Invalid youtuber provided: " + youtuber).italic.brightRed);
                            continue;
                        }

                        //channelInfos.url, ChannelDATA
                        let video = await checkVideos(channelInfos.url, youtuber);
                        if (!video) {
                            //console.log(` [YOUTUB] :: [${channelInfos.name}] | No notification`.italic.brightRed);
                            continue;
                        }

                        let channel = await client.channels.fetch(Data.youtube.dc_channel).catch(() => null);
                        if (!channel) {
                            //console.log(" [YOUTUB] :: [ERR] | DC-Channel not found".italic.brightRed);
                            continue;
                        }
                        
                        const youtubeData = await client.youtube_log.get(youtuber);
                        if (youtubeData && youtubeData.message) {
                            channel.send({
                                content:
                                    youtubeData.message
                                        .replace(/{videoURL}/gi, video.link)
                                        .replace(/{videoAuthorName}/gi, video.author)
                                        .replace(/{videoTitle}/gi, video.title)
                                        .replace(/{videoPubDate}/gi, formatDate(client, new Date(video.pubDate)))
                                        .replace(/{url}/gi, video.link)
                                        .replace(/{author}/gi, video.author)
                                        .replace(/{title}/gi, video.title)
                                        .replace(/{date}/gi, formatDate(client, new Date(video.pubDate)))
                            }).catch(() => null);
                            await client.youtube_log.set(youtuber + ".oldvid", video.id)
                            await client.youtube_log.push(youtuber + ".alrsent", video.id)
                            //console.log(" [YOUTUB] :: Notification sent !".italic.brightRed);
                        } else {
                            continue;
                        }
                    }
                } else {
                    continue;
                }
            } catch (e) {
                console.log(String(" [YOUTUB] :: " + e).grey)
                continue;
            }
        }
        return true;
    }

    function formatDate(client, date) {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
        return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
    }
}
