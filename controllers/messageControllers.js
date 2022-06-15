const messageDb = require('../models/message')

const message_details = async (req,res)=>{
    let { threadId, offset } = req.query

   
            try{ 
                    const result = await messageDb.selectAll(threadId, offset)
                    res.json(result)
            }catch(err){
                console.log(err)
                                res.status(500);
            }


            
}

module.exports ={message_details}