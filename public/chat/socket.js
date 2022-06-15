
import Player from './player.js'
import controls from './controls.js'
const socket = io.connect();






let path = window.location.pathname
let room = path.split('/chat/')[1]
let roomId = room.split('%')[0]

//join room 
socket.emit('joinRoom',roomId)





const chatWindow =  document.getElementById('chat__message')
const messageInput = document.getElementById('message')
const chatMsg = document.getElementById('chat__message')
const feedback = document.getElementById('feedback')
const firstMsg = document.querySelector('.first-message')
const preview = document.querySelector('.preview-container');
let cross = document.querySelector('.closePre')
let files;
let inpFile = document.getElementById('inpFile')



messageInput.addEventListener('keypress',(e)=>{
    socket.emit('typing')
})






if(inpFile!=null){
    inpFile.addEventListener('change',(e)=>{

 
    
    
    
        // got all the images files
        files =document.querySelector('.file').files;

    
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
  
            [].forEach.call(files, readAndPreview)
        }
    
    })
}







messageInput.addEventListener('keydown',async (e)=>{
 
        const message =messageInput.value

    
    if (e.key === 'Enter'){
 
   
        if(files !== undefined){
            files=Array.from(files)
     
            let imgArray=[]
           

            for(const file of files){
                const result = await readImg(file)
                imgArray.push(result)
        
            }

  
            
            if(message !== null){
                let data = {imgArray, message}
   
                socket.emit('chat-message',data)
                preview.innerHTML=''
                messageInput.value= ''
                files.splice(0)
             
            }else{
                let data = {imgArray}
             
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

    feedback.innerHTML=''
    
    appendMsg(data)
    

})


socket.on("msg-notification",(data=>{
    notificationSound()
}))










// get room and user
socket.on('roomusers',({room, users})=>{
    // outputRoomName(room);

    outputRoomUsers(users);
})


socket.on('typing',(data)=>{
    if(data.typing){
       
        feedback.innerHTML = '<p><em>'+data.username+'輸入中...</em></p>'
        chatWindow.scrollTop=chatWindow.scrollHeight
    }else{
        feedback.innerHTML=""
    }
   
})



socket.on('duplicate',(message)=>{
    
    window.location.href='/'
})
























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














let players = []
socket.on('init-char',({id, room, plyers})=>{
 
    const player = new Player({ id, room })
    controls(player, socket)


    socket.emit('new-player', player);

    socket.on('new-player', obj => {
        players.push(new Player(obj))
    });
   

    socket.on('move-player', ({id, dir}) =>{

        let user = players.find(v => {
            return  v.id === id
        })

        user.move(dir)
       
    })
    
    socket.on('stop-player', ({id, dir}) =>{
        let user = players.find(v => {
            return v.id === id})

            user.stop(dir)
    })


    players = plyers.map(v => new Player(v)).concat(player);

    socket.on('remove-player',id => players = players.filter( v => v.id !== id));

    const draw = ()=>{
        let load;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        players.forEach(v=>{
           
            load = v.draw(ctx)
        
            v.newPost()
        })
        if (load == false){
            requestAnimationFrame(draw)
        }

    }
    draw()
})









