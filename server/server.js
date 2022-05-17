const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const postDB = require('./models/post')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const jwt = require('jsonwebtoken')

const cookie = require('cookie')

const messageDb = require('./models/message')



const path = require('path')
const cookieParser = require('cookie-parser');
require('dotenv').config
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'/views'))
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json())
app.use(express.urlencoded());
const {checkUser, requireAuth, checkToken} = require('./middleware/authMiddleware')
app.use(cookieParser());
const userAPI = require('./routes/user.js');
const postAPI = require('./routes/post.js')
const msgAPI = require('./routes/message.js')

app.use('/api/users',userAPI)
app.use('/api/posts',postAPI)
app.use('/api/messages',msgAPI)

const { userJoin, getCurrentUser, userLeave, getRoomUsers}   = require('./socket-utils/user-util');
const { disconnect } = require('process');





app.get('*', checkUser);
// app.get('*', checkUser);
app.get('/', (req,res)=>{
    res.render('index')
})


// app.post('/thread', requireAuth, async (req,res)=>{
//     console.log(req.body.cat, req.body.message, req.body.title)
//     try{
//         const result = await postDB.insertOne(req.body.title,req.body.message,req.user_id,req.body.cat)
//         res.render('chat', {title: req.body.title, message: req.body.message})
//     }catch(err){
//         res.status(500).send({
//                         error:err.message
//                     })
//     }

// })


app.get('/thread', checkUser, async (req,res)=>{
  
    let title=req.query.title;
    let message=req.query.message;
    let author=req.query.author;
    
    if(title && message && author){
        try{
            let result = await postDB.checkSpecific(title,message,author)
            if(result.length != 0){
                res.render('chat')
            }else{
                res.redirect('/')
            }
        }catch(err){
            res.redirect('/')
        }
    }else{
        res.redirect('/')
    }



   
})
















io.on('connection',async (socket)=>{
    let currentSocketId = socket.id
    // socket.emit("hello","world") // to single user who connect to this server
    

    let cookief =socket.handshake.headers.cookie;
    let userId = await checkToken(cookief)
    console.log(userId)
   
    let foundUser;
   

    socket.on('joinRoom',({author,title,message,username,threadId})=>{
        
        console.log(author,title,message,username,threadId,userId)
       
        const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]); ///////show cocket
        console.log(sockets);
        let usersInRoom = getRoomUsers(title)

        const usersIdInRoom = usersInRoom.map((user)=>{
            return user.userId
        })
        console.log('user in room'+usersIdInRoom)
    
    
        foundUser = usersInRoom.find((user)=>{
            return user.userId = userId
        })
    
        console.log('is there a same user in the room'+foundUser)


        if(foundUser){

            
            socket.emit('duplicate','error')
        
            
           
            io.sockets.sockets.forEach((socket) => {
          


                // If given socket id is exist in list of all sockets, kill it
                if(socket.id === currentSocketId){

                   
                    socket.disconnect(true);
                    
                    console.log('remove a user')
                    
                    const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
                    console.log('the rest:',sockets);
                }



            });

               
                
            }else{



                const user = userJoin(socket.id,username,title,threadId,userId)

                            
                socket.join(user.title)

                console.log(author,message,user.title,user.username,userId)

                socket.emit('init-load',{
                    author,
                    message,
                    title,
                    user:user.username,
                    createAt: new Date().toLocaleString()
                })




                console.log(user) // 印出user details
                if(user.username != 'guest'){
                socket.to(user.title).emit('new-user',{
                    user:user.username,
                    message:'已進入聊天室',
                    createAt: new Date().toLocaleString()
                    
                })


                // send users and room info 
                io.to(user.title).emit('roomusers',{
                    room:user.title,
                    users: getRoomUsers(user.title)
                })
                }

            }
        
    })


        let createAt = new Date().toLocaleString()
        //listen for chatmessage
        socket.on('chat-message', async (message)=>{
            const user = getCurrentUser(socket.id)
            io.to(user.title).emit('chat-message',{
                message,
                user:user.username,
                createAt

            })


            let result = await messageDb.insertOne(user.threadId,user.userId, createAt, message)
            console.log(result)

        })
    


        socket.on('typing',(data)=>{
            const user = getCurrentUser(socket.id)
            socket.to(user.title).emit("typing",data)
        })




   
        socket.on('disconnect', ()=>{
            // console.log('a user disconnect')
            // const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
            // console.log(sockets);
            // console.log(foundUser)
         
        
            

            if(!foundUser){
     
                const user= userLeave(socket.id);
                

                
                io.to(user.title).emit('leave-message',{
                    user:user.username,
                    message:"已離開聊天室",
                    createAt: new Date().toLocaleString()
                });



                // send users and room info 
                io.to(user.title).emit('roomusers',{
                    room:user.title,
                    users: getRoomUsers(user.title)
                })
                }
            
        }
        )
  
        

});










httpServer.listen(3000)

