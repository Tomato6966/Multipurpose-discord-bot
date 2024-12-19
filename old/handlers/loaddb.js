const Enmap = require("enmap");
module.exports = client => {
    let dateNow = Date.now();
    console.log(`${String("[x] :: ".magenta)}Now loading the Database...`.brightGreen)
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

    client.jtcsettings = new Enmap({
        name: `jtcsettings`,
        dataDir: `./databases/jtc1`
    }); // - CHANGE TO : {jtc1 : data, jtc2: data, jtc3: data, ..., jtc100: data}
/**/client.roster = new Enmap({
        name: `roster`,
        dataDir: `./databases/roster`
    }); // - CHANGE TO : {roster1 : data, roster2: data, roster3: data, ..., roster100: data}
/**/client.autosupport = new Enmap({
        name: `autosupport`,
        dataDir: `./databases/menuticket`
    }); // - CHANGE TO : {autosupport1 : data, autosupport2: data, autosupport3: data, ..., autosupport100: data}
/**/client.menuticket = new Enmap({
        name: `menuticket`,
        dataDir: `./databases/menuticket`
    }); // - CHANGE TO : {menuticket1 : data, menuticket2: data, menuticket3: data, ..., menuticket100: data}

/**/client.menuapply = new Enmap({
        name: `menuapply`,
        dataDir: `./databases/menuticket`
    }); // - CHANGE TO : {menuapply1 : data, menuapply2: data, menuapply3: data, ..., menuapply100: data}
    
/**/client.apply = new Enmap({
        name: `apply`,
        dataDir: `./databases/apply`
    }); // - CHANGE TO : {apply1 : data, apply2: data, apply3: data, ..., apply100: data}
/*
    for (let i = 0; i <= 100; i++) {
        let index = i + 1;
        client[`jtcsettings${index != 1 ? index : ""}`] = new Enmap({
            name: `jtcsettings${index != 1 ? index : ""}`,
            dataDir: `./databases/jtc${index == 1 ? "1" : index == 2 ? "2" : "3"}`
        });
        client[`roster${index != 1 ? index : ""}`] = new Enmap({
            name: `roster${index != 1 ? index : ""}`,
            dataDir: `./databases/roster`
        });
    }
    for (let i = 1; i <= 100; i++) {
        client[`autosupport${i}`] = new Enmap({
            name: `autosupport${i != 1 ? i : ""}`,
            dataDir: `./databases/menuticket`
        });
        client[`menuticket${i}`] = new Enmap({
            name: `menuticket${i != 1 ? i : ""}`,
            dataDir: `./databases/menuticket`
        });
        client[`menuapply${i}`] = new Enmap({
            name: `menuapply${i != 1 ? i : ""}`,
            dataDir: `./databases/menuticket`
        });
        client[`apply${i}`] = new Enmap({
            name: `apply${i}`,
            dataDir: `./databases/apply${i == 1 ? "" : i == 2 ? "2" : i == 3 ? "3" : i == 4 ? "4" : "5"}`
        });
    }*/
    

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

    /**
     * ENSURE DATA
     */
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
    let ensureObject = {};
    for(let i = -1; i<=100; i++) ensureObject[`tickets${i != -1 ? i : ""}`] = [];
    for(let i = -1; i<=100; i++) ensureObject[`applytickets${i != -1 ? i : ""}`] = [];
    for(let i = -1; i<=100; i++) ensureObject[`menutickets${i != -1 ? i : ""}`] = [];
    client.setups.ensure("TICKETS", ensureObject);
    console.log(`[x] :: `.magenta + `LOADED THE DATABASES after: `.brightGreen + `${Date.now() - dateNow}ms`.green)
}