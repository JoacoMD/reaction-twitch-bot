const tmi = require('tmi.js');
const rx = require('rxjs');

var client;

const onConnectedHandler = (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`);
    clientConnected.next(client);
}

const setConnection = (username, password, channel) => {
    const options = {
        identity: {
            username: username,
            password: password
        },
        channels: [channel]
    };
    if(client) {
        client.disconnect().catch((error) => {});
    }
    client = new tmi.client(options);
    client.on('connected', onConnectedHandler);
    return client.connect();
}

const clientConnected = new rx.Subject();

module.exports = {client, setConnection, clientConnected}