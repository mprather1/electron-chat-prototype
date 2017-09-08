const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const got = require('got')
var io = require('socket.io-client')
var socket = io.connect('ws://localhost:55445')

let win
let loginView

ipcMain.on('test', (event, arg) => {
  got.post('http://localhost:55445/login', {
    body: arg
  })
  .then(res => {
    var body = JSON.parse(res.body)
    if (body.message !== 'failure') {
      createWindow()
    }
  })
  .catch(err => {
    console.log(err)
  })
})

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    frame: false,
    resizable: true
  })

  ipcMain.once('connected', (event, arg) => {
    loginView.close()

    socket.on('message', (message, result) => {
      event.sender.send('reply', message, result)
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

function login () {
  loginView = new BrowserWindow({
    width: 200,
    height: 170,
    frame: false,
    resizable: true
  })

  loginView.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'login.html'),
    protocol: 'file:',
    slashes: true
  }))

  loginView.on('closed', () => {
    loginView = null
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
    })
  }
})

app.on('ready', login)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
