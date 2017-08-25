# Dog Simulator
### Cameron Stinson

## The Game:
    Dog Simulator is a 2d platformer created using HTML5 canvas and the EaselJS library.
#### Game objective:
    Navigate over the various platforms by running and jumping to reach over 10,000 points.

    Reference-style: 
    ![alt text][assets/game.png]

    
## Approach:
    The approach for this project was to find a library and build some sort of 2d pixel art game. Originally the intention was to create a 2d RPG similar to older Zelda games, but it worked out that a 2d platformer was much easier to implement, so that is the direction the project went. After that decision was made Trello stories were made to meet the project requirements as well as optional bonus wanted features. Finally the stories on the Trello board were completed until a Minimum Viable Project was completed.

## Features:
### Velocity
    Using the built in functions from EaselJS character velocity and momentum was very easy to manipulate.
### Parallax (Scrolling) Background
    The parallax background was created by overlaying a snowflake png image with no background onto the snowy mountain image. As the game camera moves the images move at different speeds, showing a parallax effect, a simulated three dimensional view.
### Mobile Responsive
    Mobile responsiveness was achieved by adding a CSS media query which adds movement buttons when the screen is cell phone sized.

    Reference-style: 
    ![alt text][assets/mobile.png]

    Please note mobile responsiveness only works on a mobile device's touch. It will not work on desktop with clicks.
### Sprite Animations
    Player character movement animations were achieved using the SpriteSheet object built into EaselJS.
### Collision Detection
    Using an example found [Here](http://indiegamr.com/retro-style-plattform-runner-game-for-mobile-with-easeljs-part-1/) collision detection was able to be implemented into Dog Simulator so the player character was able to sit atop platforms without phasing through

## Future Features:
    * Tighten up collision detection
    * Fix animations and spritesheets for more consistent animations
    * Add additional levels and themes and obstacles
    * Add enemy and friendly NPC's that actually effect the gameplay
## Bugs: 
    * Collision detection does not like sprite animations and thus often clips through the right edge of platforms
    * Animations are not consistent because the sprite sheet for the main character is not formatted correctly
## Successes and Challenges:
    * The Parallax background took a lot trial and error to actually work. Originally I tried to use CSS, but later realized just setting the images to backgound of canvas worked much better.
    * Character animations were a major struggle because it completely broke the collision detection. After a lot of trial and error some sort of animations were working but not consistently, and collision detection is also still iffy. 

