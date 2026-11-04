//here the event starts
module.exports = (client, info) => {
    const message = String(info);
    if (message.startsWith("Provided token:")) {
        console.debug("Discord.js login token supplied; token details omitted.");
        return;
    }
    console.log(message.grey);
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
