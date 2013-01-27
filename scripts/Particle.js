define(["Compose", "Logger", "Random", "Vector2"], function(Compose, Logger, Random, Vector2) {

	var Particle = Compose(function constructor(game, imageName, point, rotation, scale, speed, direction, directionChange, angularVelocity) {
		this.game = game;
		this.image = this.game.images[imageName];

		this.width = this.image.width;
		this.height = this.image.height;

		this.position = new Vector2(point.x - (this.width / 2), point.y - (this.height / 2) + 15);
		this.originalPosition = this.position.copy();
		this.rotation = rotation;
		this.scale = scale;
		this.angularVelocity = angularVelocity;
		this.lifeTime = 250;
		this.skipMe = true;
		this.speed = speed;
		this.direction = direction;
		this.directionChange = directionChange;
	},
	{

		update: function(dt) {
			this.lifeTime -= dt;
			/*this.velocity.x *= 0.995;
			this.velocity.y += 0.075;*/

			this.direction += this.directionChange;

			this.position.x += this.speed * Math.cos(this.direction);
			this.position.y += this.speed * Math.sin(this.direction);
			this.rotation = this.rotation + this.angularVelocity;
		},

		getBaseX: function() {
			return this.position.x;
		},

		getId: function() {
			return "particle";
		},

		getLoc: function() {
			return this.originalPosition;
		},

		draw: function(ctx) {
			ctx.save();

			 // Translate to midpoint before rotating
			ctx.translate(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
			ctx.rotate(this.rotation);
			ctx.translate(-(this.width / 2), -(this.height / 2));
			ctx.scale(this.scale, this.scale);
			ctx.drawImage(this.image, 0, 0, this.width, this.height);

			ctx.restore();
		},

		isDead: function() {
			return this.lifeTime <= 0;
		}

	});
	
	return Particle;
});