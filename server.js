const express = require('express')
const socketIO = require("socket.io");
const app = express();
const server = app.listen(8000);
const io = socketIO(server);
const path = require("path");

var users = {};
var name = '';

// const httpPort = 8000;

app.use(express.static(path.join(__dirname, '_public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '_public/index.html'))
})

app.get('/:name', function(req, res){
  name = req.params.name;
  res.sendFile(path.join(__dirname, "_public/First.html"));
});

io.sockets.on("connection", function(socket){
  users[socket.id] = name;
  // node
  socket.on("nRoom", function(room){
      socket.join(room);
      socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
  });

  socket.on("node new message", function(data){
      io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
  });
});

// app.listen(httpPort, function () {
//   console.log(`Listening on port ${httpPort}!`)
// })