define["Vector2", "Layer", "Ground", "Player", "Loader"], function(Vector2, Layer, Ground, Player, Loader) {
	
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

		// player
		this.player = new Player(new Vector2(json.playerLoc.x, json.playerLoc.y));

		// add done callback
		this.loaded = false;
		this.loader.addCallback(function() {
			this.loaded = true;
		}.bind(this));
	},
	{
		isLoaded: function() {
			return this.loaded;
		},

		draw: function(ctx) {
			if (!this.loaded) return;
			ctx.save();
			ctx.translate(-this.player.getLoc().x, -this.player.getLoc().y);
			for (var i = 0; i < this.grounds.length; ++i) {
				this.grounds[i].draw(ctx);
			}
			ctx.restore();
		}
	});

	return Renderer;
});