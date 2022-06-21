const pool = require('../db-config')




const postDB = {}


postDB.insertOne = (title, message, userId, createDate,cat)=>{
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
                        connection.execute('INSERT INTO chatroom (title, message, author_id, create_date, category) VALUES (?,?,?,?,?)',[title,message,userId,createDate,cat], (err,results)=>{
                            if(err){
                                connection.rollback(()=>{
                                    connection.release()
                                    return reject(err)
                                })
                            }else{
                                connection.commit((err)=>{
                                    if(err){
                                        connection.rollback(()=>{
                                            connection.release()
                                            return reject(err)
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





postDB.getOne = (title)=>{
    return new Promise ((resolve,reject)=>{
        pool.execute('SELECT * FROM chatroom WHERE title = (?)',[title],(err,results)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(results)
            }
        })
    })
}





postDB.getAll = (offset)=>{
    return new Promise((resolve,reject)=>{
        pool.execute(`SELECT t1.chatroom_id, t1.title, t1.message, t1.author_id, t1.category, t1.create_date, t2.user_name FROM chatroom t1 JOIN users t2 ON t1.author_id = t2.user_id  ORDER BY t1.chatroom_id DESC LIMIT 7 OFFSET ${offset};`,(err,results)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(results)
            }
        })
        
    })
}




postDB.checkSpecific=(id)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('select title, message, create_date, user_name from chatroom join users on chatroom.author_id = users.user_id where chatroom_id = (?);',[id],(err,results)=>{
            if(err){
                return reject (err)
            }else{
                return resolve(results[0])
            }
        })
    })
}



postDB.getSpecificAll = (cat,offset)=>{
    return new Promise((resolve,reject)=>{
        console.log('what',cat)
        console.log(offset)
        pool.execute(`SELECT t1.chatroom_id, t1.title, t1.message, t1.author_id, t1.category, t1.create_date, t2.user_name FROM chatroom t1 JOIN users t2 ON t1.author_id = t2.user_id  WHERE category = (?) ORDER BY t1.chatroom_id DESC LIMIT 7 OFFSET ${offset};`,[cat],(err,results)=>{
            if(err){
                console.log(err.message)
                return reject(err)
            }else{
                return resolve(results)
            }
        })
        
    })
}


postDB.searchPost = (keyWord)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('select chatroom_id, user_name, create_date, title, category FROM chatroom join users on user_id = author_id where match (title) against (?);', [keyWord],(err,results)=>{
            if(err){
                return reject (err.message)
            }else{
                return resolve(results)
            }
        })
    })
}


postDB.insertBrowseTime = (userId, threadId)=>{
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
                        connection.execute('INSERT INTO user_chatroom (user_id, chatroom_id) VALUES (?,?)',[userId,threadId], (err,results)=>{
                            if(err){
                                connection.rollback(()=>{
                                    connection.release()
                                    return reject(err)
                                })
                            }else{
                                connection.commit((err)=>{
                                    if(err){
                                        connection.rollback(()=>{
                                            connection.release()
                                            return reject(err)
                                        })
                                    }else{
                                        connection.release()
                                        return resolve(results)
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

postDB.getBrowseRecord = (userId, threadId)=>{
    return new Promise((resolve, reject)=>{
        console.log(userId, threadId)
        try{
            pool.execute('select * from user_chatroom where user_id = (?) and chatroom_id = (?);',[userId, threadId],(err,results)=>{
                console.log(results)
                return resolve(results)
            })
        }catch(err){
            console.log(err)
            reject(err)
        }
    })
}

postDB.updateBrowseRecord = (userId, threadId)=>{
    return new Promise((resolve, reject)=>{
        try{
            pool.execute('update user_chatroom set browse_date = now() where user_id = (?) and chatroom_id = (?);',[userId, threadId],(err,results)=>{
                console.log('update result',results)
                return resolve(results)
            })
        }catch(err){
            console.log(err)
        }
    })
}



postDB.getPersonalPost = (userId, offset)=>{
    return new Promise((resolve, reject)=>{
        console.log(userId)
        pool.execute(`select t.chatroom_id, t.title, t.message, t.create_date, t.category, u.user_name from chatroom t join user_chatroom ut on ut.chatroom_id = t.chatroom_id join users u on u.user_id = t.author_id where ut.user_id = (?) order by browse_date desc limit 7 offset ${offset} ; `,[userId],(err,results)=>{
            if(err){
                console.log(err)
                return reject(err)
            }
            console.log('update result',results)
            return resolve(results)
        })
    })
}


module.exports=postDB