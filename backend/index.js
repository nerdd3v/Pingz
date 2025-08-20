const express = require('express');
const http = require('http')
const ws = require('ws');
const PORT = process.env.PORT
const {roomRoute} = require('./routes/room');
const { userRouter } = require('./routes/user');
const  url  = require('url');
const jwt = require('jsonwebtoken');
const { RoomModel } = require('./database/db');
const SECRET = process.env.SECRET

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
        const roomName = parameters.roomName

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

        const room = await RoomModel.findOne({RoomName: roomName});
        if(!room){
            socket.close(1008, 'Invalid Room Name');
            return;
        }

        let roomEntry = rooms.find((r)=>{r.roomname ===  roomName});

        if(!roomEntry){
            socket.close(1008, )
        }


    } catch (error) {
        
    }
})

server.listen(PORT,()=>{
    console.log("listening on port: ", PORT )
})