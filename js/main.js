var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

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
        game.load.spritesheet("theme","assets/character.png",63,100);
        game.load.spritesheet("player","assets/dude.png",32,48);
        game.load.image("startBtn","assets/startBtn.png",173,38);
        game.load.image("tree","assets/tree.png",142,156);
    };
    this.create = function() {
        game.state.start('start');
    };
};

//开始页面
game.States.start = function() {
    var player,playerWalk,playerRun,title,startBtn;
    var bounceFlag=0;
    var moveFloat=false;
    var thisCreate=this;
    this.create = function() {
        //开启物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //启动页面背景色
        game.stage.backgroundColor="#ff9";
        //组添加标题字母
        title=game.add.group();
        //使能组物理引擎
        title.enableBody=true;
        //标题动画包含进入和下落
        for(var i=0;i<8;i++){
           var tween=title.create(63*i,-100,'theme',i);
           //设置组元素固定定位
           tween.body.immovable=true;
           //设置组元素碰撞边界
            tween.body.setSize(63,30,0,12);
           var tweenIn=game.add.tween(tween).to({y:10}, 4000, Phaser.Easing.Exponential.Out,false);
           var tweenDown=game.add.tween(tween).to({y:200}, 2000, Phaser.Easing.Bounce.Out,false,i*100);
           //chain链式启动下落动画
           tweenIn.chain(tweenDown);
           tweenIn.start();
        }
        //组标题整体居中
        title.x=game.world.centerX-252;
        //玩家精灵添加
         player=game.add.sprite(-100,240,"player",5);
        //使能玩家精灵物理引擎
        game.physics.arcade.enable(player);
        //玩家移动动画
        player.animations.add("startMove",[5,6,7,8]);
        player.animations.play("startMove",8,true);
        playerWalk=game.add.tween(player).to({x:132},3000,null,true);
        playerWalk.onComplete.add(this.wait,this);

        //开始按钮设置
        startBtn=game.add.button(game.world.centerX,game.world.centerY,"startBtn",this.nextStage,this);
        startBtn.anchor.setTo(0.5,-2);
        startBtn.alpha=0;

        //背景树添加
        var tree1=game.add.sprite(71,-78,"tree");
        tree1.angle=180;
        tree1.anchor.setTo(0.5,0.5);
        game.add.tween(tree1).to({y:78},2000,null,true);

        var tree2=game.add.sprite(game.world.width-142,game.world.height,"tree");
        game.add.tween(tree2).to({y:game.world.height-156},2000,null,true);


    };
    this.update=function () {
        game.physics.arcade.collide(player,title,this.titleFloat,null,this);
        if(bounceFlag==2){
            player.body.velocity=0;
            moveFloat=true;
            //按钮动画启动
            game.add.tween(startBtn).to({alpha:1},1000,null,true);
        };
        if(moveFloat){
            player.y=title.getChildAt(0).y+title.y-38;
        }
    };
    //player waits
    this.wait=function () {
        player.animations.stop("startMove");
        player.frame=4;
        this.run();
    };
    //player runs
    this.run=function(){
        setTimeout(function () {
            player.animations.add("startRun",[5,6,7,8]);
            player.animations.play("startRun",8,true);
            playerRun=game.add.tween(player).to({x:700},3100,Phaser.Easing.Exponential.Out,true);
            playerRun.onComplete.add(thisCreate.back,this);
        },1300);
    };
    this.back=function () {
        player.animations.stop("startRun");
        player.frame=4;
        player.body.velocity.y=-160;
        player.body.velocity.x=-72;
        player.body.bounce.y=0.4;
        player.body.gravity.y=80;
        player.body.collideWorldBounds=true;
        player.animations.add("startBack",[0,1,2,3]);
        player.animations.play("startBack",8,true);
    };
    //标题浮动
    this.titleFloat=function(){
        game.add.tween(title).to({y: 20}, 700, null, true, 0, Number.MAX_VALUE, true);
        bounceFlag++;
    };
    this.nextStage=function () {
        game.state.start("main");
    }
};

//主场景
game.States.main = function() {
    this.create = function() {
        // 文本
        var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
        var text=game.add.text(game.world.centerX, game.world.centerY, "Welcome to Main Stage", style);
        text.anchor.setTo(0.5);
    };
};




//添加场景
game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('start', game.States.start);
game.state.add('main', game.States.main);
// game.state.add('over', game.States.over);

//启动boot场景
game.state.start('boot');