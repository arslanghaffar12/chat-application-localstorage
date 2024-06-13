import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Home from './pages/Home';
import Layout from './helpers/layout';
import SignUp from './pages/SignUpPage';
import SignIn from './pages/LoginPage';
import Authenticate from './helpers/authenticate';
import { SocketProvider, useSocketContext } from './socket';
import { socketEmitEvent } from './socket/socketEmit';
import { useSelector } from 'react-redux';
import { ChatContext, ChatContextProvider } from './context/chatContext';

function App() {



// user cannot go tH Home page until he is not signed in , to check if user is signed in, i used authenticate component
// if user is signed in it redirect to home page
// current user is not store on local storage as i have multiple user, 



// all chats would be store on local storage
//  total users would be store on local storage also

// once user is signup , it added on totalusers
// once chat is created, it addesd on totalChats


  return (

    <Router>
      <Routes>
        <Route path='/login' element={< SignIn />} />
        <Route path='/signup' element={< SignUp />} />

        <Route path='/' element={<Authenticate><Layout /></Authenticate>}  >

          <Route index element={< Home />} />

        </Route>
      </Routes>
    </Router>



  );
}

export default App;
