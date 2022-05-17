


export async function  getPost(){

    let endPoint = '/api/posts'


    let h = new Headers()
    h.append('Accept','application/json') 

    let request = new Request(endPoint,{
        method:"GET",
        headers:h
    })

    
    try{
        const response = await fetch(request)
        const data = await response.json()
        renderPost(data)


    }catch(err){
        console.log(err)
    }



}


function renderPost(data){

    data.forEach(post=>{



        let threadContainer = document.querySelector('.thread-container')
        
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
        a.href=`http://localhost:3000/thread/?title=${post["title"]}&message=${post["message"]}&author=${post["user_name"]}&user=${user}&threadId=${post["thread_id"]}`
        a.className='link'
        
        let author = document.createElement('div')
        author.className="thread__author"
        author.textContent=post["user_name"]
        let details = document.createElement('div')
        details.className="thread__details"

        let title =document.createElement('div')
        title.className= "thread__title"
        title.textContent=post["title"]
        let message = document.createElement('div')
        message.className="thread__message"
        message.textContent=post["message"]
        let time = document.createElement('div')
        time.textContent=post["create_date"]
        time.className="thread__time"
        
        details.append(title,message,time)


        let cat = document.createElement('span')
        cat.className="thread__cat"
        cat.textContent=post["category"]


        let ball = document.createElement('span')
        ball.className="cat-circle"
        cat.appendChild(ball)

        




        switch (cat.textContent){
            case "一般":
                ball.style.backgroundColor="#6DD5FA"
                break;
            case "上班":
                ball.style.backgroundColor="#f64f59"
                break;
            case "科技":
                ball.style.backgroundColor="#a8ff78"
                break;
            case "愛情":
                ball.style.backgroundColor="#f5af19"
                break;
            case "音樂":
                ball.style.backgroundColor="#c471ed"
                break;
            case "遊戲":
                ball.style.backgroundColor="#86a8e7"
                break;
        }










        thread.append(author,details,cat,a)


        threadContainer.appendChild(thread)





    })

}