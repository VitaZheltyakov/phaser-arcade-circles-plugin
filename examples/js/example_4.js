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
    game.add.text(game.world.width*0.01, game.world.height*0.01, "Multi circle-body", { font: "16px Arial", fill: "#ffffff" });

    sprite1 = game.add.sprite(50, 320, 'ballRed');
    sprite1.anchor.set(0.5);
    sprite2 = game.add.sprite(400, 350, 'ballBlue');
    sprite3 = game.add.sprite(400, 250, 'ballBlue');
    sprite4 = game.add.sprite(460, 300, 'ballBlue');
    sprite5 = game.add.sprite(460, 200, 'ballBlue');
    sprite6 = game.add.sprite(460, 400, 'ballBlue');

    game.physics.enable( [ sprite1, sprite2, sprite3, sprite4, sprite5, sprite6 ], Phaser.Physics.ARCADE);

    sprite1.body.setCircle(30);
    sprite1.body.bounce.setTo(0.75, 0.75);
    sprite1.body.mass = 1;
    sprite1.body.velocity.setTo(500, 0);
    sprite1.body.collideWorldBounds = true;

    group = game.add.group();

    sprite2.body.setCircle(30);
    group.add(sprite2);

    sprite3.body.setCircle(30);
    group.add(sprite3);

    sprite4.body.setCircle(30);
    group.add(sprite4);

    sprite5.body.setCircle(30);
    group.add(sprite5);

    sprite6.body.setCircle(30);
    group.add(sprite6);

    group.setAll('anchor.x', 0.5);
    group.setAll('anchor.y', 0.5);
    group.setAll('body.mass', 1);
    group.setAll('body.collideWorldBounds', true);
	 group.setAll('body.bounce.x', 0.75);
	 group.setAll('body.bounce.y', 0.75);

}

function update() {

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.arcade.collide(sprite1, group, collisionHandler, null, this);
    game.physics.arcade.collide(group);

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
}