import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = createServer();

const io = new Server(app) 

io.on('connection', (socket):void => {
    console.log("connected to the server", socket.id)

    socket.on("Disconnect", ():void => {
        console.log("User disconnected", socket.id)
    });
});

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
});