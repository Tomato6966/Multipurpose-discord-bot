//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var {
    MessageEmbed
} = require(`discord.js`);
const { escapeRegex, dbEnsure } = require(`./functions`)
const map = new Map()
module.exports = async (client) => {

    module.exports.messageCreate = async (client, message, guild_settings) => {
        if (!message.guild || message.guild.available === false || message.author?.bot) return;
        let es = guild_settings.embed;
        let args = message.content.split(" ");
        let prefix = guild_settings.prefix;
        //if not in the database for some reason use the default prefix
        if (prefix === null) prefix = config.prefix;
        //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);       
        var cuc = await client.keyword.get(message.guild.id+".commands")
        if(!cuc && !Array.isArray(cuc)) {
            await dbEnsure(client.keyword, message.guild.id, {
                commands: []
            })
            cuc = [];
        }
        for await (const cmd of cuc){
            for await (const string of args){
                if(string && (String(string).toLowerCase() == (cmd.name.toLowerCase()) || (cmd.aliases.includes(String(string).toLowerCase()))) && cmd.channels.includes(message.channel.id) ){
                    if(!map.has(cmd.name+message.guild.id)){
                        map.set(cmd.name+message.guild.id, true)
                        setTimeout(()=>{map.delete(cmd.name+message.guild.id)}, 5000)
                        if(cmd.embed){
                            //if its not that then return
                            if (prefixRegex.test(message.content) && !cmd.name.startsWith(prefix)) return;
                            message.channel.send({embeds: [new MessageEmbed()
                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                .setFooter(client.getFooter(es))
                                .setDescription(cmd.output.replace("{member}", `<@${message.author?.id}>`))
                            ]});
                            continue;
                        }else{
                            //if its not that then return
                            if (prefixRegex.test(message.content) && !cmd.name.startsWith(prefix)) return;
                            message.channel.send(cmd.output.replace("{member}", `<@${message.author?.id}>`))
                            continue;
                        }
                    }
                    else{
                    }
                    continue;
                }

            }
        }
    }
}