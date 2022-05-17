const pool = require('../db-config')



let userDB = {}


//新增使用者
userDB.insertOne = (username,password,email)=>{
    return new Promise((resolve,reject)=>{

        pool.getConnection( (err,connection)=>{


            if(err){
                return reject (err)
            }

            connection.beginTransaction((err)=>{

                if(err){
                    connection.rollback(()=>{
                        connection.release()
                        return reject (err)
                    })
                
                }else{


                    connection.execute('INSERT INTO users (user_name,email,password) VALUES (?,?,?);',[username,email,password],(err,results)=>{
               
                        if(err){
                            connection.rollback(()=>{
                                connection.release()
                                return reject(err)
                            })
                       
                        
                        }else{
                           
                            connection.execute('INSERT INTO user_credentials (authentication_type_id,user_id) VALUES (?,?);',[1, results.insertId],(err)=>{
                                if(err){
                                    connection.rollback(()=>{
                                        connection.release()
                                        return reject(err)
                                    })
                                   
                                }else{
                                    console.log(results)
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

    })
}



//登陸使用者
userDB.loginOne=(email)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('SELECT * FROM users WHERE email = ?',[email],(err,results)=>{
            if(err){
                console.log(err)
                return reject (err)
            }else{
                console.log(results[0])
                return resolve(results[0])
            }
        })
    })
}







userDB.findOne=(id)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('SELECT * FROM users join user_credentials on users.user_id = user_credentials.user_id WHERE users.user_id = ? ',[id],(err,results)=>{
            if(err){
                console.log(err)
                return reject (err)
            }else{
                console.log(results)
                return resolve(results[0])
            }
        })
    })
}





module.exports=userDB