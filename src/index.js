const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bot = require('./bot');
const reactions = require('./reactions');

app.set('port', 8080);
app.use(express.static(path.join(process.resourcesPath, 'public')));
// app.use(express.static('public')); use with 'npm run start'
app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.resolve(process.resourcesPath, "public/favicon.ico"));
})

const onMessageHandler = (target, context, msg, self) => {
    if (self) { return; }
    console.log(context.username, msg);
    const commandName = msg.trim().split(' ')[0];
    const targetUser = msg.trim().split(' ')[1];

    if(commandName === '!help') {
        bot.client.say(target, `/me Los comandos disponibles son: ${reactions.getListOfCommands()}`)
        return;
    }

    const el = reactions.buildReaction(commandName, context.username, targetUser);
    if(el === reactions.targetNotFound) {
        bot.client.say(target, `Debes nombrar a alguien para usar el comando ${commandName}`);
        return;
    }
    if(el) {
        io.emit('reaction', el);
    }
}

bot.clientConnected.subscribe((client) => {
    client.on('message', onMessageHandler);
})

io.on('connection', (socket) => {
    console.log("Alguien se conecto!");
})

server.listen(app.get('port'), () => {
    console.log('Server started on port', app.get('port'));
});

module.exports = {app, server}

