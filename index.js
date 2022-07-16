const { Manager } = require("discord-hybrid-sharding");
const { Client } = require('discord-cross-hosting');
const config = require("./botconfig/config.json");
const colors = require("colors");
const OS = require("os");
const { authToken, settings: BridgeSettings } = require("./bridge_config.json");

const client = new Client({
    agent: 'bot',
    host: '193.milrato.dev', // Domain without https
    port: 19273, // Proxy Connection (Replit) needs Port 443
    handshake: true, // When Replit or any other Proxy is used
    authToken: authToken,
    retries: 360,
    rollingRestarts: false, // Enable, when bot should respawn when cluster list changes.
});

client.on('debug', console.log);
client.connect();

const manager = new Manager("./bot.js", { 
    token: config.token,     
    totalShards: BridgeSettings.totalShards,
    mode: "process", // "process" or: "worker"
    respawn: true, 
    usev13: true,
    keepAlive: {
       interval: 10000,
       maxMissedHeartbeats: 5,
       maxClusterRestarts: 3,
    }
});
manager.on("clusterCreate", cluster => {
    console.log(`[SHARDING-MANAGER]: `.magenta + `Launched Cluster #${cluster.id} | ${cluster.id+1}/${cluster.manager.totalClusters} [${cluster.manager.shardsPerClusters}/${cluster.manager.totalShards} Shards]`.green)

    cluster.on("death", function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} died..`)}`);
    });

    cluster.on("message", async (msg) => {
        if(!msg._sCustom) return
        if (msg.dm) {
            const { interaction, message, dm, packet } = msg
            await manager.broadcast({ interaction, message, dm, packet })
        }
    })

    cluster.on("message", async (message) => {
        return;
        if (!message._sRequest) return;
        if (message.guildId && !message.eval) {
            console.log("MANAGER - received message for guildId", message.guildId);
            await manager.broadcast({ guildId: message.guildId })
        }
    })

    cluster.on("error", e => {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} errored ..`)}`);
        console.error(e);
    })
    
    cluster.on("disconnect", function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} disconnected..`)}`);
    });

    cluster.on("reconnecting", function () {
        console.log(`${colors.yellow.bold(`Cluster ${cluster.id} reconnecting..`)}`);
    });

    cluster.on("close", function (code) {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} close with code ${code}`)}`);
    });

    cluster.on("exit", function (code) {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} exited with code ${code}`)}`);
    });
});

manager.on('clientRequest', async (message) => {
    if(message._sRequest && message.songRequest){
        if(message.target === 0 || message.target) {
            const msg = await manager.clusters.get(message.target).request(message.raw);
            message.reply(msg)
        } else {
            manager.clusters.forEach(async cluster => {
               const msg = await cluster.request(message.raw);
               message.reply(msg)
            })
        }
    }
})

// Log the creation of the debug
manager.on("debug", (d) => console.log(d))

client.listen(manager);
client.requestShardData().then(e => {
    if (!e) return;
    if (!e.shardList) return;
    manager.totalShards = e.totalShards;
    manager.totalClusters = e.shardList.length;
    manager.shardList = e.shardList;
    manager.clusterList = e.clusterList;
    console.table({ shards: manager.shardList, cluster: manager.clusterList })
    manager.spawn({ timeout: -1 });
}).catch(console.error);
/*
setInterval(() => {

    client.requestToGuild({ guildId: "773668217163218944" })
        .then(e => console.log(e))
        .catch(e => console.log(e));
}, 30_000)
*/
client.on('bridgeMessage', message => {
    return;
    if (!message._sCustom) return; // If message is a Internal Message
    console.log("BRIDGE-INDEX-MESSAGE", message);
});

client.on('bridgeRequest', message => {
    return;
    if (!message._sCustom && !message._sRequest) return; // If message is a Internal Message
    console.log("BRIDGE-INDEX-REQUEST", message);
    if (message.ack) return message.reply({ message: 'I am alive!' });
    message.reply({ data: 'Hello World' });
});
