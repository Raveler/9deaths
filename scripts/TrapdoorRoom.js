define(["Compose", "Vector2", "Logger", "Entity", "Animation"], function(Compose, Vector2, Logger, Entity, Animation) {

	var TrapdoorRoom = Compose(Entity, function(game, json) {

		// subobjects
		this.trapdoorJson = json.trapdoor;
		this.triggerJson = json.trigger;

		// number of triggers
		this.triggers = json.triggers;

		// create the trapdoors
		var id = json.id;
		var pitWidth = 146;
		for (var x = 0; x < 5; ++x) {
			for (var y = 0; y < 5; ++y) {
				this.trapdoorJson.id = id + "-trapdoor-" + x + y;
				Logger.log(this.trapdoorJson.id);
				this.trapdoorJson.loc = [this.getLoc().x + x * pitWidth + y * 60, this.getLoc().y + y * 60];
				this.game.createEntity(this.trapdoorJson);
			}
		}

		// create the triggers
		var width = 500;
		for (var i = 0; i < this.triggers.length; ++i) {
			this.triggerJson.id = id + "-trigger-" + i;
			this.triggerJson.loc = [this.getLoc().x + (i / (this.triggers.length-1)) * width + pitWidth/2, 0];
			this.game.createEntity(this.triggerJson);
		}
	},
	{
		init: function() {

			// link the different trapdoors to the triggers
			for (var i = 0; i < this.triggers.length; ++i) {
				var triggerArray = this.triggers[i];
				var trigger = this.game.getEntity(this.getId() + "-trigger-" + i);
				//Logger.log(trigger);
				for (var j = 0; j < triggerArray.length; ++j) {
					var trapdoorArray = triggerArray[j];
					var trapdoor = this.game.getEntity(this.getId() + "-trapdoor-" + trapdoorArray[0] + trapdoorArray[1]);
					trigger.addTriggerable(trapdoor);
				}
			}

		},

		update: function(dt) {
		},

		draw: function(ctx) {
		}
	});

	return TrapdoorRoom;
});