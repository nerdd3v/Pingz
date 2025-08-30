const jwt = require('jsonwebtoken');
const SECRET = 'whothehellwasthat';

const generateToken = (email)=>{
    const token = jwt.sign({email}, SECRET);
    return token
}
module.exports = {
    generateToken
}