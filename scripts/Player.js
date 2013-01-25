define(["Compose", "Vector2"], function(Compose, Vector2) {

	var Player = Compose(function(loc) {
		this.loc = loc;
	},
	{
		getLoc: function() {
			return this.loc;
		}
	});

	return Player;
});