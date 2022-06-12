const express = require('express')
const router =express.Router()
const messageDb = require('../models/message')
const redis = require('redis')
const client = redis.createClient( 6379 )


async function connectR(){
     client.connect()
     console.log('client status2',client)
  
}
connectR()



// const defaultExpiration = 3600








router.get('/' , async (req,res)=>{
    let { threadId, offset } = req.query
    console.log(offset)
    if(offset == 0){
        try{
            const value = await client.get(`message?threadId=${threadId}`)
            console.log('this is message',value)
            if(value !== null){
                console.log('messssss')
                return res.json(JSON.parse(value))
            }else{
                try{
                    console.log('no data')
                    const result = await messageDb.selectAll(threadId, offset)
                    client.set(`message?threadId=${threadId}`, JSON.stringify(result) )
                    res.json(result)
                }catch(err){
                   
                    console.log(err)
                    res.status(500);
                }
            }
        }catch(err){
            console.log(err)
        }
    }else{
        try{
    
            const result = await messageDb.selectAll(threadId, offset)
            res.json(result)
        }catch(err){
            console.log(err)
            res.status(500);
        }
    }
    }
    



)

















module.exports = router