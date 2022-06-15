const { reject } = require('bcrypt/promises')
const pool = require('../db-config')


const messageDb = {}


messageDb.insertOne = (threadId, userId, time,message=null, images=null)=>{
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
                
                    connection.execute('INSERT INTO message (chatroom_id, user_id, create_date, message, images) VALUES (?,?,?,?,?);',[threadId, userId, time, message, images],(err,results)=>{
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
        pool.execute(`select message_id,chatroom_id, message, create_date, user_name, images from message join users on message.user_id = users.user_id where message.chatroom_id = (?) order by message_id desc limit 20 offset ${offset};`,[threadId],(err,results)=>{
            if(err){
                return reject(err)
            }else{
                return resolve (results)
            }
        })
    })

}



module.exports = messageDb;