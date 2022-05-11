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


                    connection.execute('INSERT INTO users (user_name) VALUES (?);',[username],(err,results)=>{
               
                        if(err){
                            connection.rollback(()=>{
                                connection.release()
                                return reject(err)
                            })
                        
                        }else{
                        
                            connection.execute('INSERT INTO user_credentials (authentication_type_id,email,password,user_id) VALUES (?,?,?,?);',[1,email,password, results.insertId],(err)=>{
                                if(err){
                                    connection.rollback(()=>{
                                        connection.release()
                                        return reject(err)
                                    })
                               
                                }else{
                                  
                                    connection.commit((err,results)=>{
                                        if(err){
                                            connection.rollback(()=>{
                                                connection.release()
                                                return reject (err)
                                            })
                                 
                                        }else{
                    
                                            connection.release()
                                   
                                            return resolve("ok")
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
userDB.loginOne=(email,password)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('SELECT * FROM user_credentials WHERE email = ?',[email],(err,results)=>{
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





module.exports=userDB