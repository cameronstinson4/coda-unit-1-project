(function (window) {
    function Hero(spriteSheet) {
        this.initialize(spriteSheet);
    }
    Hero.prototype = new createjs.Sprite();

    Hero.prototype.Sprite_initialize = Hero.prototype.initialize;
   
    Hero.prototype.initialize = function (spriteSheet) {
       	this.reset();

        this.Sprite_initialize(spriteSheet);
        this.name = 'Hero';
        this.snapToPixel = true;
	};

    Hero.prototype.reset = function() {
    	this.velocity = {x:0,y:0};
    };

	Hero.prototype.tick = function () {

		this.velocity.y += 1;
		var collision = null;

		// preparing the variables
		collideables = Game.getCollideables();

		// collision = calculateCollision(this, 'y', collideables, moveBy);
		// this.y += moveBy.y;

		// moveBy = {x:this.velocity.x, y:0};
		// collision = calculateCollision(this, 'x', collideables, moveBy);
		// this.x += moveBy.x;

		if (!collisionX(this, collideables, this.velocity.x)) {
			this.x += this.velocity.x;

		}
		if (!collisionY(this, collideables, this.velocity.y)) {
			this.y += this.velocity.y;

		}
	};

	Hero.prototype.move = function(up, right, down, left) {
			if (up === true) {
				this.velocity.y = -17; 
			}
			else if (down === true){
				this.velocity.y = 17;
			}
			else {
				this.velocity.y = 0;
			}

			if (right === true) {
				this.velocity.x = 17;
			}
			else if (left === true) {
				this.velocity.x = -17;
			}
			else {
				this.velocity.x = 0;
			}
		}

    window.Hero = Hero;
} (window));