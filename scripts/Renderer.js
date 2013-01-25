define(["Compose", "Vector2", "Layer", "Ground", "Player", "Loader"], function(Compose, Vector2, Layer, Ground, Player, Loader) {
	
	var Renderer = Compose(function(game, json) {

		// the game
		this.game = game;

		// loader
		this.loader = new Loader();

		// go over all grounds
		this.grounds = [];
		for (var i = 0; i < json.grounds.length; ++i) {
			var ground = new ground(json.grounds[i]);
			this.grounds.push(ground);
			this.loader.add(ground);
		}

		// add done callback
		this.loaded = false;
		this.loader.addCallback(this);
	},
	{
		onDone: function() {
			this.loaded = true;
		},

		isLoaded: function() {
			return this.loaded;
		},

		draw: function(ctx) {
			if (!this.loaded) return;
			for (var i = 0; i < this.grounds.length; ++i) {
				this.grounds[i].draw(ctx);
			}

			ctx.fillStyle = "#FF0000";
			ctx.fillRect(300, 300, 200, 200);
		}
	});

	return Renderer;
});