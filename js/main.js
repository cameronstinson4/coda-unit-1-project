
var		HERO_IMAGE = 'assets/dog.png',
		PLATFORM_IMAGE = 'assets/platform.png',
		BACKGROUND_IMAGE = "assets/snow.png",
		PARALLAX_IMAGE = "assets/snowflakes.png",
		NPC_IMAGE = "assets/cat.png";

function _game()
{
	window.Game = this;
	var self = this,
		ticks = 0,
		canvas,
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
		scoreboard,
		background,
		npcs = [];

	// holds all collideable objects
	var collideables = [];
	self.getCollideables = function() { return collideables; };

	// starts to load all the assets
	self.preloadResources = function() {
		self.loadImage(HERO_IMAGE);
		self.loadImage(PLATFORM_IMAGE);
		self.loadImage(BACKGROUND_IMAGE);
		self.loadImage(PARALLAX_IMAGE);
		self.loadImage(NPC_IMAGE);

	}

	var requestedAssets = 0;
	var loadedAssets = 0;
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
		canvas.width = getWidth();
		canvas.height = getHeight();
		document.getElementById("board").appendChild(canvas);

		// initializing the stage
		stage = new createjs.Stage(canvas);

		background = self.setupBg();
		
		world = new createjs.Container();
		stage.addChild(world);

		// creating the Hero, and assign an image
		// also position the hero in the middle of the screen
		hero = new Hero(assets[HERO_IMAGE]);
		npcs.push(new Character(assets[NPC_IMAGE]));
		collideables.push(npcs[0]);

		self.reset();

		scoreboard = new createjs.Text("Score: ", "20px Courier New", "#0000ff");
		scoreboard.x = 10;
		scoreboard.y = 20;
		scoreboard.textBaseline = "alphabetic";
		stage.addChild(scoreboard);

		// Setting the listeners
	
		self.setupListeners();

		self.createStartingPlatform();

		createjs.Ticker.addEventListener("tick", this.tick);
		createjs.Ticker.setFPS(60);
	}

	//Sets up listeners for keyboard and touch events
	self.setupListeners = function() {
		//Setup keyboard listeners
		document.onkeydown = self.handleKeyDown;
		document.onkeyup = self.handleKeyUp;

		//setup touch listeners
		if ('ontouchstart' in document.documentElement) {
			document.getElementById("left").addEventListener('touchstart', function(e) { key.left = true });
			document.getElementById("left").addEventListener('touchend', function(e) { key.left = false });
			document.getElementById("right").addEventListener('touchstart', function(e) { key.right = true });
			document.getElementById("right").addEventListener('touchend', function(e) { key.right = false });
		}

		document.getElementById("jump").addEventListener("touchstart", function() { hero.jump()});

	}

	//Handles keydown events from the keyboard
	self.handleKeyDown = function(e)
	{
		if (e.keyCode === 39) {
			key.right = true;
		} else if (e.keyCode === 37) {
			key.left = true;
		}
		if (e.keyCode === 38) {
			hero.jump();
		}
	}

	//Handles keydown events from the keyboard
	self.handleKeyUp = function(e)
	{
		if (e.keyCode === 39) {
			key.right = false;
		} else if (e.keyCode === 37) {
			key.left = false;
		}

		keyDown = false;

	}

	self.createStartingPlatform = function() {

	}

	self.reset = function() {
		collideables = [];
		self.lastPlatform = null;
		world.removeAllChildren();
		world.x = 0;
		world.y = 0;

		hero.x = 150;
		hero.y = canvas.height/2 + 50;
		hero.reset();
		world.addChild(hero);
		
		for (var i = 0; i < npcs.length; i++) {
			npcs[i].x = 150 ;
			npcs[i].y = canvas.height/2 + 50;
			npcs[i].reset();
			world.addChild(npcs[i]);
		}

		// add a platform for the hero to collide with
		self.addPlatform(10, canvas.height/1.25);

		var length = canvas.width / (assets[PLATFORM_IMAGE].width * 1.5) + 2;
		var atX = 0;
		var atY = canvas.height/1.25;

		for ( let i = 1; i < length; i++ ) {
			var atX = (i-.5) * assets[PLATFORM_IMAGE].width*2 + (Math.random()*assets[PLATFORM_IMAGE].width-assets[PLATFORM_IMAGE].width/2);
			var atY = atY + (Math.random() * 300 - 150);
			self.addPlatform(atX,atY);
		}
	}

	self.tick = function(e)
	{

		ticks++;
		hero.tick();
		for (var i = 0; i < npcs.length; i++) {
			npcs[i].tick();
		}


		if ( hero.y > canvas.height*3 ) {
			self.reset();
			return;
		}

		// if the hero "leaves" it's bounds of
		// screenWidth * 0.3 and screenHeight * 0.3(to both ends)
		// we will reposition the "world-container", so our hero
		// is allways visible
		if ( hero.x > canvas.width*.3 ) {
			world.x = -hero.x + canvas.width*.3;
		}
		if ( hero.y > canvas.height*.7 ) {
			world.y = -hero.y + canvas.height*.7;
		} else if ( hero.y < canvas.height*.3 ) {
			world.y = -hero.y + canvas.height*.3;
		}

		for ( var i = 0; i < collideables.length; i++ ) {
			let c = collideables[i];
			if ( c.localToGlobal(c.image.width,0).x < -10 ) {
				self.movePlatformToEnd(c);
			}
		}
	
		hero.move(key.up, key.right, key.down, key.left);

		score = hero.x;
		scoreboard.text = "Score: " + score;

		if (score > 10000) {
			self.onWin();
		}
		
		canvas.width = getWidth();
		canvas.height = document.getElementById("board").offsetHeight;

		self.updateBg();

		stage.update();
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

	//Sets up the 2 images to create the parallax background
	self.setupBg = function() {
		var bg = new createjs.Container();
		bg.snapToPixel = true;
		var bitmap = new createjs.Bitmap(assets[BACKGROUND_IMAGE]);

		bg.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets[PARALLAX_IMAGE]);

		bg.addChild(bitmap);

		stage.addChild(bg);

		// return the background
		return bg;
	}	

	//Updates the images in the parallax background based on their position in the array
	self.updateBg = function() {

		for (var i = 0; i < background.children.length; i++) {

			background.children[i].x = (world.x * .02 * (i + 1)) + background.children[i].regX;
		}
	}
	
	//Displays the win screen when the user wins
	self.onWin = function() {
		world.removeAllChildren();
		stage.removeAllChildren();
		let win = new createjs.Text("You Win!", "20px Courier New", "#0000ff");
		win.x = canvas.width/2;
		win.y = canvas.height/2;
		stage.addChild(win);
		stage.update();
		stage.tickEnabled = false;
	}

	self.preloadResources();
	
};

new _game();