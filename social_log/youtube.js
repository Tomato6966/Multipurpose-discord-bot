// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const { databasing, delay, getLatestVideos, channelInfo } = require('../handlers/functions');

module.exports = async (client) => {

    client.Jobyoutube = new CronJob('0 3,11,19,25,31,37,43,49,55 * * * *', async function(){
        check(client); 
    }, null, true, 'America/Los_Angeles');
    
    client.on("ready", () => {
        client.Jobyoutube.start(); //start the JOB
    });


    /** Check the Videos, and if there is a valid video or not
      * @param
     */
     async function checkVideos(youtubeChannel, youtuber){
        try{
            let lastVideos = await getLatestVideos(youtubeChannel);
            // If there isn't any video in the youtube channel, return
            if(!lastVideos || !lastVideos[0]) return false;
            let ytData = await client.youtube_log.get(youtuber)
            if(!ytData) return false;
            let lastSavedVideo = ytData.oldvid;
            let alrsentvideos = ytData.alrsent;
         // If the last video is the same as the last saved, return
            if(lastSavedVideo && (lastSavedVideo === lastVideos[0].id || lastSavedVideo.includes(lastVideos[0].id)))  return false;
            if(alrsentvideos && (alrsentvideos.includes(lastVideos[0].id))) return false;
            return lastVideos[0];
        } catch (e){
            return false;
        }
    }

    async function check(client){
        console.log(" [YOUTUB] :: Checking Accounts...".italic.brightRed)
        client.guilds.cache.map(guild => guild.id).forEach(async guildid => {
            try{
                const Data = await client.social_log.get(guildid);
                if(Data && Data.youtube && Data.youtube.channel){
                 
                    for(const yt of Data){
                        await dbEnsure(client.youtube_log, yt, {
                            oldvid: "",
                            alrsent: [],
                            message: "**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}"
                        })
                    }
                    
                    Data.youtube.channel.forEach(async (youtuber) => {
                        console.log(` [YOUTUB] :: [${youtuber}] | Start checking...`.italic.brightRed);
                        let channelInfos = await channelInfo(youtuber);
                        if(!channelInfos) return console.log(String(" [YOUTUB] :: [ERR] | Invalid youtuber provided: " + youtuber).italic.brightRed);
                        //channelInfos.url, ChannelDATA
                        let video = await checkVideos(channelInfos.url, youtuber);
                        if(!video) return console.log(` [YOUTUB] :: [${channelInfos.name}] | No notification`.italic.brightRed);
                        
                        let channel = await client.channels.fetch(client.social_log.get(guildid, "youtube.dc_channel")).catch(e=>{return;})
                        if(!channel) return console.log(" [YOUTUB] :: [ERR] | DC-Channel not found".italic.brightRed);
                        const youtubeData = await client.youtube_log.get(youtuber);
                        if(youtubeData && youtubeData.message) {
                            channel.send({content: 
                                youtubeData.message
                                .replace(/{videoURL}/gi, video.link)
                                .replace(/{videoAuthorName}/gi, video.author)
                                .replace(/{videoTitle}/gi, video.title)
                                .replace(/{videoPubDate}/gi, formatDate(client, new Date(video.pubDate)))
                                .replace(/{url}/gi, video.link)
                                .replace(/{author}/gi, video.author)
                                .replace(/{title}/gi, video.title)
                                .replace(/{date}/gi, formatDate(client, new Date(video.pubDate)))
                            }).catch(() => {});
                            await client.youtube_log.set(youtuber+".oldvid", video.id)
                            await client.youtube_log.push(youtuber+".alrsent", video.id)
                            console.log(" [YOUTUB] :: Notification sent !".italic.brightRed);
                        }
                    });           
                }
            }catch (e){
                console.log(String(" [YOUTUB] :: " + e).grey)
            }
        })
    }

    function formatDate(client, date) {
        let monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        let day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
        return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
    }
}
