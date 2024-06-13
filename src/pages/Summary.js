import React, { useState, useCallback, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import brand from "../assets/moto1.png"
import UserItem from '../components/UserItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatHeader from '../ChatTopBar';
import ChatCard from './chat';
import { useChatContext } from '../context/chatContext';
import logo1 from "../assets/moto1.png"
import { useSelector } from 'react-redux';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSocketContext } from '../context/socket';
import { isEqualSet, isValue } from '../helpers/common';

const defaultTheme = createTheme();

export default function Summary() {

    const currentUser = useSelector(state => state.auth.user);
    const [totalUsers, setTotalUsers] = useLocalStorage('totalUser', []);



    const { handleChatSelect, userToBeChat, currentChat, totalChats } = useChatContext();

    const { socket: { socket, onlineUsers } } = useSocketContext();
    const [online, setOnline] = useState({});

    console.log("onlineUsers", onlineUsers);
    console.log("handleChatSelect", handleChatSelect);



    console.log("chatId,  currentChat", userToBeChat, currentChat);

    useEffect(() => {
        if (isValue(onlineUsers) && onlineUsers.length > 0) {
            let _users = {};
            onlineUsers.forEach(element => {
                _users[element?.userId] = element?.userId;

            });

            setOnline(_users)
        }

    }, [onlineUsers])

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <ChatHeader

                        user={
                            { profile: logo1, name: currentUser.firstName + " " + currentUser.lastName }
                        }

                    />

                    <div id="style-3" className='m-0 p-0' style={{ backgroundColor: '', height: '69vh', overflowY: 'auto', marginTop: "2px" }}>
                        {totalUsers.map((user, ind) => {

                            const ids = new Set([currentUser?._id, user?._id]);
                            let findChat = totalChats.filter((item) => {
                                const idsSet = new Set(item.participents);


                                return isEqualSet(idsSet, ids);
                            });

                            let unSeen = -1;




                            if (findChat.length > 0) {
                                unSeen = findChat[0][currentUser._id]?.unreadCount;
                            }





                            return (

                                <UserItem

                                    ind={ind}
                                    item={user}
                                    handleChat={() => handleChatSelect(user)}
                                    online={user._id in online}
                                    unSeen={unSeen}


                                />
                            )

                        })}
                    </div>
                </Grid>
                <Grid item xs={8}>




                    <ChatCard
                        key={userToBeChat?._id}
                        currentUser={currentUser}

                    />



                </Grid>
            </Grid>
        </ThemeProvider>
    )
}
