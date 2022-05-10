

export function initRegForm(){

    let fullscreen = document.querySelector('.full-screen')
    let registerForm = document.querySelector('.register-section')
    let loginForm = document.querySelector('.login-section')
    let close_btn = document.querySelector('.register-close-btn')
    close_btn.addEventListener('click',()=>{
        fullscreen.classList.toggle('is_none')
        registerForm.classList.toggle('is_none')

    })


    // let registerForm = document.querySelector('.register-section')
    let registerBtn = document.querySelector('.signup_btn')
    registerBtn.addEventListener('click',()=>{
        fullscreen.classList.toggle('is_none')
        registerForm.classList.toggle('is_none')
 
    })


    let loginSwitch = document.querySelector('.login-switch')
    loginSwitch.addEventListener('click',()=>{
        registerForm.classList.toggle('is_none')
        loginForm.classList.toggle('is_none')

    })

}