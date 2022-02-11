
const { mongoUri } = require("../databaseUri.json");
const { Database } = require("./databasewrapper");
const { dbEnsure, delay } = require("./functions")
const OS = require("os");

module.exports = async client => {
    return new Promise(async (res) => {
    
        const connectionOptions = { 
            useUnifiedTopology: true,
            maxPoolSize: OS.cpus().length * 5,
            minPoolSize: OS.cpus().length,
            writeConcern: "majority",
        };
        /*
            if you have several Pools, mongo can use them to send data to them without "blocking" the sending from other datas
            Aka it will be faster, but needs more ram...
        */
        let dateNow = Date.now();
        console.log(`${String("[x] :: ".magenta)}Now loading the Database ...`.brightGreen)
        client.database = new Database(mongoUri, connectionOptions);
        client.database.on("ready", async () => {
            const DbPing = await client.database.ping();
            console.log(`[x] :: `.magenta + `LOADED THE DATABASE after: `.brightGreen + `${Date.now() - dateNow}ms\n       Database got a ${DbPing}ms ping`.green)
            // Creating the Tables
            client.notes = new client.database.table("notes");
            
            client.economy = new client.database.table("economy");
            
            client.invitesdb = new client.database.table("InviteData");
            
            client.tiktok = new client.database.table("tiktok");
            
            client.youtube_log = new client.database.table("youtube_log");
            
            client.mutes = new client.database.table("mutes");
            
            client.snipes = new client.database.table("snipes");
            
            client.stats = new client.database.table("stats");
            
            client.afkDB = new client.database.table("afkDB");
            
            client.musicsettings = new client.database.table("musicsettings");
            
            client.settings = new client.database.table("settings");
            
            client.jointocreatemap = new client.database.table("jointocreatemap");
            
            client.joinvc = new client.database.table("joinvc");
            
            client.setups = new client.database.table("setups");
            
            client.queuesaves = new client.database.table("queuesaves");
            
            client.modActions = new client.database.table("actions");
            
            client.userProfiles = new client.database.table("userProfiles");
            
            client.jtcsettings = new client.database.table("jtcsettings");
            
            client.roster = new client.database.table("roster");
            
            client.autosupport = new client.database.table("autosupport");
            
            client.menuticket = new client.database.table("menuticket");
            
            client.menuapply = new client.database.table("menuapply");
            
            client.apply = new client.database.table("apply");
            
            client.points = new client.database.table("points");
            
            client.voicepoints = new client.database.table("voicepoints");
            
            client.reactionrole = new client.database.table("reactionrole");
            
            client.social_log = new client.database.table("social_log");
            
            client.blacklist = new client.database.table("blacklist");
            
            client.customcommands = new client.database.table("customcommands");
            
            client.keyword = new client.database.table("keyword");
            
            client.premium = new client.database.table("premium");
            
            client.epicgamesDB = new client.database.table("epicgamesDB");
            
            client.Anti_Nuke_System = new client.database.table("Anti_Nuke_System");
            
            client.backupDB = new client.database.table("backupDB");
            
            client.giveawayDB = new client.database.table("giveawayDB");
            await dbEnsure(client.stats, "global", {
                commands: 0,
                songs: 0
            })
            await dbEnsure(client.afkDB, "REMIND", {
                REMIND: []
            });
            await dbEnsure(client.mutes, "MUTES", {
                MUTES: []
            })
            let obj = {};
            for(let i = 0; i<= 100; i++) {
                obj[`tickets${i != 0 ? i : ""}`] = [];
                obj[`menutickets${i != 0 ? i : ""}`] = [];
                obj[`applytickets${i != 0 ? i : ""}`] = [];
            }
            
            await dbEnsure(client.setups, "TICKETS", obj);
            manageGiveaways()
            res(true);
        });
        // top-level awaits
        await client.database.connect();
        async function manageGiveaways(){
            
            const { GiveawaysManager } = require('discord-giveaways');
            const CustomGiveawayManager = class extends GiveawaysManager {
                async getAllGiveaways() {
                    return await client.giveawayDB.all();
                }
                async saveGiveaway(messageId, giveawayData) {        
                    await client.giveawayDB.set(messageId, giveawayData);
                    return true;
                }
                async editGiveaway(messageId, giveawayData) {
                    await client.giveawayDB.set(messageId, giveawayData);
                    return true;
                }
                async deleteGiveaway(messageId) {
                    await client.giveawayDB.delete(messageId);
                    return true;
                }
                async refreshStorage() {
                    return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
                }
            };
            
            const manager = new CustomGiveawayManager(client, {
                default: {
                    botsCanWin: false,
                    embedColor: ee.color,
                    embedColorEnd: ee.wrongcolor,
                    reaction: '🎉'
                }
            });
            // We now have a giveawaysManager property to access the manager everywhere!
            client.giveawaysManager = manager;
            client.giveawaysManager.on("giveawayReactionAdded", async (giveaway, member, reaction) => {
                try {
                const isNotAllowed = await giveaway.exemptMembers(member);
                if (isNotAllowed) {
                    member.send({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setThumbnail(member.guild.iconURL({dynamic: true}))
                        .setAuthor(`Missing the Requirements`, `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128`)
                        .setDescription(`> **Your are not fullfilling the Requirements for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), please make sure to fullfill them!.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                        .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
                    ]
                    }).catch(() => {});
                    reaction.users.remove(member.user).catch(() => {});
                    return;
                }
                let BonusEntries = await giveaway.checkBonusEntries(member.user).catch(() => {}) || 0;
                if(!BonusEntries) BonusEntries = 0;
                member.send({
                    embeds: [
                    new MessageEmbed()
                        .setColor(ee.color)
                        .setThumbnail(member.guild.iconURL({dynamic: true}))
                        .setAuthor(`Giveaway Entry Confirmed`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
                        .setDescription(`> **Your entry for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.**\n\n**Prize:**\n> ${giveaway.prize}\n\n**Winnersamount:**\n> \`${giveaway.winnerCount}\`\n\n**Your Bonus Entries**\n> \`${BonusEntries}\`\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                        .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
                    ]
                }).catch(() => {});
                console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
                } catch (e) {
                console.log(e);
                }
            });
            client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
                try {
                member.send({
                    embeds: [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setThumbnail(member.guild.iconURL({dynamic: true}))
                        .setAuthor(`Giveaway Left!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
                        .setDescription(`> **You left [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) and aren't participating anymore.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                        .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
                    ]
                }).catch(() => {});
                console.log(`${member.user.tag} left giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
                } catch (e) {
                console.log(e);
                }
            });
            client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
                for(const winner of winners) {
                winner.send({
                    contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway.`,
                    embeds: [
                    new MessageEmbed()
                        .setColor(ee.color)
                        .setThumbnail(winner.guild.iconURL({dynamic: true}))
                        .setAuthor(`Giveaway Won!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
                        .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
                        .setFooter(winner.guild.name, winner.guild.iconURL({dynamic: true}))
                    ]
                }).catch(() => {});
                }
                console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
            });
            // This can be used to add features such as a congratulatory message per DM
            manager.on('giveawayRerolled', (giveaway, winners) => {
                for(const winner of winners) {
                winner.send({
                    contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway through a \`reroll\`.`,
                    embeds: [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setThumbnail(winner.guild.iconURL({dynamic: true}))
                        .setAuthor(`Giveaway Won!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
                        .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
                        .setFooter(winner.guild.name, winner.guild.iconURL({dynamic: true}))
                    ]
                }).catch(() => {});
                }
            })
        } 
    })
    

}