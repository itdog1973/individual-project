export default(player, socket)=>{

    document.addEventListener('keydown', (e)=>{
        let dir;
        if(e.key=== 'ArrowRight' || e.key==='Right'){
            
            dir ='right'

            let position = player.move(dir);
  
            socket.emit('move-player', {dir,position})
      
            
        }else if(e.key=== 'ArrowLeft' || e.key==='Left'){
    
    
    
            dir ='left'

            let position = player.move(dir);
   
            socket.emit('move-player', {dir,position})
      
        }else if(e.key=== 'ArrowUp' || e.key==='Up'){
            dir ='up'

            let position = player.move(dir);
  
            socket.emit('move-player', {dir,position})
         
          
      
        }else if(e.key === 'ArrowDown' || e.key==='Down'){
    
            dir ='down'

            let position = player.move(dir);
          
            socket.emit('move-player', {dir,position})
        
        }

      
    });


    document.addEventListener('keyup', (e)=>{

        let dir;
        if(e.key=== 'ArrowRight' || e.key==='Right') {
        dir ='right'
   
        let position = player.stop(dir);
        socket.emit('stop-player', {dir,position})

        }
        if(e.key=== 'ArrowLeft' || e.key==='Left') {
            dir ='left'
            let position = player.stop(dir);
            socket.emit('stop-player', {dir,position})
    
       
        } 
        if(e.key=== 'ArrowUp' || e.key==='Up') {
            dir ='up'
            let position = player.stop(dir);
            socket.emit('stop-player', {dir,position})
    
        
        }
        if(e.key === 'ArrowDown' || e.key==='Down'){
          
            dir ='down'
            let position = player.stop(dir);
            socket.emit('stop-player', {dir,position})
    
        }

   
})}