// user_register, user_details, user_login, user_logout
const userDB= require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config({path:__dirname+'/.env'})
const jwt = require('jsonwebtoken')
const { generateAccessToken } = require('../middleware/jwt')
const maxAge = 1*24*60*60

const user_register = async (req,res)=>{
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

}


const user_details = (req,res)=>{
    res.json({login:true})
}




const user_login = async (req,res)=>{
    const { email, password } =req.body

    try{
        let user = await userDB.loginOne(email)

        if(user == null){
            return res.status(400).send('Cannot find user')
        }
        if(await bcrypt.compare(password,user.password)){ 
  
            const payload = {user_id:user.user_id, userName:user.user_name, userEmail:user.email}
            const token = generateAccessToken(payload)
  
            res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
      
            res.locals.user=payload
            res.status(201).json({login:true})

       
        } else{
            res.send('not allowed')
        }

    }catch(err){
        console.log(err)
        res.status(500).send()
    }   
}




const user_logout =(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.json({logout:true})
    
}


module.exports = {
    user_register,
    user_details,
    user_login,
    user_logout

}