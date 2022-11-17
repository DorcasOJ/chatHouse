const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require("socket.io");

const app = express()
const server = http.createServer(app);
const io = socketio()
const port = 3000 || process.env.PORT

//Set satic folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = "ChatCord Bot";

// Run when client connect
io.on("connection", (socket) => {
    console.log(io.of("/").adapter);
    socket.on("joinRoom", ({username, room }) => {
        
    })
})


// app.get('/', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`app listening on port ${port}!`))