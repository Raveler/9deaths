define(["Compose", "Vector2", "Logger", "Entity", "Animation"], function(Compose, Vector2, Logger, Entity, Animation) {

	var Trigger = Compose(Entity, function(game, json) {
		this.game = game;
		this.trigger = json;
		this.triggerables = [];
		this.activated = json.activated;
		this.active = json.active;
		this.activateRange = json.activateRange;
		this.animation = new Animation(game, json);
		this.toggled = json.toggled;
		this.keyProcessed = false;
	},
	{
		init: function() {
			//this.setLoc(new Vector2(250, 250));
		},

		addTriggerable: function(obj) {
			this.triggerables.push(obj);
		},

		update: function(dt) {
			this.animation.update(dt);

			if (this.toggled) {
				// If trigger is activated manually, only activate if spacebar is pressed
				if (this.activated && !(this.game.isKeyDown(this.game.keyCodes.space) == true)) {
					this.keyProcessed = false;
					return;
				}

				// Check distance to trigger
				if ((((this.game.player.getLoc().x - this.getLoc().x) * (this.game.player.getLoc().x - this.getLoc().x))
						+ ((this.game.player.getLoc().y - this.getLoc().y) * (this.game.player.getLoc().y - this.getLoc().y))) > this.activateRange) {
					this.keyProcessed = false;
					return;
				}

				if (this.keyProcessed == false) {
					this.keyProcessed = true;

					this.active = !this.active;
					for (var i = 0; i < this.triggerables.length; ++i) {
						this.triggerables[i].activate(this.active);
					}
					if (this.active) {
						this.animation.setAnimation("on");
						Logger.log("Activated trigger");
					} else {
						this.animation.setAnimation("off");
						Logger.log("Disabled trigger");
					}	
				}
			} else {
				// If trigger is activated manually, only activate if spacebar is pressed
				if (this.activated && !(this.game.isKeyDown(this.game.keyCodes.space) == true)) {
					if (this.active) {
						for (var i = 0; i < this.triggerables.length; ++i) {
							this.triggerables[i].activate(false);
						}
						this.animation.setAnimation("off");
						Logger.log("Disabled trigger");
						this.active = false;
					}
					return;
				}

				// Check distance to trigger
				if ((((this.game.player.getLoc().x - this.getLoc().x) * (this.game.player.getLoc().x - this.getLoc().x))
						+ ((this.game.player.getLoc().y - this.getLoc().y) * (this.game.player.getLoc().y - this.getLoc().y))) > this.activateRange) {
					if (this.active) {
						Logger.log("Disabled trigger");
						for (var i = 0; i < this.triggerables.length; ++i) {
							this.triggerables[i].activate(false);
						}
						this.animation.setAnimation("off");
						this.active = false;
					}
					return;
				}

				if (this.active == false) {
					this.active = true;
					for (var i = 0; i < this.triggerables.length; ++i) {
						this.triggerables[i].activate(true);
					}
					this.animation.setAnimation("on");
					Logger.log("Activated trigger");
				}
			}
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

	return Trigger;
});