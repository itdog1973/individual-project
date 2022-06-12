
import Player from './player.js'
import controls from './controls.js'
const socket = io.connect();



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
const chatMsg = document.getElementById('chat__message')
const feedback = document.getElementById('feedback')
const firstMsg = document.querySelector('.first-message')
const preview = document.querySelector('.preview-container');
let cross = document.querySelector('.closePre')
let files;
let inpFile = document.getElementById('inpFile')



messageInput.addEventListener('keypress',(e)=>{
    socket.emit('typing',username)
})






if(inpFile!=null){
    inpFile.addEventListener('change',(e)=>{

        console.log('trigger')
        console.log(inpFile)
        // remove images
    
    
    
        // got all the images files
        files =document.querySelector('.file').files;
       console.log(files)
    
       cross.classList.remove('is_none')
       cross.onclick=()=>{
           preview.innerHTML=''
           inpFile.value=''
           cross.classList.add('is_none')
       }
    
    
    
        // make them preview
        function readAndPreview(file){
        
            let reader = new FileReader();
    
            reader.addEventListener('load',()=>{
                let image = new Image();
                image.src=reader.result
                preview.appendChild(image);
    
    
    
    
                let modal = document.getElementById("Modal");
                let modalImg = document.querySelector('.modal-content')
    
                image.onclick = ()=>{
                    modal.style.display='block';
                    modalImg.src = reader.result
                    let close = document.querySelector('.close')
    
                    close.onclick=()=>{
                        modal.style.display='None';
    
                    }
                }
            })
    
            reader.readAsDataURL(file)
        }
    
    
        if(files){
            console.log(files);
            [].forEach.call(files, readAndPreview)
        }
    
    })
}







messageInput.addEventListener('keydown',async (e)=>{
 
        const message =messageInput.value

    
    if (e.key === 'Enter'){
           console.log(files)
   
        if(files !== undefined){
            files=Array.from(files)
            console.log(Array.isArray(files))
            let imgArray=[]
           

            for(const file of files){
                const result = await readImg(file)
                imgArray.push(result)
                console.log('push')
            }

            console.log(imgArray)
            
            if(message !== null){
                let data = {imgArray, message}
                console.log(data)
                socket.emit('chat-message',data)
                preview.innerHTML=''
                messageInput.value= ''
                files.splice(0)
             
            }else{
                let data = {imgArray}
                console.log(data)
                socket.emit('chat-message',data)
                preview.innerHTML=''
                files.splice(0)
                
            }


           

            
        }else{
          
            socket.emit('chat-message',message)
            messageInput.value= ""
        }
        cross.classList.add('is_none')
    }})


    function readImg(file){
        return new Promise((resolve)=>{
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.addEventListener('load',()=>{
                resolve(reader.result)
            })
        })
    }







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
    
    
    
    let msgBlock = document.createElement('div')
    msgBlock.className="msg_block"



    let info = document.createElement('span')
    info.textContent=`${data.user}`
    info.className="user_info"

    let time = document.createElement('span')
    time.textContent= `${data.createAt}`
    time.className="user_time"

    let infoBlock = document.createElement('div')
    infoBlock.className="info_block"
    infoBlock.append(info,time)

    msgBlock.appendChild(infoBlock)


    if(data.hasOwnProperty('message')){
       
    
        let msg = document.createElement('p')
        msg.textContent=`${data.message}`
        msg.className="user_msg"
        msgBlock.append(msg)
    }
    
   

    if(data.hasOwnProperty('images')){
        

        let pictures = data['images']
        console.log(pictures)
        let imgContainer = document.createElement('div')
        imgContainer.className='usr-images-container'
        pictures.forEach(p=>{

        let image = document.createElement('img')
        image.className='usr-image'
        image.classList.add('zoom')
        image.src = p
        

        let modal = document.getElementById("Modal");
        let modalImg = document.querySelector('.modal-content')
        image.onclick = ()=>{
            modal.style.display='block';
            modalImg.src = p
            let close = document.querySelector('.close')

            close.onclick=()=>{
                modal.style.display='None';
            }
        }

        imgContainer.appendChild(image)

        })


        msgBlock.append(imgContainer)
    }

   
       
    





    chatMsg.append(msgBlock)
    document.getElementById('chat__message').scrollTop=document.getElementById('chat__message').scrollHeight

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



socket.on('leave-message',(data)=>{
    appendjoinMsg(data)
})






const userList = document.querySelector('.memberList');
function outputRoomUsers(users){

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
    



let players = []
socket.on('init-char',({id, room, plyers})=>{
    console.log(id)
    console.log(plyers)
    const player = new Player({ id, room })
    controls(player, socket)
    console.log(player.id)

    socket.emit('new-player', player);

    socket.on('new-player', obj => {
        players.push(new Player(obj))
    });
   

    socket.on('move-player', ({id, dir}) =>{

        let user = players.find(v => {
            return  v.id === id
        })
        console.log(user.id)
        user.move(dir)
       
    })
    
    socket.on('stop-player', ({id, dir}) =>{
        let user = players.find(v => {
            return v.id === id})
            console.log(user.id)
            user.stop(dir)
    })


    players = plyers.map(v => new Player(v)).concat(player);
    console.log(plyers)
    console.log(players)

    socket.on('remove-player',id => players = players.filter( v => v.id !== id));

    const draw = ()=>{
        console.log(players)
        ctx.clearRect(0,0,canvas.width, canvas.height);
        players.forEach(v=>{
           
            v.draw(ctx)
            v.newPost()
        })

        requestAnimationFrame(draw)
    }
    draw()
})









