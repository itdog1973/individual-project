

export function openPost(){

    let post = document.querySelector('.post')
    let postFullScreen = document.querySelector('.post-full-screen')
    let startBtn = document.querySelector('.create_btn')
    let closeBtn = document.querySelector('.form-close')

    if (!!startBtn){
        startBtn.addEventListener('click',()=>{
            postFullScreen.classList.toggle('is_none')
            post.classList.toggle('is_none')
        })

        closeBtn.addEventListener('click',()=>{
            document.querySelector('.error-message').innerHTML=""
            document.querySelector('.post__input').value=""
            document.querySelector('.post__text').value=""
            postFullScreen.classList.toggle('is_none')
            post.classList.toggle('is_none')
         


        })

        let createPost = document.querySelector('.beginPost')
        createPost.addEventListener('submit',sendPost)
    }

}


async function sendPost(ev){
    ev.preventDefault();
    
 

    let form = ev.target;
   

    let formData = new FormData(form)
    let endPoint = 'api/posts'


    let h = new Headers()
    h.append('content-type','application/json');



    for (let key of formData.keys()){
        console.log(key, formData.get(key))
    }

    let json = convert2Json(formData)

    let request = new Request(endPoint,{
        headers:h,
        method:'POST',
        body:json,
    })


    try{
        let response = await fetch(request)
        let data = await response.json()
        if(response.status=="200"){
            console.log(data)
            window.location.href=`/thread?title=${data.title}&message=${data.message}&author=${data.username}&user=${data.username}&threadId=${data.threadId}&time=${data.createDate}`
           
        }
        if(response.status=="400"){
            document.querySelector('.error-message').innerHTML="重覆的title名，請重新填寫"
        }
        

        
    }catch(err){
        console.log(err)
    }
    

}


function convert2Json(formData){
    let obj = {}
    for (let key of formData.keys()){
        obj[key]=formData.get(key);
    }
    return JSON.stringify(obj)
}


