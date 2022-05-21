const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware') 
const postDB = require('../models/post')



router.post('/', requireAuth , async (req,res)=>{

    console.log(req.body.cat, req.body.message, req.body.title)
    try{
        
        console.log(res.user_id)
        const titleResult = await postDB.getOne(req.body.title)
        console.log(titleResult)
     
        if(titleResult.length===0){
            let createDate = new Date().toLocaleString()
            const result = await postDB.insertOne(req.body.title,req.body.message,res.user_id,createDate,req.body.cat)
            console.log('this is insert result ',result)
            const payload ={ title:req.body.title, message:req.body.message, username:res.userName, threadId:result, userId:res.user_id ,createDate}
            console.log('insert post to db')
            res.status(200).json(payload)
            
    
        }else{
            console.log('not insert post to db')
            res.status(400).json({error:'重覆的title名'})
        }

              


    }catch(err){
        console.log(err.message)
        res.status(500).json({
            error:err.message
        })
    }

 

})





router.get('/', async (req,res)=>{
    let offset = req.query.offset
    let cat = req.query.cat

    console.log(cat)
    console.log(offset)
    if(cat==undefined){
        try{
            const result = await postDB.getAll(offset)
            
            // res.status(200).send(result)
    
            res.json(result)
    
        }catch(err){
            console.log(err.message)
            res.status(500).json({error:err.message})
        }
    }else{
        try{
            const result = await postDB.getSpecificAll(cat,offset)
            
            // res.status(200).send(result)
    
            res.json(result)
    
        }catch(err){
            console.log(err)
            res.status(500).json({error:err.message})
        }




    }
})













module.exports = router