const Enmap = require("enmap");
module.exports = client => {

    //Each Database gets a own file and folder which is pretty handy!
    client.notes = new Enmap({
        name: "notes",
        dataDir: "./databases/economy"
    });
    client.economy = new Enmap({
        name: "economy",
        dataDir: "./databases/economy"
    });
    client.invitesdb = new Enmap({
        name: "InviteData",
        dataDir: "./databases/economy"
    });
    client.tiktok = new Enmap({
        name: "youtube_log",
        dataDir: "./social_log/youtubelog"
    });
    client.youtube_log = new Enmap({
        name: "youtube_log",
        dataDir: "./social_log/youtubelog"
    });
    client.premium = new Enmap({
        name: "premium",
        dataDir: "./databases/premium"
    });
    client.mutes = new Enmap({
        name: "mutes",
        dataDir: "./databases/premium"
    });
    client.snipes = new Enmap({
        name: "snipes",
        dataDir: "./databases/premium"
    });
    client.stats = new Enmap({
        name: "stats",
        dataDir: "./databases/stats"
    });
    client.afkDB = new Enmap({
        name: "afkDB",
        dataDir: "./databases/stats"
    });
    //somewhere declare the database!
    client.musicsettings = new Enmap({
        name: "musicsettings",
        dataDir: "./databases/settings"
    });
    client.settings = new Enmap({
        name: "settings",
        dataDir: "./databases/settings"
    });
    for (let i = 0; i <= 25; i++) {
        let index = i + 1;
        client[`jtcsettings${index != 1 ? index : ""}`] = new Enmap({
            name: `jtcsettings${index != 1 ? index : ""}`,
            dataDir: `./databases/jtc${index == 1 ? "1" : index == 2 ? "2" : "3"}`
        });
    }
    client.jointocreatemap = new Enmap({
        name: "jointocreatemap",
        dataDir: "./databases/jointocreatemap"
    });
    client.joinvc = new Enmap({
        name: "joinvc",
        dataDir: "./databases/jointocreatemap"
    });
    client.setups = new Enmap({
        name: "setups",
        dataDir: "./databases/setups",
    });
    client.queuesaves = new Enmap({
        name: "queuesaves",
        dataDir: "./databases/queuesaves",
        ensureProps: false
    });
    client.modActions = new Enmap({
        name: 'actions',
        dataDir: "./databases/warns"
    });
    client.userProfiles = new Enmap({
        name: 'userProfiles',
        dataDir: "./databases/warns"
    });


    client.autosupport1 = new Enmap({
        name: "autosupport",
        dataDir: "./databases/menuticket"
    });
    client.autosupport2 = new Enmap({
        name: "autosupport2",
        dataDir: "./databases/menuticket"
    });
    client.autosupport3 = new Enmap({
        name: "autosupport3",
        dataDir: "./databases/menuticket"
    });
    client.menuticket1 = new Enmap({
        name: "menuticket",
        dataDir: "./databases/menuticket"
    });
    client.menuticket2 = new Enmap({
        name: "menuticket2",
        dataDir: "./databases/menuticket"
    });
    client.menuticket3 = new Enmap({
        name: "menuticket3",
        dataDir: "./databases/menuticket"
    });
    client.menuapply1 = new Enmap({
        name: "menuapply",
        dataDir: "./databases/menuticket"
    });
    client.menuapply2 = new Enmap({
        name: "menuapply2",
        dataDir: "./databases/menuticket"
    });
    client.menuapply3 = new Enmap({
        name: "menuapply3",
        dataDir: "./databases/menuticket"
    });

    client.apply = new Enmap({
        name: "apply",
        dataDir: "./databases/apply"
    });
    client.apply2 = new Enmap({
        name: "apply2",
        dataDir: "./databases/apply2"
    });
    client.apply3 = new Enmap({
        name: "apply3",
        dataDir: "./databases/apply3"
    });
    client.apply4 = new Enmap({
        name: "apply4",
        dataDir: "./databases/apply4"
    });
    client.apply5 = new Enmap({
        name: "apply5",
        dataDir: "./databases/apply5"
    });
    require("fs").readdirSync("./handlers/applies").forEach(file => {
        let filename = String(file).replace(".js", "")
        client[`${filename}`] = new Enmap({
            name: `${filename}`,
            dataDir: "./databases/otherapplies"
        });
    });



    client.points = new Enmap({
        name: "points",
        dataDir: "./databases/ranking"
    });
    client.voicepoints = new Enmap({
        name: "voicepoints",
        dataDir: "./databases/ranking"
    });
    client.reactionrole = new Enmap({
        name: "reactionrole",
        dataDir: "./databases/reactionrole"
    });
    for (let i = 0; i <= 25; i++) {
        let index = i + 1;
        client[`roster${index != 1 ? index : ""}`] = new Enmap({
            name: `roster${index != 1 ? index : ""}`,
            dataDir: `./databases/roster`
        });
    }
    client.social_log = new Enmap({
        name: "social_log",
        dataDir: "./databases/social_log"
    });
    client.blacklist = new Enmap({
        name: "blacklist",
        dataDir: "./databases/blacklist"
    });
    client.customcommands = new Enmap({
        name: "custom commands",
        dataDir: "./databases/customcommands"
    });
    client.keyword = new Enmap({
        name: "keyword",
        dataDir: "./databases/keyword"
    });















    client.premium.ensure("premiumlist", {
        list: [
            /*{
                "u": "XXXYYYXXXYYYXXXYYY"
                }, {
                "g": "XXXYYYXXXYYYXXXYYY"
                }*/
            ]
      })
    client.stats.ensure("global", {
        commands: 0,
        songs: 0,
        setups: 0
    });
    client.mutes.ensure("MUTES", {
        MUTES: []
    })
    client.afkDB.ensure("REMIND", {
        REMIND: []
    });
    client.setups.ensure("TICKETS", {
        tickets: [],
        tickets1: [],
        tickets2: [],
        tickets3: [],
        tickets4: [],
        tickets5: [],
        tickets6: [],
        tickets7: [],
        tickets8: [],
        tickets9: [],
        tickets10: [],
        tickets11: [],
        tickets12: [],
        tickets13: [],
        tickets14: [],
        tickets15: [],
        tickets16: [],
        tickets17: [],
        tickets18: [],
        tickets19: [],
        tickets20: [],
        tickets21: [],
        tickets22: [],
        tickets23: [],
        tickets24: [],
        tickets25: [],
        applytickets1: [],
        applytickets2: [],
        applytickets3: [],
        applytickets4: [],
        applytickets5: [],
        applytickets6: [],
        applytickets7: [],
        applytickets8: [],
        applytickets9: [],
        applytickets10: [],
        applytickets11: [],
        applytickets12: [],
        applytickets13: [],
        applytickets14: [],
        applytickets15: [],
        applytickets16: [],
        applytickets17: [],
        applytickets18: [],
        applytickets19: [],
        applytickets20: [],
        applytickets21: [],
        applytickets22: [],
        applytickets23: [],
        applytickets24: [],
        applytickets25: [],
        menutickets: [],
        menutickets0: [],
        menutickets1: [],
        menutickets2: [],
        menutickets3: [],
        menutickets4: [],
        menutickets5: [],
        menutickets6: [],
        menutickets7: [],
        menutickets8: [],
        menutickets9: [],
        menutickets10: [],
        menutickets11: [],
        menutickets12: [],
        menutickets13: [],
        menutickets14: [],
        menutickets15: [],
        menutickets16: [],
        menutickets17: [],
        menutickets18: [],
        menutickets19: [],
        menutickets20: [],
        menutickets21: [],
        menutickets22: [],
        menutickets23: [],
        menutickets24: [],
        menutickets25: [],
    });
}