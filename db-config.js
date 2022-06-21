const mysql = require('mysql2')
// require('dotenv').config({path:__dirname+'/.env'})
require('dotenv').config({override:true})
console.log(process.env.rds_HOST,process.env.rds_PASSWORD)
const pool =mysql.createPool(
    {
        host:process.env.rds_HOST,
        user:process.env.rds_USER,
        database:process.env.DB,
        password:process.env.rds_PASSWORD,
        connectionLimit: 10
    }
)

module.exports=pool