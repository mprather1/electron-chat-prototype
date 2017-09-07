const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const got = require('got')
var io = require('socket.io-client')
var socket = io.connect('ws://localhost:55445')

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 800, frame: false, resizable: false})

  ipcMain.once('connected', (event, arg) => {
    socket.on('message', message => {
      event.sender.send('reply', message)
    })
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
    socket.disconnect()
  })
}

ipcMain.on('asynchronous-message', (event, arg) => {
  got.post('http://localhost:55445/messages', {
    body: arg
  })
})

ipcMain.on('get', (event, arg) => {
  if (arg === 'all') {
    let stream = got.stream('http://localhost:55445/messages')
    var body = []
    stream.on('data', result => {
      body.push(result)
    })

    stream.on('end', () => {
      event.sender.send('messages', body)
      event.sender.send('test', ipcMain)
    })
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
