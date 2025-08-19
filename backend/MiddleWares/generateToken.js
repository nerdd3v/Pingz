const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const generateToken = (email)=>{
    const token = jwt.sign({email}, SECRET);
    return token
}
module.exports = {
    generateToken
}