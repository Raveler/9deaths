define(["Compose", "Vector2", "Logger", "Entity", "Animation", "Random"], function(Compose, Vector2, Logger, Entity, Animation, Random) {

	var Door = Compose(Entity, function(game, json) {
		this.animation = new Animation(game, json);
		this.skipMe = true;
	},
	{
		init: function() {
			this.game.movables.push(this);
		},

		update: function(dt) {
			
			// compute x distance from door
			var dx = Math.abs(this.game.player.getBaseX() - this.getLoc().x);
			var dy = this.getLoc().y - this.game.player.getLoc().y;
			if (dx < 150 && dy > 0) {
				this.game.audio.Door.play();
				this.animation.setAnimation("open");
			}
			else {
				this.animation.setAnimation("closed");
			}

			this.animation.update(dt);
		},


		draw: function(ctx) {
			ctx.save();
			ctx.translate(this.getLoc().x, this.getLoc().y - 40);
			this.animation.draw(ctx);
			ctx.restore();
		}
	});

	return Door;
});