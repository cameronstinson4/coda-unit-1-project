    
var rightDog = function() {

    var spriteSheet = new createjs.SpriteSheet({
        images: ["assets/dog-sprites-right.png"],
        frames: {width:86, height:54, count:36, regX: 64, regY: 64, spacing:5, margin:3},
        animations: {
            run: {
                frames: [7, 8, 9],
                speed: 0.2
            }
        }
    });

    return spriteSheet;
}
var leftDog = function() {

    var spriteSheet = new createjs.SpriteSheet({
        images: ["assets/dog-sprites-left.png"],
        frames: {width:86, height:54, count:36, regX: 64, regY: 64, spacing:4, margin:4},
        animations: {
            run: {
                frames: [6, 7, 8],
                speed: 0.2
            }
            
        }
    });

    return spriteSheet;
}