import React from 'react';

import './Input.css';
let timeout=null
const Input = ({ setMessage, sendMessage, message ,isTyping,isNotTyping}) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={(event) =>{ 
        setMessage(event.target.value) 
        isTyping(event)
        clearTimeout(timeout)
        timeout= setTimeout(()=>{
          isNotTyping(event)
        },500)
      }
      }
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : (event.key===' '?isNotTyping(event):null)}
      onBlur={event=>isNotTyping(event)}
    />
    <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
  </form>
)

export default Input;   