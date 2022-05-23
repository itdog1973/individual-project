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
                        connection.execute('INSERT INTO threads (title, message, author_id, create_date, category) VALUES (?,?,?,?,?)',[title,message,userId,createDate,cat], (err,results)=>{
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
        pool.execute('SELECT * FROM threads WHERE title = (?)',[title],(err,results)=>{
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
        pool.execute(`SELECT t1.thread_id, t1.title, t1.message, t1.author_id, t1.category, t1.create_date, t2.user_name FROM threads t1 JOIN users t2 ON t1.author_id = t2.user_id  ORDER BY t1.thread_id DESC LIMIT 7 OFFSET ${offset};`,(err,results)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(results)
            }
        })
        
    })
}




postDB.checkSpecific=(title,message,author)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('select * from threads join users on users.user_id = threads.author_id where title = (?) and message = (?) and user_name =(?);',[title,message,author],(err,results)=>{
            if(err){
                return reject (err)
            }else{
                return resolve(results)
            }
        })
    })
}



postDB.getSpecificAll = (cat,offset)=>{
    return new Promise((resolve,reject)=>{
        console.log('what',cat)
        console.log(offset)
        pool.execute(`SELECT t1.thread_id, t1.title, t1.message, t1.author_id, t1.category, t1.create_date, t2.user_name FROM threads t1 JOIN users t2 ON t1.author_id = t2.user_id  WHERE category = (?) ORDER BY t1.thread_id DESC LIMIT 7 OFFSET ${offset};`,[cat],(err,results)=>{
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
        pool.execute('select user_name, create_date, title  FROM threads join users on user_id = author_id where match (title) against (?);', [keyWord],(err,results)=>{
            if(err){
                return reject (err.message)
            }else{
                return resolve(results)
            }
        })
    })
}


module.exports=postDB