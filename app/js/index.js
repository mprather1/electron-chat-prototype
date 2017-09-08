const {ipcRenderer} = require('electron')
let $ = require('jquery')
const Handlebars = require('handlebars')

ipcRenderer.send('connected', 'success')
ipcRenderer.send('get', 'all')

ipcRenderer.on('messages', (event, arg) => {
  var body = JSON.parse(arg.toString())

  for (let message of body) {
    $('#message').prepend(getTemplate(message))
  }
})

ipcRenderer.on('reply', (event, arg) => {
  var message = JSON.parse(arg)
  $('#message').prepend(getTemplate(message))
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

var messageTemplate = Handlebars.compile(`\
  <li> 
    <div class="avatar"> 
      <img src="#" /> 
    </div>
    <div class="messages"> 
      <strong>{{ author }}</strong> wrote:
      <p>{{ content }}</p> 
      at <time>{{ created_at }}</time>
    </div>
  </li>
`)

function getTemplate (message) {
  var retval = {
    author: message.author,
    content: message.content,
    created_at: message.created_at
  }
  var html = messageTemplate(retval)
  return html
}
