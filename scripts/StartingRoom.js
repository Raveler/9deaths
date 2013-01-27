define(["Compose", "Logger", "Vector2", "Animation", "Particle", "Random"], function(Compose, Logger, Vector2, Animation, Particle, Random) {
	
	var StartingRoom = Compose(function constructor(game) {
		this.game = game;
	},
	{
		getId: function() {
			return "";
		},

		init: function() {
			/*this.game.entities.push(this);
			this.game.movables.push(this);*/
		},

		isDead: function() {
			return this.dead;
		},

		die: function() {
			this.dead = true;
		},

		update: function(dt) {
		},

		getLoc: function() {
			return this.room.getLoc();
		},

		getBaseX: function() {
			return this.room.getBaseX();
		},

		draw: function(ctx, z) {
			ctx.font = "24px Finger Paint";
			ctx.fillStyle = "#920b0b";
			ctx.textAlign = "center";
			ctx.save();
			//ctx.translate(3800, -100);
			ctx.translate(2800, -150);
			ctx.rotate(-0.1);
			ctx.fillText("So you want\n", 0, 0);
			ctx.fillText("eternal life, " + this.game.player.name + "?", 0, 20);
			ctx.restore();

			// last deaths
			for (var i = 0; i < 4; ++i) {
			if (i >= this.game.lastDeaths.length) continue;
			var name = this.game.lastDeaths[this.game.lastDeaths.length-1-i]; 
			ctx.font = "18px Croissant One";
			ctx.fillStyle = "#696660";
			ctx.textAlign = "center";
			ctx.fillText(name, 1000 + i * 190, -150);
			}
		}
	});
	
	return StartingRoom;
});