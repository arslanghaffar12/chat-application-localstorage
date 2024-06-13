export const socketListenEvent = (socket, { setSocketValue }) => {
    socket.on('connect', () => {
        setSocketValue((prev) => ({
            ...prev,
            socketId: socket.id
        }));
    });

    socket.on('ONLINE_USER_CHANGED', (onlineUsers) => {
        console.log("onlineUsers is coming",onlineUsers);
        setSocketValue((prev) => ({
            ...prev,
            onlineUsers : onlineUsers
        }));
    });

   

    // receive message
    socket.on('RECEIVE_MESSAGE', (messageData) => {
        console.log('message im recieving', messageData);
        setSocketValue((prev) => ({
            ...prev,
            messageData : messageData
        }));
    });

  

    // someone is typing
    socket.on('TYPING_NOTIFY', (typingNotify) => {
        console.log("TYPING_NOTIFY is running", typingNotify);

        setSocketValue((prev) => ({
            ...prev,
            typingNotify
        }));
    });

    socket.on('CHAT_ROOM_NOTIFY', ({ message }) => {
        console.log("CHAT_ROOM_NOTIFY is running", message);
        setSocketValue((prev) => ({
            ...prev,
            roomNotify: message
        }));
    });


};
