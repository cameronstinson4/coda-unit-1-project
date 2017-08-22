    
var dog = function() {

    var spriteSheet = new createjs.SpriteSheet({
        images: ["assets/Dog_1.png"],
        frames: {width:86, height:54, count:36, regX: 64, regY: 64, spacing:4, margin:4},
        animations: {
            run: {
                frames: [6, 7, 8, 9, 10, 11],
                speed: 0.2
            }
        }
    });

    return spriteSheet;
}