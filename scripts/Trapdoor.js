define(["Compose", "Vector2", "Logger", "Entity", "Animation"], function(Compose, Vector2, Logger, Entity, Animation) {

	var Trapdoor = Compose(Entity, function(game, json) {
		this.game = game;
		this.trapdoor = json;
		this.triggerId = json.triggerId;
		this.animation = new Animation(game, json);
	},
	{
		init: function() {
			this.game.getEntity(this.triggerId).addTriggerable(this);
			//this.setLoc(new Vector2(250, 250));
		},

		activate: function(on) {
			if (on) {
				Logger.log("trapdoor on!");
				this.animation.setAnimation("open");
			}
			else {
				Logger.log("trapdoor off!");
				this.animation.setAnimation("closed");
			}
		},

		update: function(dt) {
			this.animation.update(dt);
			// do stuff here
		},

		draw: function(ctx) {
			ctx.save();
			ctx.fillStyle = "#00FFFF";
			ctx.translate(this.getLoc().x, this.getLoc().y);
			ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx);
			ctx.restore();
		}
	});

	return Trapdoor;
});