//  MDN naming convesion 
// post_index, post_details, post_create_post, post_personal_post
const postDB = require('../models/post')
const redis = require('redis')
const client = redis.createClient({
    url: 'redis://redis-server',
    port: 6379
});
async function connectR(){
    client.connect()
}
connectR()



const post_index = async (req,res)=>{
    let offset = req.query.offset
    let cat = req.query.cat


    if(cat==undefined){
        if(offset == 0){
            try{
                const posts = await client.lRange('posts',0,-1)
             
                if(posts.length !== 0){
                    let postsArray = Array.from(posts)
       
                    let postJSONArray=[];
                    postsArray.forEach(p=>{
                        postJSONArray.push(JSON.parse(p))
                    })
             
          
                    return res.json(postJSONArray)
                }else{
                    const result = await postDB.getAll(offset)
                    

                    result.forEach(r =>{
            
                        client.rPush('posts',JSON.stringify(r))
                    })


                    res.json(result)
                }
            }catch(err){
           
                res.status(500).send(err)
            }
        }else{
            const result = await postDB.getAll(offset)
            res.json(result)
        }
           
       
      
    }else{
        try{
            const result = await postDB.getSpecificAll(cat,offset)
            
    
            res.json(result)
    
        }catch(err){
   
            res.status(500).json({error:err.message})
        }




    }
}



const post_details = async (req,res)=>{
    let keyword = req.params.keyword;
    let result = await postDB.searchPost(keyword)
    res.json(result)
}




const post_create_post = async (req,res)=>{
    const { cat, message, title } = req.body
    try{  
        const titleResult = await postDB.getOne(title)

     
        if(titleResult.length===0){
            let create_date = new Date().toLocaleString()
            const result = await postDB.insertOne(title,message,res.user_id,create_date,cat)
   
            const payload ={ title, message, user_name:res.userName, chatroom_id:result, userId:res.user_id ,create_date}

          
            client.lPush('posts',JSON.stringify({chatroom_id:result,title,message,author_id:res.user_id,category:cat,create_date,user_name:res.userName}))
            let listLength = (await client.lRange('posts',0,-1)).length
            if(listLength > 7){
      
                client.rPop('posts')
            }
           
            res.status(200).json(payload)
            
    
        }else{
  
            res.status(400).json({error:'重覆的title名'})
        }

              


    }catch(err){

        res.status(500).json({
            error:err.message
        })
    }

}



const post_personal_post = async (req,res)=>{
    let offset = req.query.offset

    try{
        const result = await postDB.getPersonalPost(res.user_id, offset)
        res.status(200).json(result)

    }catch(err){
        console.log(err)
    }
}







module.exports ={
    post_index,
    post_details,
    post_create_post,
    post_personal_post
}