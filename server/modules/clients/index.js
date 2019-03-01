const _ = require('lodash');
const util = require('util');

module.exports = class Clients {

    constructor() {
        this.clientList = [];
    }

    saveClient(client, params) {
        const { u, ct } = params;

        // [TODO] input validation; should not have gotten this far...
        if(u === null) { return; }

        const existingClient = this.getByUsername(u);

        // [TODO] fix reconnection issues
        client.username = u;
        client.type = ct;
        client.joinedAt = new Date();
        this.clientList.push(client);

        if(existingClient) {
            console.log('removing old instance of client %s', existingClient.id)
            this.deleteClient(existingClient);
        }
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

    getWaitList() {
        return _(this.clientList)
        .filter({'type': 'user'})
        .sortBy(['joinedAt'])
        .map(obj => _.pick(obj, ['id', 'username', 'joinedAt']))
        .value();
    }
}