const server = require('./src/index');
const path = require('path');
const electron = require('electron');
const ipc = electron.ipcMain;
const bot = require('./src/bot');

const createWindow = () => {
    const win = new electron.BrowserWindow({
        width: 390,
        height: 550,
        webPreferences: {
            preload: path.join(__dirname, 'view/preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile(path.join(__dirname, 'view/index.html'))
}

console.log(__dirname);

electron.app.whenReady().then(() => {
    createWindow();

    electron.app.on('activate', () => {
        if(electron.BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

electron.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron.app.quit()
    }
})

ipc.on('connect-bot', (e, data) => {
    bot.setConnection(data.username, data.password, data.channel).then(() => {
        e.sender.send('bot-connected', 'Bot conectado');
    }).catch((reason) => e.sender.send('bot-error-connection', reason));
})