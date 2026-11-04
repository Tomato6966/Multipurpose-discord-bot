const { MessageEmbed } = require("discord.js");
module.exports = function (client, options) {
    client.on("guildMemberUpdate", async (oM, nM) => {
        client.settings.ensure(nM.guild.id, {
            boost: {
                enabled: false,
                message: "",
                log: false,
                stopBoost:
                    "🚀 {member} **stopped Boosting us..** 😿",
                startBoost:
                    "🚀 {member} **has boosted us!** 💃",
                againBoost:
                    "🚀 {member} **has boosted us again!** 🎉",
            },
        });
        if (!client.settings.has(nM.guild.id)) return;
        if (!client.settings.has(nM.guild.id, "boost")) return;

        let settings = client.settings.get(nM.guild.id, "boost");
        if (settings && settings.enabled) {
            //if he/she starts boosting
            if (!oM.premiumSince && nM.premiumSince) {
                console.log(settings);
                nM.send(settings.message.substring(0, 2000)).catch(() => {});
            }
            //if he/she boosts again
            if (oM.premiumSince && oM.premiumSinceTimestamp != nM.premiumSinceTimestamp) {
                console.log(settings);
                nM.send(settings.message.substring(0, 2000)).catch(() => {});
            }
        }

        if (settings && settings.log) {
            let boostLogChannel = nM.guild.channels.cache.get(settings.log);
            if (!boostLogChannel) boostLogChannel = (await nM.guild.channels.fetch(settings.log).catch(() => {})) || false;
            if (!boostLogChannel) return;

            let stopBoost = new MessageEmbed()
                .setFooter(client.getFooter("ID: " + nM.user.id))
                .setTimestamp()
                .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({ dynamic: true })))
                .setColor("RED")
                .setDescription(`${String(settings.stopBoost).replace(/\{member\}/giu, `${nM.user}`)}`);
            let startBoost = new MessageEmbed()
                .setFooter(client.getFooter("ID: " + nM.user.id))
                .setTimestamp()
                .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({ dynamic: true })))
                .setColor("#ff8afb")
                .setDescription(`${String(settings.startBoost).replace(/\{member\}/giu, `${nM.user}`)}`);
            let againBoost = new MessageEmbed()
                .setFooter(client.getFooter("ID: " + nM.user.id))
                .setTimestamp()
                .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({ dynamic: true })))
                .setColor("#ff8afb")
                .setDescription(`${String(settings.againBoost).replace(/\{member\}/giu, `${nM.user}`)}`);

            //if he/she stops boosting
            if (oM.premiumSince && !nM.premiumSince) {
                return boostLogChannel.send({ embeds: [stopBoost] }).catch(console.warn);
            }
            //if he/she starts boosting
            if (!oM.premiumSince && nM.premiumSince) {
                return boostLogChannel.send({ embeds: [startBoost] }).catch(console.warn);
            }
            //if he/she starts boosting
            if (oM.premiumSince && oM.premiumSinceTimestamp != nM.premiumSinceTimestamp) {
                return boostLogChannel.send({ embeds: [againBoost] }).catch(console.warn);
            }
        }
    });
};
