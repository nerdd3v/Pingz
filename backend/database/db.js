const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ProfileSchema = new mongoose.Schema({
    url:{
        type: String,
        default: "https://imgs.search.brave.com/MOJNZZ7jZEobQ9JitvnpUAhqvxpu5zwiYbbnQxtiNQg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzRj/L2YwLzlmNGNmMGYy/NGIzNzYwNzdhMmZj/ZGFiMmU4NWMzNTg0/LmpwZw"
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const RoomSchema = new mongoose.Schema({
    RoomName: {
        type: String,
        required: true
    },
    RoomOTP: {
        type: Number,
        required: true,
        min: 1000,
        max:9999
    },
    users: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
})

const UserModel = mongoose.model('User', UserSchema);
const ProfileModel = mongoose.model('Profile', ProfileSchema);
const RoomModel = mongoose.model('Room', RoomSchema);


module.exports = {
    UserModel,
    ProfileModel,
    RoomModel
}