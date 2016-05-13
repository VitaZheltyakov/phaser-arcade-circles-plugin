var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ballRed', 'assets/ball-red.png');
    game.load.image('ballBlue', 'assets/ball-blue.png');
}

var sprite1;
var sprite2;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = '#2d2d2d';
    game.add.text(game.world.width*0.01, game.world.height*0.01, "Two circle-body. Red ball is immovable", { font: "16px Arial", fill: "#ffffff" });

    sprite1 = game.add.sprite(50, 300, 'ballRed');
    sprite1.anchor.set(0.5);
    sprite2 = game.add.sprite(400, 340, 'ballBlue');
    sprite2.anchor.set(0.5);

    game.physics.enable( [ sprite1, sprite2 ], Phaser.Physics.ARCADE);

    sprite1.body.immovable = true;
    sprite1.body.setCircle(30);
    sprite1.body.bounce.setTo(0.75, 0.75);
    sprite1.body.mass = 1;
    sprite1.body.velocity.setTo(250, 0);
    sprite1.body.collideWorldBounds = true;

    sprite2.body.setCircle(30);
    sprite2.body.bounce.setTo(0.75, 0.75);
    sprite2.body.mass = 1;
    sprite2.body.velocity.setTo(0, 0);
    sprite2.body.collideWorldBounds = true;


}

function update() {

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.arcade.collide(sprite1, sprite2, collisionHandler, null, this);

    if (cursors.up.isDown)
    {
        sprite1.body.velocity.y = -100;
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.velocity.y =  100;
    }
    else if (cursors.left.isDown)
    {
        sprite1.body.velocity.x = -100;
    }
    else if (cursors.right.isDown)
    {
        sprite1.body.velocity.x = 100;
    }
}

function collisionHandler (obj1, obj2) {

}

function render() {
//    game.debug.body(sprite1);
//    game.debug.body(sprite2);
}