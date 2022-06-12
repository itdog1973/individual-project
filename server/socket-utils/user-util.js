const users=[];

//join user to chat
function userJoin(socketId, username, title, threadId, userId){


    const user={socketId, username, title, threadId, userId}

    users.push(user);
    console.log('all users in users array',users)
    return user;

}



function getCurrentUser(id){
    return users.find(user=>user.socketId===id);
}




//user leaves chat
function userLeave(id){

    const index = users.findIndex(user => user.socketId === id);
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}



// get room users
function getRoomUsers(title){
    return users.filter(user => user.title === title)
}




module.exports={
    userJoin,getCurrentUser,userLeave,getRoomUsers,users
}