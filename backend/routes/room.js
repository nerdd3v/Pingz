const express = require('express');
const ws = 

const roomRoute = express.Router();

roomRoute.get('/join',(req, res)=>{
    const {RoomName, RoomOTP} = req.body;

    if(!RoomName || RoomOTP){
        return res.status()
    }
})