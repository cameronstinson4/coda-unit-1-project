const	HERO_IMAGE = 'assets/hero.png',
		PLATFORM_IMAGE = 'assets/platform.png',
		WALL_IMAGE = 'assets/wall-sprites.png';

function _game()
{
	window.Game = this;
	var self = this,
		ticks = 0,
		canvas,
		stage,
		world,
		hero,
		w = getWidth(),
		h = getHeight(),
		assets = [],
		keyDown = false,
		key = {
          right: false,
          left: false,
          up: false,
          down: false
		};
		
	// holds all collideable objects
	var collideables = [];
	self.getCollideables = function() { return collideables; };

	// starts to load all the assets
	self.preloadResources = function() {
		self.loadImage(HERO_IMAGE);
		self.loadImage(PLATFORM_IMAGE);
		self.loadImage(WALL_IMAGE);
	}

	var requestedAssets = 0,
		loadedAssets = 0;
	// loads the assets and keeps track 
	// of how many assets where there to
	// be loaded
	self.loadImage = function(e) {
		var img = new Image();
		img.onload = self.onLoadedAsset;
		img.src = e;

		assets[e] = img;

		++requestedAssets;
	}
	// each time an asset is loaded
	// check if all assets are complete
	// and initialize the game, if so
	self.onLoadedAsset = function(e) {
		++loadedAssets;
		if ( loadedAssets == requestedAssets ) {
			self.initializeGame();
		}
	}

	self.initializeGame = function() {
		// creating the canvas-element
		canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		document.body.appendChild(canvas);

		// initializing the stage
		stage = new createjs.Stage(canvas);
		world = new createjs.Container();
		stage.addChild(world);

		// creating the Hero, and assign an image
		// also position the hero in the middle of the screen
		hero = new Hero(assets[HERO_IMAGE]);

		self.reset();

		// Setting the listeners
		if ('ontouchstart' in document.documentElement) {
			canvas.addEventListener('touchstart', function(e) {
				self.handleKeyDown();
			}, false);

			canvas.addEventListener('touchend', function(e) {
				self.handleKeyUp();
			}, false);
		} else {
			document.onkeydown = self.handleKeyDown;
			document.onkeyup = self.handleKeyUp;
			document.onmousedown = self.handleKeyDown;
			document.onmouseup = self.handleKeyUp;
		}

		createjs.Ticker.addEventListener("tick", this.handleTick);
		createjs.Ticker.setFPS(60);
	}
	self.reset = function()
	{
		collideables = [];
		self.lastPlatform = null;
		world.removeAllChildren();
		world.x = world.y = 0;

		hero.x = 50;
		hero.y = h/2 + 50;
		hero.reset();
		world.addChild(hero);

		var numPlatforms = Math.ceil(canvas.width / assets[PLATFORM_IMAGE].width) + 1;

		// add a platform for the hero to collide with
		//self.addPlatform(50 - assets[PLATFORM_IMAGE].width/2, h/1.25);

		for ( var i = 0; i < numPlatforms; i++ ) {
			var atX = assets[PLATFORM_IMAGE].width*i;
			var atY = h/1.25;
			self.addPlatform(atX,atY);
		}
	}
	self.handleTick = function(e)
	{
		ticks++;
		hero.tick();
		hero.move(key.up, key.right, key.down, key.left);

		// if the hero "leaves" it's bounds of
		// screenWidth * 0.3 and screenHeight * 0.3(to both ends)
		// we will reposition the "world-container", so our hero
		// is allways visible
		if ( hero.x > w*.3 ) {
			world.x = -hero.x + w*.3;
		}
		if ( hero.y > h*.7 ) {
			world.y = -hero.y + h*.7;
		} else if ( hero.y < h*.3 ) {
			world.y = -hero.y + h*.3;
		}

		for ( var c = 0; c < collideables.length; c++ ) {
			var p = collideables[c];
			if ( p.localToGlobal(p.image.width,0).x < -10 ) {
				self.movePlatformToEnd(p);
			}
		}

		stage.update();
	}
	
	// this method adds a platform at the
	// given x- and y-coordinates and adds
	// it to the collideables-array
	self.lastPlatform = null;
	self.addPlatform = function(x,y) {
		x = Math.round(x);
		y = Math.round(y);

		var spriteSheet = new createjs.SpriteSheet({
			images: ["assets/wall-sprites.png"],
			frames: {width:16, height:16},
			animations: {
				run: [0, 1]
			}
		});
		var animation = new createjs.Sprite(spriteSheet, "run");

		animation.play();	
		animation.x = 100;
		animation.y = 100;
		spriteSheet.getAnimation("run").frequency = 0;
		spriteSheet.getAnimation("run").next = "run";
		animation.gotoAndStop("run");
		stage.addChild(animation);

		//var wallImage = createjs.SpriteSheetUtils.extractFrame(wallSheet, 0);

		var platform = new createjs.Bitmap(assets[PLATFORM_IMAGE]);
		platform.x = x;
		platform.y = y;
		platform.snapToPixel = true;

		world.addChild(platform);
		collideables.push(platform);
		self.lastPlatform = platform;
	}
	self.movePlatformToEnd = function(platform) {
		platform.x = self.lastPlatform.x + platform.image.width;
		platform.y = self.lastPlatform.y;
		self.lastPlatform = platform;
	}

	self.handleKeyDown = function(e)
	{

		if (e.keyCode === 39) {
			key.right = true;
		} else if (e.keyCode === 37) {
			key.left = true;
		}
		if (e.keyCode === 38) {
			key.up = true;
		} else if (e.keyCode === 40) {
			key.down = true;
		}
	}

	self.handleKeyUp = function(e)
	{
		
		if (e.keyCode === 39) {
			key.right = false;
		} else if (e.keyCode === 37) {
			key.left = false;
		}
		if (e.keyCode === 38) {
			key.up = false;
		} else if (e.keyCode === 40) {
			key.down = false;
		}
	}

	self.preloadResources();
};

new _game();