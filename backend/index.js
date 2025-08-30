const express = require('express');
const http = require('http')
const ws = require('ws');
// const PORT = process.env.PORT
const {roomRoute} = require('./routes/room');
const { userRouter } = require('./routes/user');
const  url  = require('url');
const jwt = require('jsonwebtoken');
const { RoomModel } = require('./database/db');
const SECRET = 'whothehellwasthat';
const mongoose = require('mongoose')

const app = express();
app.use(express.json());
app.use('/user',userRouter);
app.use('/room', roomRoute)

const rooms = []; //{roomname: String, Sockets: [Isme websockets jo connection pe aa rahe hai woh yaha pe push kardunga]};

const server = http.createServer(app);

const wss = new ws.Server({server});


wss.on('connection', async(socket, req)=>{
    try {
        const parameters = url.parse(req.url, true).query;
        const token = parameters.token;
        const roomName = parameters.roomName;

        if(!token || !roomName){
            socket.close(1008, 'Token and Room name is required');
            return;
        }

        let user;
        try {
            user = jwt.verify(token, SECRET);
        } catch (error) {
            socket.close(1008, 'Invalid token');
            return;
        }

        // okay
        const room = await RoomModel.findOne({RoomName: roomName});
        if(!room){
            socket.close(1008, 'Invalid Room Name');
            return;
        }

        let roomEntry = rooms.find(r => r.RoomName === roomName);

       if (!roomEntry) {
            roomEntry = {
                RoomName: roomName,
                sockets: [socket]
            };
            rooms.push(roomEntry);
        } else {
            roomEntry.sockets = [...roomEntry.sockets, socket];
        }
        //okay

        //handling the logic for close the websockets

        socket.on('close',()=>{
            roomEntry.sockets = roomEntry.sockets.filter(s => s !== socket);
        })

        socket.on('message', (e) => {
            console.log('Received message:', e);
            roomEntry.sockets.forEach(s => {
                if (s !== socket && s.readyState === ws.OPEN) {
                    console.log('Sending message to socket:', s.id);
                    s.send(JSON.stringify(e));
                }
            });
        });

        
    } catch (error) {
        console.error('WebSocket error:', error);
        socket.close(1011, 'Internal server error');
    }
})

mongoose.connect('mongodb+srv://saketsharma448:4buIpW6t8SNXuCVb@mongobasic.nnwkgtx.mongodb.net/').then(()=>{
    server.listen(3000,()=>{
        console.log("listening on port: ", 3000 )
    })
})