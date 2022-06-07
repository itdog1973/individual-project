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
const imgAPI = require('./routes/images.js')
app.use('/api/users',userAPI)
app.use('/api/posts',postAPI)
app.use('/api/messages',msgAPI)
app.use('/auth',authAPI)
app.use('/images',imgAPI)

const { userJoin, getCurrentUser, userLeave, getRoomUsers}   = require('./socket-utils/user-util');

// const session = require('express-session')
// app.use(session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))


const cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'chill-talk session',
    keys: [process.env.COOKIE_SECRET],
    // Cookie Options
    // maxAge: 24 * 60 * 60 * 1000  24 hours
  }))
const passport =require('passport');
require('./middleware/passport-set')
app.use(passport.initialize());
app.use(passport.session());








app.get('/', checkUser, (req,res)=>{
 
    res.render('index')
})












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













let plyers = []
let typing=false;
let timer=null;
io.on('connection',async (socket)=>{
    let currentSocketId = socket.id
    // socket.emit("hello","world") // to single user who connect to this server
    console.log(currentSocketId)

    let cookief =socket.handshake.headers.cookie;
    let currentUserId = await checkToken(cookief)
    console.log(currentUserId)
   
    let foundUser;
   
    //start join room 
    socket.on('joinRoom',({author,title,message,username,threadId,time})=>{
        
        console.log(author,title,message,username,threadId,currentUserId,time)
       
        const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]); ///////show socket
        console.log('the total players in connecting to this socket',sockets);
        let usersInRoom = getRoomUsers(title)

        const usersIdInRoom = usersInRoom.map((user)=>{
            return user.userId
        })
        console.log('user in room'+usersIdInRoom)
    
    
        foundUser = usersInRoom.find((user)=>{
            console.log(user.userId)
            console.log(currentUserId)
            return user.userId == currentUserId
        })
    
        console.log('is there a same user in the room'+foundUser)

        // check if duiplicate 
        if(foundUser){

            
     
            
            currentSocketId = foundUser.socketId
            
            io.to(currentSocketId).emit('duplicate','error')

            io.sockets.sockets.forEach((socket) => {
          


                // If given socket id is exist in list of all sockets, kill it
                if(socket.id === currentSocketId){

                   
                    socket.disconnect(true);
                    
                    console.log('remove a user')
                    
                    const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
                    console.log('the rest:',sockets);
                    
                }



            });




            const user = userJoin(currentSocketId,username,title,threadId,currentUserId,time)

               
                socket.join(user.title)
                currentSocketId=user.socketId;

                socket.emit('init-load',{
                    author,
                    message,
                    title,
                    user:user.username,
                    createAt: time
                })




                console.log(user) // 印出user details
                
              

                if(user.username != 'guest'){
                    socket.to(user.title).emit('new-user',{
                        user:user.username,
                        message:'已進入聊天室',
                        createAt: new Date().toLocaleString()
                })


                



                //init a character for user

                
                if(user.username != 'guest'){
                    socket.emit('init-char',{
                        id:currentSocketId,
                        plyers
                })}







                // send users and room info 
                io.to(user.title).emit('roomusers',{
                    room:user.title,
                    users: getRoomUsers(user.title)
                })



                }


               
                
            }else{



                const user = userJoin(currentSocketId,username,title,threadId,currentUserId)

                            
                socket.join(user.title)

                

                socket.emit('init-load',{
                    author,
                    message,
                    title,
                    user:user.username,
                    createAt: time
                })




                console.log(user) // 印出user details
                if(user.username != 'guest'){
                socket.to(user.title).emit('new-user',{
                    user:user.username,
                    message:'已進入聊天室',
                    createAt: new Date().toLocaleString()
                    
                })


                //init a character for user

                
                let roomUsers = getRoomUsers(title)
                console.log('look',roomUsers)


                      
                if(user.username != 'guest'){
                    socket.emit('init-char',{
                        id:currentSocketId,
                        plyers
                })}



                




                

                const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
                console.log(sockets);





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
            console.log('trigger')
            if(message.hasOwnProperty('imgArray')){
                
                if(message.hasOwnProperty('message')){
               
                    let result = await covertBuf(message['imgArray'])
               
                    const user = getCurrentUser(currentSocketId)
               
                    io.to(user.title).emit('chat-message',{
                        message:message['message'],
                        images:result,
                        user:user.username,
                        createAt
    
                    })

                    await messageDb.insertOne(user.threadId,user.userId, createAt, message['message'],result)


                socket.to(user.title).emit('msg-notification','new-msg')
                }else{
                    const user = getCurrentUser(currentSocketId)
                    const result = await covertBuf(message['imgArray'])
         

                    io.to(user.title).emit('chat-message',{
                        images:result,
                        user:user.username,
                        createAt
    
                    })
                    await messageDb.insertOne(user.threadId,user.userId, createAt, images=result)
                socket.to(user.title).emit('msg-notification','new-msg')
                }
            

            }else{
                const user = getCurrentUser(currentSocketId)
                io.to(user.title).emit('chat-message',{
                    message,
                    user:user.username,
                    createAt

                })
         

            socket.to(user.title).emit('msg-notification','new-msg')


            let result = await messageDb.insertOne(user.threadId,user.userId, createAt, message)
            console.log(result)
            }
            
 
        })
    


        socket.on('typing',(username)=>{
            typing=true;
            const user = getCurrentUser(currentSocketId)
            console.log(username)
            socket.to(user.title).emit("typing",{typing:typing,username:username})
            clearTimeout(timer)
            timer= setTimeout(() => {
                typing=false
                socket.to(user.title).emit("typing",{typing:typing,username:username})
            }, 1000);
        })




        socket.on('new-player', obj => {
            console.log('new player id',currentSocketId)
            const user = getCurrentUser(currentSocketId)
            console.log('the new player info',obj)
            plyers.push(obj);
            console.log('all players in an array',plyers)
            socket.to(user.title).emit('new-player', obj)});

        socket.on('move-player',  info => {
            const user = getCurrentUser(currentSocketId)

            console.log('moveing user id',user )
            console.log(getRoomUsers(user.title))
            let foundPlayer = plyers.find(x => x.id == currentSocketId);
            console.log('the move player index is ',foundPlayer)
            console.log('the dir is',info)
            console.log(info['dir'], info['position'])

            if(info['dir'] == 'down' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'up' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'left' ){
                foundPlayer.x=info['position']
            }else if(info['dir'] == 'right' ){
                foundPlayer.x=info['position']
            }

            console.log(plyers)
            socket.to(user.title).emit('move-player', {id:currentSocketId, dir:info['dir']})
        });

        socket.on('stop-player',  info =>{
            const user = getCurrentUser(currentSocketId)
            console.log('stop player id', user)



            let foundPlayer = plyers.find(x => x.id == currentSocketId);

            if(info['dir'] == 'down' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'up' ){
                foundPlayer.y=info['position']
            }else if(info['dir'] == 'left' ){
                foundPlayer.x=info['position']
            }else if(info['dir'] == 'right' ){
                foundPlayer.x=info['position']
            }



            socket.to(user.title).emit('stop-player', {id:currentSocketId, dir:info['dir']})
    });
                    




   
        socket.on('disconnect', ()=>{
            console.log('a user disconnect')
            const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
            console.log(sockets);
            console.log(foundUser)
            
        
            
             
                console.log(currentSocketId)
                const user= userLeave(currentSocketId);
                console.log(user)
                if(user){

                    io.to(user.title).emit('remove-player', socket.id);
                    plyers = plyers.filter(v => v.id !== socket.id);



                    if(user.username != 'guest'){
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
      
        }
        )
  
        

});










httpServer.listen(3000)

