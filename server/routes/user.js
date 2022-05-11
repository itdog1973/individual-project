const express = require('express')
const router = express.Router()
const userDB= require('../models/user')














router.get('/',(req,res)=>{ // 查使用者
    
})

router.post('/', async(req,res)=>{ //建立使用者
    
    let username = req.body.username
    
    let email = req.body.email
    let password = req.body.password
    console.log(username,email,password)

    try{
        let result = await userDB.insertOne(username,password,email)
        res.json(result)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }


})

router.put('/',async (req,res)=>{ //使用者登入
    let email = req.body.email
    let password = req.body.password
    try{
        let result = await userDB.loginOne(email,password)
        if (result!=null){
          
            if (result.password === password){
   
                res.status(200).json("ok")

              
            }else{

         res.status(400).json("error")
            }
        }else{

       res.status(400).json("error")
        }
    }catch(err){

     res.status(500).json("error")
    }
})


router.delete('/',(req,res)=>{ //登出使用者木
    
})


module.exports=router