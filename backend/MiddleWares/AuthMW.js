const SECRET = 'whothehellwasthat'
const jwt = require('jsonwebtoken')
const authMiddleWare = (req, res, next)=>{
    // const AuthHeader = req.headers['authorization'];
    const {token} = req.body;
    // if(!AuthHeader){
    //     return res.status(404).json({message:"provide the authorisation header"});
    // }
    // const token = AuthHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({message:'Invalid or expired token'})
    }
}

module.exports = {
    authMiddleWare
}