import { io } from 'socket.io-client';
import { socketListenEvent } from './socketOn';

export const initSocket = ({ setSocketValue }) => {
    const endPoint = "http://localhost:4200";
    const socket = io(endPoint);

    // this is whole listeing event 
    socketListenEvent(socket, { setSocketValue });

    // setting socket value
    setSocketValue((prev) => ({ ...prev, socket }));

    // return {
    //   socket,
    //   disconnect: () => {
    //     console.log('DISCONNECT')
    //     setSocketValue(INIT_SOCKET_STATE)
    //     socket.disconnect()
    //   }
    // }
};
