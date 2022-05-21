

let selected;
let offset=0;
let isLoading=false;
export function checkCat(){


    let catGroup = document.querySelector(".category")

    catGroup.addEventListener('click',(e)=>{
        let targetValue = e.target.value
        if(targetValue == '一般'){
            selected='一般';
            getSpecificPost(selected)
        }else if(targetValue == '上班'){
            selected='上班';
            getSpecificPost(selected)
        }else if(targetValue =='科技'){
            selected='科技';
            getSpecificPost(selected)
        }else if(targetValue == '愛情'){
            selected='愛情';
            getSpecificPost(selected)
        }else if(targetValue == '音樂'){
            selected='音樂';
            getSpecificPost(selected)
        }else if(targetValue == '遊戲'){
            selected='遊戲';
            getSpecificPost(selected)

        }

    })


    
}




async function getSpecificPost(data){

    console.log(data)
    offset=0
    let endPoint = `/api/posts?cat=${data}&offset=${offset}`



    try{
        if(isLoading==false){
            isLoading=true
            let response = await fetch(endPoint) 
            let data = await response.json()
            renderCatPost(data)
            console.log(data)
            offset+=6
        
        }

      


    }catch(err){
        console.log(err)    
    }

}

function renderCatPost(data){

    let threadContainer = document.querySelector('.thread-container')

    threadContainer.innerHTML=""

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
        a.href=`http://localhost:3000/thread/?title=${post["title"]}&message=${post["message"]}&author=${post["user_name"]}&user=${user}&threadId=${post["thread_id"]}&time=${post["create_date"]}`
        a.className='link'
        
        let author = document.createElement('div')
        author.className="thread__author"
        author.textContent=post["user_name"]
        let details = document.createElement('div')
        details.className="thread__details"

        let title =document.createElement('h2')
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
   
}
