requirejs.config({
	baseUrl: '/',
	paths: {
		lib: '/js/lib'
	}
});

require(["app/app", "app/sfx"],
	function (app, sfx) {
		var fps = 60;

		var socket = io();

		// Initialize mainCanvas
		app.init('mainCanvas');
		sfx.init([{name:"firework", url:"/sounds/firework.mp3"}]);

		var colors = [
			[255,0,0,255],
			[0,255,0,255],
			[0,0,255,255],

			[255,0,255,255],
			[255,255,0,255],
			[0,255,255,255],

			[128,0,255,255],
			[128,255,0,255],
			[0,128,255,255],

			[255,0,128,255],
			[255,128,0,255],
			[0,255,128,255],
		];


		window.addEventListener('mousedown', function(e) {
			var x = e.x;
  			var y = e.y;
  			socket.emit('mousedown', JSON.stringify({"x":x, "y":y}));
		});

		socket.on('firework', function(msg){
			cord = JSON.parse(msg);
			var color = colors[Math.floor(Math.random()*colors.length)];
			for(var i = 0; i < 100;i++){
				sfx.play("firework");
				app.emit(cord.x, cord.y, Math.random()*300, 0, 1000, color, [0,0,0,255], 5, 1, Math.random()*360);
			}
		});

		// Start graphics loop
		var lastRefresh = new Date().getTime();
    	setInterval(function(){
    		// Calculate delta-time
    		var now = new Date().getTime();
        	var dt = now-lastRefresh;

        	app.refresh(dt);
        	app.reDraw();

        	// Set lastRefresh to calc. deltatime next time.
        	lastRefresh = now;
    	},1000/fps);
	}
);