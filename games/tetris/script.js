const ctx = document.getElementById("tetris").getContext("2d");

var rows = new Array()
var interval = null;
var defaultSpeed = speed = 300;
var score = 0; var level = 0;

function drawBox(x, y, color = '#000000') {
  var size = 20;
  ctx.fillStyle = color;
  ctx.fillRect(x * size + 1, y * size + 1, size - 2, size -2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x * size + 3, y * size + 3, size - 6, size - 6);
  ctx.fillStyle = color;
  ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10);
}

function newShapeBox(x,y, color = '#000000') {
   return {
      x: x,
      y: y,
      color: color,
      draw: function(startX, startY) {
         drawBox(startX + this.x, startY + this.y, this.color);
      }
    }
}

function newShape() {
 const shapes = [
  [newShapeBox(-1,0,'violet'), newShapeBox(0,0,'violet'), newShapeBox(1,0,'violet'), newShapeBox(0,1,'violet')],
  [newShapeBox(-1,0,'red'), newShapeBox(0,0,'red'), newShapeBox(1,0,'red'), newShapeBox(2,0,'red')],
  [newShapeBox(-1,0,'orange'), newShapeBox(0,0,'orange'), newShapeBox(1,0,'orange'), newShapeBox(1,1,'orange')],
  [newShapeBox(-1,0,'blue'), newShapeBox(0,0,'blue'), newShapeBox(1,0,'blue'), newShapeBox(-1,1,'blue')],
  [newShapeBox(0,0,'green'), newShapeBox(1,1,'green'), newShapeBox(1,0,'green'), newShapeBox(0,1,'green')],
  [newShapeBox(-1,0,'brown'), newShapeBox(0,0,'brown'), newShapeBox(0,1,'brown'), newShapeBox(1,1,'brown')],
  [newShapeBox(-1,1,'black'), newShapeBox(0,1,'black'), newShapeBox(0,0,'black'), newShapeBox(1,0,'black')],
 ]
 return shapes[Math.floor(Math.random() * shapes.length)]
}

function newFigure() {
  var shape = {
    posX:   8,
    posY:   0,
    boxes:  newShape(),
    draw:   function() { this.boxes.forEach(box => box.draw(this.posX, this.posY)); },
    left:   function() { if(!isTouch(this.posX - 1, this.posY, this.boxes)){this.posX = this.posX - 1;}},
    right:  function() { if(!isTouch(this.posX + 1, this.posY, this.boxes)){this.posX = this.posX + 1;}},
    down:   function() { if(!isBlock(this.posX, this.posY + 1, this.boxes)){this.posY = this.posY + 1;}},
    rotate: function() {
      var newBoxes = [
         newShapeBox(this.boxes[0].y, -this.boxes[0].x, this.boxes[0].color),
         newShapeBox(this.boxes[1].y, -this.boxes[1].x, this.boxes[1].color),
         newShapeBox(this.boxes[2].y, -this.boxes[2].x, this.boxes[2].color),
         newShapeBox(this.boxes[3].y, -this.boxes[3].x, this.boxes[3].color),
      ]
      if(!isTouch(this.posX, this.posY+1, newBoxes)) this.boxes = newBoxes;
    }
  }
  return shape;
}

var curFigure = newFigure();

document.addEventListener("keydown", function(event) {
    if      (event.code == "ArrowRight"){ curFigure.right()  }
    else if (event.code == "ArrowLeft") { curFigure.left()   }
    else if (event.code == "ArrowDown") { curFigure.down()   }
    else if (event.code == 'Space')     { curFigure.rotate() }
    redraw();
}, false)

function redraw() {
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 340, 600);
  ctx.font = '14px serif';
  ctx.fillStyle = '#000'
  ctx.fillText("Score: " + score, 5, 15)
  ctx.fillText("Level: " + level, 5, 30)
  curFigure.draw();
  rows.forEach( b => b.draw(0,0) )
}

function changeSpeed() {
  clearInterval(interval);
  speed = speed * 0.96;
  interval = setInterval(function(){
       curFigure.down();
       redraw();
    } , speed)
}

function newGame() {
  speed = defaultSpeed;
  score = 0; level = 0;
  interval = setInterval(function(){
     curFigure.down();
     redraw();
  } , speed)
  curFigure = newFigure();
  rows = new Array();
  redraw();
}

function stop() {
   for(const c of curFigure.boxes) {
     rows.push(newShapeBox(curFigure.posX + c.x, curFigure.posY + c.y, c.color))
   }
   clearLine();
   curFigure = newFigure();

   if (isTouch(curFigure.posX, curFigure.posY, curFigure.boxes)) {
     clearInterval(interval);
     alert("Game over. Your score is " + score); newGame(); return;
   }
   redraw();
}

function isBlock(posX, posY, boxes) {
  if (isTouch(posX, posY, boxes)) {
    redraw()
    stop();
   }
}

function isTouch(posX, posY, boxes) {
   var result = false;
   for(const c of boxes) {
      if (posX + c.x < 0 || posX + c.x > 16 || posY + c.y >= 30) return true;
      for(const el of rows) {
        if ((el.x == posX + c.x) && (el.y == posY + c.y)) return true;
      }
    }
   return result;
}

function clearLine() {
  score+= 10 * Math.round(defaultSpeed / speed)
  var y = 30 + 1;
  while(--y > 0) {
    var rowEls = new Array();
    for(const el of rows) if (el.y == y) rowEls.push(el);
    if (rowEls.length > 16) {
      // remove all current lines
      for(const el of rowEls) rows.splice(rows.indexOf(el),1)
      // down all the rest
      for (const el of rows) if (el.y < y) {el.y = el.y + 1}
      // check again if more lines need to be cleared
      changeSpeed()
      level++
      score+= Math.round(100 * defaultSpeed / speed)
      clearLine()
    }

  }
}

newGame();

// REDRAW
setInterval(function(){  redraw();}, 50)