
var		PLATFORM_IMAGE = 'assets/cobble-platform.png',
		BACKGROUND_IMAGE = "assets/snow.png",
		PARALLAX_IMAGE = "assets/snowflakes.png",
		NPC_IMAGE = "assets/cat.png";
		START_PLATFORM_IMAGE = "assets/start-platform.png";
		DOG_SPRITES_RIGHT = "assets/dog-sprites-right.png";
		DOG_SPRITES_LEFT = "assets/dog-sprites-left.png";

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
          left: false
		}, 
		score = 0,
		scoreboard,
		background,
		npcs = [],
		platforms = [],
		paused = false,
		win;

	// holds all collideable objects
	var collideables = [];
	self.getCollideables = function() { return collideables; };

	// starts to load all the assets
	self.preloadResources = function() {
		self.loadImage(PLATFORM_IMAGE);
		self.loadImage(BACKGROUND_IMAGE);
		self.loadImage(PARALLAX_IMAGE);
		self.loadImage(NPC_IMAGE);		
		self.loadImage(START_PLATFORM_IMAGE);
		self.loadImage(DOG_SPRITES_LEFT);
		self.loadImage(DOG_SPRITES_RIGHT);
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
		hero = new Hero(rightDog());
		npcs.push(new Character(assets[NPC_IMAGE]));

		self.reset();

		//Set up scoreboard
		scoreboard = new createjs.Text("Score: ", "25px VT323", "#0000ff");
		scoreboard.x = 10;
		scoreboard.y = 20;
		scoreboard.textBaseline = "alphabetic";
		stage.addChild(scoreboard);
	
		self.setupListeners();
		self.showInstructions();

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
		document.getElementById("reset").addEventListener("click", self.reset);
	}

	//Handles keydown events from the keyboard
	self.handleKeyDown = function(e)
	{
		if (e.keyCode === 39) {
			key.right = true;
		} else if (e.keyCode === 37) {
			key.left = true;
		}
		if (e.keyCode === 38 || e.keyCode === 13) {
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

	//Creates and displays the instructions for the game
	self.showInstructions = function() {
		var instructionsText = 
		`Welcome to Dog Simulator\n
		Use the right and left arrow keys ( \u02C2 \u02C3 ) to move Professor Doctor Woofbark Dogbone.\n
		Use the up arrow key ( \u02C4 ) to jump over obstacles.\n
		Use jump twice ( \u02C4 \u02C4 ) to double jump!\n
		Score 10,000 points to succeed!`;

		let instructions = new createjs.Text(instructionsText, "25px VT323", "#0000ff");
		instructions.x = canvas.width/10;
		instructions.y = canvas.height/4;
		world.addChild(instructions);		
	}
	
	//Creates and adds the starting platform to the world
	self.createStartingPlatform = function() {
		var startPlatform = new createjs.Bitmap(assets[START_PLATFORM_IMAGE]);
		startPlatform.x = 0;
		startPlatform.y = canvas.height/2 + 200;
		collideables.push(startPlatform);
		world.addChild(startPlatform);
	}

	//Resets the game board
	self.reset = function() {
		self.paused = false;

		stage.removeChild(win);

		collideables = [];
		self.lastPlatform = null;
		world.removeAllChildren();
		world.x = 0;
		world.y = 0;

		hero.x = 150;
		hero.y = canvas.height/2 + 50;
		hero.reset();
		world.addChild(hero);
		
		for (let i = 0; i < npcs.length; i++) {
			npcs[i].x = 150 ;
			npcs[i].y = canvas.height/2 + 50;
			npcs[i].reset();
			world.addChild(npcs[i]);
		}

		self.createStartingPlatform();

		// add first platform for the hero to collide with
		self.addPlatform(1000, canvas.height/1.25);

		var length = canvas.width / (assets[PLATFORM_IMAGE].width * 1.5) + 2;
		var atX = 0;
		var atY = canvas.height/1.25;

		for ( let i = 1; i < length; i++ ) {
			var atX = (i-.5) * assets[PLATFORM_IMAGE].width*2 + (Math.random()*assets[PLATFORM_IMAGE].width-assets[PLATFORM_IMAGE].width/2) + 1000;
			var atY = atY + (Math.random() * 300 - 150);
			self.addPlatform(atX,atY);
		}

		document.getElementById("reset").style.display = "none";
	}

	//The tick function that will run 60 times for per second
	self.tick = function(e)
	{

		if (!self.paused) {
			ticks++;
			hero.tick();
			for (var i = 0; i < npcs.length; i++) {
				npcs[i].tick();
			}


			if ( hero.y > canvas.height*3 ) {
				self.reset();
				return;
			}

			self.adjustCamera();

			for ( var i = 0; i < platforms.length; i++ ) {
				let c = platforms[i];
				if ( c.localToGlobal(c.image.width,0).x < -10 ) {
					self.movePlatformToEnd(c);
				}
			}
		
			hero.move(key.right, key.left);

			score = hero.x - 150;
			scoreboard.text = "Score: " + score;
			
			canvas.width = getWidth();
			canvas.height = document.getElementById("board").offsetHeight;

			self.updateBg();

			stage.update();

			if (score > 10000) {
				self.onWin();
			}
		}
	}

	self.adjustCamera = function() {
		// if the hero "leaves" it's bounds of
		// screenWidth * 0.3 and screenHeight * 0.3(to both ends)
		// we will reposition the "world-container", so our hero
		// is allways visible
		if ( hero.x > canvas.width*.3 ) {
			world.x = -hero.x + canvas.width*.3;
		}
		if ( hero.y > canvas.height*.6 ) {
			world.y = -hero.y + canvas.height*.6;
		} else if ( hero.y < canvas.height*.4 ) {
			world.y = -hero.y + canvas.height*.4;
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
		platforms.push(platform);
		self.lastPlatform = platform;
	}
	//When a platform goes out of sight, add it to the front
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
			background.children[i].y = (world.y * .02 * (i + 1)) + background.children[i].regY;

		}
	}
	
	//Displays the win screen when the user wins
	self.onWin = function() {
		win = new createjs.Text("You Win!", "25px VT323", "#0000ff");
		win.x = canvas.width/2;
		win.y = canvas.height/2;
		stage.addChild(win);
		
		stage.update();
		self.paused = true;
		document.getElementById("reset").style.display = "block";
	}
	
	self.preloadResources();
	
};

new _game();