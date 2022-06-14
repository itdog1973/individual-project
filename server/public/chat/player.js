
const canvas = document.getElementById('canvas');
canvas.height=window.innerHeight
canvas.width=window.innerWidth-450

let img = new Image();
img.src = 'https://dv0q95071dj8r.cloudfront.net/mr0.png'



let imgr = new Image();
imgr.src = 'https://dv0q95071dj8r.cloudfront.net/mr.png'


let imgr1 = new Image();
imgr1.src = 'https://dv0q95071dj8r.cloudfront.net/mr1.png'


let imgr2 = new Image();
imgr2.src = 'https://dv0q95071dj8r.cloudfront.net/mr2.png'


let imgup = new Image();
imgup.src = 'https://dv0q95071dj8r.cloudfront.net/mb.png'


let imgup1 = new Image();
imgup1.src = 'https://dv0q95071dj8r.cloudfront.net/mb1.png'


let imgup2 = new Image();
imgup2.src = 'https://dv0q95071dj8r.cloudfront.net/mb2.png'


let imgd = new Image()
imgd.src = 'https://dv0q95071dj8r.cloudfront.net/mf.png'


let imgd1 = new Image()
imgd1.src = 'https://dv0q95071dj8r.cloudfront.net/mf1.png'


let imgd2 = new Image()
imgd2.src = 'https://dv0q95071dj8r.cloudfront.net/mf2.png'


let imgl = new Image()
imgl.src = 'https://dv0q95071dj8r.cloudfront.net/ml.png'


let imgl1 = new Image()
imgl1.src = 'https://dv0q95071dj8r.cloudfront.net/ml1.png'



let imgl2 = new Image()
imgl2.src = 'https://dv0q95071dj8r.cloudfront.net/ml2.png'










class Player{

    constructor({id,room,x=20, y=200, w=60, h=80, speed=5, dx=0, dy=0 }){


        this.x = x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.speed=speed;
        this.dx=dx
        this.dy=dy
        this.id = id;
        this.room=room;
        this.img = new Image()
        this.img.src = 'https://dv0q95071dj8r.cloudfront.net/mr0.png'
        

    }

    draw(ctx){
        let load = true
        this.img.onload= ctx.drawImage(this.img,this.x,this.y,this.w,this.h)
        load = false
        return load
    }

    

    move(dir){
        if(dir == 'right'){
  
            if(this.img.src != imgr.src && this.img.src != imgr1.src && this.img.src != imgr2.src){
                this.img.src = imgr.src
                return(this.img.src)
            }else if(this.img.src == imgr.src){
       
                this.img.src = imgr1.src
                this.dx = this.speed
    
                return(this.x)
            }else if( this.img.src == imgr1.src){
         
                this.img.src = imgr2.src
                this.dx = this.speed
    
                return(this.x)
            }else if( this.img.src == imgr2.src){
                this.img.src = imgr1.src
                this.dx = this.speed
         
                return(this.x)
            }
        }else if(dir == 'left'){
            if (this.img.src != imgl.src && this.img.src != imgl1.src && this.img.src != imgl2.src){
                this.img.src = imgl.src
                return(this.img.src)
            }else if(this.img.src == imgl.src){
       
                this.img.src = imgl1.src
                this.dx = -this.speed
                return(this.x)
            }else if( this.img.src == imgl1.src){
         
                this.img.src = imgl2.src
                this.dx = -this.speed
                return(this.x)
            }else if( this.img.src == imgl2.src){
                this.img.src = imgl1.src
                this.dx = -this.speed
                return(this.x)
            }
        }else if(dir == 'up'){
            if (this.img.src != imgup.src && this.img.src != imgup1.src && this.img.src != imgup2.src){
                this.img.src = imgup.src
            }else if( this.img.src == imgup.src){
       
                this.img.src = imgup1.src
                this.dy= -this.speed
                return(this.y)
            }else if( this.img.src == imgup1.src){
         
                this.img.src = imgup2.src
                this.dy= -this.speed
                return(this.y)
            }else if( this.img.src == imgup2.src){
                this.img.src = imgup1.src
                this.dy= -this.speed
                return(this.y)
            }
        }else if (dir == 'down'){
            if (this.img.src != imgd.src && this.img.src != imgd1.src && this.img.src != imgd2.src){
                this.img.src = imgd.src
            }else if(this.img.src == imgd.src){
       
                this.img.src = imgd1.src
                this.dy = this.speed
                return(this.y)
            }else if( this.img.src == imgd1.src){
         
                this.img.src = imgd2.src
                this.dy = this.speed
                return(this.y)
            }else if( this.img.src == imgd2.src){
                this.img.src = imgd1.src
                this.dy = this.speed
                return(this.y)
            }
        }
    }



    stop(dir){
        if(dir== 'right'){
            this.dx=0;
            this.dy=0;
            this.img.src = imgr.src
            return(this.x)
        }else if(dir == 'left'){
            this.dx=0;
            this.dy=0;
            this.img.src = imgl.src
            return(this.x)
        }else if (dir == 'up'){
            this.dx=0;
            this.dy=0;
            this.img.src = imgup.src
            return(this.y)
        }else if (dir == 'down'){
            this.dx=0;
            this.dy=0;
            this.img.src = imgd.src
            return(this.y)
        }
    }



    newPost(){
        this.x += this.dx;
        this.y += this.dy

            //left wall
        if(this.x<0){
            this.x=0;
        }

        //right wall
        if(this.x + this.w > canvas.width){
           
            this.x=canvas.width-this.w
        }

        
        if(this.y < 0){
            this.y=0
        }

        if(this.y + this.h > canvas.height){
            this.y=canvas.height-this.h
        }

    
    }


}


export default Player