
let isLoading = false;
let offset = 0;
let firstTime = true;
let observer;


export async function getMsg(){
    let path = window.location.pathname
    let room = path.split('/chat/')[1]
    let roomId = room.split('%')[0]
      let endPoint = `/api/messages?threadId=${roomId}&offset=${offset}`



      try{
        if(isLoading == false){
            isLoading = true
            let result = await fetch(endPoint)
            let data = await result.json()

            offset +=20
       

            if(firstTime==true){
                firstTime=false;
                isLoading=false
       
                renderMsg(data)
            }else{
                isLoading=false
           
                renderHistoryMsg(data)
            }
      
        }
        
      }catch(err){
          console.log(err)
      }
    

}



let chatWindow = document.querySelector('#chat__message')


function renderMsg(data){
    let chatContainer = document.getElementById('chat__message')
  

  
    const reverseData = data.reverse()
    

    reverseData.forEach((msg)=>{
        let msgBlock = document.createElement('div')
         msgBlock.className='msg_block'
         let infoBlock;
         let userMsg;
         let imgContainer;
        if(msg['message'] != null){
           
            infoBlock = document.createElement('div')
            infoBlock.className='info_block'
            let userInfo = document.createElement('span')
            userInfo.textContent=msg['user_name']
            userInfo.className='user_info'
    
            let userTime = document.createElement('span')
            userTime.className='user_time'
            userTime.textContent=msg['create_date']
    
    
            infoBlock.append(userInfo,userTime)
    
    
            userMsg = document.createElement('p')
            userMsg.className='user_msg'
            userMsg.textContent=msg['message']

            msgBlock.append(infoBlock,userMsg)
        }
       

        
        if(msg['images'] != null){
            
         
                let pictures = JSON.parse(msg['images'])
            

                imgContainer = document.createElement('div')
                imgContainer.className='usr-images-container'
                pictures.forEach(p=>{
           
                let image = document.createElement('img')
                image.className='usr-image'
        
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

                msgBlock.append(infoBlock,userMsg,imgContainer)
                
        
                })
        
        
            
            
        
        }



        
        
        
        
        
        


        chatContainer.appendChild(msgBlock)





    })
     
        if(data.length<20){
      
            chatWindow.scrollTop=chatWindow.scrollHeight
            observer.unobserve(document.querySelector('.trigger'))
    
            
        }
        if(data.length>1){
            let historyLine = document.createElement('div')
            historyLine.className='history'
            historyLine.textContent='以上為歷史訊息'
            chatContainer.appendChild(historyLine)
         
        }
            
        chatWindow.scrollTop=chatWindow.scrollHeight
     

}



export function renderHistoryMsg(data){


  
    let chatContainer = document.getElementById('chat__message')


    data.forEach((msg)=>{
        let msgBlock = document.createElement('div')
        msgBlock.className='msg_block'
        let infoBlock = document.createElement('div')
        infoBlock.className='info_block'
        let userInfo = document.createElement('span')
        userInfo.textContent=msg['user_name']
        userInfo.className='user_info'

        let userTime = document.createElement('span')
        userTime.className='user_time'
        userTime.textContent=msg['create_date']


        infoBlock.append(userInfo,userTime)


        let userMsg = document.createElement('p')
        userMsg.className='user_msg'
        userMsg.textContent=msg['message']

        msgBlock.append(infoBlock,userMsg)




        let messageTop = document.getElementById('chat__message').firstElementChild
      
        chatContainer.insertBefore(msgBlock,messageTop)

        // chatContainer.appendChild(msgBlock)

 
    })
    
    
    if(data.length<20){
     
        observer.unobserve(document.querySelector('.trigger'))
        
    }
    chatWindow.scrollTop=chatWindow.scrollHeight
   


}

export function setObserver(){

    let options ={
        root:null,
        rootMargin: "0px",
        threshold: 0.5
    }
    
    observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(document.querySelector('.trigger'))
    
    function handleIntersect(entries){
        if(entries[0].isIntersecting){
            getMsg()
        }
    }


}

