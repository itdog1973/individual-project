

const socket = io.connect('http://localhost:3000');



 const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let author = params.author; // "some_value"
  let title = params.title;
  let message = params.message
  let username = params.user
  let threadId = params.threadId
  let time = params.time

// const socket = io.connect('http://localhost:3000'+`?author=${author}&title=${title}&message=${message}`);




//join room 
socket.emit('joinRoom',{author,title,message,username,threadId,time})
// socket.emit('first-request',{author,title,message})




const chatWindow =  document.getElementById('chat__window')
const messageInput = document.getElementById('message')
const sendBtn = document.getElementById('send__btn')
const chatMsg = document.getElementById('chat__message')
const feedback = document.getElementById('feedback')
const firstMsg = document.querySelector('.first-message')
chatWindow.scrollTop=chatWindow.scrollHeight

// sendBtn.addEventListener('click',()=>{
//     const message =messageInput.value
 
//     socket.emit('chat-message',message)


//     messageInput.value= ""
// })


messageInput.addEventListener('keypress',(e)=>{
    socket.emit('typing',username)
})





messageInput.addEventListener('keydown',(e)=>{
    
    if (e.key === 'Enter'){
        const message =messageInput.value
        






        if(message){
            socket.emit('chat-message',message)
      
            messageInput.value= ""
            // e.target.blur()
        }
    }

})









socket.on("new-user",(data)=>{
    appendjoinMsg(data)
})

socket.on("chat-message",(data)=>{
    console.log(data)
    console.log('try to')
    feedback.innerHTML=''
    
    appendMsg(data)
    

})


socket.on("msg-notification",(data=>{
    notificationSound()
}))


socket.on("init-load",(data)=>{
  console.log(data)

    appendTitle(data)
    appendfirstMsg(data)

})







// get room and user
socket.on('roomusers',({room, users})=>{
    // outputRoomName(room);
    console.log(users)
    outputRoomUsers(users);
})


socket.on('typing',(data)=>{
    if(data.typing){
        console.log(username)
        feedback.innerHTML = '<p><em>'+data.username+'輸入中...</em></p>'
        chatWindow.scrollTop=chatWindow.scrollHeight
    }else{
        feedback.innerHTML=""
    }
   
})



socket.on('duplicate',(message)=>{
    
    window.location.href='/'
})






















function appendTitle(data){
    let title = document.querySelector('.title')
    title.textContent=data.title
}

function appendfirstMsg(data){
    let info = document.createElement('span')
    info.textContent=`${data.author}`
    info.className="user_info"

    let time = document.createElement('span')

    time.textContent= `${data.createAt}`
    time.className="user_time"

    let infoBlock = document.createElement('div')
    infoBlock.className="info_block"
    infoBlock.append(info,time)

    let msg = document.createElement('p')
    msg.textContent=`${data.message}`
    msg.className="user_msg"
    
    let msgBlock = document.createElement('div')
    msgBlock.className="msg_block"
    msgBlock.append(infoBlock,msg)
 
    firstMsg.append(msgBlock)
    chatWindow.scrollTop=chatWindow.scrollHeight

}

function appendMsg(data){
    
    let info = document.createElement('span')
    info.textContent=`${data.user}`
    info.className="user_info"

    let time = document.createElement('span')

    time.textContent= `${data.createAt}`
    time.className="user_time"

    let infoBlock = document.createElement('div')
    infoBlock.className="info_block"
    infoBlock.append(info,time)

    let msg = document.createElement('p')
    msg.textContent=`${data.message}`
    msg.className="user_msg"
    
    let msgBlock = document.createElement('div')
    msgBlock.className="msg_block"
    msgBlock.append(infoBlock,msg)
 
    chatMsg.append(msgBlock)
    chatWindow.scrollTop=chatWindow.scrollHeight

}


function appendjoinMsg(data){
    let info = document.createElement('span')
    info.textContent=`${data.user} ${data.message}`
    info.className="user_info"

    let time = document.createElement('span')

    time.textContent= `${data.createAt}`
    time.className="user_time"

    let joinBlock = document.createElement('div')
    joinBlock.className="join_block"
    joinBlock.append(info,time)

 
 
    chatMsg.append(joinBlock)
    chatWindow.scrollTop=chatWindow.scrollHeight

}


function notificationSound(){


    document.getElementById("audio").play();
}




// add room name to dom

function outputRoomName(room){

}

socket.on('leave-message',(data)=>{
    appendjoinMsg(data)
})



// if(Notification.permission === "granted"){
//     showNotification(data)
// } else if (Notification.permission !== "denied"){
//     Notification.requestPermission().then(permission=>{
//         if(permission ==="granted"){
//             showNotification(data)
//         }
    
//     });
// }


function showNotification (data){


    const notification = new Notification("New message from Chill Talk!",{

        body:`${data.username}已經上線了`,
        icon:``

    });

    notification.onclick=(e)=>{

    }
}

const userList = document.querySelector('.memberList');
function outputRoomUsers(users){
    // userList.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`;
    userList.innerHTML=''
    users.forEach(user=>{

        let li = document.createElement('li')
        li.textContent=user.username
        li.className='name'
        
        let online = document.createElement('span')
        online.className='online'
        
        li.appendChild(online)
        
        userList.appendChild(li)



    })
}






/////////////////////////////////////////////////////////////////////////////animation///////////////////////////////////////////////////////////////////////////////////


const canvas = document.getElementById('canvas');
canvas.height=window.innerHeight
canvas.width=window.innerWidth-450
const ctx = canvas.getContext('2d');
document.body.style.overflow = 'hidden';
window.onresize = function(){
    
    resizeCanvas()

}


function resizeCanvas(){

    canvas.width = window.innerWidth-450;
    canvas.height=window.innerHeight;
}




// socket.on('newPost',(data)=>{
//     update(data.playerX,data.playerY)
// })




let imageload=0;
// let img = new Image();
// let imgr = new Image();
// let imgr1 = new Image();
// let imgr2 = new Image();
// let imgup = new Image();
// let imgup1 = new Image();
// let imgup2 = new Image();
// let imgd = new Image()
// let imgd1 = new Image()
// let imgd2 = new Image()
// let imgl = new Image()
// let imgl1 = new Image()
// let imgl2 = new Image()



// const userChars = {};






    


    let img = new Image();
    img.src = '/characters/mr0.png'
    // img.addEventListener('load',count)
    
    
    // create image
    let imgr = new Image();
    imgr.src = '/characters/mr.png'
    // imgr.addEventListener('load',count)
    
    let imgr1 = new Image();
    imgr1.src = '/characters/mr1.png'
    // imgr1.addEventListener('load',count)
    
    let imgr2 = new Image();
    imgr2.src = '/characters/mr2.png'
    // imgr2.addEventListener('load',count)
    
    
    let imgup = new Image();
    imgup.src = '/characters/mb.png'
    // imgup.addEventListener('load',count)
    
    
    let imgup1 = new Image();
    imgup1.src = '/characters/mb1.png'
    // imgup1.addEventListener('load',count)
    
    let imgup2 = new Image();
    imgup2.src = '/characters/mb2.png'
    // imgup2.addEventListener('load',count)
    
    
    let imgd = new Image()
    imgd.src = '/characters/mf.png'
    // imgd.addEventListener('load',count)
    
    let imgd1 = new Image()
    imgd1.src = '/characters/mf1.png'
    // imgd1.addEventListener('load',count)
    
    let imgd2 = new Image()
    imgd2.src = '/characters/mf2.png'
    // imgd2.addEventListener('load',count)
    
    
    
    let imgl = new Image()
    imgl.src = '/characters/ml.png'
    // imgl.addEventListener('load',count)
    
    
    let imgl1 = new Image()
    imgl1.src = '/characters/ml1.png'
    // imgl1.addEventListener('load',count)
    
    
    let imgl2 = new Image()
    imgl2.src = '/characters/ml2.png'
    // imgl2.addEventListener('load',count)
    



socket.on('init-char',(data)=>{
    let numOfUser = data['numOfUser']
    console.log(numOfUser)
    update()
})








// function count(){
    
//     imageload++
//     console.log(imageload)

//     if(imageload==13){


//         update()          

//     }
//     // socket.emit('newPlayer',{x:player.x, y:player.y })

// }


 





// create charter
const player = {

    w:60,
    h:80,
    x:20,
    y:200,
    speed:4,
    dx:0,
    dy:0

}







// put the charvter in one canvers
function drawPlayer(){
 
    // while (n<numOfUser){
        ctx.drawImage(img,player.x,player.y,player.w,player.h)
    //     n++
    // }
   

}



function clear(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
}




function update(x,y){

    clear()

    drawPlayer();

    newPost();

    requestAnimationFrame(update)


}



function updatePosition(x,y){


    socket.emit('newPost',{img,playerX:x,playerY:y,playerW:player.w,playerH:player.h})


}


function newPost(){

    player.x += player.dx;
    player.y += player.dy
    // updatePosition( player.x, player.y)


    detectWalls();
}



function detectWalls(){

    //left wall
    if(player.x<0){
        player.x=0;
    }

    //right wall
    if(player.x + player.w > canvas.width){
        console.log(canvas.width)
        player.x=canvas.width-player.w
    }

    
    if(player.y < 0){
        player.y=0
    }

    if(player.y + player.h > canvas.height){
        player.y=canvas.height-player.h
    }


}









//


function moveRight(){


    player.dx = player.speed

            
 
}


function moveLeft(){
    player.dx = -player.speed
}

function moveUp(){
    player.dy= -player.speed
}

function moveDown(){


    player.dy = player.speed
 
 

}






// img.onload =moveRight()

function keyDown(e){


    if(e.key=== 'ArrowRight' || e.key==='Right'){
    
        if(img.src != imgr.src && img.src != imgr1.src && img.src != imgr2.src){
            img.src = imgr.src
        }else if(img.src == imgr.src){
   
            img.src = imgr1.src
            moveRight()
        }else if( img.src == imgr1.src){
     
            img.src = imgr2.src
            moveRight()
        }else if( img.src == imgr2.src){
            img.src = imgr1.src
            moveRight()
        }
        
        
    }else if(e.key=== 'ArrowLeft' || e.key==='Left'){



        if (img.src != imgl.src && img.src != imgl1.src && img.src != imgl2.src){
            img.src = imgl.src
        }else if(img.src == imgl.src){
   
            img.src = imgl1.src
            moveLeft()
        }else if( img.src == imgl1.src){
     
            img.src = imgl2.src
            moveLeft()
        }else if( img.src == imgl2.src){
            img.src = imgl1.src
            moveLeft()
        }
        
   
    }else if(e.key=== 'ArrowUp' || e.key==='Up'){
        if (img.src != imgup.src && img.src != imgup1.src && img.src != imgup2.src){
            img.src = imgup.src
        }else if(img.src == imgup.src){
   
            img.src = imgup1.src
            moveUp()
        }else if( img.src == imgup1.src){
     
            img.src = imgup2.src
            moveUp()
        }else if( img.src == imgup2.src){
            img.src = imgup1.src
            moveUp()
        }
      
      
  
    }else if(e.key === 'ArrowDown' || e.key==='Down'){

        if (img.src != imgd.src && img.src != imgd1.src && img.src != imgd2.src){
            img.src = imgd.src
        }else if(img.src == imgd.src){
   
            img.src = imgd1.src
            moveDown()
        }else if( img.src == imgd1.src){
     
            img.src = imgd2.src
            moveDown()
        }else if( img.src == imgd2.src){
            img.src = imgd1.src
            moveDown()
        }
        
    }
}






function keyUp(e){

    if(

        e.key == 'Right'||e.key == 'ArrowRight' 

    ){
        img.src = imgr.src
        player.dx=0;
        player.dy=0;
    }

    if(

        
        e.key == 'Left'||e.key == 'ArrowLeft'
    )
    {
        player.dx=0;
        player.dy=0;
        img.src = imgl.src
    }

    if(

    
        e.key == 'Up'|| e.key == 'ArrowUp'

    ){
        player.dx=0;
        player.dy=0;
        img.src = imgup.src
    }

    if(

        
        e.key == 'Down'||e.key == 'ArrowDown'

    ){

        player.dx=0;
        player.dy=0;
        img.src = imgd.src

    }










}






document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
