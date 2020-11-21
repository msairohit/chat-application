const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
})

server.listen(3000, () => {
    console.log("listening..");
})


var usermapData = [];

io.on('connection', socket => {

    console.log('connected.');

    socket.on('join', data => {

        socket.join(data.room);

        console.log(data.user + ' joined the room : ' + data.room);

        usermapData.push({ userName: data.user, room: data.room });

        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: 'has joined the room' });
    });

    socket.on('leave', data => {

        console.log(data.user + ' left the room : ' + data.room);

        socket.broadcast.to(data.room).emit('left room', { user: data.user, message: 'has left this room' });

        usermapData = usermapData.filter(user => user.userName !== data.user);

        socket.leave(data.room);
    });

    socket.on('message', data => {
        //io.in user who sent message will also get the message, whereas broadcast will not send to same user.
        io.in(data.room).emit('new message', { user: data.user, message: data.message });
    })

    socket.on('get data', data => {
        io.in(data.room).emit('all users', { data: usermapData })
    })
})