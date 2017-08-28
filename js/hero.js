(function (window) {
    function Hero(image) {
        this.initialize(image);
    }
    Hero.prototype = new createjs.Sprite();

    Hero.prototype.Sprite_initialize = Hero.prototype.initialize;
   
    Hero.prototype.initialize = function (spriteSheet) {
       	this.reset();

        this.Sprite_initialize(spriteSheet);
        this.name = 'Hero';
		this.snapToPixel = true;
		this.gotoAndPlay("run");

    };
    Hero.prototype.reset = function() {
    	this.velocity = {x:0,y:1};
       	this.onGround = false;
		this.doubleJump = false;
    };

	Hero.prototype.tick = function () {
		this.velocity.y += 1;

		// preparing the variables
		var moveBy = {x:0, y:this.velocity.y},
			collision = null,
			collideables = Game.getCollideables();

		collision = calculateCollision(this, 'y', collideables, moveBy);
		// moveBy is now handled by 'calculateCollision'
		// and can also be 0 - therefore we won't have to worry
		this.y += moveBy.y;

		if ( !collision ) {
			if ( this.onGround ) {
				this.onGround = false;
				this.doubleJump = true;
				this.gotoAndPlay("jump");

			}
		} else {
			// the hero can only be 'onGround'
			// when he's hitting floor and not
			// some ceiling
			if ( moveBy.y >= 0 ) {
				this.onGround = true;
				this.doubleJump = false;
				this.gotoAndPlay("run");

			}

			this.velocity.y = 0;
		}

		moveBy = {x:this.velocity.x, y:0};
		collision = calculateCollision(this, 'x', collideables, moveBy);
		this.x += moveBy.x;
	};

    Hero.prototype.jump = function() {
    	// if the hero is "on the ground"
    	// let him jump, physically correct!
		if ( this.onGround ) {
			this.velocity.y = -17;
			this.onGround = false;
			this.doubleJump = true;
		// we want the hero to be able to
		// jump once more when he is in the
		// air - after that, he has to wait
		// to lang somewhere on the ground
		} else if ( this.doubleJump ) {
			this.velocity.y = -17;
			this.doubleJump = false;
		}
	};

	Hero.prototype.move = function(right, left) {

			if (right === true) {
				this.velocity.x = 17;
				this.spriteSheet = rightDog();
				this.play();
			}
			else if (left === true) {
				this.velocity.x = -17;
				this.spriteSheet = leftDog();
				this.play();

			}
			else {
				this.stop();
				this.velocity.x = 0;
			}
		}

    window.Hero = Hero;
} (window));