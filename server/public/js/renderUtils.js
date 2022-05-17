// // let catName = ["一般", "上班","科技","愛情","音樂","政治"]
// // let catColor = ["#6DD5FA","#f64f59","#a8ff78","#f5af19","#c471ed","#86a8e7"]

// function renderPost(data){

//     data.forEach(post=>{



//         let threadContainer = document.querySelector('.thread-container')

//         let thread = document.createElement('div')
//         thread.className="thread"

        
//         let author = document.createElement('div')
//         author.className="thread__author"
//         author.textContent=post["user_name"]
//         let details = document.createElement('div')
//         details.className="thread__details"

//         let title =document.createElement('div')
//         title.className= "thread__title"
//         title.textContent=post["title"]
//         let message = document.createElement('div')
//         message.className="thread__message"
//         message.textContent=post["message"]
//         let time = document.createElement('div')
//         time.textContent=post["create_date"]
//         time.className="thread__time"
        
//         details.append(title,message,time)


//         let cat = document.createElement('span')
//         cat.className="thread__cat"
//         cat.textContent=post["category"]


//         let ball = document.createElement('span')
//         ball.className="cat-circle"
//         cat.appendChild(ball)

        




//         switch (cat.textContent){
//             case "一般":
//                 ball.style.backgroundColor="#6DD5FA"
//                 break;
//             case "上班":
//                 ball.style.backgroundColor="#f64f59"
//                 break;
//             case "科技":
//                 ball.style.backgroundColor="#a8ff78"
//                 break;
//             case "愛情":
//                 ball.style.backgroundColor="#f5af19"
//                 break;
//             case "音樂":
//                 ball.style.backgroundColor="#c471ed"
//                 break;
//             case "政治":
//                 ball.style.backgroundColor="#86a8e7"
//                 break;
//         }










//         thread.append(author,details,cat)


//         threadContainer.appendChild(thread)





//     })

// }


// export {renderPost}