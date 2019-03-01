const _ = require('lodash');
const Clients = require('../clients');
const Parser = require('./parser');
const WebSocket = require('ws');

module.exports = class Messenger {

    constructor() {
        this.wss = new WebSocket.Server({port: 40510})
        this.clients = new Clients();
        this.parser = new Parser();

        this.bindListeners();
    }

    getWebsockerServer() {
        return this.wss;
    }

    bindListeners(cb) {
        this.wss.on('connection', this.onClientConnection.bind(this));      
    }

    /**
     * [TODO] Clean this up and abstract as pub/sub instead of stupid business logic here
     * @param {*} client 
     * @param {*} req 
     */
    onClientConnection(client, req) {
        
        client.id = req.headers['sec-websocket-key'];
      
        client.on('close', () => {
          this.clients.deleteClient(client);
        });
      
        client.on('message', (message) => {
            const parsedMsg = this.parser.parse(message);

            if(parsedMsg.b === 'connected') {
              this.clients.saveClient(client, parsedMsg);
            }
      
            // [TODO] need to check if active driver
            if(parsedMsg.i === 'joystick') {
              const roverClient = this.clients.getByUsername('rover');
              if(typeof roverClient !== 'undefined') {
                const joystickMessage = {d: parsedMsg.d, x: parsedMsg.x, y: parsedMsg.y};
                roverClient.send(JSON.stringify(joystickMessage));
              }
              else {
                console.log('rover client: %s', this.clients.clientList['rover']);
              }
            }
        });

        setInterval(
            () => console.log('clients: %s', this.clients.getClientNames()),
            5000
        )
    }
}