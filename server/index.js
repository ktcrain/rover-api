require('dotenv').config();
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const Clients = require('./clients');
// const EventEmitter = require('events').EventEmitter;

process.env.NODE_ENV='production';

const wss = new WebSocket.Server({port: 40510})

const clients = new Clients();

parseMessage = function(message) {

  defaultMessage = {
    ct: null, // clientType
    u: null, // username
    i: null, // input
    b: null, // message body
  };

  let parsedMsg;

  try {
    parsedMsg = Object.assign(defaultMessage, JSON.parse(message));
    console.log('received: %s', util.inspect(parsedMsg, {showHidden: false, depth: null}));  
  }
  catch(jsonError) {
    console.log(jsonError);
    console.log('received (non-json): %s', message);
    parsedMsg = Object.assign(defaultMessage, { body: message });
   }

   return parsedMsg;
}

wss.on('connection', function (client, req) {

  client.id = req.headers['sec-websocket-key'];

  client.on('close', () => {
    clients.deleteClient(client);
  });

  client.on('message', function (message) {
      const parsedMsg = parseMessage(message);
      clients.saveClient(parsedMsg.u, client);

      // [TODO] need to check if active driver
      if(parsedMsg.i === 'joystick') {
        const roverClient = clients.getByUsername('rover');
        if(typeof roverClient !== 'undefined') {
          const joystickMessage = {d: parsedMsg.d, x: parsedMsg.x, y: parsedMsg.y};
          roverClient.send(JSON.stringify(joystickMessage));
        }
        else {
          console.log('rover client: %s', clients.clientList['rover']);
        }
      }
  })

  setInterval(
    () => console.log('clients: %s', clients.getClientNames()),
    5000
  )
})

const app = new express();
const expressPort = process.env.PORT || 5000;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes')(app);

app.listen(expressPort, () => console.log(`Rover app listening on port ${expressPort}!`));
