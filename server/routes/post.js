const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware') 
const postDB = require('../models/post')
const redis = require('redis')
const client = redis.createClient(6379)
async function connectR(){
    client.connect()
    console.log('client status2',client)
 
}
connectR()


router.post('/', requireAuth , async (req,res)=>{

    console.log(req.body.cat, req.body.message, req.body.title)
    const { cat, message, title } = req.body
    try{
        
      


        console.log(res.user_id)
        const titleResult = await postDB.getOne(title)
        console.log(titleResult)
     
        if(titleResult.length===0){
            let createDate = new Date().toLocaleString()
            const result = await postDB.insertOne(title,message,res.user_id,createDate,cat)

           


            console.log('this is insert result ',result)
            const payload ={ title, message, username:res.userName, threadId:result, userId:res.user_id ,createDate}


            client.lPush('posts',JSON.stringify({threadId:result,title,message,author_id:res.user_id,category:cat,createDate,username:res.userName}))
            client.rPop('posts')
            

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



const defaultExpiration = 3600

router.get('/', async (req,res)=>{
    let offset = req.query.offset
    let cat = req.query.cat

    console.log(cat)
    console.log(offset)
    if(cat==undefined){
        if(offset == 0){
            try{
                const posts = await client.get('posts')
                console.log(posts)
                if(posts !== null){
                    console.log(posts.length)
                    return res.json(JSON.parse(posts))
                }else{
                    const result = await postDB.getAll(offset)
                    client.setEx('posts',defaultExpiration,JSON.stringify(result))
                    res.json(result)
                }
            }catch(err){
                console.log(err)
                res.status(500).send(err)
            }
        }else{
            const result = await postDB.getAll(offset)
            res.json(result)
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

router.get('/:keyword',async (req,res)=>{


    let keyword = req.params.keyword;
    console.log(keyword)

    let result = await postDB.searchPost(keyword)
    res.json(result)


})


router.put('/', requireAuth, async (req,res)=>{
    let offset = req.query.offset

    try{
        const result = await postDB.getPersonalPost(res.user_id, offset)
        console.log(result)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
    }
})










module.exports = router