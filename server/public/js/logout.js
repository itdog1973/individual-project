

export function logout(){
    let logoutBtn = document.querySelector('.logout_btn')
    console.log(!!logoutBtn)
    if(!!logoutBtn){
        logoutBtn.addEventListener('click',logoutRequest)
    }
}


async function logoutRequest(){
    


    let h = new Headers()
    h.append('Content-type','application/json')
    let endPoint = 'api/users'
    let request = new Request(endPoint,{
        headers:h,
        method:'DELETE',
    })

    try{
        let response = await fetch(request)
        let data = response.json()
        console.log(data)
        document.location.reload(true)
    }catch(err){
        console.log(err)
    }
    


}