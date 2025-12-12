import { useState, useEffect, ChangeEvent, JSX } from "react";
import { io, Socket } from "socket.io-client";

const App = ()=> {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<string[] | string>([]);
  const [chatuser, setChatUser] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('join',(data:string):void => {
      console.log('Received from server:', data);
    });

    newSocket.on('chatUsers', (userData:string[] | string):void => {
      console.log('Chat Users:', userData);
    });

    newSocket.on('chat', (chatData: {msg:string, member:string}):void=>{
      if(chatuser!==chatData.member){
        setChat([]);
        setChatUser(chatData.member);
      }
      setChat(pre => [...pre, chatData.msg]);
    })

    return() => {
      console.log('Disconnecting socket...');
      newSocket.disconnect();
    };
  }, []);
  
  return (<div>
      <button onClick={()=>{
        if(socket) socket.emit('manuka', 'Hello from client!');
      }}>Send Message to Server</button>
      <div>
        <p>Chat Register</p>
        <input placeholder='your username' onChange={(e: ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)}/>
        <button onClick={()=>{
          if(socket) socket.emit('usernameRegister', username);
        }}>Register</button>
      </div>
      <div>
        <p>chat</p>
        <select value={chatuser?chatuser:undefined} onChangeCapture={(e: ChangeEvent<HTMLSelectElement>)=>setChatUser(e.target.value)}>
          {Array.isArray(userData) && userData.map((user: string): JSX.Element => <option key={user} value={user}></option>)}
        </select>
        <div>
          {chat?.map((chat: string,i:number): JSX.Element => <p key={i}>{chat}</p>)}
        </div>
        <input placeholder="type your msg" value={message} onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}  />
        <button onClick={()=>{
          if(socket && chatuser){
            socket.emit('message', {message:chatuser});
            setMessage("");
            setChat(pre => [...pre, message]);
          }
        }}>Send</button>
      </div>
    </div>
  );
}
export default App;