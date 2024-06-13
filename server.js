

const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const sio = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const cors = require("cors");


var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// mongoConnectWithRetry()


server.listen(4200, function () {
    console.log("Server is listening on 4200");
});


const userRooms = new Map();

var onlineUsers = []; // Object to store online users and their rooms


sio.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('USER_ONLINE', (userId, socketId) => {


        console.log("userId", userId, socketId);
        const userExisted = onlineUsers.some(user => user.userId === userId)
        const prevSocketId = userExisted?.socketId || null
        if (userExisted && prevSocketId !== socketId) {
            onlineUsers = onlineUsers.map(user => {
                return user.userId === userId ? ({ ...user, socketId: socketId }) : user
            })
        } else if (!userExisted) {
            onlineUsers.push({
                userId,
                socketId: socketId
            })
            console.log("im running", onlineUsers);
        }
        sio.emit('ONLINE_USER_CHANGED', onlineUsers)

    })

    socket.on('USER_OFFLINE', (logoutUserId) => {
        onlineUsers = onlineUsers.filter(({ userId }) => userId !== logoutUserId)
        sio.emit('ONLINE_USER_CHANGED', onlineUsers)
    })




    socket.on('ENTER_CHAT_ROOM', roomData => {
        const { roomId, message } = roomData
        console.log("roomId", roomId, message);

        console.log("socket rooms", socket.rooms);

        const currentRoom = Object.keys(socket.rooms).find(room => room !== socket.id)
        console.log("currentRoom", currentRoom, roomId);

        if (currentRoom === roomId) return
        if (currentRoom) {
            socket.leave(currentRoom)
        }


        socket.join(roomId)
        socket.to(roomId).emit('CHAT_ROOM_NOTIFY', {
            roomId,
            message
        })
    })

    socket.on('USER_TYPING', ({ senderId, receiverId, typing, message }) => {

        const receiver = onlineUsers.find(({ userId }) => userId === receiverId)


        console.log("recieverId", receiver);
        if (receiver) {

            socket.to(receiver.socketId).emit('TYPING_NOTIFY', { senderId, receiverId, typing, message })
        }

    })


    socket.on('SEND_MESSAGE', async (messageData) => {
        const { senderId, receiverId } = messageData

        console.log("im messageData", messageData);
        console.log("im receiverId", receiverId);

        const receiver = onlineUsers.find(({ userId }) => userId === receiverId)
        console.log("receiver find", receiver);



        if (typeof receiver !== undefined && receiver && "socketId" in receiver) {

            socket.to(receiver.socketId).emit('RECEIVE_MESSAGE', { ...messageData });


        }

        // Emit message back to sender
        socket.emit('RECEIVE_MESSAGE', messageData);

    })

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);

        // Remove user from onlineUsers based on socketId
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

        // Emit updated online user list to all clients
        sio.emit('ONLINE_USER_CHANGED', onlineUsers);
    });



});