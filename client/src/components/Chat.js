import React, { useState, useEffect } from 'react';
import queryString from 'querystring';
import io from 'socket.io-client';
import './Chat';

let socket;

const Chat = ({ location }) => {
    
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { name ,room} = queryString.parse(location.search) //get the url back

        socket = io(ENDPOINT);

        console.log(name, room);
        setName(name);
        setRoom(room);

        console.log(socket)
        
    },[ENDPOINT, location.search]);

    return (
        <h1>Chat</h1>
        )

    };

export default Chat;