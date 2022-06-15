const users=[];

//join user to chat
function userJoin(socketId, username, room, userId){


    const user={socketId, username, room, userId}

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
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}




module.exports={
    userJoin,getCurrentUser,userLeave,getRoomUsers,users
}