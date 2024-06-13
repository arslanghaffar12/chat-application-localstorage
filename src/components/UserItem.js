import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircleIcon from '@mui/icons-material/Circle';

export default function UserItem({ ind, item, handleChat, online, unSeen }) {
    return (
        <div key={ind} className='d-flex align-items-center border-bottom py-2 px-4  user-chat'
            onClick={() => handleChat(item)}
        >
            {/* User's Avatar */}
            <Avatar alt={item.firstName} src={item.avatar} className="rounded-circle me-3" />
            <div>
                {/* User's Name */}
                <Typography variant="subtitle1" className='user-name'>
                    {item.firstName + " " + item.lastName}
                    {online && (
                        <CircleIcon
                            style={{
                                color: 'green',
                                // position: 'absolute',
                                right: '10px',
                                width: '0.8rem',
                                height: '0.8rem',
                                border: '2px solid white',
                                borderRadius: '50%',
                            }}
                        />
                    )}
                </Typography>

                { unSeen > 0 &&  <Typography variant="body1" style={{ fontSize: "0.7rem", color: "red" }}>
                    {unSeen}
                </Typography>}


            </div>
            <Divider />
        </div>
    );
}
