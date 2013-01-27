define(["Compose", "Logger", "Vector2", "Animation"], function(Compose, Logger, Vector2, Animation) {
	
	var ContainedAnimation = Compose(function constructor(game, json, loc) {
		this.game = game;
		this.animation = new Animation(game, json);
		this.skipMe = true;
		this.loc = loc;
	},
	{
		getId: function() {
			return "";
		},

		init: function() {
			this.game.entities.push(this);
			this.game.movables.push(this);
		},

		isDead: function() {
			return false;
		},

		update: function(dt) {
			this.animation.update(dt);
		},

		getLoc: function() {
			return this.loc;
		},

		getBaseX: function() {
			return this.loc.x;
		},

		draw: function(ctx, z) {
			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			this.animation.draw(ctx);
			ctx.restore();
		}
	});
	
	return ContainedAnimation;
});