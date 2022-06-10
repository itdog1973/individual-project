
let isLoading = false;
let offset = 0;
let firstTime = true;
let observer;
let counter = 0;

export async function getMsg(){
     counter++
     console.log(counter)
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      let threadId = params.threadId
      console.log(threadId)
      let endPoint = `/api/messages?threadId=${threadId}`



      try{
        if(isLoading == false){
            isLoading = true
            let result = await fetch(endPoint)
            let data = await result.json()
            console.log(result)
            console.log(data)
            // offset +=50
            console.log(offset)
            console.log(data)
            console.log(firstTime)

            // if(firstTime==true){
            //     firstTime=false;
            //     isLoading=false
            //     console.log(firstTime)
            //     renderMsg(data)
            // }else{
            //     isLoading=false
            //     console.log(firstTime)
            //     renderHistoryMsg(data)
            // }
            renderMsg(data)
           
        }
        
      }catch(err){
          console.log(err)
      }
    

}


// const chatWindow =  document.getElementById('chat__window')



function renderMsg(data){
    let chatContainer = document.getElementById('chat__message')
  
    console.log('first time tigger')
  
    // const reverseData = data.reverse()
    
    console.log(data)

    data.forEach((msg)=>{
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
            
                console.log(typeof(msg['images']))
                let pictures = JSON.parse(msg['images'])
                console.log(Array.isArray(pictures))

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
     
        // if(data.length<50){
        //    console.log('data length less than 50')
        //     // let historyLine = document.createElement('div')
        //     // historyLine.className='history'
        //     // historyLine.textContent='以上為歷史訊息'
        //     // chatContainer.appendChild(historyLine)
        //     // chatWindow.scrollTop=chatWindow.scrollHeight
        //     observer.unobserve(document.querySelector('.trigger'))
        //     window.scrollTo(0,0)
            
        // }
        if(data.length>1){
            let historyLine = document.createElement('div')
            historyLine.className='history'
            historyLine.textContent='以上為歷史訊息'
            chatContainer.appendChild(historyLine)
            window.scrollTo(0,0)
        }
            
 
     

}



// export function renderHistoryMsg(data){


//     console.log('second time tigger')
  

//     let chatContainer = document.getElementById('chat__message')

//     // const reverseData = data.reverse()
//     data.forEach((msg)=>{
//         let msgBlock = document.createElement('div')
//         msgBlock.className='msg_block'
//         let infoBlock = document.createElement('div')
//         infoBlock.className='info_block'
//         let userInfo = document.createElement('span')
//         userInfo.textContent=msg['user_name']
//         userInfo.className='user_info'

//         let userTime = document.createElement('span')
//         userTime.className='user_time'
//         userTime.textContent=msg['create_date']


//         infoBlock.append(userInfo,userTime)


//         let userMsg = document.createElement('p')
//         userMsg.className='user_msg'
//         userMsg.textContent=msg['message']

//         msgBlock.append(infoBlock,userMsg)




//         // let messageTop = document.getElementById('chat__message').firstElementChild
      
//         // chatContainer.insertBefore(msgBlock,messageTop)

//         chatContainer.appendChild(msgBlock)

     
//     })
    
    
//     if(data.length<50){
//         console.log('data length less than 50')
//         observer.unobserve(document.querySelector('.trigger'))
        
//     }
//     // chatWindow.scrollTop=0
   


// }

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

