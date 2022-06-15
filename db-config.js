const mysql = require('mysql2')
require('dotenv').config({path:__dirname+'/.env'})
const pool =mysql.createPool(
    {
        host: process.env.HOST,
        user:process.env.DBUSER,
        database:process.env.DB,
        password:process.env.PASSWORD,
        connectionLimit: 10
    }
)

module.exports=pool