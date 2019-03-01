const _ = require('lodash');
const util = require('util');

module.exports = class Clients {

    constructor() {
        this.clientList = [];
    }

    saveClient(username, client) {
        if(username === 'unknown' || this.getByUsername(username)) { return; }
        client.username = username;
        this.clientList.push(client);
    }

    deleteClient(client) {
        _.remove(this.clientList, { 'id': client.id });
    }

    getClients() {
        return this.clientList;
    }
    
    getById(id) {
        return _.find(this.clientList, { 'id': id });
    }

    getByUsername(username) {
        return _.find(this.clientList, { 'username': username });
    }

    getClientNames() {
        return _.map(this.clientList, 'username');
    }
}