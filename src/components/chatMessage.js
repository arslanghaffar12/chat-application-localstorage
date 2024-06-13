import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment'; // Assuming you're using moment.js for timestamps

const messageContainerStyles = (senderId, currentUser,) => ({
    display: 'flex',
    justifyContent: senderId === currentUser._id ? 'flex-end' : 'flex-start',
    alignItems: 'flex-end',
    marginBottom: '1rem', // Adjust spacing as needed
});

const messageContentStyles = (senderId, currentUser,) => ({
    padding: '1rem',
    borderRadius: '5px',
    maxWidth: '70%', // Adjust maxWidth as needed
    wordBreak: 'break-word',
    color: senderId === currentUser._id ? 'black' : '#fff',
    backgroundColor: senderId === currentUser._id ? '#e6e8ed' : '#6f5cc4',
});

const messageTimestampStyles = (senderId, currentUser) => ({
    fontSize: '0.8rem',
    marginLeft: '1rem', // Adjust margin as needed
    color: senderId === currentUser._id ? 'black' : '#fff',
});

function Message({ message, currentUser, isCurrentUser }) {
    const messageContainerClasses = messageContainerStyles(message.senderId, currentUser);
    const messageContentClasses = messageContentStyles(message.senderId, currentUser);
    const messageTimestampClasses = messageTimestampStyles(message.senderId, currentUser);

    return (
        <Stack direction="row" spacing={1}

            className={isCurrentUser ? "right-message mb-2" : "left-message mb-2"}
        >

            <Box className="message-content">
                <Typography variant="body2">{message.content}</Typography>
                <Box style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <Typography variant="caption" className="message-timestamp">
                        {moment(new Date(message.timestamp)).format('LT')}
                    </Typography>
                </Box>

            </Box>
        </Stack>
    );
}

export default Message;
