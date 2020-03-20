
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { addUser, removeUser, getUser, getUsersInRomm } = require('./users.js');

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        console.log('join');
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` }); //broadcast beside that user

        socket.join(user.room);

        callback(); //Error hadnler that send error message 

    });

    socket.on('sendMessage', (message, callback) => { //socket.on take in two things (keystring , arrow function)
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        callback();
    })

    socket.on('disconnect', () => {
        console.log('User had left');
    })

});


app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));