require('dotenv').config
const AWS = require('aws-sdk');
const short = require('short-uuid');

AWS.config.update({
    region : process.env.AWS_BUCKET_REGION,
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY
})





let s3Bucket = new AWS.S3( { params: {Bucket: process.env.AWS_BUCKET_NAME} } );


async function covertBuf(images){
    
   const results = await Promise.all(images.map( async image=>{

    let buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),'base64') 
       
    let id = short.generate()
    let params = {
        Key: id,
        Body: buffer,
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64'
    };

    await s3Bucket.putObject(params).promise()
    return  `https://chill-talk2.s3.ap-northeast-1.amazonaws.com/${id}`
   }))
   console.log('finsihed uploading ')
   return results

}





module.exports= { covertBuf }










