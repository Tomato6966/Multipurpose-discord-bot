//here the event starts
module.exports = (client, event, id) => {
    console.log(` || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Shard #${id} Disconnected || <==> ||`)
}

