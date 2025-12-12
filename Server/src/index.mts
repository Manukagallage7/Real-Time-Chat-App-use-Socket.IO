import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = createServer();

const io = new Server(app,{
    cors: {
        origin: 'http://localhost:5173',
    }
})

io.on('connection', (socket):void => {
    console.log("connected to the server", socket.id)

    socket.emit('join', 'hello');

    socket.on('manuka', (data:string):void => {
        console.log('Received from client:', data, socket.id);
    });

    socket.on("Disconnect", ():void => {
        console.log("User disconnected", socket.id)
    });
});

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
});