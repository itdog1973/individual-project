const express = require('express');

const { createServer } = require('http');
const { Server } = require('socket.io');
const postDB = require('./models/post')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    maxHttpBufferSize:10e6
})
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
const {checkUser, requireAuth, checkToken, isLoggedIn} = require('./middleware/authMiddleware')
app.use(cookieParser());
const { covertBuf } = require('./s3/s3')
const userAPI = require('./routes/user.js');
const postAPI = require('./routes/post.js')
const msgAPI = require('./routes/message.js')
const authAPI = require('./routes/auth.js')
// const imgAPI = require('./routes/images.js')
app.use('/api/users',userAPI)
app.use('/api/posts',postAPI)
app.use('/api/messages',msgAPI)
app.use('/auth',authAPI)
// app.use('/images',imgAPI)

const { userJoin, getCurrentUser, userLeave, getRoomUsers ,users}   = require('./socket-utils/user-util');




const cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'chill-talk session',
    keys: [process.env.COOKIE_SECRET],
  }))
const passport =require('passport');
require('./middleware/passport-set')
app.use(passport.initialize());
app.use(passport.session());

const redis = require('redis')
const client = redis.createClient( 6379 )


async function connectR(){
     client.connect()
  
}
connectR()







// login route
app.get('/login',(req,res)=>{
    res.render('login')
})

// register route
app.get('/register',(req,res)=>{
    res.render('register')
})
// home page route
app.get('/', checkUser, (req,res)=>{
 
    res.render('index')
})

// chat room route
app.get('/chat/:id', checkUser, async (req,res)=>{
    const chatID = req.params.id

    try{
        let result = await postDB.checkSpecific(chatID)
        if(result){
            res.render('chat',{ title:result['title'], message:result['message'], author:result['user_name'], time:result['create_date'] })
        }else{
            res.redirect('/')
        }
    }catch(err){
        console.log(err.message)
        res.redirect('/')
    }
  


   
})




let plyers = []
let typing=false;
let timer=null;
io.on('connection',async (socket)=>{

  

    let cookief =socket.handshake.headers.cookie;
    let userInfo = await checkToken(cookief)
    let currentUserId = userInfo['id']
    let currentUserName = userInfo['name']
    console.log(currentUserName)

   
    let foundUser;
   
 
    socket.on('joinRoom',async (room)=>{
  

       
        const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]); ///////show socket
  
        let usersInRoom = getRoomUsers(room)
     

        const usersIdInRoom = usersInRoom.map((user)=>{
            return user.userId
        })

    
        foundUser = usersInRoom.find((user)=>{
            return user.userId == currentUserId
        })
    
      

        // check if duiplicate 
        if(foundUser){


            
            io.to(foundUser.socketId).emit('duplicate','error')

            io.sockets.sockets.forEach((socket) => {
          


                // If given socket id is exist in list of all sockets, kill it
                if(socket.id === foundUser.socketId){

                   
                    socket.disconnect(true);
                    
           
                    
                    const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
                    console.log('the rest:',sockets);
                    
                }



            });




            const user = userJoin(socket.id,currentUserName,room,currentUserId)
        
               
                socket.join(room)
                let currentUserinroom = getRoomUsers(room)
                console.log('current all user in room',currentUserinroom)




                if(user.username != 'guest'){
                    socket.to(user.room).emit('new-user',{
                        user:user.username,
                        message:'已進入聊天室',
                        createAt: new Date().toLocaleString()
                })


                if(user.username!="guest"){
         
                    const record = await postDB.getBrowseRecord(currentUserId,room)
      
                    if(record.length!=0){
                     
                       await postDB.updateBrowseRecord(currentUserId,room)
                    }else{
            
                        await postDB.insertBrowseTime(currentUserId,room)
                    }
                }



                //init a character for user

                let roomPlyers = plyers.filter(player=>player.room === user.room)
                if(user.username != 'guest'){
                    socket.emit('init-char',{
                        id:socket.id,
                        room:user.room,
                        plyers:roomPlyers
                })}




                
                

                // send users and room info 
                io.to(user.room).emit('roomusers',
                {
                    room:user.room,
                    users: getRoomUsers(user.room)
                }
                
                )



                }


               
                
            }else{



               
            const user = userJoin(socket.id,currentUserName,room,currentUserId)

               
                            
                socket.join(user.room)

                


                if(user.username!="guest"){
                    const record = await postDB.getBrowseRecord(currentUserId,room)
            
         
                    if(record.length!=0){
        
                       await postDB.updateBrowseRecord(currentUserId,room)
                    }else{
                        await postDB.insertBrowseTime(currentUserId,room)
                    }
                }



       
                if(user.username != 'guest'){
                socket.to(user.room).emit('new-user',{
                    user:user.username,
                    message:'已進入聊天室',
                    createAt: new Date().toLocaleString()
                    
                })


                //init a character for user

                
                // let roomUsers = getRoomUsers(room)



                      
                let roomPlyers = plyers.filter(player=>player.room === user.room)
                if(user.username != 'guest'){
                    socket.emit('init-char',{
                        id:socket.id,
                        room:user.room,
                        plyers:roomPlyers
                })}



                

                const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
                console.log(sockets);





                // send users and room info 
                io.to(user.room).emit('roomusers',{
                    room:user.room,
                    users: getRoomUsers(user.room)
                    
                })
                }

            }
        
    })

       



        let createAt = new Date().toLocaleString()
        //listen for chatmessage
        socket.on('chat-message', async (message)=>{
            if(message.hasOwnProperty('imgArray')){
                
                if(message.hasOwnProperty('message')){
               
                    let result = await covertBuf(message['imgArray'])
               
                    const user = getCurrentUser(socket.id)
               
                    io.to(user.room).emit('chat-message',{
                        message:message['message'],
                        images:result,
                        user:user.username,
                        createAt
    
                    })


             



                    await messageDb.insertOne(user.room,user.userId, createAt, message['message'],result)
              
                socket.to(user.room).emit('msg-notification','new-msg')
                }else{
                    const user = getCurrentUser(socket.id)
                    const result = await covertBuf(message['imgArray'])
         

                    io.to(user.room).emit('chat-message',{
                        images:result,
                        user:user.username,
                        createAt
    
                    })
                    await messageDb.insertOne(user.room,user.userId, createAt, images=result)
                socket.to(user.room).emit('msg-notification','new-msg')
                }
            

            }else{
                const user = getCurrentUser(socket.id)
                io.to(user.room).emit('chat-message',{
                    message,
                    user:user.username,
                    createAt

                })
         

            socket.to(user.room).emit('msg-notification','new-msg')


            await messageDb.insertOne(user.room,user.userId, createAt, message)
            }
            
 
        })
    


        socket.on('typing',()=>{
            typing=true;
            const user = getCurrentUser(socket.id)
            socket.to(user.room).emit("typing",{typing:typing,username:user.username})
            clearTimeout(timer)
            timer= setTimeout(() => {
                typing=false
                socket.to(user.room).emit("typing",{typing:typing,username:user.username})
            }, 1000);
        })




        socket.on('new-player', obj => {
       
            const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
            const user = getCurrentUser(socket.id)
            plyers.push(obj);
            socket.to(user.room).emit('new-player', obj)});



        socket.on('move-player',  info => {
            const user = getCurrentUser(socket.id)
     
            let foundPlayer = plyers.find(x => x.id == socket.id);
       

            if(info['dir'] == 'down' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'up' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'left' ){
                foundPlayer.x=info['position']
            }else if(info['dir'] == 'right' ){
                foundPlayer.x=info['position']
            }


            socket.to(user.room).emit('move-player', {id:socket.id, dir:info['dir']})
        });

        socket.on('stop-player',  info =>{
            const user = getCurrentUser(socket.id)

            let foundPlayer = plyers.find(x => x.id == socket.id);

            if(info['dir'] == 'down' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'up' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'left' ){
                foundPlayer.x=info['position']
            }else if(info['dir'] == 'right' ){
                foundPlayer.x=info['position']
            }



            socket.to(user.room).emit('stop-player', {id:socket.id, dir:info['dir']})
    });
                    




   
        socket.on('disconnect', ()=>{

            const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
    
                const user= userLeave(socket.id);
  
                if(user){

                    io.to(user.room).emit('remove-player', socket.id);
                    plyers = plyers.filter(v => v.id !== socket.id);



                    if(user.username != 'guest'){
                        io.to(user.room).emit('leave-message',{
                            user:user.username,
                            message:"已離開聊天室",
                            createAt: new Date().toLocaleString()
                        });

                           // send users and room info 
                    io.to(user.room).emit('roomusers',{
                        room:user.room,
                        users: getRoomUsers(user.room)
                    })
                    }
                   
    

                }
      
        }
        )
  
        

});










httpServer.listen(3000)

