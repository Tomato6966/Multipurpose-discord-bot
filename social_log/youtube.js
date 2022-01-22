// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const { databasing, delay, getLatestVideos, channelInfo } = require('../handlers/functions');

module.exports = client => {

    client.Jobyoutube = new CronJob('0 */7 * * * *', async function(){
        await delay(4 * 60 * 1000)
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
            let lastSavedVideo = client.youtube_log.get(youtuber, "oldvid")
            let alrsentvideos = client.youtube_log.get(youtuber, "alrsent")
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
        client.guilds.cache.map(guild => guild.id).forEach(guildid => {
            try{
                client.social_log.ensure(guildid, {
                    youtube: {
                        channels: [],
                        dc_channel: ""
                    },
                })
                for(const yt of client.social_log.get(guildid, "youtube.channels")){
                    client.youtube_log.ensure(yt, {
                        oldvid: "",
                        alrsent: [],
                        message: "**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}"
                    })
                }
                client.social_log.get(guildid, "youtube.channels").forEach(async (youtuber) => {
                    console.log(` [YOUTUB] :: [${youtuber}] | Start checking...`.italic.brightRed);
                    let channelInfos = await channelInfo(youtuber);
                    if(!channelInfos) return console.log(String(" [YOUTUB] :: [ERR] | Invalid youtuber provided: " + youtuber).italic.brightRed);
                    //channelInfos.url, ChannelDATA
                    let video = await checkVideos(channelInfos.url, youtuber);
                    if(!video) return console.log(` [YOUTUB] :: [${channelInfos.name}] | No notification`.italic.brightRed);
                    
                    let channel = await client.channels.fetch(client.social_log.get(guildid, "youtube.dc_channel")).catch(e=>{return;})
                    if(!channel) return console.log(" [YOUTUB] :: [ERR] | DC-Channel not found".italic.brightRed);
                    
                    channel.send({content: 
                        client.youtube_log.get(youtuber, "message")
                        .replace(/{videoURL}/gi, video.link)
                        .replace(/{videoAuthorName}/gi, video.author)
                        .replace(/{videoTitle}/gi, video.title)
                        .replace(/{videoPubDate}/gi, formatDate(client, new Date(video.pubDate)))
                        .replace(/{url}/gi, video.link)
                        .replace(/{author}/gi, video.author)
                        .replace(/{title}/gi, video.title)
                        .replace(/{date}/gi, formatDate(client, new Date(video.pubDate)))
                    }).catch(() => {});;
                    client.youtube_log.set(youtuber, video.id, "oldvid")
                    client.youtube_log.push(youtuber, video.id, "alrsent")
                    console.log(" [YOUTUB] :: Notification sent !".italic.brightRed);
                });        
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
