
require(["Logger", "Loader", "Game", "FPSTimer"], function callback(Logger, Loader, Game, FPSTimer) {
	
	// draw the log
	var log = document.getElementById("log");
	log.appendChild(Logger.getElement());
	
	// launch the game
	var game = new Game();
	
	// set up update loop/FPS timer
	var fpsTimer = new FPSTimer(60, function(dt) {
		game.update(dt);
		document.getElementById('fps').innerHTML = "FPS: " + fpsTimer.getFPS();
	});
	fpsTimer.start();
});