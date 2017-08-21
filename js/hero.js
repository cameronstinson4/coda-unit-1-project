(function (window) {
    function Hero(image) {
        this.initialize(image);
    }
    Hero.prototype = new createjs.Bitmap();

    Hero.prototype.Bitmap_initialize = Hero.prototype.initialize;
   
    Hero.prototype.initialize = function (image) {
       	this.reset();

        this.Bitmap_initialize(image);
        this.name = 'Hero';
        this.snapToPixel = true;
    };
    Hero.prototype.reset = function() {
    	this.velocity = {x:0,y:0};
    };

	Hero.prototype.tick = function () {

		this.velocity.y += 5;

		// preparing the variables
		var moveBy = {x:0, y:this.velocity.y},
			collision = null,
			collideables = Game.getCollideables();

		collision = calculateCollision(this, 'y', collideables, moveBy);
		this.y += moveBy.y;

		moveBy = {x:this.velocity.x, y:0};
		collision = calculateCollision(this, 'x', collideables, moveBy);
		this.x += moveBy.x;
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