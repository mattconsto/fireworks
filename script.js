var scaling = 2
var drawing = false
var particles = []
var stars = []
var raining = false
var snowing = false
var tool = createFireworks

for(var i = 0; i < 100; i++) stars.push({x: Math.random(), y: Math.random()})

var canvas = document.getElementById("canvas")
canvas.context = canvas.getContext("2d")

window.addEventListener("resize", resizeCanvas)
window.addEventListener("load", resizeCanvas)
canvas.addEventListener("mousedown", function(event) {drawing = true; tool(event)})
canvas.addEventListener("touchstart", function(event) {drawing = true; tool(event); event.preventDefault(); return false})
canvas.addEventListener("mouseup", function(event) {drawing = false})
canvas.addEventListener("touchend", function(event) {drawing = false})
canvas.addEventListener("mousemove", function(event) {tool(event)})
canvas.addEventListener("touchmove", function(event) {tool(event)})

var Timing = {
	stamp: window.performance.now(),
	delta: 1000/60,
	refresh: function() {
		let temp = window.performance.now()
		this.delta = temp - this.stamp
		return this.stamp = temp
	}
}

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t
	if(arguments.length === 1) s = h.s, v = h.v, h = h.h
	i = Math.floor(h * 6)
	f = h * 6 - i
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break
		case 1: r = q, g = v, b = p; break
		case 2: r = p, g = v, b = t; break
		case 3: r = p, g = q, b = v; break
		case 4: r = t, g = p, b = v; break
		case 5: r = v, g = p, b = q; break
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	}
}

function createFireworks(event, bypass) {
	if(!drawing && !bypass) return

	var x = ("clientX" in event ? event.clientX : event.touches[0].clientX)/scaling - canvas.offsetLeft
	var y = ("clientY" in event ? event.clientY : event.touches[0].clientY)/scaling - canvas.offsetTop
	var color = HSVtoRGB(Math.random(), Math.random()*0.5+0.5, 1)

	particles.push({
		x: x, y: y,
		speed: Math.random() * 4 + 2,
		angle: Math.PI / 2 * Math.random() + 3 / 4 * Math.PI,
		lifetime: (1 + 2*Math.random()) * 1000,
		generations: (Math.random() < 0.2 ? 2 : 1),
		color: "rgb("+color.r+", "+color.g+", "+color.b+")",
		explosions: Math.round(Math.random()+1)
	})

	return false
}

function createRaindrops(event, bypass) {
	if(!drawing && !bypass) return

	var x = ("clientX" in event ? event.clientX : event.touches[0].clientX)/scaling - canvas.offsetLeft
	var y = ("clientY" in event ? event.clientY : event.touches[0].clientY)/scaling - canvas.offsetTop
	var color = HSVtoRGB(Math.random(), Math.random()*0.5+0.5, 1)

	particles.push({
		x: x, y: y,
		speed: 0,
		angle: Math.PI / 4 * Math.random() + 3.5 / 4 * Math.PI,
		lifetime: (1 + 2*Math.random()) * 2000,
		generations: 0,
		color: "rgb(0, 0, "+color.b+")",
		explosions: 0
	})

	return false
}

function createSnowfall(event, bypass) {
	if(!drawing && !bypass) return

	var x = ("clientX" in event ? event.clientX : event.touches[0].clientX)/scaling - canvas.offsetLeft
	var y = ("clientY" in event ? event.clientY : event.touches[0].clientY)/scaling - canvas.offsetTop

	particles.push({
		x: x, y: y,
		speed: 0,
		angle: Math.PI / 2 * Math.random() + 3 / 4 * Math.PI,
		lifetime: (1 + 2*Math.random()) * 2000,
		generations: 0,
		color: "white",
		explosions: 0
	})

	return false
}

function createFlame(event, bypass) {
	if(!drawing && !bypass) return

	var x = ("clientX" in event ? event.clientX : event.touches[0].clientX)/scaling - canvas.offsetLeft
	var y = ("clientY" in event ? event.clientY : event.touches[0].clientY)/scaling - canvas.offsetTop
	var color = HSVtoRGB(Math.random() / 5, Math.random()*0.5+0.5, 1)

	particles.push({
		x: x, y: y,
		speed: 0.5,
		angle: Math.PI / 2 * Math.random() - 1 / 4 * Math.PI,
		lifetime: (1 + 2*Math.random()) * 2000,
		generations: 0,
		color: "rgb("+color.r+", "+color.g+", "+color.b+")",
		explosions: 0
	})

	return false
}

function createConfetti(event, bypass) {
	if(!drawing && !bypass) return

	var x = ("clientX" in event ? event.clientX : event.touches[0].clientX)/scaling - canvas.offsetLeft
	var y = ("clientY" in event ? event.clientY : event.touches[0].clientY)/scaling - canvas.offsetTop
	var color = HSVtoRGB(Math.random(), Math.random()*0.5+0.5, 1)

	particles.push({
		x: x, y: y,
		speed: 1,
		angle: 2 * Math.PI * Math.random(),
		lifetime: (1 + 2*Math.random()) * 2000,
		generations: 0,
		color: "rgb("+color.r+", "+color.g+", "+color.b+")",
		explosions: 0
	})

	return false
}

function resizeCanvas() {
	canvas.width = window.innerWidth/scaling
	canvas.height = window.innerHeight/scaling
	canvas.style.width = scaling*canvas.width + "px"
	canvas.style.height = scaling*canvas.height + "px"
}

var update = function() {
	for(var i = particles.length - 1; i >= 0; i--) {
		particles[i].x += Math.sin(particles[i].angle) * particles[i].speed
		particles[i].y += Math.cos(particles[i].angle) * particles[i].speed

		particles[i].speed -= Timing.delta / 500
		particles[i].lifetime -= Timing.delta

		if(particles[i].lifetime <= 0) {
			var parent = particles[i]
			particles.splice(i, 1)

			for(var j = 0; j < 10; j++) {
				if(parent.generations > 0) {
					particles.push({
						x: parent.x,
						y: parent.y,
						speed: 2,
						angle: Math.random() * 2 * Math.PI,
						lifetime: Math.random() * 1000,
						generations: parent.generations-1,
						color: parent.color,
						explosions: 1
					})
				}
			}
			continue
		}

		if(particles[i].x < -100 || particles[i].x > canvas.width + 100 || particles[i].y < -100 || particles[i].y > canvas.height + 100) {
			particles.splice(i, 1)
			continue
		}
	}

	// Create rain
	for(var i = 0; raining && i < Math.floor(Math.random()*3); i++) {
		createRaindrops(new MouseEvent("raindrop", {"clientX": Math.random()*(canvas.width+100)*scaling - 50, "clientY": -99}), true)
	}

	for(var i = 0; snowing && i < Math.floor(Math.random()*3); i++) {
		createSnowfall(new MouseEvent("snowfall", {"clientX": Math.random()*(canvas.width+100)*scaling - 50, "clientY": -99}), true)
	}
}

var render = function() {
	canvas.context.fillStyle = "rgba(24, 16, 48, 0.2)"
	canvas.context.fillRect(0, 0, canvas.width, canvas.height)

	canvas.context.fillStyle = "#f0f0d0"
	for(var i = 0; i < stars.length; i++) {
		canvas.context.fillRect(stars[i].x*canvas.width-1, (18.5/20*stars[i].y*canvas.height)-1, 2, 2)
	}

	canvas.context.fillStyle = "rgba(0, 0, 0, 0.2)"
	canvas.context.fillRect(0, 18.5/20*canvas.height, canvas.width, canvas.height*1.5/20)

	for(var i = 0; i < particles.length; i++) {
		canvas.context.fillStyle = particles[i].color
		canvas.context.fillRect(particles[i].x-2, particles[i].y-2, 4, 4)
	}
}

var loop = function() {
	Timing.refresh()
	update()
	render()
	requestAnimationFrame(loop)
}

loop()
