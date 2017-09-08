const $ = require('jquery')
const {ipcRenderer} = require('electron')
var log = document.getElementById('login-submit')
log.addEventListener('click', (e) => {
  e.preventDefault()
  var loginAttrs = {
    username: $('#username-input').val(),
    password: $('#password-input').val()
  }
  ipcRenderer.send('test', JSON.stringify(loginAttrs))
})
