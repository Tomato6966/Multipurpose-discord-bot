const {
    edit_Roster_msg, dbEnsure, delay
} = require(`./functions`);

module.exports = (client) => {

    const maxRoster = 100;
    
    var CronJob = require('cron').CronJob;
    client.Jobroster = new CronJob('0 */30 * * * *', async function() {
        client.guilds.cache.map(async guild => {
            let thedb = client.roster;
            let rawData = await thedb.all();
            let GuildData = rawData.find(d => d.ID == guild.id)?.data;
            for (let i = 1; i <= maxRoster; i++) {
                var pre = `roster${i}`;
                if(GuildData?.[pre]?.rosterchannel?.length > "notvalid".length)
                {
                    let channel = GuildData?.[pre]?.rosterchannel
                    if(!channel || channel.length <= "notvalid".length) continue;
                    let realchannel = guild.channels.cache.get(channel);
                    if(!realchannel) continue;
                    edit_Roster_msg(client, guild, thedb, pre)
                } else {
                    continue;
                }
            }
        });
    }, null, true, 'Europe/Berlin');
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
                let thedb = client.roster;
                let rawData = await thedb.all();
                let GuildData = rawData.find(d => d.ID == newMember.guild.id)?.data;
                //if role got ADDED and its one role of the db then update the embed with antispam
                if (roleadded.length > 0) {
                    
                    for (let i = 1; i <= maxRoster; i++) {
                        var pre = `roster${i}`;
                        if(GuildData?.[pre]) {
                            const d = GuildData?.[pre]
                            if(d?.rosterchannel?.length > "notvalid".length)
                            {
                                let rosterroles = d?.rosterroles;
                                if (!rosterroles || rosterroles?.length === 0) continue;
                                for (let i = 0; i < rosterroles.length; i++) {
                                    let role = newMember.guild.roles.cache.get(rosterroles[i])
                                    if(!role || role == null || role == undefined || !role.id || role.id == null) continue;
                                    if (roleadded.includes(role.id)) {
                                        edit_Roster_msg(client, newMember.guild, thedb, pre);
                                        await delay(1500);
                                    }
                                }
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    }
                }
                //if role got removed and its one role of the db then update the embed with antispam
                else if (roleremoved.length > 0) {
                    for (let i = 1; i <= maxRoster; i++) {
                        var pre = `roster${i}`;
                        if(GuildData?.[pre]) {
                            const d = GuildData?.[pre]
                            if(d?.rosterchannel?.length > "notvalid".length)
                            {
                                let rosterroles = d?.rosterroles;
                                if (rosterroles?.length === 0) continue;
                                for (let i = 0; i < rosterroles.length; i++) {
                                    let role = newMember.guild.roles.cache.get(rosterroles[i])
                                    if(!role || role == null || role == undefined || !role.id || role.id == null) continue;
                                    if (roleremoved.includes(role.id)) {
                                        edit_Roster_msg(client,newMember.guild, thedb, pre);
                                        await delay(1500);
                                    }
                                }
                            }else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e)
        }
    });

}
