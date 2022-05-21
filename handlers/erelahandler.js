

module.exports = (client) => {
    //Create the client 
    require("./erela_events/creation")(client)
    //in there we are requireing the node_events + client and normal events
};


