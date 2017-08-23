
var		HERO_IMAGE = 'assets/dog.png',
		PLATFORM_IMAGE = 'assets/platform.png',
		BACKGROUND_IMAGE = "assets/snow.png",
		PARALLAX_IMAGE = "assets/snowflakes.png",
		BASE_WIDTH = 800,
		BASE_HEIGHT = 400,
		GRID_HORIZONTAL = 8,
		GRID_VERTICAL = 4;

function _game()
{
	window.Game = this;
	var self = this,
		w = getWidth(),
		h = getHeight(),
		ticks = 0,
		canvas,
		ctx,
 		assets = [],
		stage,
		world,
		hero,
		keyDown = false,
		key = {
          right: false,
          left: false,
          up: false,
          down: false
		}, 
		score = 0,
		text,
		background;

	self.width = w;
	self.height = h;

	// holds all collideable objects
	var collideables = [];
	self.getCollideables = function() { return collideables; };

	// starts to load all the assets
	self.preloadResources = function() {
		self.loadImage(HERO_IMAGE);
		self.loadImage(PLATFORM_IMAGE);
		self.loadImage(BACKGROUND_IMAGE);
		self.loadImage(PARALLAX_IMAGE);
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
		document.getElementById("board").appendChild(canvas);

		// initializing the stage
		stage = new createjs.Stage(canvas);

		background = self.setupBg();
		
		world = new createjs.Container();
		stage.addChild(world);

		// creating the Hero, and assign an image
		// also position the hero in the middle of the screen
		hero = new Hero(assets[HERO_IMAGE]);

		self.reset();

		text = new createjs.Text("Score: ", "20px Courier New", "#0000ff");
		text.x = 10;
		text.y = 20;
		text.textBaseline = "alphabetic";
		stage.addChild(text);

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

		createjs.Ticker.addEventListener("tick", this.tick);
		createjs.Ticker.setFPS(60);
	}

	self.reset = function() {
		collideables = [];
		self.lastPlatform = null;
		world.removeAllChildren();
		world.x = world.y = 0;

		hero.x = 150 ;
		hero.y = h/2 + 50;
		hero.reset();
		world.addChild(hero);

		// add a platform for the hero to collide with
		self.addPlatform(10, h/1.25);

		var c, l = w / (assets[PLATFORM_IMAGE].width * 1.5) + 2, atX=0, atY = h/1.25;

		for ( c = 1; c < l; c++ ) {
			var atX = (c-.5) * assets[PLATFORM_IMAGE].width*2 + (Math.random()*assets[PLATFORM_IMAGE].width-assets[PLATFORM_IMAGE].width/2);
			var atY = atY + (Math.random() * 300 - 150);
			self.addPlatform(atX,atY);
		}
	}

	self.tick = function(e)
	{
		var c,p,l;

		ticks++;
		hero.tick();

		if ( hero.y > h*3 ) {
			self.reset();
			return;
		}

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

		l = collideables.length;
		for ( c = 0; c < l; c++ ) {
			p = collideables[c];
			if ( p.localToGlobal(p.image.width,0).x < -10 ) {
				self.movePlatformToEnd(p);
			}
		}
	
		hero.move(key.up, key.right, key.down, key.left);
		score = hero.x;

		text.text = "Score: " + (score - ticks);

		if (score > 10000) {
			self.onWin();
		}
		self.updateBg();

		stage.update();
	}

	self.updateBg = function() {

		background.x = (world.x * .30); // horizontal

		for (var i = 0; i < background.children.length; i++) {
			if ( background.children[i].localToGlobal(background.children[i].image.width,0).x < self.width ) {
				let bitmap = new createjs.Bitmap(background.children[i].image.src);
				bitmap.x = background.children[i].x + background.children[i].image.width;
				background.addChild(bitmap);
			}

			background.children[i].x = (world.x * .20 * (i+1));
		}
	}

	// this method adds a platform at the
	// given x- and y-coordinates and adds
	// it to the collideables-array
	self.lastPlatform = null;
	self.addPlatform = function(x,y) {
		x = Math.round(x);
		y = Math.round(y);

		var platform = new createjs.Bitmap(assets[PLATFORM_IMAGE]);
		platform.x = x;
		platform.y = y;
		platform.snapToPixel = true;


		world.addChild(platform);
		collideables.push(platform);
		self.lastPlatform = platform;
	}
	
	self.movePlatformToEnd = function(platform) {
		platform.x = self.lastPlatform.x + platform.image.width*2 + (Math.random()*platform.image.width*2 - platform.image.width);
		platform.y = self.lastPlatform.y + (Math.random() * 300 - 150);
		self.lastPlatform = platform;
	}

	self.handleKeyDown = function(e)
	{

		if (e.keyCode === 39) {
			key.right = true;
		} else if (e.keyCode === 37) {
			key.left = true;
		}
		if (e.keyCode === 38 || e.keyCode === 13) {
			keyDown = true;
			hero.jump();
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

		keyDown = false;

	}

	self.onWin = function() {
		world.removeAllChildren();
		stage.removeAllChildren();
		let text = new createjs.Text("You Win!", "20px Courier New", "#0000ff");
		text.x = canvas.width/2;
		text.y = canvas.height/2;
		stage.addChild(text);
		stage.update();
	}

	self.setupBg = function() {
		var bg = new createjs.Container();
		bg.snapToPixel = true;
		var bitmap = new createjs.Bitmap(assets[BACKGROUND_IMAGE]);

		bg.addChild(bitmap);
		bitmap = new createjs.Bitmap(assets[PARALLAX_IMAGE]);

		bg.addChild(bitmap);

		bg.width = bitmap.image.width;
		bg.height = bitmap.image.height;

		stage.addChild(bg);

		// return the background
		return bg;
}

	self.preloadResources();
	
};

new _game();