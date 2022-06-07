require('dotenv').config({path:__dirname+'/.env'})
const jwt = require('jsonwebtoken')






const maxAge = 1*24*60*60
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:maxAge})
}

module.exports={ generateAccessToken }