import { useState, useEffect, ChangeEvent, JSX } from "react";
import { io, Socket } from "socket.io-client";

const App = ()=> {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<string[] | string>([]);
  const [chatuser, setChatUser] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);
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
        <select onChangeCapture={(e: ChangeEvent<HTMLSelectElement>)=>setChatUser(e.target.value)}>
          {userData?.map((user:string):JSX.Element=><option value={user}></option>)}
        </select>

      </div>
    </div>
  );
}
export default App;