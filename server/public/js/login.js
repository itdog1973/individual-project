
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

    loginBtn.addEventListener('click',()=>{
        fullscreen.classList.toggle('is_none')
        loginForm.classList.toggle('is_none')

    })


    let registerSwitch = document.querySelector('.register-switch')
    registerSwitch.addEventListener('click',()=>{
        registerForm.classList.toggle('is_none')
        loginForm.classList.toggle('is_none')

    })

}



