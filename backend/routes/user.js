const express = require('express');
const { UserModel, ProfileModel } = require('../database/db');
const {z} = require('zod');
const generateToken = require('../MiddleWares/generateToken');
const { authMiddleWare } = require('../MiddleWares/AuthMW');

const userRouter = express.Router();

const signupSchema = z.object({
  email: z.string(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character")
});

userRouter.post('/signup', async(req, res)=>{
   try {
    const validateData = signupSchema.safeParse(req.body);
    const {email, password} = validateData;

    const userExists = UserModel.findOne({email});
    if(userExists){
        return res.status(400).json({message:"email already exists"})
    }
    const newUser = new UserModel({email,password});
    await newUser.save();

    return res.status(201).json({message:"signup successful"})
   } catch (error) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
   }
})

userRouter.post('/login',async(req, res)=>{
    const validateData = signupSchema.safeParse(req.body);
    if(!validateData.success){
        return res.status(404).json({message:"wrong email and password format"})
    }
    const {email, password} = validateData.data
    try{
        const userExists =await UserModel.findOne({email});
       if (!userExists || userExists.password !== password) {
    return res.status(403).json({ message: "Invalid email or password" });
}
        const token = generateToken(email);
        res.status(202).json({message:"login succes: "+ token})
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

userRouter.get('/profile/:userID',authMiddleWare,(req, res)=>{
    const {userId} = req.params;
    try {
        const profile = ProfileModel.find({user: userId}).populate('user', 'email createdAt');

        if(!profile){
            return res.status(404).json({message: "such profile does not exist"})
        }
        res.status(201).json({
            username: profile.username,
            url: profile.url,
            user: profile.user
        })
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

userRouter.put('/profile/:userID',authMiddleWare,async(req, res)=>{
    const {userID} = req.params;
    const user = req.user;
    
    if(userID !== user._id){
        return res.status(404).json({message:'You are not authorized'})
    }
    const profile = await ProfileModel.findOne({user: userID});
    if(!profile){
        return res.status(404).json({message:'Profile not found'});
    }

    const {url, username} = req.body;

    if(url) profile.url = url;
    if(username) profile.username = username;

    await profile.save();
    return res.status()
}) 


module.exports = {
    userRouter
}