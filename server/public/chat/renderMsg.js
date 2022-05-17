


export async function getMsg(){

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
      let threadId = params.threadId
      console.log(threadId)
      let endPoint = '/api/messages'
      let h = new Headers()
      h.append('Content-type', 'application/json')

      let data =JSON.stringify({tID:`${threadId}`})
      console.log(data)
      
      let request = new Request(endPoint,{
          method:'POST',
          headers: h,
          body: data

      })


      try{
        let result = await fetch(request)
        let data = await result.json()
        console.log(data)
        renderMsg(data['test'])
      }catch(err){
          console.log(err)
      }


}


function renderMsg(data){
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


        chatContainer.appendChild(msgBlock)
    })

}