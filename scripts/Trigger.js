define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	var Trigger = Compose(function(game) {
		this.game = game;
		this.activateRange = 10000;

		this.triggers = this.game.json["triggers"];
	},
	{
		checkIfActivated: function() {
			for(var i = 0; i < this.triggers.length; i++) {

				//Logger.log(this.trigger[i]);
			}


			/*if ((((this.game.player.getLoc().x - this.loc.x) * (this.game.player.getLoc().x - this.loc.x))
				+ ((this.game.player.getLoc().y - this.loc.y) * (this.game.player.getLoc().y - this.loc.y))) > this.activateRange) {
				Logger.log("nope");
				return false;
			}*/

			//Logger.log("activated");

			this.animate();
			return true;
		},

		animate: function() {

		},

		draw: function(ctx) {
			ctx.fillStyle = "#0000FF";
			//ctx.fillRect(this.loc.x - 20, this.loc.y - 20, 40, 40);
		}
	});

	return Trigger;
});