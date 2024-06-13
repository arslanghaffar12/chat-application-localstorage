import React, { useEffect, useState } from 'react';


import logo5 from "../assets/moto5.jpg"
import { useSelector } from 'react-redux';
import { generateUniqueID } from '../helpers/common';
import { ChatContextProvider, useChatContext } from '../context/chatContext';
import { socketEmitEvent } from '../socket/socketEmit';
import Summary from './Summary';
import { useSocketContext } from '../context/socket';



export default function Home() {


// get currentUser from redux
  const currentUser = useSelector(state => state.auth.user);


  const { socketConnect, socket: { socket, socketId, onlineUsers } } = useSocketContext();

  console.log("hi im running socket in app.js", onlineUsers);


  useEffect(() => {
    if (currentUser && !socketId) {
      // if user is there and socketId is null then it must reconnet socket 
      console.log("hi im running", currentUser);
      socketConnect();
    }
  }, [currentUser, socketId, socketConnect]);


// this run when user is online and having socket id, so that other users may know he is online
  useEffect(() => {
    if (currentUser && socketId) {
      console.log("hi im running two", currentUser);

      socketEmitEvent(socket).userOnline(currentUser._id, socketId);
    }


    



  }, [socketId, socket, currentUser]);


  return (
    <ChatContextProvider>
      <Summary />
    </ChatContextProvider>

  );
}
