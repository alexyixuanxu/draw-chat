const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function(req, res){
	// send chat.html when in index directory
	res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('send canvas', function(data){
		io.emit('send canvas', data);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});


server.listen(3000, function(){
	console.log('listening on port 3000');
});