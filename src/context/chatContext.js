import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { generateUniqueID, isEqualSet, isValue } from '../helpers/common';
import { socketEmitEvent } from '../socket/socketEmit';
import { useSelector } from 'react-redux';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSocketContext } from './socket';

const ChatContext = createContext({});

export const useChatContext = () => useContext(ChatContext);

function ChatContextProvider({ children }) {


    const currentUser = useSelector(state => state.auth.user);

    console.log("currentUser", currentUser);

    // this all coming from socket context
    const { socket: { socket, onlineUsers, messageData }, resetSocketValue } = useSocketContext();


    console.log("socket in chat context", socket);

    const [currentChat, setCurrentChat] = useState({});
    const [userToBeChat, setUserToBeChat] = useState({});
    const [usersOnline, setUsersOnline] = useState({});

    console.log("userToBeChat", userToBeChat);
    const [totalChats, setTotalChats] = useLocalStorage('totalChats', []);







 

//  to update chat, allChats
    const updateTotalChatsOnLocalStorage = (message) => {

        try {


            if (message) {

                let participents = [message.senderId, message.receiverId];

                const participantsSet = new Set(participents);


                let indexToBeUpdate = totalChats.findIndex((item) => {
                    const idsSet = new Set(item.participents);

                    return isEqualSet(idsSet, participantsSet);
                });


                // find existing chat
                const findChat = indexToBeUpdate !== -1 ? totalChats[indexToBeUpdate] : null;

                // if chat exist
                if (findChat) {
                    let _currentChat = { ...findChat };

                    let chats = [..._currentChat.chat, message];


                    _currentChat.chat = chats;
                    let _totalChats = [...totalChats];

                    // this is ids of sender and reciever
                    const currentIds = new Set([userToBeChat?._id, currentUser?._id])


                    // to check if current exist chat is equal to between sender and reciever
                    // only set currentChat if user has selected currentchat and sender receiver id match with selected chat and currentUser id
                    if (isEqualSet(currentIds, participantsSet)) {

                        _currentChat[currentUser?._id].unreadCount = 0;


                        setCurrentChat(_currentChat);


                        // check if reciever is online 
                        if (userToBeChat._id in usersOnline) {


                        } else {
                            // otherwise put this message to user unread
                            _currentChat[userToBeChat?._id].unreadCount = _currentChat[userToBeChat?._id].unreadCount + 1;

                        }

                    }
                    else {
                        // it runs when user is not in this existed chat, it runs for all users, and this scenerios runs when 
                        // reciever is online but donot match with the current chat , so i update this as unread count

                        _currentChat[currentUser?._id].unreadCount = _currentChat[currentUser?._id].unreadCount + 1;

                    }

                    // at final, i updated totalChats in localStorage
                    _totalChats[indexToBeUpdate] = _currentChat;
                    console.log("_totalChats are",_totalChats);
                    setTotalChats(_totalChats);


                }

            }

        }
        catch (err) {
            console.log("error while updating localstorage for chats");
        }




        resetSocketValue('messageData');


    };

    // to create chat if not already exsit with unique id, and set it to current chat
    // to create new chat i used generateUniqueID ,this is function coming from common file, it generate an unique id, i pass it exists ids so that it does not return exist id
    const handleChatSelect = async (userToBeChat) => {


        console.log("userToBeChat", userToBeChat);
        setUserToBeChat(userToBeChat)




        if (isValue(userToBeChat)) {

            console.log("handle is running");



            let participents = [userToBeChat._id, currentUser._id];

            let findChat = totalChats.filter((item) => {
                const idsSet = new Set(item.participents);
                const participantsSet = new Set(participents);


                return isEqualSet(idsSet, participantsSet);
            });

            if (findChat.length > 0) {

                console.log("handle is running findChat", findChat);


                if (currentChat._id !== findChat[0]._id) {

                    socketEmitEvent(socket).enterChatRoom({ roomId: findChat[0]?._id, message: `${currentUser?.firstName}` });
                    socketEmitEvent(socket).leaveChatRoom({ roomId: currentChat?._id, message: `${currentUser?.firstName}` });
                    findChat[0][currentUser?._id].unreadCount = 0;

                    let _chat = totalChats.map((item) => {
                        if (item._id === findChat[0]._id) {
                            item = findChat[0];

                            return item
                        }
                        return item

                    })

                    setTotalChats(_chat)
                  
                    setCurrentChat(findChat[0]);

                }
                else {
                    console.log("handle is running findChat else");

                }

            }
            else {

                try {
                    console.log("handle is running else");

                    let _existedChatIds = [];

                    totalChats.forEach((item) => {
                        _existedChatIds = [..._existedChatIds, item.participents]
                    })

                    
                    let newChat = {
                        participents: participents,
                        chat: [],
                        _id: generateUniqueID(_existedChatIds),
                        [participents[0]]: {
                            unreadCount: 0,
                        },
                        [participents[1]]: {
                            unreadCount: 0,
                        },
                        unreadCount: 0,
                    }

                    let _chats = [...totalChats, newChat];

                    console.log("_chats  ", _chats);
                    console.log("newChat  ", newChat);

                    setTotalChats(_chats);
                    setCurrentChat(newChat);
                    socketEmitEvent(socket).enterChatRoom({ roomId: newChat._id, message: `${currentUser.firstName}` });
                }
                catch (err) {
                    console.log("error while emit chatroom", err);
                }



            }
        }
    };

    useEffect(() => {
        if (isValue(onlineUsers) && onlineUsers.length > 0) {
            let _users = {};
            onlineUsers.forEach(element => {
                _users[element?.userId] = element?.userId;

            });

            setUsersOnline(_users)
        }

    }, [onlineUsers])

    return (
        <ChatContext.Provider
            value={{
                userToBeChat,
                currentChat,
                setCurrentChat,
                totalChats,
                setTotalChats,
                handleChatSelect,
                updateTotalChatsOnLocalStorage,

            }}
        >
            {children}
        </ChatContext.Provider>
    );
}



export { ChatContextProvider, ChatContext };
