import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ChatHeader = (props) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={2}
            px={3}
            bgcolor="#f0f0f0"
        >
            <Box display="flex" alignItems="center">
                <Avatar src={props.user.profile} sx={{ width: 40, height: 40 }} />
                <Box ml={1}>{props.user.name}</Box>

            </Box>

            <Box>
                <MoreVertIcon />
            </Box>
        </Box>
    );
};

export default ChatHeader;
