export default(player, socket)=>{

    document.addEventListener('keydown', (e)=>{
        let dir;
        if(e.key=== 'ArrowRight' || e.key==='Right'){
            
            dir ='right'
            
        }else if(e.key=== 'ArrowLeft' || e.key==='Left'){
    
    
    
            dir ='left'
       
        }else if(e.key=== 'ArrowUp' || e.key==='Up'){
            dir ='up'
          
      
        }else if(e.key === 'ArrowDown' || e.key==='Down'){
    
            dir ='down'
        }

        player.move(dir);
        socket.emit('move-player', dir)
    });


    document.addEventListener('keyup', (e)=>{

        let dir;
        if(e.key=== 'ArrowRight' || e.key==='Right') dir ='right'
        if(e.key=== 'ArrowLeft' || e.key==='Left') dir ='left'
        if(e.key=== 'ArrowUp' || e.key==='Up') dir ='up'
        if(e.key === 'ArrowDown' || e.key==='Down') dir ='down'

        player.stop(dir);
        socket.emit('stop-player', dir)

})}