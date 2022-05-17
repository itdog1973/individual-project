const express = require('express')
const router =express.Router()
const messageDb = require('../models/message')



router.post('/' , async (req,res)=>{
    let tID = req.body.tID
    const result = await messageDb.selectAll(tID)
    res.json({test:result})
})


module.exports = router