const express = require('express')
const router = express.Router()
const userDB= require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config({path:__dirname+'/.env'})
const jwt = require('jsonwebtoken')
const { requireAuth } = require('../middleware/authMiddleware')











router.get('/', requireAuth,(req,res)=>{ // 查使用者
    

 res.json({login:true})



})

router.post('/', async(req,res)=>{ //建立使用者
    
   

    try{
  
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = await userDB.insertOne(req.body.username,hashedPassword,req.body.email)

        const userData =  {user_id:user}

        const token = generateAccessToken(userData)
  
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user:user})
    }catch(err){
        console.log(err)
        res.status(500).send('error 500')
    }

})





router.put('/',async (req,res)=>{ //使用者登入
    const email = req.body.email
    const password = req.body.password
    console.log(email)
    console.log(password)
    try{
        let user = await userDB.loginOne(email)
        console.log(user)
        if(user == null){
            return res.status(400).send('Cannot find user')
        }
        if(await bcrypt.compare(password,user.password)){ 
  
            const payload = {userId:user.user_id, userName: user.user_name, userEmail:user.email}
            const token = generateAccessToken(payload)
  
            res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
            console.log('sucessful login a user')
            res.locals.user=payload
            res.status(201).json({login:true})

       
        } else{
            res.send('not allowed')
        }

    }catch(err){
        console.log("500 error")
        res.status(500).send()
    }   

})

const maxAge = 1*24*60*60
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:maxAge})
}



router.delete('/',(req,res)=>{ //登出使用者
    


res.cookie('jwt','',{maxAge:1})
res.json({logout:true})



})


module.exports=router