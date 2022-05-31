const express = require('express')
const router = express.Router()
const { getImage }  = require('../s3/s3')


router.get('/:key', async (req, res)=>{
    let key = req.params.key
    const readStream = await getImage(key)

    // console.log(readStream)
    let img = readStream.replace('dataimage','data:image')
    let img2 = img.replace('base64',';base64,')
    console.log('route  ',img2)
    res.send(img2)
})

module.exports=router