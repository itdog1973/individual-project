

let isLoading = false
let offset=0;
export let observer;
export async function  getPost(){

    let endPoint = `/api/posts?limit=6&offset=${offset}`


    let h = new Headers()
    h.append('Accept','application/json') 

    let request = new Request(endPoint,{
        method:"GET",
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
    
    
        }catch(err){
            console.log(err)
        }
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
        // let message = document.createElement('div')
        // message.className="thread__message"
        // message.textContent=post["message"]
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
    if(data.length<7){
        observer.unobserve(document.querySelector('.trigger'));
    }
}



export function getObserver(){
    
    let options ={
        root:null,
        rootMargin: "0px",
        threshold: .5
    }


    observer = new IntersectionObserver(handleIntersect, options);


    observer.observe(document.querySelector('.trigger'))
    console.log('trigger')
    function handleIntersect(entries){
        console.log(entries)
        console.log(entries[0])
        if(entries[0].isIntersecting){
            getPost()
        }
    }

}