require('dotenv').config
const AWS = require('aws-sdk');
const short = require('short-uuid');

AWS.config.update({
    region : process.env.AWS_BUCKET_REGION,
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY
})





let s3Bucket = new AWS.S3( { params: {Bucket: process.env.AWS_BUCKET_NAME} } );


async function covertBuf(string){
    
    
    return new Promise((resolve,reject)=>{


        // string is based 64 image string which is passed from the client side

        // let buffer = Buffer.from(string.replace(/^data:image\/\w+;base64,/, ""),'base64') 
        let buffer = Buffer.from(string,'base64') 
        let id = short.generate()
        let params = {
            Key: id,
            Body: buffer,
            ContentType: 'image/jpeg'
        };

        s3Bucket.putObject(params, function(err, data){
            if (err) { 
            console.log(err);
            console.log('Error uploading data: ', data); 
            return reject(err)
            } else {
            console.log('successfully uploaded the image!');
            return resolve(id)
            }
        });
    })


}


function getImage(objKey){
  return new Promise((resolve, reject)=>{
    let getParams = {

        Bucket: process.env.AWS_BUCKET_NAME,
        Key: objKey
    }

    s3Bucket.getObject(getParams, (err,data)=>{
        if(err){
            return reject(err)
        }

        return resolve(data.Body.toString('base64'))
    })

  })
    
}




module.exports= { covertBuf, getImage }










