const ipc = require('electron').ipcRenderer;

ipc.send('connection-variable-request');

ipc.on('connection-data-recived', (event, prefs) => {
    document.getElementById('username').value = prefs.username ? prefs.username : ''; 
    document.getElementById('password').value = prefs.password ? prefs.password : '';
    document.getElementById('channel').value = prefs.channel ? prefs.channel : '';
});

var button = document.getElementById('connect-button');

button.addEventListener('click', () => {
    clearMessages();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const channel = document.getElementById('channel').value;

    ipc.send('connect-bot', {username, password, channel})
})

ipc.on('bot-connected', (e, data) => {
    console.log(data);
    const info = document.getElementById('info-msg');
    info.innerHTML = data;
    info.style.display = 'block';
})

ipc.on('bot-error-connection', (e, data) => {
    console.log(data);
    const error = document.getElementById('error-msg');
    error.innerHTML = data;
    error.style.display = 'block';
})

const clearMessages = () => {
    const info = document.getElementById('info-msg');
    info.innerHTML = '';
    info.style.display = 'none';
    const error = document.getElementById('error-msg');
    error.innerHTML = '';
    error.style.display = 'none';
}

