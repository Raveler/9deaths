define(["Compose", "Vector2", "Logger", "Entity", "Animation", "ContainedAnimation"], function(Compose, Vector2, Logger, Entity, Animation, ContainedAnimation) {

	var Monster = Compose(Entity, function(game, json) {
		this.game = game;
		//this.location = new Vector2(json.loc[0], json.loc[1]);
		this.activeRange = json.activeRange;
		this.xlimit = json.xlimit;
		this.death = false;
		this.eating = false;
		this.animation = new Animation(game, json);
		this.game.monsters.push(this);
		this.skipMe = true;

	},
	{
		init: function() {
			this.game.movables.push(this);
		},

		update: function(dt) {
			this.animation.update(dt);
			// eating
			/*if (this.audio.paused && !this.death) {
				this.audio.play();
			}*/


			var moveVector = this.game.player.loc.subtract(this.getLoc());
			if (moveVector.length() < this.activeRange && this.eating && !this.death) {
				this.game.audio.Monstereating.play();
			}

			// Ignore if death
			if (this.death || this.eating) {
				return;
			}

			var moveVector = this.game.player.loc.subtract(this.getLoc());
			if (moveVector.length() > this.activeRange) {
				this.animation.setAnimation("idle");
				this.animation.setFlip(true);
				return;
			}

			this.game.audio.Monstergrowl.play();

			
			if ((Math.abs(moveVector.x) < 110) && (Math.abs(moveVector.y) < 15)) {
				this.game.player.die();
				this.eating = true;
				this.eatingAnimation = new ContainedAnimation(this.game, this.game.json["MonsterEating"], this.getLoc());
				this.eatingAnimation.animation.setAnimation("eating");
				this.eatingAnimation.animation.setFlip(true);
				this.eatingAnimation.init();
				return;
			}

			moveVector = moveVector.normalize();

			if (moveVector.x > 0) {
				this.animation.setAnimation("walk");
				this.animation.setFlip(false);
			} else {
				this.animation.setAnimation("walk");
				this.animation.setFlip(true);
			}

			// Scale monster speed
			moveVector = moveVector.multiply(2.7);

			var newLocation = this.getLoc().add(moveVector);
			if (this.game.isValidAndSafePosition(newLocation) && (newLocation.x > this.xlimit[0]) && (newLocation.x < this.xlimit[1])) {
				this.setLoc(newLocation);
				return;
			}

			newLocation = new Vector2(this.getLoc().x + (moveVector.x / Math.abs(moveVector.x)), this.getLoc().y);
			if (this.game.isValidAndSafePosition(newLocation) && (newLocation.x > this.xlimit[0]) && (newLocation.x < this.xlimit[1])) {
				this.setLoc(newLocation);
				return;
			}

			newLocation = new Vector2(this.getLoc().x, this.getLoc().y + (moveVector.y / Math.abs(moveVector.y)));
			if (this.game.isValidAndSafePosition(newLocation) && (newLocation.x > this.xlimit[0]) && (newLocation.x < this.xlimit[1])) {
				this.setLoc(newLocation);
				return;
			}
		},

		init: function() {

		},

		die: function() {
			if (this.eatingAnimation instanceof Object) {
				this.eatingAnimation.die();
			}
			this.death = true;
		},

		draw: function(ctx) {
			// Ignore if death
			if (this.death || this.eating) {
				return;
			}

			ctx.save();
			//ctx.fillStyle = "#00FF00";
			ctx.translate(this.getLoc().x, this.getLoc().y);
			//ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx, this.z);
			ctx.restore();

			//ctx.fillStyle = "#00FFF0";
			//ctx.fillRect(this.getLoc().x - 20, this.getLoc().y - 20, 40, 40);
		}
	});

	return Monster;
});