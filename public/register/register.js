
let data;
// export function initRegForm(){


//     // let registerForm = document.querySelector('.register-section')
//     // let loginForm = document.querySelector('.login-section')
//     // let close_btn = document.querySelector('.register-close-btn')
//     // close_btn.addEventListener('click',()=>{
//     //     fullscreen.classList.toggle('is_none')
//     //     registerForm.classList.toggle('is_none')

//     // })


//     // let registerForm = document.querySelector('.register-section')
//     // let registerBtn = document.querySelector('.signup_btn')
//     // console.log(registerBtn)
//     // console.log(!!registerBtn)
//     // if(!!registerBtn){
//     // registerBtn.addEventListener('click',()=>{

//     //     registerForm.classList.toggle('is_none')
 
//     // })


//     // let loginSwitch = document.querySelector('.login-switch')
//     // loginSwitch.addEventListener('click',()=>{
//     //     registerForm.classList.toggle('is_none')
//     //     loginForm.classList.toggle('is_none')

//     // })


 
  

//     // }
// }
let regForm = document.querySelector('.reg-form')
regForm.addEventListener('submit', complicatedRequest)



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
        method:'POST',
        headers:h,
        body:json
    })
    
    try{
        let response = await fetch(request)
        data = await response.json()
        if(response.status=="201"){
            document.location='/'
        }
       
        
    }catch(err){
        console.log(err)
    }
 




}




function convert2Json(formData){
    let obj={};
    for (let key of formData.keys()){
        obj[key]=formData.get(key);
    }
    console.log(JSON.stringify(obj))
    return JSON.stringify(obj);
}





// function directLogin(data){



//     console.log('trying to close the back')





//     let welcomeMsg = document.createElement('div')
//     welcomeMsg.className='welcomeMsg'
//     let welcomePic = document.createElement('div')
//     welcomePic.className="welcomePic"
//     let welcomeIcon = document.createElement('img')
//     welcomeIcon.src="/icon/welcome.svg"
//     welcomePic.appendChild(welcomeIcon)

//     let welcomeTxt = document.createElement('div')
//     welcomeTxt.className="welcomeTxt"



//     let welcomeTimer = document.createElement('h5')
//     welcomeTimer.innerHTML=2
//     let welcomeTimerReminder = document.createElement('h4')
//     welcomeTimerReminder.textContent='2秒後自動登入'
//     welcomeTxt.textContent="歡迎成為Chill Talk的一份子!"

//     welcomeMsg.append(welcomePic,welcomeTxt,welcomeTimerReminder,welcomeTimer)





//     document.body.appendChild(welcomeMsg);


    
//     window.setInterval(function(){

//         welcomeTimer.innerHTML=welcomeTimer.innerHTML-1
//         if(welcomeTimer.innerHTML==0){
//             document.location='/'
//         }

//     }, 1000)



// }



