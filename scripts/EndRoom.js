define(["Compose", "Logger", "Vector2", "Animation", "Particle", "Random"], function(Compose, Logger, Vector2, Animation, Particle, Random) {
	
	var EndRoom = Compose(function constructor(game, json) {
		this.game = game;
		//this.animation = new Animation(game, json);
		this.skipMe = true;
		this.dead = false;
		this.started = false;
		this.loc = new Vector2(json.loc);
		this.dialog = false;
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
			Logger.log(this.game.player.getBaseX() + " vs " + (this.room.getLoc().x - this.room.getWidth() + 400));
			if (!this.dialog && this.game.player.getBaseX() > this.room.getLoc().x - this.room.getWidth() + 400) {
				this.dialog = true;
				this.game.player.speed = 0;
			}
		},

		getLoc: function() {
			return this.loc;
		},

		getBaseX: function() {
			return this.loc.x;
		},

		draw: function(ctx, z) {
			if (this.dialog) {
				ctx.font = "20px Finger Paint";
				ctx.fillStyle = "#920b0b";
				var x = this.room.getLoc().x - this.room.getWidth() + 530;
				ctx.fillText("One who does not know his own name...", x, -180);
				ctx.fillText("... is not worthy of eternal life.", x+100, -150);
			}

			/*if (this.isDead()) {
				return;
			}
			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			this.animation.draw(ctx);
			ctx.restore();*/
		}
	});
	
	return EndRoom;
});