const express = require('express')
const router =express.Router()
const messageDb = require('../models/message')



router.get('/' , async (req,res)=>{

    let tID = req.query.threadId
    let offset = req.query.offset
    console.log(tID, offset)
    const result = await messageDb.selectAll(tID, offset)
    res.json({message:result})
})


module.exports = router