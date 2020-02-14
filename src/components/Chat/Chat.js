import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [typing, setTyping] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const ENDPOINT = 'https://chat-app-ayush.herokuapp.com/';
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)
    document.title=`Room : ${room}`
    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })
    socket.on('typing',(text)=>{
      setTyping(text.text)
    })
    socket.on('notTyping',(text)=>{
      setTyping(text.text)
    })
    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages])
  const isTyping=(event)=>{
    event.preventDefault();
    socket.emit('isTyping',name,()=>{

    })
  }
  const isNotTyping =(event)=>{
    socket.emit('isNotTyping',name,()=>{

    })
  }
  const sendMessage = (event) => {
    event.preventDefault();
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
      isNotTyping(event)
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} typing={typing}/>
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} isNotTyping={isNotTyping} sendMessage={sendMessage} isTyping={isTyping} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;