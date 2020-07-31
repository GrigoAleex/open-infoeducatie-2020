const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
var bodyParser = require('body-parser')
const users = []
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'open'
})

app.set('view engine', 'ejs')
app.use(express.static('app/public'))
app.use(bodyParser.urlencoded({ extended: false }));


io.on('connection', socket => {
  socket.on('join-room', ( roomId, userId ) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
  
  //* Chat 
  socket.on('new-user', ( roomId, name) => {
    let user = new Object()
    user.name = name
    user.room = roomId
    users[socket.id] = user
    socket.broadcast.emit('user-connected', users[socket.id])
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id].name, room: users[socket.id].room })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket])
    delete users[socket.id]
  })
})


//* Routes
require("./app/routes/web.routes.js")(app);

//* Set the port, listen for requests
server.listen(3000)