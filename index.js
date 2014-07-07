// Express web-application framework is used to setup server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var id = "/";

// Set chat interface
app.get(id, function(req, res){
  res.sendfile('index.html');
});

// Get current Timestamp in hh:mm:ss format
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;    

    return hour + ":" + min + ":" + sec;

}

// Socket IO connection
io.on('connection', function(socket){
  console.log('A user connected');  
  socket.on('adduser', function(username){
	// we store the username in the socket session for this client
	socket.username = username;
	
	// echo to client they've connected
	socket.emit('chat message', 'SERVER: you are now connected');
	// echo globally (all clients) that a person has connected
	socket.broadcast.emit('chat message', 'SERVER: ' + username + ' has connected');
  });

  // When user disconnects a disconnect message is sent to all remaining clients and the server logs it
  socket.on('disconnect', function(){
    console.log('user disconnected');
	io.emit('disconnect', "SERVER: " + socket.username + " has left the conversation");	
  });
  
  // Mirrors all conversations on the Server Console.
  /*
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  */
  
  // Broadcasts every message received to every client including the one that sent the chat msg.
  socket.on('chat message', function(msg){
    io.emit('chat message', getDateTime() +": " + socket.username + ": " + msg);
  });
});

// Listen to port 3000 for connection requests
http.listen(3000, function(){
  console.log('listening on *:3000');
});
