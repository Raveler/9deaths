define(["Compose", "Vector2", "Layer", "Ground", "Player", "Loader", "Wall"], function(Compose, Vector2, Layer, Ground, Player, Loader, Wall) {
	
	var Renderer = Compose(function(game, json) {

		// the game
		this.game = game;

		// loader
		this.loader = new Loader();

		// go over all grounds
		this.grounds = [];
		for (var i = 0; i < json.grounds.length; ++i) {
			var ground = new Ground(json.grounds[i]);
			this.grounds.push(ground);
			this.loader.add(ground);
		}

		// go over all walls
		this.walls = [];
		for (var i = 0; i < json.walls.length; ++i) {
			var wall = new Wall(json.walls[i]);
			this.walls.push(wall);
			this.loader.add(wall);
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
			for (var i = 0; i < this.walls.length; ++i) {
				if (!this.walls[i].isBefore(this.game.player)) {
					this.walls[i].draw(ctx);
				}
			}
			this.game.player.draw(ctx);
			for (var i = 0; i < this.walls.length; ++i) {
				if (this.walls[i].isBefore(this.game.player)) {
					this.walls[i].draw(ctx);
				}
			}
		}
	});

	return Renderer;
});