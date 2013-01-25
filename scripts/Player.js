define(["Vector2"], function(Vector2) {

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