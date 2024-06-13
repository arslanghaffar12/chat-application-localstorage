import React, { useCallback, useContext, useState } from 'react'
import io from 'socket.io-client';
import { initSocket } from '../socket';


const INIT_SOCKET_STATE = {
    socket: null,
    socketId: null,
    onlineUsers: null,
    messageData: null,
    messageReadStatus: null,
    typingNotify: null,
    roomNotify: null,
    invitedNotify: null
};

const SocketContext = React.createContext(INIT_SOCKET_STATE);
export const useSocketContext = () => useContext(SocketContext);


const SocketProvider = ({ children }) => {


//  socket state that is for whole app
    const [socket, setSocketValue] = useState(INIT_SOCKET_STATE);

    console.log("hi im running socket in socket", socket);

    // initsocket is connection and all our other 

    const socketConnect = useCallback(() => {
        return initSocket({ setSocketValue });
    }, []);

  
    const resetSocketValue = useCallback((key) => {
        key ? setSocketValue((prev) => ({ ...prev, [key]: null })) : setSocketValue(INIT_SOCKET_STATE);
    }, []);



    return (

        <SocketContext.Provider value={{ socket, socketConnect, setSocketValue, resetSocketValue }}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }
