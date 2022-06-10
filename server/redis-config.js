const redis = require('redis')
const client = redis.createClient()


client.on('error', function(error){
    console.log(error)
})

client.on('connect', function(error){
    console.log('redis sucess ')
})

module.exports={ client }
