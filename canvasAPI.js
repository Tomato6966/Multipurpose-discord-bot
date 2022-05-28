/**
 * this file MUST be exeucted externally.
 * Means that the bot can enter the functions from a different process, making it FASTER
 * that's very neat and useful!
 * If it's not executed, no worries, it will still work but be slower!
 */
const express = require("express");
const Canvas = require("canvas");
const canvacord = require("canvacord");
const MilratoCanvasApi = require("./handlers/CanvasApi");
const apiSettings = {
  "valid": [
    "734513783338434591"
  ],
  "ip" : "localhost",
  "port": 4040
};
const { valid, port } = apiSettings;

module.exports = apiSettings;

const bodyParser = require('body-parser');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw());
app.get("/", (request, response) => {
  response.send("Hello!<br /><b>Endpoints</b>: <br />/levelUpCard")
})


app.post("/levelUpCard", async (request, response) => {
    if(!request.query || !request.query.token || !validateToken(request.query.token)) { 
      return response.json({error: "Invalid Token added!"});
    }
    try {
      const time = Date.now();
      console.log("/levelUpCard | received a Canvas Request")
      const responseBuffer = await MilratoCanvasApi.levelUpCard(request.body);
      console.log(`/levelUpCard | Finished with the Buffer after ${Date.now() - time}ms`)
      return response.json({ buffer: responseBuffer.toString('base64') });
    } catch (e) {
      console.error(e);
      return response.json({error: e});
    }
})

app.post("/rankCard", async (request, response) => {
    if(!request.query || !request.query.token || !validateToken(request.query.token)) { 
      return response.json({error: "Invalid Token added!"});
    }
    try {
      const time = Date.now();
      console.log("/rankCard | received a Canvas Request")
      const responseBuffer = await MilratoCanvasApi.rankCard(request.body);
      console.log(`/rankCard | Finished with the Buffer after ${Date.now() - time}ms`)
      return response.json({ buffer: responseBuffer.toString('base64') });
    } catch (e) {
      console.error(e);
      return response.json({error: e});
    }
})

app.post("/leaderBoardCard", async (request, response) => {
  if(!request.query || !request.query.token || !validateToken(request.query.token)) { 
    return response.json({error: "Invalid Token added!"});
  }
  try {
    const time = Date.now();
    console.log("/leaderBoardCard | received a Canvas Request")
    const responseBuffer = await MilratoCanvasApi.leaderBoardCard(request.body);
    console.log(`/leaderBoardCard | Finished with the Buffer after ${Date.now() - time}ms`)
    return response.json({ buffer: responseBuffer.toString('base64') });
  } catch (e) {
    console.error(e);
    return response.json({error: e});
  }
})


app.post("/welcomeDm", async (request, response) => {
  if(!request.query || !request.query.token || !validateToken(request.query.token)) { 
    return response.json({error: "Invalid Token added!"});
  }
  try {
    const time = Date.now();
    console.log("/welcomeDm | received a Canvas Request")
    const responseBuffer = await MilratoCanvasApi.welcomeDm(request.body);
    console.log(`/welcomeDm | Finished with the Buffer after ${Date.now() - time}ms`)
    return response.json({ buffer: responseBuffer.toString('base64') });
  } catch (e) {
    console.error(e);
    return response.json({error: e});
  }
})
app.post("/welcomeChannel", async (request, response) => {
  if(!request.query || !request.query.token || !validateToken(request.query.token)) { 
    return response.json({error: "Invalid Token added!"});
  }
  try {
    const time = Date.now();
    console.log("/welcomeChannel | received a Canvas Request")
    const responseBuffer = await MilratoCanvasApi.welcomeChannel(request.body);
    console.log(`/welcomeChannel | Finished with the Buffer after ${Date.now() - time}ms`)
    return response.json({ buffer: responseBuffer.toString('base64') });
  } catch (e) {
    console.error(e);
    return response.json({error: e});
  }
})







app.listen(port, () => {
  console.log(`Website online on port ${port}`);
})

function validateToken(token) {
  if(valid.includes(token)) {
    return true;
  } else {
    return false;
  }
}