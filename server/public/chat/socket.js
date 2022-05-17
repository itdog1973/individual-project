
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

// const socket = io.connect('http://localhost:3000'+`?author=${author}&title=${title}&message=${message}`);




//join room 
socket.emit('joinRoom',{author,title,message,username,threadId})
// socket.emit('first-request',{author,title,message})





const messageInput = document.getElementById('message')
const sendBtn = document.getElementById('send__btn')
const chatMsg = document.getElementById('chat__message')
const chatWindow =  document.getElementById('chat__window')
const feedback = document.getElementById('feedback')
const firstMsg = document.querySelector('.first-message')


sendBtn.addEventListener('click',()=>{
    const message =messageInput.value
 
    socket.emit('chat-message',message)


    messageInput.value= ""
})


messageInput.addEventListener('keypress',(e)=>{
    socket.emit('typing',username)
})





messageInput.addEventListener('keydown',(e)=>{
    
    if (e.key === 'Enter'){
        const message =messageInput.value
    
        if(message){
            socket.emit('chat-message',message)
      
            messageInput.value= ""
            e.target.blur()
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


socket.on("init-load",(data)=>{
  console.log(data)

    appendTitle(data)
    appendfirstMsg(data)

})




socket.on('connect',()=>{
    console.log('sucess connect')
})



// get room and user
socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outputRoomUsers(users);
})


socket.on('typing',(data)=>{
    feedback.innerHTML = '<p><em>'+data+'輸入中...</em></p>'
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







// add room name to dom

function outputRoomName(room){

}

socket.on('leave-message',(data)=>{
    appendjoinMsg(data)
})