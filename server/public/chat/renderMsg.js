let isLoading = false;
let offset = 0;
let firstTime = true;
let observer;


export async function getMsg(){
     
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
      let threadId = params.threadId
      console.log(threadId)
      let endPoint = `/api/messages?offset=${offset}&threadId=${threadId}`
    //   let h = new Headers()
    //   h.append('Content-type', 'application/json')

    //   let data =JSON.stringify({tID:`${threadId}`, offset})

      
    //   let request = new Request(endPoint,{
    //       method:'POST',
    //       headers: h,
    //       body: data

    //   })


      try{
        if(isLoading == false){
            isLoading = true
            let result = await fetch(endPoint)
            let data = await result.json()
            isLoading=false
            console.log(data)
            offset +=12
            console.log(offset)
            console.log(data)
            if(firstTime==true){
                firstTime=false;
                renderMsg(data['message'])
            }else{
                renderHistoryMsg(data['message'])
            }
           
        }
        
      }catch(err){
          console.log(err)
      }


}






function renderMsg(data){
    let chatContainer = document.getElementById('chat__message')
    const reverseData = data.reverse()
    reverseData.forEach((msg)=>{
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


        chatContainer.appendChild(msgBlock)
    })

        if(data.length>=1){
            const chatWindow =  document.getElementById('chat__window')
            let historyLine = document.createElement('div')
            historyLine.className='history'
            historyLine.textContent='以上為歷史訊息'
            chatContainer.appendChild(historyLine)
            chatWindow.scrollTop=chatWindow.scrollHeight
        }
        
        if(data.length<10){
            observer.unobserve(document.querySelector('.trigger'))
        }
 


}



export function renderHistoryMsg(data){
    let chatContainer = document.getElementById('chat__message')

    // const reverseData = data.reverse()
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


     
    })
   
    
    if(data.length<10){
        observer.unobserve(document.querySelector('.trigger'))
    }
    chatWindow.scrollTop=50
   


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

