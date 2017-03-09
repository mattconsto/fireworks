var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var scaling = 2;
canvas.width = window.innerWidth/scaling;
canvas.height = window.innerHeight/scaling;
canvas.style.width = scaling*canvas.width + "px";
canvas.style.height = scaling*canvas.height + "px";

var Timing =  {
	stamp: window.performance.now(),
	delta: 1000/60,
	refresh: function() {
		let temp = window.performance.now();
		this.delta = temp - this.stamp;
		return this.stamp = temp;
	}
}

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

var drawing = false;

canvas.addEventListener("mousedown", function(event) {drawing = true;getPosition(event);}, false);
canvas.addEventListener("mouseup", function(event) {drawing = false;}, false);
canvas.addEventListener("mousemove", getPosition, false);
window.addEventListener('resize', resizeCanvas);

function getPosition(event) {
	if(!drawing) return;

  var x = event.x/scaling - canvas.offsetLeft;
  var y = event.y/scaling - canvas.offsetTop;

  var color = HSVtoRGB(Math.random(), Math.random()*0.5+0.5, 1);

  fireworks.push({
  	x: x,
  	y: y,
  	speed: Math.random() * 4 + 2,
  	angle: Math.PI / 2 * Math.random() + 3 / 4 * Math.PI,
  	lifetime: (1 + 2*Math.random()) * 1000,
  	generations: (Math.random() < 0.2 ? 2 : 1),
  	color: "rgb("+color.r+", "+color.g+", "+color.b+")",
  	explosions: Math.round(Math.random()+1)
  });
}

function resizeCanvas(){
	canvas.width  = window.innerWidth/scaling;
	canvas.height = window.innerHeight/scaling;
	canvas.style.width = scaling*canvas.width + "px";
	canvas.style.height = scaling*canvas.height + "px";
}

var fireworks = [];
var stars = [];

for(var i = 0; i < 100; i++) {
	stars.push({x: Math.random(), y: Math.random()});
}

context.fillStyle = "#000010";
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "#000000";
context.fillRect(0, 19/20*canvas.height, canvas.width, canvas.height/20);

var update = function() {
	for(var i = fireworks.length - 1; i >= 0; i--) {
		fireworks[i].x += Math.sin(fireworks[i].angle) * fireworks[i].speed;
		fireworks[i].y += Math.cos(fireworks[i].angle) * fireworks[i].speed;

		fireworks[i].speed -= Timing.delta / 500;

		fireworks[i].lifetime -= Timing.delta;

		if(fireworks[i].lifetime <= 0) {
			var parent = fireworks[i];
			fireworks.splice(i, 1);

			for(var j = 0; j < 10; j++) {
				if(parent.generations > 0) {
					fireworks.push({
						x: parent.x,
						y: parent.y,
						speed: 2,
						angle: Math.random() * 2 * Math.PI,
						lifetime: Math.random() * 1000,
						generations: parent.generations-1,
						color: parent.color,
						explosions: 1,
					});
				}
			}

			continue;
		}

		if(fireworks[i].x < 0 || fireworks[i].x > canvas.width || fireworks[i].y < 0 || fireworks[i].y > canvas.height) {
			fireworks.splice(i, 1);
			continue;
		}
	}
}

var render = function() {
	context.fillStyle = "rgba(0, 0, 16, 0.2)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#f0f0d0";
	for(var i = 0; i < stars.length; i++) {
		context.fillRect(stars[i].x*canvas.width-1, (19/20*stars[i].y*canvas.height)-1, 2, 2);
	}

	context.fillStyle = "rgba(0, 0, 0, 0.2)";
	context.fillRect(0, 19/20*canvas.height, canvas.width, canvas.height/20);

	for(var i = 0; i < fireworks.length; i++) {
		context.fillStyle = fireworks[i].color;
		context.fillRect(fireworks[i].x-2, fireworks[i].y-2, 4, 4);
	}
}

var loop = function() {
	Timing.refresh();

	update();
	render();

	requestAnimationFrame(loop);
}

loop();