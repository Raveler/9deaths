define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	var Trigger = Compose(function(game) {
		this.game = game;
		this.triggers = this.game.json["triggers"].triggers;
	},
	{
		checkIfActivated: function() {
			for(var i = 0; i < this.triggers.length; i++) {
				var trigger = this.triggers[i];

				// If trigger is activated manually, only activate if spacebar is pressed
				if (trigger.activated && !(this.game.isKeyDown(this.game.keyCodes.space) == true)) {
					if (trigger.active) {
						Logger.log("Disabled trigger " + i);
						trigger.active = false;
					}
					continue;
				}

				// Check distance to trigger
				if ((((this.game.player.getLoc().x - trigger.location[0]) * (this.game.player.getLoc().x - trigger.location[0]))
						+ ((this.game.player.getLoc().y - trigger.location[1]) * (this.game.player.getLoc().y - trigger.location[1]))) > trigger.activateRange) {
					if (trigger.active) {
						Logger.log("Disabled trigger " + i);
						trigger.active = false;
					}
					continue;
				}

				if (trigger.active == false) {
					trigger.active = true;
					Logger.log("Activated trigger " + i);
					this.animate();
				}
			}
		},

		animate: function() {

		},

		debugDraw: function(ctx) {
			for(var i = 0; i < this.triggers.length; i++) {
				var trigger = this.triggers[i];
				ctx.fillStyle = "#0000FF";
				ctx.fillRect(trigger.location[0] - 20, trigger.location[1] - 20, 40, 40);
			}
		}
	});

	return Trigger;
});