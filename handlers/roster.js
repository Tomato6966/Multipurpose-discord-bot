const {
    edit_Roster_msg, send_roster_msg, delay
} = require(`${process.cwd()}/handlers/functions`);

module.exports = (client) => {
    
    var CronJob = require('cron').CronJob;
    client.Jobroster = new CronJob('0 */30 * * * *', function() {
        client.guilds.cache.map(guild => {
            for (let i = 0; i <= 25; i++) {
                let index = i + 1;
                var thedb = client[`roster${index != 1 ? index : ""}`]
                thedb?.ensure(guild.id, {
                    rosterchannel: "notvalid",
                    rosteremoji: "➤",
                    rostermessage: "",
                    rostertitle: "Roster",
                    rosterstyle: "1",
                    rosterroles: [],
                    inline: false,
                })
                let channel = thedb?.get(guild.id, "rosterchannel")
                if(!channel || channel.length <= "notvalid".length) continue;
                let realchannel = guild.channels.cache.get(channel);
                if(!realchannel) continue;
                edit_Roster_msg(client, guild, thedb)
            }
        });
    }, null, true, 'America/Los_Angeles');
    client.Jobroster.start();

    client.on("guildMemberUpdate", async function (oldMember, newMember) {
        try {
            const oldRoles = [...oldMember.roles.cache.keys()].filter(x => ![...newMember.roles.cache.keys()].includes(x))
            const newRoles = [...newMember.roles.cache.keys()].filter(x => ![...oldMember.roles.cache.keys()].includes(x))
            const rolechanged = (newRoles.length || oldRoles.length)

            if (rolechanged) {
                //array for added roles
                let roleadded = [];
                if (newRoles.length > 0)
                    for (let i = 0; i < newRoles.length; i++) roleadded.push(newRoles[i])
                //array for removed roles
                let roleremoved = [];
                if (oldRoles.length > 0)
                    for (let i = 0; i < oldRoles.length; i++) roleremoved.push(oldRoles[i])
                //if role got ADDED and its one role of the db then update the embed with antispam
                if (roleadded.length > 0) {
                    for (let i = 0; i <= 25; i++) {
                        let index = i + 1;
                        var thedb = client[`roster${index != 1 ? index : ""}`]
                        thedb?.ensure(newMember.guild.id, {
                            rosterchannel: "notvalid",
                            rosteremoji: "➤",
                            rostermessage: "",
                            rostertitle: "Roster",
                            rosterstyle: "1",
                            rosterroles: [],
                            inline: false,
                        })
                        let rosterroles = thedb?.get(newMember.guild.id, "rosterroles");
                        if (rosterroles.length === 0) continue;
                        for (let i = 0; i < rosterroles.length; i++) {
                            let role = newMember.guild.roles.cache.get(rosterroles[i])
                            if(!role || role == null || role == undefined || !role.id || role.id == null) continue;
                            if (roleadded.includes(role.id)) {
                                edit_Roster_msg(client, newMember.guild, thedb);
                                await delay(1500);
                            }
                        }
                    }
                }
                //if role got removed and its one role of the db then update the embed with antispam
                else if (roleremoved.length > 0) {
                    for (let i = 0; i <= 25; i++) {
                        let index = i + 1;
                        var thedb = client[`roster${index != 1 ? index : ""}`]
                        thedb?.ensure(newMember.guild.id, {
                            rosterchannel: "notvalid",
                            rosteremoji: "➤",
                            rostermessage: "",
                            rostertitle: "Roster",
                            rosterstyle: "1",
                            rosterroles: [],
                            inline: false,
                        })
                        let rosterroles = thedb?.get(newMember.guild.id, "rosterroles");
                        if (rosterroles.length === 0) continue;
                        for (let i = 0; i < rosterroles.length; i++) {
                            let role = newMember.guild.roles.cache.get(rosterroles[i])
                            if(!role || role == null || role == undefined || !role.id || role.id == null) continue;
                            if (roleremoved.includes(role.id)) {
                                edit_Roster_msg(client,newMember.guild, thedb);
                                await delay(1500);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
    });

}
