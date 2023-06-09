var game_scene = new Phaser.Scene('main');
game_scene.lastn_pipe = 6;
game_scene.n_pipe = Math.ceil(Math.random() * game_scene.lastn_pipe);
game_scene.pop_pipe_name = function(kind) {
    if (this.n_pipe < this.lastn_pipe) {
        this.n_pipe ++ ;
    } else {
        this.n_pipe = 0;
    }
    return "pipe_" + kind + this.n_pipe ;
}
var game;

var config = {
    type: Phaser.AUTO,
    autoCenter: 1,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: 640,
    height: 960,
    parent: "game",
    scene: game_scene,
    title: "FlOppyBird",
    version: "0.1b",
    transparent: "true",
    url: "ahah",
    banner: "-- FlOppyBird --\n Authors: Lalie Arnoud, Thomas Galinier, Guillaume Cagniard",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            immuable: true
        }
    }
};

game_scene.preload = function() {
    this.load.setBaseURL('');

    // Loading needed resources
    // this.load.image('bg', '/static/easter_egg/img/bg.jpg');

    this.load.spritesheet('bird', '/static/easter_egg/img/bird.png', { frameWidth: 496, frameHeight: 351 });

    this.load.image('ground', '/static/easter_egg/img/ground.png');
    for (var i = 0 ; i <= this.lastn_pipe ; i++) {
        this.load.image('pipe_end' + i, '/static/easter_egg/img/pipe_end' + i + '.png');
        this.load.image('pipe_mid' + i, '/static/easter_egg/img/pipe_mid' + i + '.png');
    }
    this.load.image('cross', '/static/easter_egg/img/cross.png');
};

game_scene.create = function() {
    // Making the background
    // this.background = this.add.sprite(0, 0, 'bg');
    // this.background.setOrigin(0, 0);
    this.cameras.main.setBackgroundColor('#46caff');

    // Making the ground
    this.ground = this.physics.add.sprite(0, 0, 'ground');
    this.ground.setOrigin(0, 0);
    this.ground.width = this.cameras.main.width;
    this.ground.height = this.cameras.main.height / 5;
    this.ground.y = this.cameras.main.height - this.ground.height;
    this.ground.body.setAllowGravity(false);
    this.ground.body.immovable = true;
    this.ground.body.reboud = false;

    // Creating bird's animations
    this.anims.create({
        key: 'normal',
        frames: this.anims.generateFrameNumbers('bird', { frames: [0] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'low_fly',
        frames: this.anims.generateFrameNumbers('bird', { frames: [0, 1, 2, 0] }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'quick_fly',
        frames: this.anims.generateFrameNumbers('bird', { frames: [0, 1, 2, 0] }),
        frameRate: 15,
        repeat: -1
    });

    // Making the bird
    this.bird = this.physics.add.sprite(170, 0, 'bird');
    this.bird.displayWidth = game.config.width * 0.125;
    this.bird.scaleY = this.bird.scaleX;
    this.bird.y = (this.cameras.main.height / 2) - (this.bird.height / 2);

    this.bird.anims.play('low_fly', true);
    this.tweenFly = game_scene.tweens.add({
        targets: game_scene.bird,
        y: game_scene.bird.y + 20,
        ease: 'Quad',
        duration: 400,
        repeat: -1,
        yoyo: true
    });

    this.bird.body.setCircle(this.bird.width/2 - 40, 50, -20);


    // Making pipes
    this.pipes = this.physics.add.group({
        classType: Phaser.GameObjects.Sprite,
        key: 'pipes',
        maxSize: 40,
        repeat: 39,
        createMultipleCallback: function(o) {
            var n = game_scene.physics.add.sprite(0, 0, 'pipe');
            n.body.setAllowGravity(false);
            n.body.reboud = false;
            n.setVisible(false);
            this.add(n);
        }
    });
    this.pipes.children.entries.forEach(p => {
        p.setVisible(false);
        p.setActive(false);
    });

    this.topPipes = this.physics.add.group({
        classType: Phaser.GameObjects.Sprite,
        key: 'top_pipes',
        maxSize: 4,
        repeat: 3,
        createMultipleCallback: function(o) {
            var n = game_scene.physics.add.sprite(0, 0, 'pipe_top');
            n.body.setAllowGravity(false);
            n.body.reboud = false;
            n.setVisible(false);
            this.add(n);
        }
    });
    this.topPipes.children.entries.forEach(p => {
        p.setVisible(false);
        p.setActive(false);
    });
    
    this.bottomPipes = this.physics.add.group({
        classType: Phaser.GameObjects.Sprite,
        key: 'bottom_pipes',
        maxSize: 4,
        repeat: 3,
        createMultipleCallback: function(o) {
            var n = game_scene.physics.add.sprite(0, 0, 'pipe_bottom');
            n.body.setAllowGravity(false);
            n.body.reboud = false;
            n.setVisible(false);
            this.add(n);
        }
    });
    this.bottomPipes.children.entries.forEach(p => {
        p.setVisible(false);
        p.setActive(false);
    });

    this.pipesToCheckScore = new Array();
    this.pipesToCheckMore = new Array();

    game_scene.addPipes();

    // Setting the jump trigger
    game_scene.input.on('pointerdown', function(pointer){
        game_scene.jump();
    });
    this.inJump = false;

    // Adding collides
    this.physics.add.collider(this.bird, this.ground, onFinish);
    this.physics.add.collider(this.bird, this.pipes, onFinish); 
    this.physics.add.collider(this.bird, this.topPipes, onFinish);
    this.physics.add.collider(this.bird, this.bottomPipes, onFinish);

    // Adding the score
    this.score = 0;
    this.scoreText = this.add.text(0, 100, "0", { font: "60px Arial", fill: "#ffffff" });
    this.scoreText.x = (this.cameras.main.width / 2) - (this.scoreText.width / 2);
    
    this.started = false;
    
    // Making the close button
    this.close = this.add.sprite(0, 0, 'cross');
    this.close.displayWidth = 50;
    this.close.scaleY = this.close.scaleX;
    this.close.x = 50;
    this.close.y = 50;
    this.close.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
        onFinish();
        document.location.href = url_edt;
    });
    
};

game_scene.addPipes = function() {
    var pipes = 12;
	var empty = Math.round(Math.random() * (pipes - 7)) + 3;
	for (var i = 0; i <= pipes; i++) {
		if (i > empty + 1 || i < empty - 1) {
            var x = this.cameras.main.width;
            var y = (this.cameras.main.height - this.ground.height) - ((i * this.cameras.main.height) / pipes);

            // Empty space (w/out pipes) near
            if(i == empty + 2 || i == empty - 2) {
                var yDiff = 15;
                var pipeEnd;
                var yPipe;
                if(i == empty + 2) {
                    // Taking the first unuse top pipe
                    pipeEnd = this.topPipes.getFirst(false);
                    pipeEnd.setTexture(this.pop_pipe_name("end"));
                    yPipe = y + yDiff;
                } else {
                    // Taking the first unuse bottom pipe
                    pipeEnd = this.bottomPipes.getFirst(false);
                    pipeEnd.setTexture(this.pop_pipe_name("end"));
                    yPipe = y - yDiff;
                }
                pipeEnd.body.reset(x, yPipe);
                pipeEnd.setActive(true);
                pipeEnd.setVisible(true);
                pipeEnd.body.immovable = true;
                pipeEnd.body.width = pipe.width;
                pipeEnd.body.height = pipe.height;

                if(this.started)
                    pipeEnd.body.velocity.x = -250;
            }

            var pipe = this.pipes.getFirst(false);
            pipe.setActive(true);
            pipe.setVisible(true);
                    pipe.setTexture(this.pop_pipe_name("mid"));

            pipe.body.reset(x, y);
            pipe.body.immovable = true;
            pipe.body.width = pipe.width;
            pipe.body.height = pipe.height;

            if(this.started)
                pipe.body.velocity.x = -250;

            // si on se trouve sur le premier morceau de tuyau du groupe
            if(i == 0) {
                this.pipesToCheckScore.push(pipe);
                this.pipesToCheckMore.push(pipe);
            }
        }
    }
}
updated = false;
game_scene.jump = function() {
    if(!this.started) { // If the game hadn't start yet
        this.tweenFly.stop();
        this.started = true;

        this.ground.body.velocity.x = -250;
        this.pipes.children.entries.forEach(p => {
            p.body.velocity.x = -250;
        });
        this.topPipes.children.entries.forEach(p => {
            p.body.velocity.x = -250;
        });
        this.bottomPipes.children.entries.forEach(p => {
            p.body.velocity.x = -250;
        });
    }

    if(this.bird.y >= 0) { // The bird can't fly out of the screen
        this.bird.body.gravity.y = 2000;
        this.bird.body.velocity.y = -600;
        this.bird.angle = -45;
        this.inJump = true;
        
        this.bird.anims.stop('low_fly');
        this.bird.anims.play('quick_fly', true);

        if(this.tweenFalling != null) {
            this.tweenFalling.stop();
        }

        this.tweenJumping = game_scene.tweens.add({
            targets: this.bird,
            angle: -45,
            ease: 'Quad',
            duration: 70,
            repeat: -1
        });
    }
}

game_scene.update = function() {
    // Ground's animation
    if(this.ground.x + (this.ground.width / 2) <= 0) {
        this.ground.x = 0;
    }

    // Bird's animation
    if(this.bird.body.velocity.y > 0 && this.inJump) {
        this.inJump = false;
        if(this.tweenJumping != null) {
            this.tweenJumping.stop();
        }
        this.tweenFalling = game_scene.tweens.add({
            targets: this.bird,
            angle: 90,
            ease: 'Quad',
            duration: 300,
            repeat: -1,
            delay: 200,
            onStart: function() {
                game_scene.bird.anims.stop('low_fly');
                game_scene.bird.anims.stop('quick_fly');
                game_scene.bird.anims.play('normal', true);
            }
        });

    }

    // Pipes cleaning
    this.pipes.children.entries.forEach(p => {
        var isIn = Phaser.Geom.Rectangle.Overlaps(game_scene.physics.world.bounds, p.getBounds());
        if(!isIn) {
            p.setActive(false);
        }
    });
    this.topPipes.children.entries.forEach(p => {
        var isIn = Phaser.Geom.Rectangle.Overlaps(game_scene.physics.world.bounds, p.getBounds());
        if(!isIn) {
            p.setActive(false);
        }
    });
    this.bottomPipes.children.entries.forEach(p => {
        var isIn = Phaser.Geom.Rectangle.Overlaps(game_scene.physics.world.bounds, p.getBounds());
        if(!isIn) {
            p.setActive(false);
        }
    });


    // Pipes generation
    var isGenerating = this.pipesToCheckMore.length != 0 && this.pipesToCheckMore[0].x + (this.pipesToCheckMore[0].width / 2) < (this.cameras.main.width / 2)
    if(isGenerating) {
        this.pipesToCheckMore.splice(0, 1);
        game_scene.addPipes();
    }

    // Score updates
    var isIncreasing = this.pipesToCheckScore.length != 0 && this.pipesToCheckScore[0].x + (this.pipesToCheckScore[0].width / 2) < (this.bird.body.x)
    if(isIncreasing) {
        this.score++;
        this.scoreText.setText(this.score);
        this.pipesToCheckScore.splice(0, 1);
        this.scoreText.x = (this.cameras.main.width / 2) - (this.scoreText.width / 2);
    }

    // Score server's updates
    if(this.score != 0 && !updated && this.score % 10 == 0) {
        updated = true;
        send_score(this.score, false);
    }
    if(this.score == 0 || this.score % 10 != 0) {
        updated = false;
    }

};


game = new Phaser.Game(config);


function send_score(s, isLastScore) {
    var sent_data = {} ;
    $.ajax({
        url: url_set_score,
        type: 'POST',
        data: {finished: true, score: game_scene.score},
        dataType: 'json',
        success: function(data, ts, req) {
            score_list = data;
            go_board() ;
        },
        error: function(msg) {
            console.log("Sorry, your score could not be transmitted to the server...");
        }
    });
}

function onFinish() {
    game_scene.started = false;
    send_score(game_scene.score, true);
    game.scene.stop("main");
    game.scene.start("main");
}

function go_board() {
    var dat = d3.select("#list-score")
        .selectAll("li")
        .data(score_list)
        .attr("class", function(d) {return d.score==0?"invisible":"visible"; })
        .select(".score")
        .text(function(d) {return d.user;});
}

go_board();
