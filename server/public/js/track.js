let offset = 0;
let isLoading =false
import { observer  } from "./post.js";
export default ()=>{

    const trackBtn = document.getElementById('radio2')
    if(trackBtn!=null){
        trackBtn.addEventListener('click',renderPersonalTrack)
    }

}

async function renderPersonalTrack(){

    let endPoint = `/api/posts?limit=6&offset=${offset}`

    let h = new Headers()
    h.append('Accept','application/json') 

    let request = new Request(endPoint,{
        method:"Put",
        headers:h
    })


    if(isLoading == false){
        isLoading=true
        try{
            console.log(isLoading)
            const response = await fetch(request)
            const data = await response.json()
           
            offset+=7
            renderPost(data)
            console.log(data)
    
        }catch(err){
            console.log(err)
        }

    }
}

function renderPost(data){
    if(data.length<7){
        observer.unobserve(document.querySelector('.trigger'));
    }
    let threadContainer = document.querySelector('.thread-container')
    threadContainer.innerHTML='';
    data.forEach(post=>{



        
        
        let userTag = document.querySelector('.login_user')
        let user;
        if(userTag){
             user = userTag.textContent
        }else{
            user="guest"
        }
        
        let thread = document.createElement('div')
        thread.className="thread"
        console.log(post)
        let a = document.createElement('a')
        a.href=`/thread/?title=${post["title"]}&message=${post["message"]}&author=${post["user_name"]}&user=${user}&threadId=${post["thread_id"]}&time=${post["create_date"]}`
        a.className='link'
        
        let author = document.createElement('div')
        author.className="thread__author"
        author.textContent=post["user_name"]
        let details = document.createElement('div')
        details.className="thread__details"

        let title =document.createElement('h3')
        title.className= "thread__title"
        title.textContent=post["title"]
      
        let time = document.createElement('div')
        time.textContent=post["create_date"]
        time.className="thread__time"
        
        details.append(title,time)


        let cat = document.createElement('span')
        cat.className="thread__cat"
        cat.textContent=post["category"]
        


        let ball = document.createElement('span')
        ball.className="cat-circle"
        cat.appendChild(ball)

        




        switch (cat.textContent){
            case "一般":
                ball.style.backgroundColor="#6DD5FA"
                cat.style.border=`1px solid #6DD5FA`
                break;
            case "上班":
                ball.style.backgroundColor="#f64f59"
                cat.style.border=`1px solid #f64f59`
                break;
            case "科技":
                ball.style.backgroundColor="#a8ff78"
                cat.style.border=`1px solid #a8ff78`
                break;
            case "愛情":
                ball.style.backgroundColor="#f5af19"
                cat.style.border=`1px solid #f5af19`
                
                break;
            case "音樂":
                ball.style.backgroundColor="#c471ed"
                cat.style.border=`1px solid #c471ed`
                break;
            case "遊戲":
                ball.style.backgroundColor="#86a8e7"
                cat.style.border=`1px solid #86a8e7`
                break;
        }



        






        thread.append(author,details,cat,a)


        threadContainer.appendChild(thread)





    })

    isLoading=false
    console.log(isLoading)

}
