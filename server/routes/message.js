const express = require('express')
const router =express.Router()
const messageDb = require('../models/message')



router.post('/' , async (req,res)=>{
    let tID = req.body.tID
    let offset = req.body.offset
    console.log(tID, offset)
    const result = await messageDb.selectAll(tID, offset)
    res.json({message:result})
})


module.exports = router