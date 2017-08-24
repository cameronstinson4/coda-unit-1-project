(function (window) {
    function Character(image) {
        this.initialize(image);
    }
    Character.prototype = new createjs.Bitmap();

    Character.prototype.Bitmap_initialize = Character.prototype.initialize;
   
    Character.prototype.initialize = function (image) {
       	this.reset();

        this.Bitmap_initialize(image);
        this.name = 'Cat';
        this.snapToPixel = true;
        this.left = false;
        this.right = true;
    };
    Character.prototype.reset = function() {
    	this.velocity = {x:0,y:0};
       	this.onGround = false;
		this.doubleJump = false;
    };

	Character.prototype.tick = function () {
        this.velocity.y += 1;
        
        if (this.right === true) {
            this.velocity.x = 2;
        }
        else if (this.left === true) {
            this.velocity.x = -2;
        }
        
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
			}
		} else {
			// the Character can only be 'onGround'
			// when he's hitting floor and not
			// some ceiling
			if ( moveBy.y >= 0 ) {
				this.onGround = true;
				this.doubleJump = false;
			}
			this.velocity.y = 0;
        }

		moveBy = {x:this.velocity.x, y:0};
		collision = calculateCollision(this, 'x', collideables, moveBy);
        this.x += moveBy.x;
        
        if (this.ticks % 100 === 0) {
            
            if (this.left) {
                this.right = true;
                this.left = false;
            }
            else {
                this.right = false;
                this.left = true;
            }
        }
	};
        

    window.Character = Character;
} (window));