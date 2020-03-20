import React from 'react';
import './Input.css';



const Input = ({ message, setMessage, sendMesage }) => (
    <form className="form">
        <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={event => event.key === 'Enter' ? sendMesage(event) : null} 
        />

        <button className="sendButton" conClick={(event) => sendMesage(event)}>Send</button>
    </form>

)


export default Input;

