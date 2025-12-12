import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000');

const App = ()=> {

  useEffect(() => {
    return() => {
      socket.removedAllListeners();
    };
  }, []);
  return (<div>
      App
    </div>
  );
}
export default App;