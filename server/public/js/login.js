let data;
export function initLogForm(){

    let fullscreen = document.querySelector('.full-screen')
    let registerForm = document.querySelector('.register-section')
    let loginForm = document.querySelector('.login-section')
    let close_btn = document.querySelector('.login-close-btn')
    close_btn.addEventListener('click',()=>{
        fullscreen.classList.toggle('is_none')
        loginForm.classList.toggle('is_none')

    })



    let loginBtn = document.querySelector('.login_btn')
    console.log('loginBtn'+loginBtn)
    console.log(!!loginBtn)
    if(!!loginBtn){

    loginBtn.addEventListener('click',()=>{
        fullscreen.classList.toggle('is_none')
        loginForm.classList.toggle('is_none')

    })


    let registerSwitch = document.querySelector('.register-switch')
    registerSwitch.addEventListener('click',()=>{
        registerForm.classList.toggle('is_none')
        loginForm.classList.toggle('is_none')

    })

    let loginSubmit = document.querySelector('.login-form')
    loginSubmit.addEventListener('submit',complicatedRequest)
   


    }

}


async function complicatedRequest(ev){
    ev.preventDefault();
 
    let Form = ev.target;
    let formData = new FormData(Form)


    for (let key of formData.keys()){ //keys method can create an iterator 
        console.log(key, formData.get(key))
    }
    let json =  convert2Json(formData)

    let endPoint = '/api/users'
    let h = new Headers()
    h.append('content-type','application/json');

    let request = new Request(endPoint,{
        method:'PUT',
        headers:h,
        body:json
    })
    
    try{
        let response = await fetch(request)
        data = await response.json()
        console.log(response.status)
        if(response.status=='201'){
         
            document.location.reload(true)
        }
    

        
    }catch(err){
        console.log(err)
    }
 




}



function convert2Json(formData){
    const obj ={};
    for(let key of formData.keys()){
        obj[key]= formData.get(key);
    }
    return JSON.stringify(obj)
}




function directLogin(){

        console.log('trying to close the back')
        document.querySelector('.full-screen').classList.toggle('is_none')
        document.querySelector('.register-section').classList.toggle('is_none')


 
}