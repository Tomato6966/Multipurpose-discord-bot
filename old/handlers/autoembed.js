const Discord = require("discord.js")
let url = "";
module.exports = client => {
    client.on("messageCreate", async message => {
        if(!message.guild || message.guild.available === false || message.author.id == client.user.id) return;
        
        let es = client.settings.get(message.guild.id, "embed");;
        let set = client.settings.get(message.guild.id, "autoembed");
        if(!set) return;
        if(!Array.isArray(set)) {
            client.settings.set(message.guild.id, Array(set), "autoembed");
            set = client.settings.get(message.guild.id, "autoembed");
        }
        for(const ch of set){
            try{
                var channel = message.guild.channels.cache.get(ch)
                if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) channel = message.guild.channels.cache.get(ch);
                if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) client.settings.remove(message.guild.id, ch,"autoembed")
            }catch{
                client.settings.remove(message.guild.id, ch, "autoembed")
            }
        }
        if(set.includes(message.channel.id) || set.includes(message.channel.parentId)){
            try{
                const targetMessage = await message.channel.messages.fetch(message.id, false, true).catch(() => {})
                if (!targetMessage) return console.log("It seems that this message does not exists!");
                //if it is an Embed do this
                if(targetMessage.embeds[0]){
                    const oldEmbed = targetMessage.embeds[0]
                    const embed = new Discord.MessageEmbed()
                    if(oldEmbed.title) embed.setTitle(oldEmbed.title)
                    if(oldEmbed.description) embed.setDescription(oldEmbed.description)  
                    embed.setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    embed.setTimestamp()
                    
                    if(oldEmbed.author) embed.setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL, oldEmbed.author.url)
                    if(oldEmbed.image) try{embed.setImage(oldEmbed.image.url)}catch{}

                    if(oldEmbed.thumbnail) try{embed.setThumbnail(oldEmbed.thumbnail.url)}catch{}
                    if(oldEmbed.url) embed.setURL(oldEmbed.url)
                    if(oldEmbed.fields[0]){
                        for(let i = 0; i<= oldEmbed.fields.length; i++){
                            if(oldEmbed.fields[i]) embed.addField(oldEmbed.fields[i].name, oldEmbed.fields[i].value)
                        }
                    }
                    targetMessage.delete().catch(e=>console.log("THIS ERROR PREVENTS A BUG"));
                    if(targetMessage.content) return message.channel.send({content: targetMessage.content, embeds: [embed]}).catch(e=>console.log("THIS ERROR PREVENTS A BUG"));
                    message.channel.send({embeds: [embed]}).catch(e=>console.log("THIS ERROR PREVENTS A BUG"));
                }
                  //else do this
                else{
                    let embed = new Discord.MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic:true}))
                    if(message.content) embed.setDescription(message.content)
                    
                    let files = null;
                    //add images if added (no videos possible)
                    if (message.attachments.size > 0){
                        if (message.attachments.every(attachIsImage)) {
                            const attachment = new MessageAttachment(url, imagename)
                            files = [attachment];
                        }
                    }
                    //if no content and no image, return and dont continue
                    if (!message.content && message.attachments.size <= 0) return;
            
                    function attachIsImage(msgAttach) {
                        url = msgAttach.url;
                        imagename = msgAttach.name || `Unknown`;
                        return url.indexOf(`png`, url.length - 3 ) !== -1 ||
                            url.indexOf(`jpeg`, url.length - 4 ) !== -1 ||
                            url.indexOf(`gif`, url.length - 3) !== -1 ||
                            url.indexOf(`jpg`, url.length - 3) !== -1;
                    }
                    message.channel.send({
                        embeds: [embed],
                        files: files
                    }).catch(e=>console.log("THIS ERROR PREVENTS A BUG"));
                    message.delete().catch(e=>console.log("THIS ERROR PREVENTS A BUG"));
                    if (collected.first().attachments.size > 0) 
                    if (collected.first().attachments.every(attachIsImage)) embed.setImage(url)
                }
            }catch{

            }
        }
    })
}
function attachIsImage(msgAttach) {
    url = msgAttach.url;
    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
  }