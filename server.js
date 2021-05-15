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


var usermapData = new Map();

userAndNoOfMessages = new Map();

io.on('connection', socket => {

    console.log('connected.');

    socket.on('join', data => {

        socket.join(data.room);

        console.log(data.user + ' joined the room : ' + data.room);

        var isRoomAdmin = true;
        for (const [key, value] of usermapData.entries()) {
            console.log(key, value);
            if (value.room === data.room) {
                isRoomAdmin = false;
                break;
            }
        }

        console.log('isRoom admin:  ' + isRoomAdmin);
        usermapData.set(data.user, { userName: data.user, room: data.room, roomAdmin: isRoomAdmin });

        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: 'has joined the room' });
    });

    socket.on('leave', data => {

        console.log(data.user + ' left the room : ' + data.room);

        socket.broadcast.to(data.room).emit('left room', { user: data.user, message: 'has left this room' });

        // usermapData = usermapData.filter(user => user.userName !== data.user);
        usermapData.delete(data.user);

        socket.leave(data.room);
    });

    socket.on('message', data => {
        let messageCount = userAndNoOfMessages.get(data.user);
        console.log(messageCount);
        userAndNoOfMessages.set(data.user, messageCount === undefined ? 1 : (messageCount + 1))
        console.log(userAndNoOfMessages);
        //io.in user who sent message will also get the message, whereas broadcast will not send to same user.
        usermapData.set(data.user, { userName: data.user, room: data.room, noOfMessages: userAndNoOfMessages.get(data.user), roomAdmin: usermapData.get(data.user).roomAdmin });
        io.in(data.room).emit('new message', { user: data.user, message: data.message });
    })

    socket.on('get data', data => {
        console.log(usermapData);
        var body = [];
        for (const [key, value] of usermapData.entries()) {
            console.log(key, value);
            let obj = {
                userName: key,
                data: value
            }
            body.push(obj);
        }
        io.in(data.room).emit('all users', { data: body })
    })

    socket.on('add youtube video', data1 => {
        socket.broadcast.to(data1.room).emit('youtube video added', { data: data1 })
    })

    socket.on('videoPaused', data1 => {
        socket.broadcast.to(data1.room).emit('pause video', { data: data1 })
    })

    socket.on('videoResumed', data1 => {
        socket.broadcast.to(data1.room).emit('resume video', { data: data1 })
    })
})