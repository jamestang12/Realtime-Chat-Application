import React, { useState, useEffect } from 'react';
import './Chat.css';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        socket.emit('join', { name, room }, () => { //join is the function name

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT], location.search)
    return (

        <h1>Chat</h1>
    )

}

export default Chat;