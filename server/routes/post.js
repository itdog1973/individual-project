const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware') 
const postDB = require('../models/post')



router.post('/', requireAuth , async (req,res)=>{

    console.log(req.body.cat, req.body.message, req.body.title)
    try{
        
        console.log(req.user_id)
        const titleResult = await postDB.getOne(req.body.title)
        console.log(titleResult)
     
        if(titleResult.length===0){
            const result = await postDB.insertOne(req.body.title,req.body.message,req.user_id,req.body.cat)
       
            const payload ={ title:req.body.title, message:req.body.message, username:res.userName, threadId:result }
            console.log('insert post to db')
            res.status(200).json(payload)
            
    
        }else{
            console.log('not insert post to db')
            res.status(400).json({error:'重覆的title名'})
        }

      



        // res.locals.postTitle = {title:req.body.title}
        // res.locals.postMessage={message:req.body.message}
        // res.locals.user= {username:res.userName}

        

       
        


    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }

 

})





router.get('/', async (req,res)=>{

    try{
        const result = await postDB.getAll()
        
        // res.status(200).send(result)

        res.json(result)

    }catch(err){
        console.log(err)
        res.status(500).json({error:err,message})
    }
    
})





module.exports = router