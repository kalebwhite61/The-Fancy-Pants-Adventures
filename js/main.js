var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
var global_test;

game.States = {};

//进度加载
game.States.boot = function() {
    this.preload = function() {
        if(typeof(GAME) !== "undefined") {
            this.load.baseURL = GAME + "/";
        }
        if(!game.device.desktop){
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
        game.load.image('loading', 'assets/preloader.gif');
    };
    //场景跳转
    this.create = function() {
        game.state.start('preload');
    };
};
//资源载入
game.States.preload = function() {
    this.preload = function() {
        global_test=game.load.spritesheet("theme","assets/character.png",63,100);
    };
    this.create = function() {
        game.state.start('start');
    };
};

//开始页面
game.States.start = function() {
    var title;
    this.create = function() {
        //开启物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor="#ff9";
        title=[game.add.sprite(50, 240, 'theme', 0)];

        //使能精灵物理引擎
        game.physics.enable(title[0], Phaser.Physics.ARCADE);

        //title[0].set(300,300);
        //game.add.tween(title[0]).to({x: 400}, 3000,Phaser.Easing.Bounce.Out,true);
        //game.add.tween(title[0]).to({angle:360}, 3000, Phaser.Easing.Bounce.Out,true);


        // title[0].body.velocity.x=100;
        // title[0].body.bounce.y = 1.0;//跳跃反弹计算
        // title[0].body.gravity.y = -250;//跳跃重力值
        //边界碰撞检测
        title[0].body.collideWorldBounds = true;

        game.add.tween(title[0]).to( { x: 400,y: 0 }, 3000, Phaser.Easing.Bounce.Out, true);

    };
    this.update=function () {
      // title[0].body.angularVelocity = 300;


    }
};

//主场景
game.States.main = function() {
    this.create = function() {

    };
};




//添加场景
game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('start', game.States.start);
// game.state.add('main', game.States.main);
// game.state.add('over', game.States.over);

//启动boot场景
game.state.start('boot');