
window.addEventListener('DOMContentLoaded', (event) =>{

    const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
    for (let t = 0; t < 10000000; t++) {
        squaretable[`${t}`] = Math.sqrt(t)
        if (t > 999) {
            t += 9
        }
    }
    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        squareDistance() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        angle() {
            return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }

    let mouse = false
    let tapper = false

    let enemies = []
    let score = 0

    let splat = -1
    let enemyspawn = 0.009
    let keysPressed = {};

document.addEventListener('keydown', (event) => {
   keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
 });


 let tutorial_canvas = document.getElementById("tutorial");
 let splatbtn = document.getElementById("splat");

 splatbtn.onclick = splatflip

 function splatflip(){
     splat*= -1
 }

    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

 //   tutorial_canvas_context.scale(.1, .1);  // this scales the canvas
    tutorial_canvas.style.background = "#000000"




 let flex = tutorial_canvas.getBoundingClientRect();

 // Add the event listeners for mousedown, mousemove, and mouseup
 let tip = {}
 let xs
 let ys
 let tap = {}
 let xz
 let yz


 
 window.addEventListener('mousedown', e => {
    flex = tutorial_canvas.getBoundingClientRect();


    xs = e.clientX - flex.left;
    ys = e.clientY - flex.top;
      tip.x = xs
      tip.y = ys

      tip.body = tip

    // if(mainguy.health ==0){
    //     if(squarecircle(restart, tip)){
    //         enemies = []
    //         score = 0
    //         mainguy.body.x = 350
    //         mainguy.body.y = 350
    //         mainguy.shots = []
    //         mainguy.deathrays = []
    //         mainguy.health = 1
    //         enemyspawn = 0.009
    //     }
    // }

    //   mainguy.firing+= 1
    //   mainguy.gun.fire(tip)

      mouse = true

   window.addEventListener('mousemove', beamdrag);
 });



 window.addEventListener('mouseup', e => {
     mouse = false
    window.removeEventListener("mousemove", beamdrag);
    window.removeEventListener("mousehold", beamdrag);
 })

 function beamdrag(e) {
    flex = tutorial_canvas.getBoundingClientRect();


    xs = e.clientX - flex.left;
    ys = e.clientY - flex.top;
      tip.x = xs
      tip.y = ys

      tip.body = tip

      mainguy.firing+= 1
      mainguy.gun.fire(tip)
  }


  function beamdragx(e) {
    flex = tutorial_canvas.getBoundingClientRect();


    for(let q = 0; q<enemies.length; q++){
        enemies[q].body.color =getRandomLightColor()
    }


    xs = e.targetTouches[0].pageX - flex.left;
    ys = e.targetTouches[0].pageY - flex.top;


    // xs = Math.random()*tutorial_canvas.width// touchItem.clientX// - flex.left;
    // ys = Math.random()*tutorial_canvas.height//touchItem.clientY// - flex.top;
      tap.x = xs
      tap.y = ys

      tap.body = tap

      mainguy.firing+= 1
      mainguy.gun.fire(tap)
  }



 
 window.addEventListener('touchstart', e => {

    flex = tutorial_canvas.getBoundingClientRect();


    xs = e.targetTouches[0].pageX - flex.left;
    ys = e.targetTouches[0].pageY - flex.top;
      tip.x = xs
      tip.y = ys

      tap.body = tap

    if(mainguy.health ==0){
        if(squarecircle(restart, tap)){
            enemies = []
            score = 0
            mainguy.body.x = 350
            mainguy.body.y = 350
            mainguy.shots = []
            mainguy.deathrays = []
            mainguy.health = 1
            enemyspawn = 0.009
        }
    }

    //   mainguy.firing+= 1
    //   mainguy.gun.fire(tip)

      tapper = true

      window.addEventListener('touchmove', beamdragx);
      window.addEventListener('touchhold', beamdragx);
    
 });    

 window.addEventListener('touchend', e => {


    flex = tutorial_canvas.getBoundingClientRect();


    xs = e.targetTouches[0].pageX - flex.left;
    ys = e.targetTouches[0].pageY - flex.top;
      tip.x = xs
      tip.y = ys

      tap.body = tap
    // jumping = 0
    tapper = false
   window.removeEventListener("touchmove", beamdrag);
   window.removeEventListener('touchhold', beamdrag);
    
 });




  class Gun{
      constructor(owner){
        this.rate =  5
        this.owner = owner
        this.bulletsize = 10
        this.bulletspeed = 10
        this.range = 25
      }
      fire(tip){
        //   console.log(tap, tip)
      if(this.owner.firing%this.rate == 0){
            this.owner.shots[ this.owner.shots.length] = new Circle(this.owner.body.x,this.owner.body.y, this.bulletsize,"#ffffff") // make the bullet
            this.owner.shots[this.owner.shots.length-1].health = this.range  //This controlls how far the bullet will go
            //trajectory calculation
            let s = Math.abs(this.owner.body.x - tip.x)
            let b = Math.abs(this.owner.body.y - tip.y)
            for (let k = 0; Math.sqrt(Math.abs(b*b)+Math.abs(s*s)) > this.bulletspeed; k++ ){   //sets speed to maximum from above
            b = b*.9999
            s = s*.9999
            }
            for (let k = 0;Math.sqrt(Math.abs(b*b)+Math.abs(s*s)) < this.bulletspeed; k++ ){ //sets speed to maximum from below
            b = b/.9999
            s = s/.9999
            }  
            //section to determine direction
            if(tip.x > this.owner.body.x){
            this.owner.shots[ this.owner.shots.length-1].xmom = s
            }
            if(tip.x < this.owner.body.x){
            this.owner.shots[ this.owner.shots.length-1].xmom = -s
            }
            if(tip.y< this.owner.body.y){
                this.owner.shots[ this.owner.shots.length-1].ymom = -b
            }
            if(tip.y> this.owner.body.y){
                this.owner.shots[ this.owner.shots.length-1].ymom = b
            }
          }
      }
  }



  class Perceptron {
    constructor(inputs) {
        this.bias = 0 //this.weight()
        this.value = this.bias
        this.weights = []
        this.inputs = inputs
        for (let t = 0; t < this.inputs.length; t++) {
            this.weights.push(this.weight())
            // if(t%2==0){

            //     this.weights.push(1)
            // }else{

            //     this.weights.push(0)
            // }
        }
    }
    weight() {
        return Math.random() - .5
    }
    valueOf() {
        return this.value
    }
    compute(inputs = this.inputs) {
        this.value = this.bias
        for (let t = 0; t < inputs.length; t++) {
            if (t > this.weights.length - 1) {
                this.weights.push(this.weight())
                this.value += (inputs[t].valueOf() * this.weights[t])
            } else {
                if (typeof inputs[t] == "undefined") {
                    this.weights.push(this.weight())
                    inputs[t] = Math.random()
                }
                this.value += (inputs[t].valueOf() * this.weights[t])
            }
        }
        // this.relu()
        return this.value
    }
    relu() {
        this.value = Math.max(this.value, 0)
    }
}

function getRandomColor() { // random color
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 16) + 0)];
    }
    return color;
}
class Network {
    constructor(inputs, layerSetupArray) {
        this.intputs = []
        this.errors = []
        this.color = getRandomColor()
        this.inputs = inputs
        this.structure = []
        this.outputs = []
        for (let t = 0; t < layerSetupArray.length; t++) {
            this.scaffold = []
            for (let k = 0; k < layerSetupArray[t]; k++) {
                let cept
                if (t == 0) {
                    cept = new Perceptron(this.inputs)
                } else {
                    cept = new Perceptron(this.structure[t - 1])
                }
                this.scaffold.push(cept)
            }
            this.structure.push(this.scaffold)
        }
    }

    clone(nw){
        let perc = new Network([0,0,0,0,0], [10,8,6])
        for(let t = 0;t<nw.structure.length;t++){
            for(let k = 0;k<nw.structure[t].length;k++){
                perc.structure[t][k] = new Perceptron(nw.inputs)
                for(let f = 0;f<nw.structure[t][k].weights.length;f++){
                    perc.structure[t][k].weights[f] = nw.structure[t][k].weights[f]
                    perc.structure[t][k].bias = nw.structure[t][k].bias
                }
            }
        }
        console.log(perc)
        return perc
        }
    compute(inputs = this.inputs) {
        for (let t = 0; t < this.structure.length; t++) {
            for (let k = 0; k < this.structure[t].length; k++) {
                this.structure[t][k].compute(inputs)
            }
        }
        this.outputs = []
        this.dataoutputs = []
        for (let t = 0; t < this.structure[this.structure.length - 1].length; t++) {
            this.outputs.push(this.structure[this.structure.length - 1][t].valueOf())
            this.dataoutputs.push(new Data(this.structure[this.structure.length - 1][t].valueOf()))
        }
    }
    mutate() {
        for (let t = 0; t < 100; t++) {

            this.error1 = this.errortemp1
            let perceptronLayer = Math.floor(Math.random() * this.structure.length)
            let perceptronNumber = Math.floor(Math.random() * this.structure[perceptronLayer].length)
            let perceptronWeightNumber = Math.floor(Math.random() * this.structure[perceptronLayer][perceptronNumber].weights.length)
            this.structure[perceptronLayer][perceptronNumber].weights[perceptronWeightNumber] = (this.structure[perceptronLayer][perceptronNumber].weight() + (this.structure[perceptronLayer][perceptronNumber].weights[perceptronWeightNumber] * 10)) / 11

        }
        // if (percs.indexOf(this) == 0) {
        //     magenta++
        //     if (counter % 2 == 0) {
        //         counter++
        //         // console.log(counter)
        //     }
        // }
        // if (percs.indexOf(this) == 1) {
        //     // console.log(inputs)
        //     flag = 1
        //     cyan++
        //     // if(counter%2 == 1){
        //     // counter++
        //     //     // console.log(counter)
        //     // }
        // }
    }
    errorCheck(goals) {
        let sum = 0
        this.compute(this.intputs[(this.errors.indexOf(goals))])
        for (let t = 0; t < goals.length; t++) {
            sum += ((goals[t] - this.outputs[t]) * ((goals[t] - this.outputs[t])))
        }
        return sum
    }
    mutateTowards(goals) {
        this.compute(this.inputs)
        this.errortemp1 = 0
        for (let t = 0; t < this.errors.length; t++) {
            this.errortemp1 += this.errorCheck(this.errors[t])
        }
        this.error1 = this.errortemp1
        let perceptronLayer = Math.floor(Math.random() * this.structure.length)
        let perceptronNumber = Math.floor(Math.random() * this.structure[perceptronLayer].length)
        let perceptronWeightNumber = Math.floor(Math.random() * this.structure[perceptronLayer][perceptronNumber].weights.length)
        let storage = this.structure[perceptronLayer][perceptronNumber].weights[perceptronWeightNumber]
        this.structure[perceptronLayer][perceptronNumber].weights[perceptronWeightNumber] = (this.structure[perceptronLayer][perceptronNumber].weight() + (this.structure[perceptronLayer][perceptronNumber].weights[perceptronWeightNumber] * 100)) / 101
        this.compute(this.inputs)

        this.errortemp2 = 0
        for (let t = 0; t < this.errors.length; t++) {
            this.errortemp2 += this.errorCheck(this.errors[t])
        }
        this.error2 = this.errortemp2
        if (this.error1 < this.error2) {
            this.structure[perceptronLayer][perceptronNumber].weights[perceptronWeightNumber] = storage
            this.compute(this.inputs)
        }

        if (this.errors.length > 10000) {
            this.errors.splice(0, 1)
            this.intputs.splice(0, 1)
        }



    }
}
class Data {
    constructor(input = -100) {
        if (input == -100) {
            this.value = this.weight()
        } else {
            this.value = input
        }
    }
    valueOf() {
        return this.value
    }
    weight() {
        return Math.random() - .5
    }
}



  class Ship{
      constructor(parent){
          this.parent = parent
          this.body = new Circle(350,350, 12, "cyan")
          this.shots = []
          this.firing = 0
          this.deathrays = []
          this.health = 1
          this.gun = new Gun(this)

          //nearx, neary, angle?, selfx, selfy     
          this.inputs = [0,0,0,0,0]
          this.network = new Network(this.inputs, [10,8,6])
      }
      draw(){
          this.body.draw()
        
          for(let s = 0 ; s<this.shots.length;s++){
            this.shots[s].move()
            this.shots[s].draw()
            this.shots[s].health-=1
          }
          for(let s = 0 ; s<this.deathrays.length;s++){
            this.deathrays[s].dmove()
            this.deathrays[s].draw()
            this.deathrays[s].radius *= .945
          }
          for(let s = 0 ; s<this.deathrays.length;s++){
              if(this.deathrays[s].radius < .5){
                  this.deathrays.splice(s,1)
              }
          }
          for(let e = 0; e<this.parent.enemies.length; e++){
          for(let s = 0 ; s<this.deathrays.length;s++){
            if(intersects(this.parent.enemies[e].body,this.deathrays[s])){
            this.parent.enemies[e].health -= (this.deathrays[s].radius)*((this.deathrays[s].xmom)+(this.deathrays[s].ymom))*3
            this.parent.enemies[e].body.xmom += this.deathrays[s].xmom/4
            this.parent.enemies[e].body.ymom += this.deathrays[s].ymom/4
                  this.deathrays.splice(s,1)
            }
          }
        }
          for(let s = 0 ; s<this.shots.length;s++){


            for(let e = 0; e<this.parent.enemies.length; e++){
                if(intersects(this.parent.enemies[e].body,this.shots[s])){
                    this.parent.enemies[e].health -= (this.shots[s].radius)*(this.gun.bulletspeed)
                    this.parent.enemies[e].body.xmom += this.shots[s].xmom/3
                    this.parent.enemies[e].body.ymom += this.shots[s].ymom/3
                    deathanimation(this.shots[s], this.parent)
                    this.shots.splice(s,1)
                }
              }
          }
          for(let s = 0 ; s<this.shots.length;s++){
              if(this.shots[s].health <= 0){
                deathanimation(this.shots[s], this.parent)
                  this.shots.splice(s,1)
              }
          }
      }
  }



    // can be drawn, or moved.
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){

            this.x+=this.xmom
            this.y+=this.ymom

        }
    }

    // can be drawn, or moved with friction.  and richochet 
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.ring = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 0

            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            // tutorial_canvas_context.stroke(); 
            tutorial_canvas_context.lineWidth = 1

            if(this.ring == 1){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius*3, 0, (Math.PI*2), true)
            // tutorial_canvas_context.stroke(); 

            }
        }
        dmove(){

                this.xmom*=1.011
                this.ymom*=1.011

            this.x += this.xmom
            this.y += this.ymom

            if(this.x+this.radius > tutorial_canvas.width){

                if(this.xmom > 0){
                this.xmom *= -1
                }

            }
            if(this.y+this.radius > tutorial_canvas.height){
                if(this.ymom > 0){
                this.ymom *= -1
                }

            }
            if(this.x-this.radius < 0){
                if(this.xmom < 0){
                    this.xmom *= -1
                }

            }
            if(this.y-this.radius < 0){

                if(this.ymom < 0){
                    this.ymom *= -1
                }
        
            }

            // ^ this reflects balls off the wall
            // the internal checks make it always return to the screen

        }

        move(){

                this.xmom*=.99
                this.ymom*=.99
            this.x += this.xmom
            this.y += this.ymom

            if(this.x+this.radius > tutorial_canvas.width){

                if(this.xmom > 0){
                this.xmom *= -1
                }

            }
            if(this.y+this.radius > tutorial_canvas.height){
                if(this.ymom > 0){
                this.ymom *= -1
                }

            }
            if(this.x-this.radius < 0){
                if(this.xmom < 0){
                    this.xmom *= -1
                }

            }
            if(this.y-this.radius < 0){

                if(this.ymom < 0){
                    this.ymom *= -1
                }
        
            }

            // ^ this reflects balls off the wall
            // the internal checks make it always return to the screen

        }


    }

    class Enemy{
        constructor(){
            this.body = new Circle(Math.random()*tutorial_canvas.width, Math.random()*tutorial_canvas.height, 14, "red")
            this.health = 40
            // this.gun = mainguy.gun
            this.shots =  []
            this.firing = 0
            this.gun = new Gun(this)
        }
        draw(){
            this.body.draw()
            
        }
    }

    // let x = 0
    // let y = 0

     let circ = new Circle(125, 200, 10, getRandomLightColor(), Math.random()-.5, Math.random()-.5)  // starts with ramndom velocities and color
     let restart = new Rectangle ( 305, 370, 100, 100, "red")
    // rect.ymom = 1


    // let mainguy = new Ship()
    // // example objects

    // let enemy = new Enemy()

    // enemies.push(enemy)
    
    // enemy = new Enemy()

    // enemies.push(enemy)

    class Wrapthis {
        constructor(){
            this.mainguy = new Ship(this)
            this.mainguy.body.color = this.mainguy.network.color
            this.mainguy.shotnetwork = this.mainguy.network.clone(nw)
            this.mainguy.network = this.mainguy.network.clone(sw)
            this.enemies = []
            let enemy = new Enemy()
            enemy.body.x = 100
            enemy.body.y = 100
            this.enemies.push(enemy)
            // enemy = new Enemy()
            // this.enemies.push(enemy)
            this.enemyspawn = .009
            this.score = 0
        }
        draw(){
            if(keysPressed[' ']){
                console.log(this.mainguy)
            }
    
            if(splat == 1){
    
            tutorial_canvas_context.fillStyle =`rgba(0, 0, 0,${255/255})`
            tutorial_canvas_context.fillRect(0,0,tutorial_canvas.width*2,tutorial_canvas.height*2)
            }else{
                tutorial_canvas_context.fillStyle =`rgba(0, 0, 0,${255/255})`
                tutorial_canvas_context.fillRect(0,0,tutorial_canvas.width*2,tutorial_canvas.height*2)
         }   
    
            if(this.mainguy.health > 0){
    
                if(Math.random()<this.enemyspawn){
    
                    let xpos = Math.random()*tutorial_canvas.width
                    let ypos = Math.random()*tutorial_canvas.height
                    for(let t = 0;t<wrappers.length;t++){
                        let enemy = new Enemy()
                        enemy.body.x = xpos
                        enemy.body.y = ypos
                    
                        if(!intersectsbig(enemy.body, wrappers[t].mainguy.body)){
                            wrappers[t].enemies.push(enemy)
                        }
                    }
                }
                
                
                
                
                        players(this.mainguy)
                
                        this.mainguy.draw()
                
                        if(mouse == true){
                            this.mainguy.firing++
                            if(this.mainguy.firing%this.mainguy.gun.rate == 0){
                                this.mainguy.gun.fire(tip)
                            }
                        }else if(tapper == true){
                            this.mainguy.firing++
                            if(this.mainguy.firing%this.mainguy.gun.rate == 0){
                                this.mainguy.gun.fire(tap)
                            }
                        }
                
                        let minimum = 999999999
                        for(let e = 0; e<this.enemies.length; e++){
                            let link = new LineOP(this.enemies[e].body, this.mainguy.body)
                            if(link.hypotenuse() < minimum){
                                minimum = link.hypotenuse()
                                this.mainguy.inputs[0] = (this.enemies[e].body.x-350)/350
                                this.mainguy.inputs[1] = (this.enemies[e].body.y-350)/350
                                this.mainguy.inputs[2] =  (link.angle()-Math.PI)/Math.PI
                                this.mainguy.inputs[3] = (this.mainguy.body.x-350)/350
                                this.mainguy.inputs[4] = (this.mainguy.body.y-350)/350
                                this.mainguy.network.compute(this.mainguy.inputs)
                                this.mainguy.inputs[0] = (this.enemies[e].body.x-this.mainguy.body.x)/350
                                this.mainguy.inputs[1] = (this.enemies[e].body.y-this.mainguy.body.y)/350
                                this.mainguy.inputs[3] = 0
                                this.mainguy.inputs[4] = 0
                                this.mainguy.shotnetwork.compute(this.mainguy.inputs)
                            }
                            this.enemies[e].body.move()
                            this.enemies[e].draw()
                            if(intersects(this.enemies[e].body, this.mainguy.body)){
                                this.mainguy.health = 0
                                // this.mainguy = new Ship(this)
    
                                this.enemies = []
                                this.fitness = this.score
                                // this.score = 0
                                // this.mainguy.body.x = 350
                                // this.mainguy.body.y = 350
                                // this.mainguy.shots = []
                                // this.mainguy.deathrays = []
                                // this.mainguy.health = 1
                                // this.enemyspawn = 0.009
                            }else{
                                this.enemies[e].body.xmom -=(this.enemies[e].body.x-this.mainguy.body.x)/14000
                                this.enemies[e].body.ymom -=(this.enemies[e].body.y-this.mainguy.body.y)/14000
                            }
                            // this.enemies[e].gun.fire(this.mainguy.body)
                        }
                
                        for(let e = 0; e<this.enemies.length; e++){
                            if(this.enemies[e].health <= 0){
                
                                this.enemyspawn+=0.00005
                                this.score++
                                deathanimation(this.enemies[e].body)
                                this.enemies.splice(e,1)
                            }
                        }
                
                
                        tutorial_canvas_context.font = `${28.5}px Arial`
                        tutorial_canvas_context.fillStyle = "white";
                        tutorial_canvas_context.fillText(`${this.score}`, 630, 30);
                
                
    
            }else{
    
                // restart.draw()
                
                // tutorial_canvas_context.font = `${28.5}px Arial`
                // tutorial_canvas_context.fillStyle = "white";
                // tutorial_canvas_context.fillText(`Again?`, restart.x+10, restart.y +50);
                
                // tutorial_canvas_context.font = `${28.5}px Arial`
                // tutorial_canvas_context.fillStyle = "white";
                // tutorial_canvas_context.fillText(`Dead`, 320, 350);
                // tutorial_canvas_context.font = `${28.5}px Arial`
                // tutorial_canvas_context.fillStyle = "white";
                // tutorial_canvas_context.fillText(`Score: ${score}`, 300, 300);
        
        
    
            }
        }
    }
    

    tutorial_canvas_context.fillStyle =`rgba(0, 0, 0,${15/255})`
// interval, fill this with game logic 


let sto = []
let wrappers = []
for(let t = 0;t<1;t++){
    let wrapper = new Wrapthis()
    wrappers.push(wrapper)
}


    window.setInterval(function(){ 
        
for(let t = 0;t<wrappers.length;t++){
    wrappers[t].draw()
}


let healthsum = 2
for(let t = 0;t<wrappers.length;t++){
    healthsum += wrappers[t].mainguy.health 
}

if(healthsum <= 1){
    for(let t = 0;t<wrappers.length;t++){
        if(wrappers[t].mainguy.health == 1 || t == 19){
            sto.push(wrappers[t].mainguy.network)
        }
    }
    wrappers = []
    for(let t = 0;t<20;t++){
        let wrapper = new Wrapthis()
        wrappers.push(wrapper)
    }
    for(let t = 0;t<wrappers.length-1;t++){
        wrappers[t].mainguy.network = sto[0].clone(sto[0])
    }
    for(let t = 1;t<wrappers.length-1;t++){
        wrappers[t].mainguy.network.mutate()
        wrappers[t].mainguy.body.color = sto[0].color
        wrappers[t].mainguy.network.color = sto[0].color
        // console.log(sto[0])
    }
    sto = []
}




    }, 1) // length of refresh interval



    function control(object, speed = 1) { // basic control for objects
        if (typeof object.body != 'undefined') {
            if (keysPressed['w']) {
                object.body.y -= speed
            }
            if (keysPressed['d']) {
                object.body.x += speed
            }
            if (keysPressed['s']) {
                object.body.y += speed
            }
            if (keysPressed['a']) {
                object.body.x -= speed
            }
        } else if (typeof object != 'undefined') {
            if (keysPressed['w']) {
                object.y -= speed
            }
            if (keysPressed['d']) {
                object.x += speed
            }
            if (keysPressed['s']) {
                object.y += speed
            }
            if (keysPressed['a']) {
                object.x -= speed
            }
        }
    }

    // run on any object with x/y attributes in the timer to give them wasd controls
    function players(racer){


        let tip = {}
        tip.x = racer.body.x + racer.shotnetwork.outputs[4]
        tip.y = racer.body.y + racer.shotnetwork.outputs[5]

        racer.firing+= 1
        racer.gun.fire(tip)

        // control(racer.body)

        if (racer.network.outputs[0] > racer.network.outputs[1]) {
            if(racer.body.y>racer.body.radius){
                racer.body.y -= .701010101
            }else{
                // racer.body.y = tutorial_canvas.height-0.69
                // for(let e = 0; e<enemies.length; e++){
                //     enemies[e].body.ymom*=-1
                // }
            }
        }else  {
            if(racer.body.y<tutorial_canvas.height-racer.body.radius){
                racer.body.y += .701010101
            }else{
                // racer.body.y = 0.69
                // for(let e = 0; e<enemies.length; e++){
                //     enemies[e].body.ymom*=-1
                // }
            }
        }
        if (racer.network.outputs[2] > racer.network.outputs[3]) {
            if(racer.body.x>racer.body.radius){
                racer.body.x -= .701010101
            }else{
                // racer.body.y = tutorial_canvas.width-0.69
                // for(let e = 0; e<enemies.length; e++){
                //     enemies[e].body.xmom*=-1
                // }
            }
        }else{
            if(racer.body.x<tutorial_canvas.width-racer.body.radius){
                racer.body.x += .701010101
            }else{
                // racer.body.x = 0.69

                // for(let e = 0; e<enemies.length; e++){
                //     enemies[e].body.xmom*=-1
                // }
            }
        }
        // if (keysPressed['f']) {
        //     mainguy.gun.bulletspeed += .1
        //     if(mainguy.gun.bulletspeed>10){
        //         mainguy.gun.bulletspeed = 10
        //     }
        // }
        // if (keysPressed['g']) {
        //     mainguy.gun.bulletsize += .1
        //     if(mainguy.gun.bulletsize>10){
        //         mainguy.gun.bulletsize = 10
        //     }
        // }
        // if (keysPressed['h']) {
        //     mainguy.gun.rate -= 1
        //     if(mainguy.gun.rate<10){
        //         mainguy.gun.rate = 10
        //     }
        // }


        // any key combination can be made from a nested if statement, all keys can just be accessed by name (if you can find it)

    }





// can check if one circle contains the cneter of the other circle, and / or it can check if any constructed object with an x and y attribute is inside of a circle. With tinkering, this can check boundaries of two circles.
function intersects(circle, left) {

    if(typeof circle != "undefined"){
    if(typeof left  != "undefined"){
        
    let link = new LineOP(circle, left)
    if(link.hypotenuse() < circle.radius+left.radius){
        return true
    }
    }else{
        return false
    }
    }else{
        return false
    }
}
function intersectsbig(circle, left) {
    var areaX = left.x - circle.x;
    var areaY = left.y - circle.y;
    return areaX * areaX + areaY * areaY <= circle.radius*20 * circle.radius;
}

// random color that will be visible on  blac backgroung
function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
  }


// checks if a square contains the centerpoint of a circle
function squarecircle(square, circle){

    let squareendh = square.y + square.height
    let squareendw = square.x + square.width

    if(square.x <= circle.x){
        if(square.y <= circle.y){
            if(squareendw >= circle.x){
                if(squareendh >= circle.y){
                    return true
                }
            }
        }
    }
    return false
}

// checks if two squares are intersecting ( not touching, for touching cnange the evaluations from ">" to ">=" etc)
function squaresquare(a, b){

    a.left = a.x
    b.left = b.x
    a.right = a.x + a.width
    b.right = b.x + b.width
    a.top = a.y 
    b.top = b.y
    a.bottom = a.y + a.height
    b.bottom = b.y + b.height



    if (a.left > b.right || a.top > b.bottom || 
        a.right < b.left || a.bottom < b.top)
    {
       return false
    }
    else
    {
        return true
    }
}




function deathanimation(body, parent = 0){

    if(parent == 0){
        let start = Math.random()

        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+10
    
        deathrays = 9
    
        for(let g = 0; g < deathrays; g++){
    
    
            let dot1 = new Circle(body.x, body.y, body.radius, body.color, Math.cos(rotx), Math.sin(roty) )
            dot1.move()
            dot1.move()
            dot1.move()
            dot1.ring = 1
            // mainguy.deathrays.push(dot1)
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    }else{
        let start = Math.random()

        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+10
    
        deathrays = 9
    
        for(let g = 0; g < deathrays; g++){
    
    
            let dot1 = new Circle(body.x, body.y, body.radius, body.color, Math.cos(rotx), Math.sin(roty) )
            dot1.move()
            dot1.move()
            dot1.move()
            dot1.ring = 1
            parent.mainguy.deathrays.push(dot1)
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    }

       
    }








})