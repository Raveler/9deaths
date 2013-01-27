define(["Compose", "Vector2", "Logger", "Entity", "Animation", "Random"], function(Compose, Vector2, Logger, Entity, Animation, Random) {

	var Door = Compose(Entity, function(game, json) {
		this.animation = new Animation(game, json);
	},
	{
		init: function() {
		},

		update: function(dt) {
			this.animation.update(dt);
		},

		draw: function(ctx) {
		}
	});

	return Door;
});