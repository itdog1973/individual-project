export function switchPage(){




    let chatBtns = document.querySelectorAll("input[name='chat']")



    chatBtns.forEach(chatBtn =>{
        chatBtn.addEventListener('change',()=>{
            let selected = document.querySelector("input[name='chat']:checked");
  
            if(selected.id=='chat_msg'){
      
          
                document.querySelector('.first-message').classList.remove('is_none')
                document.querySelector('#chat__window').classList.remove('is_none')
                document.querySelector('.send').classList.remove('is_none')
                document.querySelector('.chat-list').classList.toggle('is_none')
             
            }else if(selected.id=='chat_user'){
      
           
                document.querySelector('.first-message').classList.add('is_none')
                document.querySelector('#chat__window').classList.add('is_none')
                document.querySelector('.send').classList.add('is_none')
                document.querySelector('.chat-list').classList.toggle('is_none')
                

            }
        })
    })




}

