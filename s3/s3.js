require('dotenv').config()

const AWS = require('aws-sdk');
const short = require('short-uuid');



AWS.config.update({
    region : process.env.AWS_BUCKET_REGION,
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY
})





let s3Bucket = new AWS.S3( { params: {Bucket: process.env.AWS_BUCKET_NAME} } );


function covertBuf(images){
    
    let result = images.map(processImg)
   
    let results = Promise.all(result)
 
    return results
      
   
}


function processImg(data){
    return new Promise((resolve,reject)=>{
        let buffer = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""),'base64') 
       
    let id = short.generate()
    let params = {
        Key: id,
        Body: buffer,
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64'
    };

    s3Bucket.putObject(params,(err,data)=>{
        if(err){
            reject('null')
        }else{
            resolve(`https://dv0q95071dj8r.cloudfront.net/${id}`)
        }
    })

    
    })
}



module.exports= { covertBuf }










