const express = require('express');
const ws = require('ws');
const { RoomModel } = require('../database/db');
const {authMiddleWare} = require('../MiddleWares/AuthMW');
const { generateOTP } = require('../MiddleWares/generateRoomOTP');


const roomRoute = express.Router();

roomRoute.post('/join',authMiddleWare, async(req, res)=>{
    const {RoomName, RoomOTP} = req.body;
    const user = req.user;
    if(!user){
        return res.status(404).json({message:" You are not authorised "})
    }
    if(!RoomName || !RoomOTP){
        return res.status(404).json({message:"Room name or OTP is missing"});
    }
    const RoomExists = await RoomModel.findOne({RoomName, RoomOTP});
    if(!RoomExists){
        return res.status(404).json({message:"Invalid Room name or Room OTP"})
    }
    RoomExists.users.push(user._id)
    await RoomExists.save();
    
    return res.status(202).json({message: "You have successfully entered the room", success:true})

})
roomRoute.post('/create',authMiddleWare, async (req, res)=>{
    const user = req.user;
    const {roomName} = req.body;
    if(!user){
        return res.status(404).json({message:"You are not authorised"});
    }
    if(!roomName){
        return res.status(404).json({message:"Room Name is required"})
    } 
    const roomAlreadyExists = await RoomModel.findOne({RoomName: roomName});
    if(roomAlreadyExists){
        return res.status(404).json({message: "Room Name already exists"});
    }
    const RoomOTP = generateOTP();
    const roomInfo = new RoomModel({RoomName: roomName, RoomOTP, users: [user._id]});
    await roomInfo.save();
    return res.status(202).json({message:'Room Created Successfully',roomname: roomName, roomOTP : RoomOTP})
})
module.exports = {
    roomRoute
}