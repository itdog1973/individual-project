const jwt = require('jsonwebtoken')
require('dotenv').config({path:__dirname+'/.env'})
const userDB = require('../models/user')
const cookie = require('cookie')
const crypto = require('crypto')


const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt
    // check if jwt exists & is verified
    if(token){
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, decodeToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/')
            }else{
            
                res.user_id = decodeToken.user_id
                res.userName = decodeToken.userName
                console.log(res.userName)
                res.locals.user = {userName : decodeToken.userName}
                next()
            }
        })
    }
    else{
        res.redirect('/')
    }
}


// check current user
const checkUser =  (req,res,next)=>{


    const token = req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err,decodeToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user=null;
                next()
            }else{
     console.log('checking'+decodeToken.user_id)





        let user = await userDB.findOne(decodeToken.user_id);
        // inject the user to our view use res.locals, then we can access it from view
        // if we found that user in the db, what we doing is passing the user into the view,
        // so we can out put it to the view
        console.log(user)
        res.locals.user = user;
        next()

    }
    })
    }else{
        res.locals.user=null;
        next()
    }
} 







function checkToken(cookief){
    if (cookief){
        let cookies = cookie.parse(cookief)
        let token = cookies['jwt']
        return new Promise((resolve, reject)=>{
            jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, decodeToken)=>{
                if(err){
                    console.log(err.message)
                    return reject (crypto.randomUUID())
                }else{
                
                    return  resolve(decodeToken.user_id)
          
                     
                }
        })
            
        })
    }else{
        return crypto.randomUUID()
    }
    
   
}

function isLoggedIn(req,res, next){
    req.user ? next() : res.sendStatus(401)
}



module.exports={requireAuth, checkUser, checkToken,isLoggedIn };