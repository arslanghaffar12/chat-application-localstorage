import React, { useEffect, useState, useRef, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood';

import TextField from '@mui/material/TextField';
import ChatMessage from '../components/chatMessage';
import useLocalStorage from '../hooks/useLocalStorage';
import { isEqualSet, isValue, generateUniqueID, isEmptyObject } from '../helpers/common';
import { useChatContext } from '../context/chatContext';
import { socketEmitEvent } from '../socket/socketEmit';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../context/socket';


export default function ChatCard() {


    const [chatMessages, setChatMessages] = useState([]);

    console.log("chatMessages", chatMessages);
    const [showNotify, setShowNotify] = useState(false);
    const typingTimeoutRef = useRef(null);

    console.log("showNotify", showNotify);



    const currentUser = useSelector(state => state.auth.user);


    const { userToBeChat, currentChat, updateTotalChatsOnLocalStorage, totalChats, setTotalChats } = useChatContext();

    console.log("currentChat", currentChat);
    const {
        socket: { messageData, messageReadStatus, socket, typingNotify, socketId },
        resetSocketValue,
        setSocketValue

    } = useSocketContext();


    console.log("messageData i recieved", messageData);


    useEffect(() => {

        if (currentChat) {

            setChatMessages(currentChat.chat);

        }

    }, [currentChat])


    const checkIsChatting = useCallback(
        (messageData) => {

            const { senderId, receiverId } = messageData;
            return userToBeChat._id === senderId ? true : userToBeChat._id === receiverId;
        },
        [userToBeChat]
    );






    const [message, setMessage] = useState('');
    const chatBodyRef = useRef(currentChat);



    const [totalUsers, setTotalUsers] = useLocalStorage('totalUser', []);
    const [isTyping, setIsTyping] = useState(false);



    const handleInputSubmit = (e) => {

        console.log("handleInputSubmit is running", e);

        e.preventDefault();
        if (message.trim() === '') {
            setMessage('');
            return;
        }


        let _message = {
            senderId: currentUser._id,
            receiverId: userToBeChat._id,
            text: message,
            time: new Date(),


        }

        console.log("_message", _message);





        socketEmitEvent(socket).sendMessage({
            ..._message,

        });



        setMessage('');

    };


    // to check if key is enter then send message
    const handleKeyDown = (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line when pressing Enter
            handleInputSubmit(e); // Send the message
        }
    };

    // to send user typing message
    const handleKeyUp = () => {

        const newTypingStatus = message.trim() !== '';
        if (isTyping !== newTypingStatus) {
            socketEmitEvent(socket).userTyping({
                senderId: currentUser._id,
                receiverId: userToBeChat._id,
                typing: newTypingStatus,
                message: `${currentUser.firstName} is typing...`
            });
        }
        setIsTyping(newTypingStatus);
    };



    useEffect(() => {

        if (!isEmptyObject(currentChat) && !isEmptyObject(userToBeChat)) {
            console.log("hi i am running heyb dhd asdjf", currentChat, userToBeChat);
            chatBodyRef?.current?.scrollIntoView({ behavior: 'smooth' });

        }

        // memberRef.current = newMessages;


    }, [currentChat, userToBeChat])

    useEffect(() => {

        if (isTyping) {
            setTimeout(() => {
                setIsTyping(false)

            }, 3000)
        }

    }, [isTyping])



    useEffect(() => {
        if (typingNotify) {
            console.log("isChatting", typingNotify);

            const { senderId, receiverId, typing } = typingNotify;
            const isChatting = userToBeChat?._id === senderId || userToBeChat?._id === receiverId;

            console.log("isChatting", isChatting);

            if (typing && isChatting) {
                setShowNotify(true);

                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                typingTimeoutRef.current = setTimeout(() => {
                    setShowNotify(false);
                    setSocketValue((prev) => ({
                        ...prev,
                        typingNotify: null
                    }));
                }, 2000);
            } else {
                setShowNotify(false);
                setSocketValue((prev) => ({
                    ...prev,
                    typingNotify: null
                }));
            }
        } else {
            setShowNotify(false);
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [typingNotify, userToBeChat]);


    useEffect(() => {
        if (messageData) {

            //when any message recieved it update totalChats on localstorage, there it will check which chat this message belong 

            updateTotalChatsOnLocalStorage(messageData)





        }
    }, [messageData]);




    return (
        <Card className='border-0 chat-card'>

            {
                userToBeChat && userToBeChat._id &&
                <>

                    <CardHeader
                        className='chat-header'
                        title={
                            <Grid container alignItems="center" >
                                <Grid item>
                                    <Avatar alt={userToBeChat.firstName} src="/static/images/avatar/1.jpg" style={{ width: '40px', height: '40px' }} />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h6" style={{ margin: 'unset', marginLeft: "5px", fontSize: "14px" }}>
                                        {userToBeChat.firstName + " " + userToBeChat.lastName}
                                    </Typography>

                                    {showNotify && <Typography variant="" style={{ margin: 'unset', marginLeft: "5px", fontStyle: "italic", fontSize: "10px" }}>
                                        {typingNotify?.message}
                                    </Typography>}

                                    <Typography variant="body2" color="textSecondary" style={{ margin: 'unset', marginLeft: "5px" }}>

                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                    />
                    <CardContent className='chat-container scrollbar p-2 chatbox' id='style-3'>

                        {
                            isValue(currentChat) && currentChat?.chat?.sort((a, b) => new Date(a.time) - new Date(b.time)).map((mes, ind) => {

                                return (
                                    <ChatMessage

                                        message={{
                                            timestamp: mes.time, //  "2022-06-30T10:15:30Z",
                                            content: mes.text,
                                            senderId: mes.senderId
                                        }}
                                        isCurrentUser={mes.senderId === currentUser._id}
                                        currentUser={currentUser._id}



                                    />
                                )

                            })
                        }


                        <div ref={chatBodyRef}></div>





                    </CardContent>

                    <CardActions className='chat-footer totalCenter p-2'>
                        <div style={{ width: '10%' }} className='totalCenter'>
                            <p className='margin-unset'>#</p>
                            <IconButton>
                                <MoodIcon color='#6f5cc4' />
                            </IconButton>
                        </div>
                        <TextField
                            className='border-0 chat-input'
                            placeholder='Message'
                            variant='standard'
                            fullWidth
                            multiline
                            rowsMax={4}
                            onKeyDown={handleKeyDown} // Handle Enter key press
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyUp={handleKeyUp}
                            onSubmit={handleInputSubmit}


                        // InputProps={{ disableUnderline: true }} // Remove the underline


                        />
                        <div style={{ width: '10%' }}>
                            <IconButton onClick={handleInputSubmit}>
                                <SendIcon color='#6f5cc4' />
                            </IconButton>
                        </div>
                    </CardActions>

                </>
            }

            {
                isEmptyObject(userToBeChat) &&

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh" // Full viewport height to center vertically
                >
                    <Typography variant="h6">
                        Please select a user to chat
                    </Typography>
                </Box>


            }

        </Card>
    );
}
