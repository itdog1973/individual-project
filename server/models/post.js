const pool = require('../db-config')



const postDB = {}


postDB.insertOne = (title, message, user_id, cat)=>{
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
                        connection.execute('INSERT INTO threads (title, message, author_id, category) VALUES (?,?,?,?)',[title,message,user_id,cat], (err,results)=>{
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





postDB.getAll = ()=>{
    return new Promise((resolve,reject)=>{
        pool.execute('SELECT t1.thread_id, t1.title, t1.message, t1.author_id, t1.category, t1.create_date, t2.user_name FROM threads t1 JOIN users t2 ON t1.author_id = t2.user_id  ORDER BY t1.thread_id DESC LIMIT 10;',(err,results)=>{
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



module.exports=postDB