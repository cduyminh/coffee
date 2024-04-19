import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { coffeebot } from '../startchat';

const ChatContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  position: absolute;
  bottom: 20px;
  right:20px;
  left:20px;
  border-radius: 10px;
`;

const TextInput = styled.input`
  flex: 1;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
`;

const Message = styled.div`
  padding: 10px;
  margin: 5px;
  color: #e0e0e0;
  border-radius: 10px;
`;

interface IChat {
  role: string;
  content: string;
}
const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<IChat[]>([{
    role: "system",
    content: coffeebot
  }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const newmess =  {role: "user", content: "customer: " + input + " Respond using JSON"}
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: "llama3:instruct",
      messages: [...messages, newmess],
      stream: false,
      format: "json",
    });
    console.log(response.data)
    const bot = {role: "assistant", content: response.data.message.content}
    setMessages([...messages,newmess, bot]);
    setInput('');
  };

  return (
    <ChatContainer>
      {messages.map((msg, index) => index > 0 && (
        <Message key={index}>{msg.content}</Message>
      ))}
      <InputContainer>
        <TextInput value={input} onChange={e => setInput(e.target.value)} />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;
