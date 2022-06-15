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



userDB.findGoogleUser=(profileId)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('SELECT * FROM authentication WHERE google_id = (?)',[profileId],(err,results)=>{
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


userDB.insertGoogleUser=(profileId, name, image)=>{
    return new Promise((resolve,reject)=>{

        pool.getConnection((err,connection)=>{

            if(err){
                return reject (err)
            }

            connection.beginTransaction((err)=>{
                if(err){
                    connection.rollback(()=>{
                        connection.release()
                        return reject(err)
                    })
                }else{
                    connection.execute('INSERT INTO users (user_name, avatar) VALUES (?,?)',[name, image],(err,results)=>{
                        if(err){
                            connection.rollback(()=>{
                                connection.release()
                                return reject (err)
                            })
                 
                        }else{
                            connection.execute('INSERT INTO authentication (user_id,google_id) VALUES (?,?)',[results.insertId,profileId],(err,results)=>{
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





    })
}




userDB.findOne=(id)=>{
    return new Promise((resolve,reject)=>{
        pool.execute('SELECT * FROM users WHERE users.user_id = ? ',[id],(err,results)=>{
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