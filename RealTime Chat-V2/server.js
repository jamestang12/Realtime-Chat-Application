const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io')
const io = socketio(server);
const formatMessage = require('./utlis/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utlis/users');

const botName = 'Chat Bot';

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Run when client connect
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id ,username,room);

        socket.join(user.room);


        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users and info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    console.log("New WS Connection....");

    

    //Runs when client disconnects

  
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log('test');
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));


            // Send users and info so it call the outputRoomName(room); and outputUser(users); to reload the users list

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

        
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server running on port ${PORT}`));