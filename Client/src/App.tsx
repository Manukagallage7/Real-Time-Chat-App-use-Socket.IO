import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const App = ()=> {
  const socket = io('http://localhost:4000');

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('join',(data:string):void => {
      console.log('Received from server:', data);
    });

    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, []);
  
  return (<div>
      <button onClick={()=>{
        socket.emit('manuka', 'Hello from Client!');
      }}>Send Message to Server</button>
    </div>
  );
}
export default App;