import express from 'express';
import {WebSocketServer} from 'ws';
import http from 'http';
import cors from 'cors';

const app=express();
const port=8080;
app.use(cors());

const server=http.createServer(app);
const wss=new WebSocketServer({server}); 
const users={};

//wss.on is a socket.io instance. It listens to so many socket connection such as everytime when a user connects to the socket
wss.on("connection",(ws)=>{
    //when a particular connection is done, how it has to handle it
    //whenever socket.on gets new-user-joined event, it will set the name in the users list
    ws.on("message", (message) => {
        const parsedMessage=JSON.parse(message);
        if (parsedMessage.type === 'new-user-joined'){
            const name=parsedMessage.name;
            wss.clients.forEach(client=>{
                if (client !== ws && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({type: 'user-joined', name}));
                }
            });
        }

        if (parsedMessage.type === 'send'){
            const message=parsedMessage.message;
            const senderName = parsedMessage.username;
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({type: 'receive', message:message, name:senderName}));
                }
            });
        }
    });
})

server.listen(port,()=>{
    console.log('server listening...')
});





