export function switchPage(){




    let chatBtns = document.querySelectorAll("input[name='chat']")



    chatBtns.forEach(chatBtn =>{
        chatBtn.addEventListener('change',()=>{
            let selected = document.querySelector("input[name='chat']:checked");
            console.log(selected)
            if(selected.id=='chat_msg'){
                console.log(selected.id)
          
                document.querySelector('.first-message').classList.remove('is_none')
                document.querySelector('#chat__window').classList.remove('is_none')
                document.querySelector('.send').classList.remove('is_none')
                document.querySelector('.chat-list').classList.toggle('is_none')
             
            }else if(selected.id=='chat_user'){
                console.log(selected.id)
           
                document.querySelector('.first-message').classList.add('is_none')
                document.querySelector('#chat__window').classList.add('is_none')
                document.querySelector('.send').classList.add('is_none')
                document.querySelector('.chat-list').classList.toggle('is_none')
                

            }
        })
    })




}

