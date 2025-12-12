import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = createServer();

const io = new Server(app,{
    cors: {
        origin: 'http://localhost:5173',
    }
})

const userData: {[index:string]: string} = {};

io.on('connection', (socket):void => {
    console.log("connected to the server", socket.id,typeof socket.id);

    socket.emit('join', 'hello');

    socket.on('manuka', (data:string):void => {
        console.log('Received from client:', data, socket.id);
    });

    socket.on('usernameRegister', (username:string):void => {
        userData[username]= socket.id;

        socket.emit('chatUsers', Object.keys(userData));
        console.log('Username registered:', username, socket.id);

        socket.broadcast.emit('chatUsers', Object.keys(userData));
        socket.emit('chatUsers', Object.keys(userData));
    });

    socket.on('message', (data: {message:string, chatUser:string}):void => {
        const recipients:string | undefined = userData[data.chatUser];
        if(recipients){
            let sender:string ;
        Object.entries(userData).forEach(([key, value]:[string, string]): void => {
            if(value === socket.id){
                sender = key;
            }
        });
        io.to(recipients).emit('chat', {msg: data.message, member: data.chatUser});
        } else {
            console.log(`User ${data.chatUser} not found.`);
        }
    });

    socket.on("disconnect", ():void => {
        console.log("User disconnected", socket.id)
        Object.entries(userData).forEach(([key, value]:[string, string]): void => {
            if(value === socket.id){
                delete userData[key];
            }
        });
    });
});

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
});