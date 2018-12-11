# Draw N' Chat
This is a web app where users can sign up and participate in a group chat. They communicate by drawing on a canvas and sending their drawings.

## Set Up the App
This app uses Node.js, socket.io, rita, random words, ejs and Express framework.
1. Download the zip file or clone this respository to your desired directory on your computer.
2. Download [node.js](https://nodejs.org/en/download/)
3. In your terminal, navigate to your directory that contain the respository and type in `npm install express`, `npm install socket.io`, `npm install rita`, `npm install random-words`, `npm install ejs` to install the packages.

## Run & Test the App
1. In your terminal, navigate to the directory containing the files, and type in `node server.js` to run the app. It should start a server at `localhost/3000`.
2. Visit the page and if you don't have an account, go to sign up page.
3. Usernames are randomly generated, and you may randomize it until you like the one.
4. Double check password and submit the form.
5. If all valid, a canvas will occur, you may draw your avatar on the canvas.
6. You may still continue to log in if you don't draw anything, a placeholder image will be given.
7. Now log in with your username and if all valid, you may enter the chat.
8. Start drawing and press submit button to send your drawings, note the canvas cannot be empty.

There are drawing options and sliders to change the pen type, color, alpha and such. 

________________________
By Alex Yixuan Xu