define(["Compose", "Logger", "Vector2"], function(Compose, Logger, Vector2) {

	var Area = Compose(function constructor(game, areaName) {
		this.game = game;
		this.areaData = this.game.json[areaName];

		logger.log("starting location:" + areaData.startingLocation);

		logger.log("regions:" + areaData.regions[0].path);

		logger.log("layers:" + areaData.layers);


		
		// Shift so point is center of animation
		//this.position = new Vector2(point.x - (this.animation.width / 2), point.y - (this.animation.height / 2));
		//this.scale = scale;
		//this.rotation = rotation;
	},
	{

		/*draw: function(ctx) {
			
		},*/


		isInArea: function(position) {

			var a = areaData.regions[0].path[0];
			var b = areaData.regions[0].path[1];

			//areaData.regions[0].path[1].x
			//areaData.regions[0].path[1].y


			if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0) {
				Logger.log("passed");
			} else {
				Logger.log("failed");
			}


			//return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;


		},




	});
	
	return Area;
});