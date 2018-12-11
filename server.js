const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');

// server stuff
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// random name stuff
const randomWords = require('random-words');
const rita = require('rita');

// read data from the JSON file
let usersFile = fs.readFileSync('users.json');
let chatFile =fs.readFileSync('chat.json');
//this line parses the raw data to make it readable and interprets it as a JavaScript object
let usersData = JSON.parse(usersFile); // users data contains: {userid, username, avatar} of multiple users
let chatData = JSON.parse(chatFile); // chat data contains: {userid, username, avatar, message}
let currentId = usersData.length; // keep track of number of users signed up

// parse stuff from front end
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

////////////////// INDEX PAGE ///////////////////////
// the same page as login, chat
// if user authorized, send chat page
// if not, render log in
app.get('/', function(req, res){
	res.render('login', {error: null});
});

app.post('/', function(req, res){
	let username = req.body.username;
	let password = req.body.password;

	let userFound = false;
	let userIndex = null;

	// find if username exist
	for (let i=0; i<usersData.length; i++){
		// if exist, move on to check password
		if (usersData[i].username === username){
			userFound = true;
			userIndex = i;
		}
	}

	// found user after loop, compare password
	if (userFound){
		if (password === usersData[userIndex].password){
			// move on to voting if everything matches!
			res.render('chat', {userid: usersData[userIndex].userid, username: usersData[userIndex].username, avatar: usersData[userIndex].avatar});
		}
		else{
			res.render('login', {error: 'Wrong password! Oops!'});
		}
	}
	// no such username, render error
	else{
		res.render('login', {error: 'No username found! Try again!'});
	}
});

///////////////// SIGN UP PAGE ///////////////////////
// writing to users files
// drawing to avatars
// linking  to log in page
app.get('/signup', function(req, res){
	// sign up
	res.render('signup', {success: null, error: null, userid: null, username: null});
});

app.post('/signup', function(req, res){
	let username = req.body.username;
	let password = req.body.password;
	let confirm_password = req.body.confirm_password;
	let repeatUsername = false; // checking if username already exist

	// check for validity
	// check if username already exist
	for (let i=0; i<usersData.length; i++){
		if (usersData[i].username === username){
			repeatUsername = true;	
		}
	}

	// if repeat, render error
	if (repeatUsername){
		res.render('signup', {success: null, error: 'Username already exists, try again!', userid: null, username: null});
	}
	// no repeat, move on to check password
	else{
		// check if passwords are empty
		if (password===''){
			res.render('signup', {success: null, error: "Password cannot be empty!", userid: null, username: null});
		}
		// check two passwords are the same
		else if (password===confirm_password){
			// password matched! 
			// assign an userid
			// write a default avatar src
			let userid = currentId;
			usersData.push({userid: userid, username: username, password: password, avatar: "https://www.fillmurray.com/500/500"});
			let finalUserData = JSON.stringify(usersData);
			fs.writeFile('users.json', finalUserData, finished);
			function finished(err) {
				currentId += 1; // one more user!
				console.log('file written: '+req.body);
				// let user draw
				res.render('signup', {success: "registered!", error: null, userid: userid, username: username});
			}
		}
		// if two passwords are not the same
		else{
			res.render('signup', {success: null, error: "Passwords don't match, try again!", userid: null, username: null});
		}		
	}
});

///////////////////////////////////////// Random Name Stuff ///////////////////////////////////////////////////////
function newName(){
	// name grammar:
	// 2 or 3 words, must be adj & noun
	let wordCount = Math.round(Math.random())+2; // randomly generate 2 or 3
	console.log(wordCount+' word name')
	let name = '';
	let wordsArr = [];

	while (wordsArr.length < wordCount){
		let word = randomWords();
		if (rita.isNoun(word) || rita.isAdjective(word)){
			wordsArr.push(word);
		}
	}	

	for (let i=0; i<wordsArr.length; i++){
		name += capitalize(wordsArr[i]) +' ';
	}
	
	let newName = name.trim();
	console.log(newName);
	return newName;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


////////////////////////////////////////// Socket.io ////////////////////////////////////////////
io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('generate name', function(data){
		data.newName = newName();
		io.emit('generate name', data);
	});

	socket.on('send avatar', function(data){
		io.emit('send avatar', data);
		let userid = data.userid;
		let avatar = data.avatar;
		changeAvatar(userid, avatar);
	});

	/*
	socket.on('get chat', function(data){
		data.chatData = chatData;
		io.emit('get chat', data);
	})
	*/

	socket.on('send canvas', function(data){
		let userid = data.userid;
		let message = data.message;
		let username = usersData[userid].username;
		let avatar = usersData[userid].avatar;
		// send new info to client side
		data.username = username;
		data.avatar = avatar;
		//saveMessage(data); // save to chat data
		io.emit('send canvas', data);

	});
});

function changeAvatar(userid, avatar){
	usersData[userid].avatar = avatar;
	// write files
	let finalUserData = JSON.stringify(usersData);
	fs.writeFile('users.json', finalUserData, changed);
	function changed(err) {
		console.log('changed avatar for '+usersData[userid].username);
	}
}

function saveMessage(data){
	// write into chat file
	chatData.push(data);
	let finalChatData = JSON.stringify(chatData);
	fs.writeFile('chat.json', finalChatData, updatedChat);
	function updatedChat(err) {
		console.log('saved a message from ' + data.username);
	}
}

server.listen(3000, function(){
	console.log('listening on port 3000');
});