const { reject } = require('bcrypt/promises')
const pool = require('../db-config')


const messageDb = {}


messageDb.insertOne = (threadId, userId, time,message)=>{
   return new Promise((resolve,reject)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            return reject (err)
        }else{
            connection.beginTransaction((err)=>{
                if(err){
                    connection.rollback(()=>{
                        connection.release()
                    })
                }else{
                    connection.execute('INSERT INTO posts (thread_id, user_id, create_date, message) VALUES (?,?,?,?);',[threadId, userId, time, message],(err,results)=>{
                        if(err){
                            connection.rollback(()=>{
                                connection.release()
                                return reject (err)
                            })
                        }else{
                            connection.commit((err)=>{
                                if(err){
                                    connection.rollback(()=>{
                                        connection.release()
                                        return reject (err)
                                    })
                                }else{
                                    connection.release()
                                    return resolve(results.insertId) 
                                }
                            })
                        }
                    })
                }
            })
        }
    })
   })
}




messageDb.selectAll = (threadId, offset)=>{
    return new Promise((resolve,reject)=>{
        pool.execute(`select post_id,thread_id, message, create_date, user_name from posts join users on posts.user_id = users.user_id where posts.thread_id = (?) order by post_id desc limit 12 offset ${offset};`,[threadId],(err,results)=>{
            if(err){
                return reject(err)
            }else{
                return resolve (results)
            }
        })
    })

}



module.exports = messageDb;