import * as rendMsg from './renderMsg.js' 
import { switchPage } from './chat.js'


rendMsg.getMsg();
switchPage();

let options ={
    root:null,
    rootMargin: "0px",
    threshold: 0.5
}

const observer = new IntersectionObserver(handleIntersect, options);
observer.observe(document.querySelector('.trigger'))

function handleIntersect(entries){
    if(entries[0].isIntersecting){
        rendMsg.getMsg()
    }
}