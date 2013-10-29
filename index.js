FPS = 30;
mousePos = {
	x:-1,
	y:-1
};

$(document).ready(function() {
	c=document.getElementById("canvas");
	c.width=720;
	c.height=480;
	$("div").animate({opacity:1.0},1500);
	$("#canvas").animate({opacity:1.0},4000);
	ctx=c.getContext("2d");
	c.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(c, evt);
      }, false);
	startSnake();
	setInterval(function(){
		rect = c.getBoundingClientRect();
		update();
		draw();
	},1000/FPS);
});

Dot = function(xpos,ypos){
		this.x = xpos;
		this.y = ypos;
		this.radius=2;
		this.x_ = xpos;
		this.y_ = ypos;
		this.tx = xpos;
		this.ty = ypos;
		this.target = {x:this.x,y:this.y};
};

hypot = function (x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

drawCircle = function(x,y,r,ctx) {
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	ctx.fill();
}

pushDot = function(dot, dx, dy) {
	dot.x += dx;
	dot.y += dy;

}

pushTo = function(dot, x, y, a) {
	var dist = Math.sqrt((dot.x-x)*(dot.x-x) + (dot.y-y)*(dot.y-y));
		pushDot(dot,(x-dot.x)/dist * a, (y-dot.y)/dist * a);
}
accel = 0.9;

moveToTarget = function(dot, tx, ty, callback) {
	if (Math.abs(dot.x-tx) < 1 && Math.abs(dot.y-ty) < 1) {
		dot.x_ = dot.x = tx;
		dot.y_ = dot.y = ty;
		callback();
	} else {
		pushTo(dot, tx, ty, accel - 0.4/(snake.length));
	}

}

friction = 0.85;

moveDot = function(dot) {
	var x_ = dot.x;
	var y_ = dot.y;
	dot.x += (dot.x - dot.x_) * friction;//(0.85 + snake.length/300);
	dot.y += (dot.y - dot.y_) * friction;//(0.85 + snake.length/300);
	dot.x_ = x_; dot.y_ = y_;
}

getMousePos = function(c, evt) {
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
dots = new Array();
framecount = 0;

collision_edge = 0;

collisionCheck = function() {
	var hit = 0;
	for (var i = 1; i < snake.length && !hit; i++) {
		hit = (hypot(dots[i].x, dots[i].y, dots[0].x, dots[0].y) < 6);
	}
	if (hit && !collision_edge) {
		console.log("splat");
		collision_edge = 1;
	}else if (!hit && collision_edge) {
		console.log("unsplat");
		collision_edge = 0;
	}
}

update = function() {
	framecount++;
	snakeGame();
	for(var i=0;i<dots.length;i++){
		moveToTarget(dots[i], dots[i].target.x, dots[i].target.y, function(){/*console.log("" + framecount + " " + i + ": " + dots[i].tx +","+dots[i].ty);*/});
		moveDot(dots[i]);
	}
	collisionCheck();
};

draw = function() {
	ctx.fillStyle = "rgba(45,45,45,0.6)";
	ctx.fillRect(0,0,720,480);
	ctx.fillStyle="#F55B15";
	drawCircle(dots[0].x, dots[0].y,4, ctx);
	drawCircle(dots[dots.length-1].x,dots[dots.length-1].y,dots[dots.length-1].radius,ctx);
	ctx.fillStyle="#FFFFFF";
	
	for(var i=1;i<dots.length-1;i++) {
		drawCircle(dots[i].x,dots[i].y,dots[i].radius,ctx);
	}
};
/*
gForce = 100;
maxG = 0.7;
gravSim = function() {
	for (var i = 0; i < dots.length;i++) {
		for (var j = 0; j < i; j ++) {
			distsqrd = (dots[i].x-dots[j].x)*(dots[i].x-dots[j].x)+(dots[i].y-dots[j].y)*(dots[i].y-dots[j].y);
			pushTo(dots[i], dots[j].x, dots[j].y, Math.min(gForce / distsqrd, maxG));
			pushTo(dots[j], dots[i].x, dots[i].y, Math.min(gForce / distsqrd, maxG));
		}

	} 
}*/

snakeGame = function() {

// extend snake if gets food
	if (hypot(food.x, food.y, snake[0].x,snake[0].y) < 20) {
		food.target = snake[snake.length-1];
		//pushTo(food,snake[snake.length-1].x,snake[snake.length-1].y); // accel
		snake[snake.length]=food;
		food = new Dot (Math.random()*(700) + 10,Math.random()*(460)+10);
		dots[dots.length]=food;
		console.log("weee");
	}

// move head to mouse
	snake[0].target.x = mousePos.x;
	snake[0].target.y = mousePos.y;
}

startSnake = function () {
	snake = new Array();
	snake[0] = new Dot(360,240);
	food = new Dot (Math.random()*(720),Math.random()*(480));
	dots[dots.length]=snake[0];
	dots[dots.length]=food;
}
