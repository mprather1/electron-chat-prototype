const {ipcRenderer} = require('electron')
let $ = require('jquery')

ipcRenderer.send('connected', 'success')
ipcRenderer.send('get', 'all')

ipcRenderer.on('messages', (event, arg) => {
  var body = JSON.parse(arg.toString())

  $('#message').html('')

  for (let message of body) {
    $('#message').append(`<li>${message.author} commented on ${message.created_at}:<br> ${message.content}</li>`)
  }
})

ipcRenderer.on('reply', (event, arg) => {
  var message = JSON.parse(arg)
  $('#message').append(`<li>${message.author} commented on ${new Date()}:<br> ${message.content}</li>`)
})

var button = document.getElementById('clicker')

button.addEventListener('click', function (e) {
  e.preventDefault()

  var messageAttrs = {
    content: $('#m').val(),
    author: 'fake-name'
  }

  ipcRenderer.send('asynchronous-message', JSON.stringify(messageAttrs))
})
